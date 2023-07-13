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

import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//.andDo(print())
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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
class RegisterValidationTests {
    private @Autowired ObjectMapper mapper;
    private @Autowired MockMvc mockMvc;

    @Test
    public void testInvalidEmail() throws Exception {
        DtoUser user = new DtoUser("name", "Password12!", "Password12!", "emailUser", "company");
        String json = mapper.writeValueAsString(user);
        MockHttpServletRequestBuilder request = post("/api/user").servletPath("/api/user").with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON).content(json);
        mockMvc.perform(request).andExpect(status().isNotFound())
                .andExpect(content().string(containsString("Invalid Email")));
    }

    @Test
    public void testInvalidPassword() throws Exception {
        DtoUser user = new DtoUser("name", "Password12", "Password12", "emailUser@test.com", "company");
        String json = mapper.writeValueAsString(user);
        MockHttpServletRequestBuilder request = post("/api/user").servletPath("/api/user").with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON).content(json);
        mockMvc.perform(request).andExpect(status().isNotFound())
                .andExpect(content().string(containsString("Password must contain 1 or more special characters.")));
    }

    @Test
    public void testUnmatchedPasswords() throws Exception {
        DtoUser user = new DtoUser("name", "Password12!", "Password21!", "emailUser@test.com", "company");
        String json = mapper.writeValueAsString(user);
        MockHttpServletRequestBuilder request = post("/api/user").servletPath("/api/user").with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON).content(json);
        mockMvc.perform(request).andExpect(status().isNotFound())
                .andExpect(content().string(containsString("Passwords don't match")));
    }

    @Test
    public void testNullValue() throws Exception {
        DtoUser user = new DtoUser("name", "Password12!", "Password12!", "emailUser@test.com", null);
        String json = mapper.writeValueAsString(user);
        MockHttpServletRequestBuilder request = post("/api/user").servletPath("/api/user").with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON).content(json);
        mockMvc.perform(request).andExpect(status().isNotFound())
                .andExpect(content().string(containsString("NotNull.company")));
    }

    @Test
    public void testEmtptyString() throws Exception {
        DtoUser user = new DtoUser("name", "Password12!", "Password12!", "emailUser@test.com", "");
        String json = mapper.writeValueAsString(user);
        MockHttpServletRequestBuilder request = post("/api/user").servletPath("/api/user").with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON).content(json);
        mockMvc.perform(request).andExpect(status().isNotFound())
                .andExpect(content().string(containsString("Length must be greater than 1")));
    }
}
