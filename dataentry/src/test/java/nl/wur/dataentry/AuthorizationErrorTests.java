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

/**
 * Tests might need to be updated
 */

package nl.wur.dataentry;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import nl.wur.dataentry.test.ResponseRest;
import nl.wur.dataentry.test.Solution;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class AuthorizationErrorTests {
	private @LocalServerPort int port;
	private @Autowired TestRestTemplate restTemplate;
	private @Autowired MockMvc mockMvc;

	@Test
	public void testCsrfErrors() throws Exception {
		String url = "http://localhost:" + port + "/dataentry/api/login";
		ResponseEntity<ResponseRest> response = restTemplate.exchange(url, HttpMethod.POST,
				new HttpEntity<>(new HttpHeaders()), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("Error", response.getBody().getError());
	}

	@Test
	void testMockMvcLoginError() throws Exception {
		MockHttpServletRequestBuilder request;

		request = post("/api/login").servletPath("/api/login").with(csrf().asHeader());
		mockMvc.perform(request).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.error")
				.value("Basic authorization exception : Provide 'Authorization: Basic Base64 encoded username:password' in request header"));

		request = post("/api/login").servletPath("/api/login").with(csrf().asHeader())
				.with(SecurityMockMvcRequestPostProcessors.httpBasic("email@test.com", "password"));
		mockMvc.perform(request).andExpect(status().isUnauthorized()).andExpect(
				jsonPath("$.error").value("Basic authorization exception : Bad credentials"));
	}

	@Test
	public void testRestTemplateLoginErrors() throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.set("Cookie",
				"JSESSIONID=807BFB9152DC4B945801DD7AADF76F83; XSRF-TOKEN=e67fadfc-23ff-4477-8070-af4b9b59bb5d");
		headers.set("X-XSRF-TOKEN", "e67fadfc-23ff-4477-8070-af4b9b59bb5d");
		String url = "http://localhost:" + port + "/dataentry/api/login";
		ResponseEntity<ResponseRest> response;

		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertNotNull(response.getBody().getError());

		headers.set("Authorization", "Nothing");
		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertNotNull(response.getBody().getError());

		headers.set("Authorization", "Basic issue");
		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertNotNull(response.getBody().getError());
	}

	@Test
	public void testGetJwtErrors() throws Exception {
		HttpHeaders headers = new HttpHeaders();
		String url = "http://localhost:" + port + "/dataentry/rest/tags/1";
		ResponseEntity<ResponseRest> response;

		response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers),
				ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("JWT exception : Provide 'Authorization: Bearer JsonWebToken' in request header",
				response.getBody().getError());

		headers.set("Authorization", "No Jwt");
		response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("JWT exception : Provide 'Authorization: Bearer JsonWebToken' in request header",
				response.getBody().getError());

		headers.set("Authorization", "Bearer Jwt");
		response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("Invalid JWT token : JWT strings must contain exactly 2 period characters. Found: 0",
				response.getBody().getError());
	}

	@Test
	public void testPostJwtErrors() throws Exception {
		Solution solution = new Solution("test description", "url", "name", 2021, 1, 1, 1001, 1002, 1003, 1004, 1005,
				1006, 1007, 1008, 1009, 1010,
				"http://localhost:" + port + "/dataentry/rest/organisations/1",
				"http://localhost:" + port + "/dataentry/rest/subUseCases/1",
				"http://localhost:" + port + "/dataentry/rest/sectors/1",
				Arrays.asList("http://localhost:" + port + "/dataentry/rest/tags/1"),
				Arrays.asList("http://localhost:" + port + "/dataentry/rest/subUseCases/1",
						"http://localhost:" + port + "/dataentry/rest/subUseCases/2"),
				Arrays.asList("http://localhost:" + port + "/dataentry/rest/businessModels/1",
						"http://localhost:" + port + "/dataentry/rest/businessModels/2"),
				Arrays.asList("http://localhost:" + port + "/dataentry/rest/regions/1",
						"http://localhost:" + port + "/dataentry/rest/regions/2"));

		HttpHeaders headers = new HttpHeaders();
		headers.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);
		headers.set("Cookie",
				"JSESSIONID=807BFB9152DC4B945801DD7AADF76F83; XSRF-TOKEN=e67fadfc-23ff-4477-8070-af4b9b59bb5d");
		headers.set("X-XSRF-TOKEN", "e67fadfc-23ff-4477-8070-af4b9b59bb5d");
		String url = "http://localhost:" + port + "/dataentry/rest/solutions";
		ResponseEntity<ResponseRest> response;

		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(solution, headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("Error", response.getBody().getError());

		headers.set("Authorization", "No Jwt");
		response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(solution, headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("JWT exception : Provide 'Authorization: Bearer JsonWebToken' in request header",
				response.getBody().getError());

		headers.set("Authorization", "Bearer Jwt");
		response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(solution, headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("Invalid JWT token : JWT strings must contain exactly 2 period characters. Found: 0",
				response.getBody().getError());
	}

}
