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

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
	private @Autowired InitialAuthenticationFilter initialAuthenticationFilter;
	private @Autowired JwtAuthenticationFilter jwtAuthenticationFilter;
	private @Autowired CustomLogoutHandler logoutHandler;
	private @Autowired CustomAuthenticationEntryPoint authenticationEntryPoint;
	private @Value("${dataentry.cors.url}") String urlCors;
	private @Value("${dataentry.frame.url}") String urlFrame;

	private static final String[] AUTH_WHITELIST = {
			"/api/user/forgot",
			"/api/user/reset",
			"/api/user/solutions",
			"/api/user/registration",
			"/api/user/confirm",
			"/api/swagger-ui/**",
			"/api/docs/**",
			"/api/csrf",
			"/api/captchakey",
			"/api/datasource",
			"/static/**",
			"/logoWUR.svg",
			"/logoWUR.png",
			"/logoDagHub.png",
			"/favicon.ico",
			"/manifest.json",
			"/tinymce/**",
			"/tinymce.css",
			"/index.html",
			"/"
	};

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.cors(c -> {
			CorsConfigurationSource source = request -> {
				CorsConfiguration config = new CorsConfiguration();
				config.setAllowedOrigins(List.of(urlCors));
				config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
				return config;
			};
			c.configurationSource(source);
		});

		http.headers().contentSecurityPolicy("frame-ancestors 'self' " + urlFrame);

		http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());

		http.exceptionHandling().authenticationEntryPoint(authenticationEntryPoint);

		http.authorizeRequests()
				.antMatchers(AUTH_WHITELIST).permitAll()
				.antMatchers(HttpMethod.POST, "/api/user").permitAll()
				.anyRequest().authenticated();

		http.logout().logoutUrl("/api/logout")
				.addLogoutHandler(logoutHandler).logoutSuccessUrl("/")
				.deleteCookies("JSESSIONID");

		http.addFilterAt(initialAuthenticationFilter, BasicAuthenticationFilter.class)
				.addFilterAfter(jwtAuthenticationFilter, BasicAuthenticationFilter.class);

		return http.build();
	}

}
