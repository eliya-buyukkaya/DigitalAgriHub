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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import nl.wur.dataentry.dto.DtoUser;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class UserTests {
	private @Autowired ObjectMapper mapper;
	private @Autowired MockMvc mockMvc;
	private String user;

	@BeforeEach
	private void setup() throws JsonProcessingException {
		user = mapper.writeValueAsString(
				new DtoUser("name", "Password12!", "Password12!", "emailUser@test.com", "company"));
	}

	@Test
	public void testSuccessiveRegister() throws Exception {
		MockHttpServletRequestBuilder request;
		MvcResult response;
		String token;

		System.out.println("===> 1 post /api/user");
		request = post("/api/user").servletPath("/api/user").with(csrf().asHeader())
				.contentType(MediaType.APPLICATION_JSON).content(user);
		mockMvc.perform(request).andExpect(status().isCreated())
				.andExpect(jsonPath("$.message").value("User emailUser@test.com created"));

		System.out.println("===> 2 post /api/user");
		request = post("/api/user").servletPath("/api/user").with(csrf().asHeader())
				.contentType(MediaType.APPLICATION_JSON).content(user);
		mockMvc.perform(request).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.error").value("Email emailUser@test.com already in use"));

		System.out.println("===> 3 post /api/login");
		request = post("/api/login").servletPath("/api/login").with(csrf().asHeader())
				.with(SecurityMockMvcRequestPostProcessors.httpBasic("emailUser@test.com", "Password12!"));
		response = mockMvc.perform(request).andExpect(status().isOk())
				.andExpect(jsonPath("$.message").value("User emailUser@test.com logged in")).andReturn();
		token = response.getResponse().getHeader("Authorization");

		System.out.println("===> 4 delete /api/user valid token");
		request = delete("/api/user").servletPath("/api/user").with(csrf().asHeader()).header("Authorization",
				token);
		mockMvc.perform(request).andExpect(status().isNoContent());
	}

	@Test
	public void testSuccessiveLogin() throws Exception {
		MockHttpServletRequestBuilder request;
		MvcResult response;
		String token1, token2;

		System.out.println("===> 1 post /api/user");
		request = post("/api/user").servletPath("/api/user").with(csrf().asHeader())
				.contentType(MediaType.APPLICATION_JSON).content(user);
		mockMvc.perform(request).andExpect(status().isCreated())
				.andExpect(jsonPath("$.message").value("User emailUser@test.com created"));

		System.out.println("===> 2 post /api/login");
		request = post("/api/login").servletPath("/api/login").with(csrf().asHeader())
				.with(SecurityMockMvcRequestPostProcessors.httpBasic("emailUser@test.com", "Password12!"));
		response = mockMvc.perform(request).andExpect(status().isOk())
				.andExpect(jsonPath("$.message").value("User emailUser@test.com logged in")).andReturn();
		token1 = response.getResponse().getHeader("Authorization");

		System.out.println("===> 3 get /rest/tags/1");
		request = get("/rest/tags/1").servletPath("/rest/tags/1").header("Authorization", token1);
		mockMvc.perform(request).andExpect(status().isOk());

		System.out.println("===> 4 post /api/login");
		request = post("/api/login").servletPath("/api/login").with(csrf().asHeader())
				.with(SecurityMockMvcRequestPostProcessors.httpBasic("emailUser@test.com", "Password12!"));
		response = mockMvc.perform(request).andDo(print()).andExpect(status().isOk())
				.andExpect(jsonPath("$.message").value("User emailUser@test.com logged in")).andReturn();
		token2 = response.getResponse().getHeader("Authorization");

		if (!token1.equals(token2)) {
			System.out.println("===> 5 get /rest/tags/1 invalid token");
			request = get("/rest/tags/1").servletPath("/rest/tags/1").header("Authorization", token1);
			mockMvc.perform(request).andDo(print()).andExpect(status().isUnauthorized())
					.andExpect(jsonPath("$.error").value("JWT exception : Invalid token"));
		}

		System.out.println("===> 6 delete /api/user valid token");
		request = delete("/api/user").servletPath("/api/user").with(csrf().asHeader()).header("Authorization",
				token2);
		mockMvc.perform(request).andExpect(status().isNoContent());
	}

	@Test
	public void testLogout() throws Exception {
		MockHttpServletRequestBuilder request;
		MvcResult response;
		String token;

		System.out.println("===> 1 post /api/user");
		request = post("/api/user").servletPath("/api/user").with(csrf().asHeader())
				.contentType(MediaType.APPLICATION_JSON).content(user);
		mockMvc.perform(request).andExpect(status().isCreated())
				.andExpect(jsonPath("$.message").value("User emailUser@test.com created"));

		System.out.println("===> 2 post /api/login");
		request = post("/api/login").servletPath("/api/login").with(csrf().asHeader())
				.with(SecurityMockMvcRequestPostProcessors.httpBasic("emailUser@test.com", "Password12!"));
		response = mockMvc.perform(request).andExpect(status().isOk())
				.andExpect(jsonPath("$.message").value("User emailUser@test.com logged in")).andReturn();
		token = response.getResponse().getHeader("Authorization");

		System.out.println("===> 3 post /api/logout");
		request = post("/api/logout").servletPath("/api/logout").with(csrf().asHeader()).header("Authorization", token);
		mockMvc.perform(request).andExpect(status().isFound());

		System.out.println("===> 4 delete /api/user invalid token");
		request = delete("/api/user").servletPath("/api/user").with(csrf().asHeader()).header("Authorization",
				token);
		mockMvc.perform(request).andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.error").value("JWT exception : Invalid token"));

		System.out.println("===> 5 post /api/login");
		request = post("/api/login").servletPath("/api/login").with(csrf().asHeader())
				.with(SecurityMockMvcRequestPostProcessors.httpBasic("emailUser@test.com", "Password12!"));
		response = mockMvc.perform(request).andExpect(status().isOk())
				.andExpect(jsonPath("$.message").value("User emailUser@test.com logged in")).andReturn();
		token = response.getResponse().getHeader("Authorization");

		System.out.println("===> 6 delete /api/user valid token");
		request = delete("/api/user").servletPath("/api/user").with(csrf().asHeader()).header("Authorization",
				token);
		mockMvc.perform(request).andExpect(status().isNoContent());
	}
}
