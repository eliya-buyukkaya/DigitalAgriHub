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

package nl.wur.dataentry.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import nl.wur.dataentry.dto.DtoResponse;
import nl.wur.dataentry.dto.DtoUser;
import nl.wur.dataentry.dto.DtoUserReset;
import nl.wur.dataentry.service.DataEntryService;

@Slf4j
@CrossOrigin(origins = { "${dataentry.cors.url}" })
@RestController
@RequestMapping("/api")
public class DataEntryAuthorizationController {

    private DataEntryService service;

    public DataEntryAuthorizationController(DataEntryService service) {
        this.service = service;
    }

    @Operation(summary = "Returning encrypted captcha site key", description = "No authentication required", tags = "6-others")
    @GetMapping(path = "/captchakey")
    public Map<String, String> captchakey() {
        return service.getCaptchaKey();
    }

    @Operation(summary = "Check if data source's url is correct", description = "No authentication required", tags = "6-others")
    @GetMapping(path = "/datasource")
    public Map<String, String> dataSource() {
        return service.getDataSource();
    }

    @Operation(summary = "Used to get XSRF token from backend in order to use as X-XSRF token in especially POST requests", description = "No authentication required", tags = "6-others")
    @GetMapping(path = "/csrf")
    public DtoResponse csrf() {
        return service.csrf();
    }

    @Operation(summary = "Send email containing organisations and solutions with broken url ", tags = "6-others")
    @GetMapping(path = "/url/check")
    public void checkUrl(String table) {
        service.checkUrl(table);
    }

    @Operation(summary = "Returns true if user registration is enabled", tags = "1-user")
    @GetMapping(path = "/user/registration")
    public DtoResponse getUserRegistration() {
        return service.getUserRegistration();
    }

    @Operation(summary = "Register user", description = "No authentication required", tags = "1-user")
    @PostMapping(path = "/user")
    public ResponseEntity<DtoResponse> postUser(HttpServletRequest httpRequest, @RequestBody @Valid DtoUser user) {
        return service.postUser(httpRequest.getHeader("g-recaptcha-token"), httpRequest.getRemoteAddr(), user);
    }

    @Operation(summary = "Get possible solutions based on email and company", tags = "1-user")
    @GetMapping(path = "/user/solutions")
    public Object getUserSolutions(String email, String company) {
        return service.getUserSolutions(email, company);
    }

    @Operation(summary = "Forgot password", tags = "1-user")
    @PostMapping(path = "/user/forgot")
    public Object postUserForgot(String email) {
        return service.postUserForgot(email);
    }

    @Operation(summary = "Reset password", tags = "1-user")
    @PostMapping(path = "/user/reset")
    public ResponseEntity<DtoResponse> postUserReset(@RequestBody @Valid DtoUserReset user) {
        return service.postUserReset(user);
    }

    @Operation(summary = "Update user", tags = "1-user")
    @PutMapping(path = "/user")
    public ResponseEntity<DtoResponse> putUser(@RequestBody @Valid DtoUser user) {
        return service.putUser(user);
    }

    @Operation(summary = "Get user data including user's organisations and solutions", tags = "1-user")
    @GetMapping(path = "/user")
    public Map<String, Object> getUser() {
        return service.getUser();
    }

    @Operation(summary = "Log in to the application", description = "Generated bearer token sent in response header", security = @SecurityRequirement(name = "DataEntryAuthBasic"), tags = "1-user")
    @PostMapping(path = "/login")
    public ResponseEntity<DtoResponse> loginUser(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        return service.loginUser(httpRequest.getHeader("g-recaptcha-token"), httpRequest.getRemoteAddr(), httpResponse);
    }

    @Operation(summary = "Delete user", tags = "1-user")
    @DeleteMapping(path = "/user")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser() {
        service.deleteUser();
    }

    @Operation(summary = "Confirm user email and make user enabled", tags = "1-user")
    @GetMapping(path = "/user/confirm")
    public ResponseEntity<DtoResponse> getUserConfirm(@RequestParam("token") String token) {
        return service.getUserConfirm(token);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(HttpServletRequest httpRequest, Exception e) {
        log.warn("==> " + httpRequest.getRequestURI() + " " + e.getMessage());
        return ResponseEntity.badRequest()
                .body(new DtoResponse(null, HttpStatus.BAD_REQUEST.value(), null, e.getMessage()));
    }
}
