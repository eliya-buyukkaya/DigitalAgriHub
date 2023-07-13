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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;

import nl.wur.dataentry.dto.DtoUser;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class RequestHeaderTests {
	private @Autowired ObjectMapper mapper;
	private @Autowired MockMvc mockMvc;

	@Test
	public void testHeaderCsrf() throws Exception {
		String user = mapper.writeValueAsString(
				new DtoUser("name", "Password12!", "Password12!", "emailUser@test.com", "company"));
		MockHttpServletRequestBuilder request = post("/api/user").servletPath("/api/user")
				.contentType(MediaType.APPLICATION_JSON).content(user);
		mockMvc.perform(request).andExpect(status().isForbidden());
	}

	@Test
	public void testHeaderContentType() throws Exception {
		String user = mapper.writeValueAsString(
				new DtoUser("name", "Password12!", "Password12!", "emailUser@test.com", "company"));
		MockHttpServletRequestBuilder request = post("/api/user").servletPath("/api/user")
				.with(csrf().asHeader()).content(user);
		mockMvc.perform(request).andExpect(status().isNotFound())
				.andExpect(jsonPath("$.error").value("Content type 'application/octet-stream' not supported"));
	}

	@Test
	public void testInitialAuthorization() throws Exception {
		MockHttpServletRequestBuilder request = post("/api/login").servletPath("/api/login").with(csrf().asHeader());
		mockMvc.perform(request).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.error")
				.value("Basic authorization exception : Provide 'Authorization: Basic Base64 encoded username:password' in request header"));
	}

	@Test
	public void testHeaderJWTAuthorization() throws Exception {
		MockHttpServletRequestBuilder request = post("/api/deleteUser").servletPath("/api/deleteUser").with(csrf().asHeader());
		mockMvc.perform(request).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.error")
				.value("JWT exception : Provide 'Authorization: Bearer JsonWebToken' in request header"));
	}

}
