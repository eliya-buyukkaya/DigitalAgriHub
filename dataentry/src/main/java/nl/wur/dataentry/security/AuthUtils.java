/**
 * Copyright 2022 Wageningen Environmental Research, Wageningen UR
 * Licensed under the EUPL, Version 1.2 or as soon they
 * will be approved by the European Commission - subsequent
 * versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the
 * Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in
 * writing, software distributed under the Licence is
 * distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the Licence for the specific language governing
 * permissions and limitations under the Licence.
 */

/**
* @author Eliya Buyukkaya (eliya.buyukkaya@wur.nl)
*/

package nl.wur.dataentry.security;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import nl.wur.daghub.database.domain.User;
import nl.wur.daghub.database.repository.RepositoryUser;
import nl.wur.dataentry.dto.DtoResponse;

@Slf4j
@Service
@Transactional
public class AuthUtils implements SmartInitializingSingleton {
    private @Value("${dataentry.jwt.signing.key}") String signingKey;
    private @Value("${dataentry.jwt.expiration}") int expiration;
    private AuthenticationManagerBuilder authMgrBuilder;
    private AuthenticationManager authManager;
    private UserDetailsService userDetailsService;
    private RepositoryUser repositoryUser;

    public AuthUtils(AuthenticationManagerBuilder authMgrBuilder, UserDetailsService userDetailsService, RepositoryUser repositoryUser) {
        this.authMgrBuilder = authMgrBuilder;
        this.userDetailsService = userDetailsService;
        this.repositoryUser = repositoryUser;
    }

    @Override
    public void afterSingletonsInstantiated() {
        this.authManager = authMgrBuilder.getObject();
    }

    public boolean validateBasicAuthToken(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = null;
        String email = null;
        try {
            String[] credentials = parseBasicAuthHeader(request);
            email = credentials[0];
            auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(email, credentials[1]));
            if (request.getMethod().equals("POST")) {
                User user = getUserByEmail(email);
                String jwt = user.getToken();
                if (jwt == null || request.getSession().isNew() || isTokenExpired(jwt)) {
                    jwt = createJwtToken(email, auth);
                    user.setToken(jwt);
                }
                response.setHeader("Authorization", "Bearer " + jwt);
                response.setHeader(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization");
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(auth.getPrincipal(), null, auth.getAuthorities()));
            }
        } catch (BadCredentialsException e) {
            if (email != null && repositoryUser.findByEmail(email).isEmpty())
                writeError(response, "Basic authorization exception: " + email + " not found");
            else
                writeError(response, "Basic authorization exception: " + e.getMessage());
            return false;
        } catch (Exception e) {
            writeError(response, "Basic authorization exception: " + e.getMessage());
            return false;
        }
        return true;
    }

    private User getUserByEmail(String email) {
        return repositoryUser.findByEmail(email).get();
    }

    private void updateToken(String email, String token) {
        repositoryUser.findByEmail(email).get().setToken(token);
    }

    public String createJwtToken(String username, Authentication auth) {
        if (auth == null) // username has been updated
            auth = SecurityContextHolder.getContext().getAuthentication();
        return Jwts.builder()
                .claim("roles", auth.getAuthorities().toArray()[0].toString())
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(Keys.hmacShaKeyFor(signingKey.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    public boolean validateJwtToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            String jwt = parseJwtHeader(request);
            String username = getUsernameFromJwtToken(jwt);
            if (!jwt.equals(repositoryUser.findTokenByEmail(username))) {
                throw new JwtException("Invalid token");
            }
            if (request.getServletPath().equals("/api/logout")) {
                updateToken(username, null);
            }
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));
        } catch (ExpiredJwtException e) {
            writeError(response, "Expired JWT token: " + e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            writeError(response, "Invalid JWT token: " + e.getMessage());
            return false;
        } catch (JwtException e) {
            writeError(response, "JWT exception: " + e.getMessage());
            return false;
        }
        return true;
    }

    public User getUserFromToken(String jwt) {
        String username = getUsernameFromJwtToken(jwt);
        User user = repositoryUser.findByEmail(username).get();
        if (!jwt.equals(user.getTokenreset()))
            throw new JwtException("Invalid token");
        return user;
    }

    private boolean isTokenExpired(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(signingKey.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token)
                    .getBody().getExpiration();
            return false;
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: " + e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: " + e.getMessage());
        } catch (JwtException e) {
            log.error("JWT exception: " + e.getMessage());
        }
        return true;
    }

    private String getUsernameFromJwtToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(signingKey.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token)
                    .getBody().getSubject();
        } catch (ExpiredJwtException e) {
            throw new JwtException("Expired JWT token: " + e.getMessage());
        } catch (MalformedJwtException e) {
            throw new JwtException("Invalid JWT token: " + e.getMessage());
        } catch (JwtException e) {
            throw new JwtException("JWT exception: " + e.getMessage());
        }
    }

    private String parseJwtHeader(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer "))
            return headerAuth.substring(7);
        throw new JwtException("Provide 'Authorization: Bearer JsonWebToken' in request header");
    }

    private String[] parseBasicAuthHeader(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Basic ")
                && (headerAuth = new String(Base64.getDecoder().decode(headerAuth.substring(6)))).contains(":")) {
            return headerAuth.split(":");
        }
        throw new RuntimeException("Provide 'Authorization: Basic Base64 encoded username:password' in request header");
    }

    private void writeError(HttpServletResponse response, String message) {
        try {
            log.info("==> " + message);
            PrintWriter out = response.getWriter();
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.toString());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setHeader("Error", message);
            out.print(new DtoResponse(null, HttpServletResponse.SC_UNAUTHORIZED, null, message).toJson());
            out.flush();
        } catch (IOException e) {
            log.info("Authorization exception: {}", e.getMessage());
            e.printStackTrace();
        }
    }
}
