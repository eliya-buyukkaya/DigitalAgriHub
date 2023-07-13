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
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.Arrays;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import nl.wur.daghub.database.domain.Tag;
import nl.wur.daghub.database.domain.User;
import nl.wur.daghub.database.repository.RepositorySolution;
import nl.wur.daghub.database.repository.RepositoryUser;
import nl.wur.dataentry.dto.DtoUser;
import nl.wur.dataentry.test.ResponseRest;
import nl.wur.dataentry.test.Solution;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RestTests {
	private @LocalServerPort int port;
	private @Autowired TestRestTemplate restTemplate;
	private @Autowired RepositoryUser repositoryUser;
	private @Autowired RepositorySolution repositorySolution;
	private @Autowired PasswordEncoder passwordEncoder;

	private DtoUser dtoAdmin, dtoOwner, dtoUser;
	private User admin;
	private String tokenAdmin, tokenOwner, tokenUser;
	private UsernamePasswordAuthenticationToken adminAuth;

	private HttpHeaders headers;

	@BeforeEach
	private void setup() {
		ResponseEntity<ResponseRest> response;
		headers = new HttpHeaders();
		headers.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);
		headers.set("Cookie",
				"JSESSIONID=807BFB9152DC4B945801DD7AADF76F83; XSRF-TOKEN=e67fadfc-23ff-4477-8070-af4b9b59bb5d");
		headers.set("X-XSRF-TOKEN", "e67fadfc-23ff-4477-8070-af4b9b59bb5d");

		String password = "Password12!";

		dtoAdmin = new DtoUser("name", password, password, "emailAdmin@test.com", "company");
		dtoOwner = new DtoUser("name", password, password, "emailOwner@test.com", "company");
		dtoUser = new DtoUser("name", password, password, "emailUser@test.com", "company");

		// register users
		String url = "http://localhost:" + port + "/dataentry/api/user";

		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(dtoOwner, headers), ResponseRest.class);
		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		assertEquals("User emailOwner@test.com created", response.getBody().getMessage());

		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(dtoUser, headers), ResponseRest.class);

		admin = dtoAdmin.toUser(passwordEncoder);
		admin.setRoles(new String[] { "ADMIN" });
		repositoryUser.save(admin);

		// login users
		url = "http://localhost:" + port + "/dataentry/api/login";

		response = restTemplate.withBasicAuth("emailOwner@test.com", password).exchange(url, HttpMethod.POST,
				new HttpEntity<>(headers), ResponseRest.class);
		tokenOwner = response.getHeaders().get("Authorization").get(0);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("User emailOwner@test.com logged in", response.getBody().getMessage());

		response = restTemplate.withBasicAuth("emailUser@test.com", password).exchange(url, HttpMethod.POST,
				new HttpEntity<>(headers), ResponseRest.class);
		tokenUser = response.getHeaders().get("Authorization").get(0);

		response = restTemplate.withBasicAuth("emailAdmin@test.com", password).exchange(url, HttpMethod.POST,
				new HttpEntity<>(headers), ResponseRest.class);
		tokenAdmin = response.getHeaders().get("Authorization").get(0);

		admin.setRoles(new String[] { "ROLE_ADMIN" });
		adminAuth = new UsernamePasswordAuthenticationToken(admin.getEmail(), admin.getPassword(),
				AuthorityUtils.createAuthorityList(admin.getRoles()));
	}

	@AfterEach
	private void afterEach() {
		ResponseEntity<ResponseRest> response;
		String url = "http://localhost:" + port + "/dataentry/api/user";

		headers.set("Authorization", tokenOwner);
		response = restTemplate.exchange(url, HttpMethod.DELETE, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
		assertNull(response.getBody());

		headers.set("Authorization", tokenUser);
		response = restTemplate.exchange(url, HttpMethod.DELETE, new HttpEntity<>(headers), ResponseRest.class);

		headers.set("Authorization", tokenAdmin);
		response = restTemplate.exchange(url, HttpMethod.DELETE, new HttpEntity<>(headers), ResponseRest.class);
	}

	@Test
	public void testGetTag_OK() throws Exception {
		ResponseEntity<ResponseRest> response;
		String url = "http://localhost:" + port + "/dataentry/rest/tags/1";
		headers.set("Authorization", tokenOwner);
		response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("DCAS", response.getBody().getDescription());
		assertEquals(url, response.getBody().get_links().getSelf().getHref());
	}

	@Test
	public void testGetTagWithoutAuth_UNAUTHORIZED() throws Exception {
		ResponseEntity<ResponseRest> response;
		String url = "http://localhost:" + port + "/dataentry/rest/tags";
		headers.remove("Authorization");
		response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("JWT exception : Provide 'Authorization: Bearer JsonWebToken' in request header",
				response.getBody().getError());
	}

	@Test
	public void testPostTag_METHOD_NOT_ALLOWED() throws Exception {
		ResponseEntity<ResponseRest> response;
		String url = "http://localhost:" + port + "/dataentry/rest/tags";
		Tag tag = new Tag();
		tag.setDescription("test Tag");
		headers.set("Authorization", tokenAdmin);
		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(tag, headers), ResponseRest.class);
		assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
		assertNull(response.getBody());
	}

	@Test
	public void testDeleteTag_METHOD_NOT_ALLOWED() throws Exception {
		ResponseEntity<ResponseRest> response;
		String url = "http://localhost:" + port + "/dataentry/rest/tags/1";
		headers.set("Authorization", tokenAdmin);
		response = restTemplate.exchange(url, HttpMethod.DELETE, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
		assertNull(response.getBody());
	}

	@Test
	public void testDeleteTagWithoutAuth() throws Exception {
		ResponseEntity<ResponseRest> response;
		String url = "http://localhost:" + port + "/dataentry/rest/tags/1";
		headers.remove("Authorization");
		response = restTemplate.exchange(url, HttpMethod.DELETE, new HttpEntity<>(headers), ResponseRest.class);
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("JWT exception : Provide 'Authorization: Bearer JsonWebToken' in request header",
				response.getBody().getError());
	}

	@Test
	public void testPostDeleteSolution() throws Exception {
		ResponseEntity<ResponseRest> response;
		String url = "http://localhost:" + port + "/dataentry/rest/solutions";
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

		// POST CREATED owner creating
		headers.set("Authorization", tokenOwner);
		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(solution, headers), ResponseRest.class);
		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		assertEquals("test description", response.getBody().getDescription());

		String href = response.getBody().get_links().getSelf().getHref();

		// DELETE FORBIDDEN another user cannot delete
		headers.set("Authorization", tokenUser);
		response = restTemplate.exchange(href, HttpMethod.DELETE, new HttpEntity<>(headers), ResponseRest.class);
		// assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
		// assertEquals("Forbidden", response.getBody().getError());
		assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
		assertNull(response.getBody());

		// DELETE NO_CONTENT owner can delete
		headers.set("Authorization", tokenOwner);
		response = restTemplate.exchange(href, HttpMethod.DELETE, new HttpEntity<>(headers), ResponseRest.class);
		// assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
		assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
		assertNull(response.getBody());
		SecurityContextHolder.getContext().setAuthentication(adminAuth);
		repositorySolution.deleteById(Integer.parseInt(href.substring(href.lastIndexOf('/') + 1)));
		SecurityContextHolder.getContext().setAuthentication(null);
		
		// POST CREATED owner creating
		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(solution, headers), ResponseRest.class);
		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		assertEquals("test description", response.getBody().getDescription());
		href = response.getBody().get_links().getSelf().getHref();

		// DELETE NO_CONTENT admin can delete
		headers.set("Authorization", tokenAdmin);
		response = restTemplate.exchange(href, HttpMethod.DELETE, new HttpEntity<>(headers), ResponseRest.class);
		// assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
		assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
		assertNull(response.getBody());
		SecurityContextHolder.getContext().setAuthentication(adminAuth);
		repositorySolution.deleteById(Integer.parseInt(href.substring(href.lastIndexOf('/') + 1)));
		SecurityContextHolder.getContext().setAuthentication(null);
	}

	@Test
	public void testPostPutDeleteSolution() throws Exception {
		ResponseEntity<ResponseRest> response;
		// POST
		String url = "http://localhost:" + port + "/dataentry/rest/solutions";
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

		// POST CREATED owner creating
		headers.set("Authorization", tokenOwner);
		response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(solution, headers), ResponseRest.class);
		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		assertEquals("test description", response.getBody().getDescription());

		String href = response.getBody().get_links().getSelf().getHref();
		headers.set("If-Match", response.getHeaders().get("ETag").get(0));

		// PUT FORBIDDEN user different than owner, but not admin, cannot update
		headers.set("Authorization", tokenUser);
		solution.setDescription("test description updated FORBIDDEN");
		response = restTemplate.exchange(href, HttpMethod.PUT, new HttpEntity<>(solution, headers), ResponseRest.class);
		// assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
		assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
		assertNull(response.getBody().getDescription());

		// PUT OK
		headers.set("Authorization", tokenOwner);
		solution.setDescription("test description updated OK");
		response = restTemplate.exchange(href, HttpMethod.PUT, new HttpEntity<>(solution, headers), ResponseRest.class);
		// assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
		// assertEquals("test description updated OK", response.getBody().getDescription());

		// PUT PRECONDITION_FAILED since version has been changed during previous update
		solution.setDescription("test description updated PRECONDITION_FAILED");
		response = restTemplate.exchange(href, HttpMethod.PUT, new HttpEntity<>(solution, headers), ResponseRest.class);
		// assertEquals(HttpStatus.PRECONDITION_FAILED, response.getStatusCode());
		assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
		// assertNull(response.getBody());

		// DELETE
		headers.remove("If-Match");
		response = restTemplate.exchange(href, HttpMethod.DELETE, new HttpEntity<>(headers), ResponseRest.class);
		// assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
		assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
		assertNull(response.getBody());
		SecurityContextHolder.getContext().setAuthentication(adminAuth);
		nl.wur.daghub.database.domain.Solution sol = repositorySolution
				.findById(Integer.parseInt(href.substring(href.lastIndexOf('/') + 1))).get();
		repositorySolution.delete(sol);
		SecurityContextHolder.getContext().setAuthentication(null);
	}

}
