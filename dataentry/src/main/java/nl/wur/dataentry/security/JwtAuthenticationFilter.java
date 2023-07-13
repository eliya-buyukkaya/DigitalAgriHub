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
import java.util.HashSet;
import java.util.Set;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private AuthUtils authUtils;
    private Set<String> paths;

    public JwtAuthenticationFilter(AuthUtils authUtils) {
        paths = new HashSet<>();
        paths.add("POST /api/login");
        paths.add("GET /api/csrf");
        paths.add("GET /api/captchakey");
        paths.add("GET /api/datasource");
        paths.add("POST /api/user");
        paths.add("POST /api/user/forgot");
        paths.add("POST /api/user/reset");
        paths.add("GET /api/user/registration");
        paths.add("GET /api/user/solutions");
        paths.add("GET /api/user/confirm");
        paths.add("GET /api/docs");
        paths.add("GET /favicon.ico");
        paths.add("GET /logoWUR.svg");
        paths.add("GET /logoWUR.png");
        paths.add("GET /logoDagHub.png");
        paths.add("GET /manifest.json");
        paths.add("GET /");
        paths.add("GET /index.html");
        paths.add("GET /tinymce.css");
        this.authUtils = authUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (authUtils.validateJwtToken(request, response))
            filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getMethod() + " " + request.getServletPath();
        log.info("==> " + path);
        return paths.contains(path) || path.startsWith("GET /api/swagger-ui/") || path.startsWith("GET /api/docs/")
                || path.startsWith("GET /static/") || path.startsWith("GET /tinymce/");
    }
}
