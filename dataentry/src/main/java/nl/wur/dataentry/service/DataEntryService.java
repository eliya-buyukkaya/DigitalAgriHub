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

package nl.wur.dataentry.service;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.hibernate.jpa.TypedParameterValue;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import nl.wur.daghub.database.domain.BusinessFundingStage;
import nl.wur.daghub.database.domain.BusinessGrowthStage;
import nl.wur.daghub.database.domain.BusinessModel;
import nl.wur.daghub.database.domain.Channel;
import nl.wur.daghub.database.domain.Country;
import nl.wur.daghub.database.domain.Entry;
import nl.wur.daghub.database.domain.Language;
import nl.wur.daghub.database.domain.Organisation;
import nl.wur.daghub.database.domain.OrganisationType;
import nl.wur.daghub.database.domain.Region;
import nl.wur.daghub.database.domain.Sector;
import nl.wur.daghub.database.domain.Solution;
import nl.wur.daghub.database.domain.SubUseCase;
import nl.wur.daghub.database.domain.Tag;
import nl.wur.daghub.database.domain.Technology;
import nl.wur.daghub.database.domain.UseCase;
import nl.wur.daghub.database.domain.User;
import nl.wur.daghub.database.dto.DtoIdName;
import nl.wur.daghub.database.repository.RepositoryBusinessFundingStage;
import nl.wur.daghub.database.repository.RepositoryBusinessGrowthStage;
import nl.wur.daghub.database.repository.RepositoryBusinessModel;
import nl.wur.daghub.database.repository.RepositoryChannel;
import nl.wur.daghub.database.repository.RepositoryCountry;
import nl.wur.daghub.database.repository.RepositoryLanguage;
import nl.wur.daghub.database.repository.RepositoryOrganisation;
import nl.wur.daghub.database.repository.RepositoryOrganisationType;
import nl.wur.daghub.database.repository.RepositoryRegion;
import nl.wur.daghub.database.repository.RepositorySector;
import nl.wur.daghub.database.repository.RepositorySolution;
import nl.wur.daghub.database.repository.RepositorySubUseCase;
import nl.wur.daghub.database.repository.RepositoryTag;
import nl.wur.daghub.database.repository.RepositoryTechnology;
import nl.wur.daghub.database.repository.RepositoryUseCase;
import nl.wur.daghub.database.repository.RepositoryUser;
import nl.wur.dataentry.dto.DtoOrganisation;
import nl.wur.dataentry.dto.DtoResponse;
import nl.wur.dataentry.dto.DtoSolution;
import nl.wur.dataentry.dto.DtoTranslation;
import nl.wur.dataentry.dto.DtoUser;
import nl.wur.dataentry.dto.DtoUserReset;
import nl.wur.dataentry.dto.ReCAPTCHAv3Response;
import nl.wur.dataentry.security.AuthUtils;

@Slf4j
@Service
@SuppressWarnings("unchecked")
public class DataEntryService {
    private @Autowired PasswordEncoder passwordEncoder;

    private @Autowired RepositoryBusinessFundingStage repoBusinessFundingStage;
    private @Autowired RepositoryBusinessGrowthStage repoBusinessGrowthStage;
    private @Autowired RepositoryBusinessModel repoBusinessModel;
    private @Autowired RepositoryChannel repoChannel;
    private @Autowired RepositoryCountry repoCountry;
    private @Autowired RepositoryLanguage repoLanguage;
    private @Autowired RepositoryOrganisation repoOrganisation;
    private @Autowired RepositoryOrganisationType repoOrganisationType;
    private @Autowired RepositoryRegion repoRegion;
    private @Autowired RepositorySector repoSector;
    private @Autowired RepositorySolution repoSolution;
    private @Autowired RepositorySubUseCase repoSubUseCase;
    private @Autowired RepositoryTag repoTag;
    private @Autowired RepositoryTechnology repoTechnology;
    private @Autowired RepositoryUseCase repoUseCase;
    private @Autowired RepositoryUser repoUser;

    private @PersistenceContext EntityManager em;
    private ObjectMapper mapper;

    private @Autowired AuthUtils authUtils;
    private @Autowired RestTemplate restTemplate;
    private @Autowired JavaMailSender mailSender;
    private @Value("${dataentry.registration.enabled}") boolean isRegistrationEnabled;
    private @Value("${dataentry.email}") String daghubEmail;
    private @Value("${dataentry.server}") String daghubServer;
    private @Value("${dataentry.email.admin}") String daghubEmailAdmin;
    private @Value("${dataentry.reCaptcha-verify}") String reCaptchaVerify;
    private @Value("${dataentry.reCaptcha-scores-level}") double reCaptchaLevelScores;
    private @Value("${dataentry.reCaptcha-key-site}") String reCaptchaKeySite;
    private @Value("${dataentry.reCaptcha-key-secret}") String reCaptchaKeySecret;
    private @Value("${spring.datasource.url}") String urlDataSource;

    public DataEntryService() {
        mapper = new ObjectMapper();
    }

    public Map<String, String> getDataSource() {
        Map<String, String> result = new HashMap<>();
        result.put("databaseUrl", urlDataSource.substring(5 + urlDataSource.indexOf("5432")));
        result.put("baseUrl", ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString());
        log.info("==> getDataSource " + result.get("databaseUrl") + " " + result.get("baseUrl"));
        return result;
    }

    public Map<String, String> getCaptchaKey() {
        Map<String, String> result = Collections.singletonMap("captchaKey",
                Base64.getEncoder().encodeToString(reCaptchaKeySite.getBytes()));
        log.info("==> getCaptchaKey " + result.get("captchaKey"));
        // sout(new String(Base64.getDecoder().decode(result.get("captchaKey"))));
        return result;
    }

    private String getAuthUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private User getAuthUser() {
        return repoUser.findByEmail(getAuthUsername()).get();
    }

    private ResponseEntity<DtoResponse> isAuthorized(Entry entry, int id) {
        User user = getAuthUser();
        if (user.isAdmin() || entry.hasOwner(user.getId())) {
            log.info("==> isAuthorized TRUE");
            return null;
        }
        log.info("==> isAuthorized FALSE");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new DtoResponse(id,
                HttpStatus.FORBIDDEN.value(), null, "Forbidden"));
    }

    public DtoResponse csrf() {
        log.info("==> csrf");
        return new DtoResponse(null, HttpStatus.OK.value(), "csrf", null);
    }

    public ResponseEntity<DtoResponse> loginUser(String token, String address, HttpServletResponse httpResponse) {
        String username = getAuthUsername();
        log.info("==> loginUser " + username + " " + address);
        List<String> errors = requestReCaptchaV3(token, address);
        if (errors == null)
            return ResponseEntity.ok(new DtoResponse(username, HttpStatus.OK.value(), username + " logged in", null));
        log.info("==> loginUser " + username + " " + errors);
        httpResponse.setHeader("Authorization", "");
        return ResponseEntity.badRequest().body(new DtoResponse(username,
                HttpStatus.BAD_REQUEST.value(), null, errors.toString()));
    }

    public ResponseEntity<DtoResponse> postUser(String token, String address, @Valid DtoUser dtoUser) {
        if (!isRegistrationEnabled)
            return ResponseEntity.badRequest().body(new DtoResponse(isRegistrationEnabled,
                    HttpStatus.BAD_REQUEST.value(), null, "Registration NOT enabled"));
        String username = dtoUser.getEmail();
        log.info("==> postUser " + username);
        List<String> errors = requestReCaptchaV3(token, address);
        if (errors == null) {
            if (repoUser.existsByEmail(username))
                return ResponseEntity.badRequest().body(new DtoResponse(username,
                        HttpStatus.BAD_REQUEST.value(), null, username + " already in use"));
            User user = dtoUser.toUser(passwordEncoder);
            String tokenJwt = authUtils.createJwtToken(username, null);
            user.setTokenreset(tokenJwt);
            if (dtoUser.isEditSolutions()) {
                sendEmail(username, "Please verify your email address with DigitalAgriHub",
                        buildConfirmationEmailWithEdit(username, tokenJwt), true);
                try {
                    InternetAddress[] emails = InternetAddress.parse(daghubEmailAdmin);
                    for (InternetAddress email : emails)
                        sendEmail(email.getAddress(), "DigitalAgriHub: New account", dtoUser.toString(), false);
                } catch (AddressException e) {
                    e.printStackTrace();
                }
            } else {
                user.setApproved(true);
                sendEmail(username, "Activate Your DigitalAgriHub Account", buildConfirmationEmail(username, tokenJwt),
                        true);
            }
            repoUser.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(new DtoResponse(username,
                    HttpStatus.CREATED.value(), username + " created", null));
        }
        log.info("==> postUser " + username + " " + errors);
        return ResponseEntity.badRequest().body(new DtoResponse(username,
                HttpStatus.BAD_REQUEST.value(), null, errors.toString()));
    }

    public Object postUserForgot(String email) {
        Optional<User> optUser = repoUser.findByEmail(email);
        if (optUser.isEmpty()) {
            log.info("==> postForgotPassword failed to send email " + email);
            return ResponseEntity.badRequest().body(new DtoResponse(email, HttpStatus.BAD_REQUEST.value(),
                    null, "Failed to send email"));
        }
        log.info("==> postForgotPassword email sent " + email);
        String tokenJwt = authUtils.createJwtToken(email, null);
        User user = optUser.get();
        user.setTokenreset(tokenJwt);
        repoUser.save(user);
        sendEmail(email, "DigitalAgriHub Password Reset Confirmation", buildPasswordResetEmail(email, tokenJwt), true);
        return ResponseEntity.ok(new DtoResponse(email, HttpStatus.OK.value(), "Email sent", null));
    }

    public ResponseEntity<DtoResponse> postUserReset(@Valid DtoUserReset dtoUser) {
        User user = authUtils.getUserFromToken(dtoUser.getToken());
        log.info("==> postResetPassword " + user.getEmail());
        user.setPassword(passwordEncoder.encode(dtoUser.getPassword()));
        user.setTokenreset(null);
        repoUser.save(user);
        return ResponseEntity.ok(new DtoResponse(user.getEmail(), HttpStatus.OK.value(), "Password reset", null));
    }

    public ResponseEntity<DtoResponse> getUserConfirm(String token) {
        User user = authUtils.getUserFromToken(token);
        log.info("==> confirmEmail " + user.getEmail());
        user.setTokenreset(null);
        user.setEnabled(true);
        repoUser.save(user);
        if (!user.editSolutions()) {
            return ResponseEntity.ok().body(new DtoResponse(user.getEmail(), HttpStatus.OK.value(),
                    "User enabled", null));
        } else {
            try {
                InternetAddress[] emails = InternetAddress.parse(daghubEmailAdmin);
                for (InternetAddress email : emails)
                    sendEmail(email.getAddress(), "DigitalAgriHub: Email confirmed", user.toString(), false);
            } catch (AddressException e) {
                e.printStackTrace();
            }
            return ResponseEntity.ok().body(new DtoResponse(user.getEmail(), HttpStatus.OK.value(),
                    "Waiting for approval", null));
        }
    }

    @Transactional
    public ResponseEntity<DtoResponse> putUser(@Valid DtoUser dtoUser) {
        String username = dtoUser.getEmail();
        log.info("==> putUser " + username);
        HttpHeaders headers = new HttpHeaders();
        User user = getAuthUser();
        String jwt = user.getToken();
        if (!getAuthUsername().equals(username)) {
            if (repoUser.existsByEmail(username))
                return ResponseEntity.badRequest().body(new DtoResponse(username,
                        HttpStatus.BAD_REQUEST.value(), null, username + " already in use"));
            jwt = authUtils.createJwtToken(username, null);
            headers.set("Authorization", "Bearer " + jwt);
            headers.set(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization");
        }
        repoUser.update(user.getId(), dtoUser.getName(), dtoUser.getCompany(), username,
                passwordEncoder.encode(dtoUser.getPassword()), jwt);
        return ResponseEntity.ok().headers(headers).body(new DtoResponse(username,
                HttpStatus.OK.value(), username + " updated", null));
    }

    private List<String> requestReCaptchaV3(String token, String address) {
        String path = reCaptchaVerify + "?secret=" + reCaptchaKeySecret + "&response=" + token + "&remoteip=" + address;
        ReCAPTCHAv3Response response = restTemplate.getForObject(path, ReCAPTCHAv3Response.class);
        List<String> errors = response.getErrors();
        log.info("==> requestReCaptchaV3 " + address + " " + response.getScore() + " >? " + reCaptchaLevelScores + " "
                + errors);
        if (response.isSuccess()) {
            if (response.getScore() > reCaptchaLevelScores)
                return null;
            else
                errors = Collections.singletonList("requestReCaptchaV3 score: " + response.getScore()
                        + " < " + reCaptchaLevelScores);
        }
        return errors;
    }

    public Map<String, Object> getUser() {
        String email = getAuthUsername();
        log.info("==> getUser " + email);
        Map<String, Object> result = new TreeMap<>();
        User user = getAuthUser();
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("company", user.getCompany());
        result.put("solutions", repoSolution.findAllByUserRole());
        result.put("organisations", repoOrganisation.findAllByUserRole());
        return result;
    }

    public DtoResponse getUserRegistration() {
        return new DtoResponse(isRegistrationEnabled, HttpStatus.OK.value(),
                "Registration enabled " + isRegistrationEnabled, null);
    }

    public void deleteUser() {
        String email = getAuthUsername();
        log.info("==> " + "deleteUser " + email);
        repoUser.delete(getAuthUser());
    }

    private void sendEmail(String email, String subject, String text, boolean html) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        try {
            helper.setTo(email);
            helper.setText(text, html);
            helper.setSubject(subject);
            helper.setFrom(daghubEmail);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        mailSender.send(mimeMessage);
    }

    private String buildConfirmationEmail(String email, String token) {
        return "<div style=\"width: 100%; color:#282828; background-color: #ffffff; margin:30px 20px 20px 20px; -webkit-font-smoothing: antialiased; font-family: 'Open Sans', sans-serif; text-align: left;\">\n"
                + " <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: collapse; width: 100%; height: auto;\">\n"
                + " <tr>\n"
                + " <td>\n"
                + " <a href=\"https://www.wur.nl\">\n"
                + " <img src=\"" + daghubServer
                + "/logoDagHub.png\" border=\"0\" width=\"220\" style=\"display: block;\">\n"
                + " </a>\n"
                + " </td>\n"
                + " </tr>\n"
                + " <tr>\n"
                + " <td style=\"font-size:14px; line-height:24px;\">\n"
                + " <h2 style=\"font-weight:bold;margin:40px 0 30px 0;color:#8dc63f;\">Welcome to DigitalAgriHub!</h2>\n"
                + " <p>You're just one click away from getting started with DigitalAgriHub. All you need to do is verify your email address to activate your DigitalAgriHub account.</p>\n"
                + " <a href=\"" + daghubServer + "/#/user/confirm?token=" + token
                + "\" style=\"display:inline-block;text-decoration:none;border-left:20px solid #8dc63f;border-bottom:10px solid #8dc63f;border-top:10px solid #8dc63f;border-right:20px solid #8dc63f;font-weight:bold;font-size:14px;color:#ffffff;background:#8dc63f;border-radius:5px;text-align: center;\">\n"
                + " Confirm My Email\n"
                + " </a>\n"
                + " <p>Once you have confirmed, you can start using all of DigitalAgriHub's features.</p>\n"
                + " <p>You're receiving this email because you recently created a new DigitalAgriHub account or added a new email address. If this wasn't you, please ignore this email.</p>\n"
                + " </td>\n"
                + " </tr>\n"
                + " <tr>\n"
                + " <td style=\"padding-top:40px; font-size:12px;\">\n"
                + " This email was sent to <a style=\"color:#8dc63f;text-decoration:none;font-weight:bold;\" href=\"mailto:"
                + email + "\">" + email + "</a>, which is associated with a DigitalAgriHub account.\n"
                + " <br> <br> &copy; 2023 Wageningen University & Research, All Rights Reserved\n"
                + " </td>\n"
                + " </tr>\n"
                + " </table>\n"
                + "</div>";
    }

    private String buildConfirmationEmailWithEdit(String email, String token) {
        return "<div style=\"width: 100%; color:#282828; background-color: #ffffff; margin:30px 20px 20px 20px; -webkit-font-smoothing: antialiased; font-family: 'Open Sans', sans-serif; text-align: left;\">\n"
                + " <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: collapse; width: 100%; height: auto;\">\n"
                + " <tr>\n"
                + " <td>\n"
                + " <a href=\"https://www.wur.nl\">\n"
                + " <img src=\"" + daghubServer
                + "/logoDagHub.png\" border=\"0\" width=\"220\" style=\"display: block;\">\n"
                + " </a>\n"
                + " </td>\n"
                + " </tr>\n"
                + " <tr>\n"
                + " <td style=\"font-size:14px; line-height:24px;\">\n"
                + " <h2 style=\"font-weight:bold;margin:40px 0 30px 0;color:#8dc63f;\">Welcome to DigitalAgriHub!</h2>\n"
                + " <p>You are receiving this because you have a DigitalAgriHub account associated with this email address.</p>\n"
                + " <p>Please click the link below to verify your email address.</p>\n"
                + " <a href=\"" + daghubServer + "/#/user/confirm?token=" + token
                + "\" style=\"display:inline-block;text-decoration:none;border-left:20px solid #8dc63f;border-bottom:10px solid #8dc63f;border-top:10px solid #8dc63f;border-right:20px solid #8dc63f;font-weight:bold;font-size:14px;color:#ffffff;background:#8dc63f;border-radius:5px;text-align: center;\">\n"
                + " Confirm My Email\n"
                + " </a>\n"
                + " <p>You have requested to link your organisation to one or more existing solutions in Digital Agri Hub. We will connect those solutions to your account and inform you by mail. After that you can login and update your organisation or update and add digital solutions.</p>\n"
                + " </td>\n"
                + " </tr>\n"
                + " <tr>\n"
                + " <td style=\"padding-top:40px; font-size:12px;\">\n"
                + " &copy; 2023 Wageningen University & Research, All Rights Reserved\n"
                + " </td>\n"
                + " </tr>\n"
                + " </table>\n"
                + "</div>";
    }

    private String buildPasswordResetEmail(String email, String token) {
        return "<div style=\"width: 100%; color:#282828; background-color: #ffffff; margin:30px 20px 20px 20px; -webkit-font-smoothing: antialiased; font-family: 'Open Sans', sans-serif; text-align: left;\">\n"
                + " <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: collapse; width: 100%; height: auto;\">\n"
                + " <tr>\n"
                + " <td>\n"
                + " <a href=\"https://www.wur.nl\">\n"
                + " <img src=\"" + daghubServer
                + "/logoDagHub.png\" border=\"0\" width=\"220\" style=\"display: block;\">\n"
                + " </a>\n"
                + " </td>\n"
                + " </tr>\n"
                + " <tr>\n"
                + " <td style=\"font-size:14px; line-height:24px;\">\n"
                + " <p style=\"margin:30px 0 0 0;\">You're receiving this e-mail because you requested a password reset for your user account at DigitalAgriHub.</p>\n"
                + " <p>Please go to the following page and choose a new password:</p>\n"
                + " <a href=\"" + daghubServer + "/#/user/reset?token=" + token
                + "\" style=\"display:inline-block;text-decoration:none;border-left:20px solid #8dc63f;border-bottom:10px solid #8dc63f;border-top:10px solid #8dc63f;border-right:20px solid #8dc63f;font-weight:bold;font-size:14px;color:#ffffff;background:#8dc63f;border-radius:5px;text-align: center;\">\n"
                + " Reset Password\n"
                + " </a>\n"
                + " <p>If you receive this message by mistake, please delete this message from your system and notify us.</p>\n"
                + " </td>\n"
                + " </tr>\n"
                + " <tr>\n"
                + " <td style=\"padding-top:40px; font-size:12px;\">\n"
                + " This email was sent to <a style=\"color:#8dc63f;text-decoration:none;font-weight:bold;\" href=\"mailto:"
                + email + "\">" + email + "</a>, which is associated with a DigitalAgriHub account.\n"
                + " <br> <br> &copy; 2023 Wageningen University & Research, All Rights Reserved\n"
                + " </td>\n"
                + " </tr>\n"
                + " </table>\n"
                + "</div>";
    }

    public Iterable<BusinessFundingStage> getBusinessFundingStages() {
        log.info("==> getBusinessFundingStages");
        return repoBusinessFundingStage.findAll();
    }

    public Iterable<BusinessGrowthStage> getBusinessGrowthStages() {
        log.info("==> getBusinessGrowthStages");
        return repoBusinessGrowthStage.findAll();
    }

    public Iterable<BusinessModel> getBusinessModels() {
        log.info("==> getBusinessModels");
        return repoBusinessModel.findAll();
    }

    public Iterable<Channel> getChannels() {
        log.info("==> getChannels");
        return repoChannel.findAll();
    }

    public Iterable<Map<String, Object>> getCountries() {
        log.info("==> getCountries");
        Iterable<Country> countries = repoCountry.findAll();
        List<Map<String, Object>> dtoCountries = new ArrayList<>();
        for (Country country : countries)
            dtoCountries.add(getCountries(country));
        return dtoCountries;
    }

    public Map<String, Object> getCountries(String id) {
        log.info("==> getCountries " + id);
        return getCountries(repoCountry.findById(id).get());
    }

    private Map<String, Object> getCountries(Country country) {
        Map<String, Object> map = mapper.convertValue(country, Map.class);
        map.put("regions", repoSolution.findRegionsByCountryId(country.getId()));
        return map;
    }

    public Iterable<Language> getLanguages() {
        log.info("==> getLanguages");
        return repoLanguage.findAll();
    }

    public Map<String, Object> getOrganisations(Integer id) {
        log.info("==> getOrganisations " + id);
        if (repoOrganisation.findById(id).isPresent()) {
            Organisation organisation = repoOrganisation.findById(id).get();
            Map<String, Object> map = mapper.convertValue(organisation, Map.class);
            map.put("solutions", repoSolution.findByOrganisationId(id));
            return map;
        } else
            throw new RuntimeException("Organisation " + id + " does not exist");
    }

    public Iterable<OrganisationType> getOrganisationTypes() {
        log.info("==> getOrganisationTypes");
        return repoOrganisationType.findAll();
    }

    public Iterable<Region> getRegions() {
        log.info("==> getRegions");
        return repoRegion.findAll();
    }

    public Iterable<Sector> getSectors() {
        log.info("==> getSectors");
        return repoSector.findAll();
    }

    public Map<String, Object> getSolutions(Integer id) {
        log.info("==> getSolutions " + id);
        if (repoSolution.findById(id).isPresent()) {
            Solution solution = repoSolution.findById(id).get();
            Map<String, Object> result = mapper.convertValue(solution, Map.class);

            // remove primarysubusecase from subUseCases
            Map<String, Object> primarysubusecase = null;
            for (Map<String, Object> item : (List<Map<String, Object>>) result.get("subUseCases"))
                if ((int) item.get("id") == solution.getPrimarysubusecase().getId()) {
                    primarysubusecase = item;
                    break;
                }
            ((List<Map<String, Object>>) result.get("subUseCases")).remove(primarysubusecase);

            result.put("organisation", solution.getOrganisation().getId());
            result.put("channels", repoSolution.findChannelsById(id));
            result.put("countries", repoSolution.findCountriesById(id));
            result.put("languages", repoSolution.findLanguagesById(id));
            result.put("technologies", repoSolution.findTechnologiesById(id));
            return result;
        } else
            throw new RuntimeException("Solution " + id + " does not exist");
    }

    public Iterable<SubUseCase> getSubUseCases() {
        log.info("==> getSubUseCases");
        return repoSubUseCase.findAll();
    }

    public Iterable<Tag> getTags() {
        log.info("==> getTags");
        return repoTag.findAll();
    }

    public Iterable<Technology> getTechnologies() {
        log.info("==> getTechnologies");
        return repoTechnology.findAll();
    }

    public Iterable<Map<String, Object>> getUseCases() {
        log.info("==> getUseCases");
        Iterable<UseCase> usecases = repoUseCase.findAll();
        List<Map<String, Object>> dtoUsecases = new ArrayList<>();
        for (UseCase usecase : usecases)
            dtoUsecases.add(getUseCases(usecase));
        return dtoUsecases;
    }

    public Map<String, Object> getUseCases(int id) {
        log.info("==> getUseCases " + id);
        return getUseCases(repoUseCase.findById(id).get());
    }

    private Map<String, Object> getUseCases(UseCase usecase) {
        Map<String, Object> map = mapper.convertValue(usecase, Map.class);
        map.put("subusecases", repoSolution.findSubUseCasesByUseCaseId(usecase.getId()));
        return map;
    }

    private <T> void insertIntoInSolutions(String table, List<T> ids, int idSolution) {
        log.info("==> insertInto " + table + " " + ids + " " + idSolution);
        if (ids == null)
            return;
        for (T id : ids)
            em.createNativeQuery("INSERT INTO daghub_dataentry." + table + " VALUES (?,?)")
                    .setParameter(1, id).setParameter(2, idSolution).executeUpdate();
    }

    private void insertIntoTranslations(String table, int id, List<DtoTranslation> translations) {
        log.info("==> insertInto " + table + " " + id + " " + translations);
        if (translations == null)
            return;
        for (DtoTranslation translation : translations)
            em.createNativeQuery("INSERT INTO daghub_dataentry." + table + " VALUES (?,?,?)")
                    .setParameter(1, id).setParameter(2, translation.getLanguage())
                    .setParameter(3, translation.getTranslation())
                    .executeUpdate();
    }

    private void insertIntoLanguages(int idSolution, List<String> languages) {
        log.info("==> insertIntoLanguages " + idSolution + " " + languages);
        if (languages == null)
            return;
        List<Integer> ids = new ArrayList<>();
        for (String language : languages) {
            if (repoLanguage.existsByDescription(language))
                ids.add(repoLanguage.findByDescription(language).get().getId());
            else
                ids.add(repoLanguage.save(new Language(language)).getId());
        }
        insertIntoInSolutions("languages_in_solutions", ids, idSolution);
    }

    private void insertIntoRegions(int idSolution, List<DtoSolution.DtoRegion> regions) {
        log.info("==> insertIntoRegions " + idSolution + " " + regions);
        if (regions == null)
            return;
        for (DtoSolution.DtoRegion dtoRegion : regions) {
            Country country = repoCountry.findById(dtoRegion.getCountry()).get();
            List<Integer> ids = new ArrayList<>();
            for (String region : dtoRegion.getRegions()) {
                if (repoRegion.existsByDescriptionAndCountryId(region, country.getId()))
                    ids.add(repoRegion.findByDescriptionAndCountryId(region, country.getId()).get().getId());
                else
                    ids.add(repoRegion.save(new Region(region, country)).getId());
            }
            insertIntoInSolutions("regions_in_solutions", ids, idSolution);
        }
    }

    private void insertIntoInSolutionsAndTranslations(int id, DtoSolution solution) {
        em.createNativeQuery("INSERT INTO daghub_dataentry.sub_use_cases_in_solutions VALUES (?,?)")
                .setParameter(1, solution.getPrimarysubusecase()).setParameter(2, id).executeUpdate();
        insertIntoInSolutions("business_models_in_solutions", solution.getBusinessModels(), id);
        insertIntoInSolutions("channels_in_solutions", solution.getChannels(), id);
        insertIntoInSolutions("countries_in_solutions", solution.getCountries(), id);
        insertIntoInSolutions("languages_in_solutions", solution.getLanguages(), id);
        insertIntoInSolutions("regions_in_solutions", solution.getRegions(), id);
        insertIntoInSolutions("sectors_in_solutions", solution.getSectors(), id);
        insertIntoInSolutions("sub_use_cases_in_solutions", solution.getSubUseCases(), id);
        insertIntoInSolutions("tags_in_solutions", solution.getTags(), id);
        insertIntoInSolutions("technologies_in_solutions", solution.getTechnologies(), id);

        insertIntoTranslations("solution_translations", id, solution.getTranslations());
        insertIntoLanguages(id, solution.getOtherLanguages());
        insertIntoRegions(id, solution.getOtherRegions());
    }

    private void deleteFromTranslations(String table, String column, int id) {
        log.info("==> deleteFrom " + table + " " + column + " " + id);
        em.createNativeQuery("DELETE FROM daghub_dataentry." + table + " WHERE " + column + "=:id")
                .setParameter("id", id).executeUpdate();
    }

    private void deleteFromInSolutions(String table, int idSolution) {
        log.info("==> deleteFrom " + table + " solution_id " + idSolution);
        em.createNativeQuery("DELETE FROM daghub_dataentry." + table + " WHERE solution_id=:idSolution")
                .setParameter("idSolution", idSolution).executeUpdate();
    }

    private void deleteFromInSolutionsAndTranslations(int id) {
        deleteFromInSolutions("business_models_in_solutions", id);
        deleteFromInSolutions("channels_in_solutions", id);
        deleteFromInSolutions("countries_in_solutions", id);
        deleteFromInSolutions("languages_in_solutions", id);
        deleteFromInSolutions("regions_in_solutions", id);
        deleteFromInSolutions("sectors_in_solutions", id);
        deleteFromInSolutions("sub_use_cases_in_solutions", id);
        deleteFromInSolutions("tags_in_solutions", id);
        deleteFromInSolutions("technologies_in_solutions", id);
        deleteFromTranslations("solution_translations", "solution_id", id);
    }

    private List<Integer> getRelatedEntity(String entity, int idSolution) {
        return em.createNativeQuery("SELECT " + entity + "_id FROM daghub_dataentry." + entity + "s_in_solutions"
                + " WHERE solution_id=:id AND " + entity + "_id > 9999").setParameter("id", idSolution).getResultList();
    }

    private void deleteNotRelatedEntity(String entity, List<Integer> ids) {
        log.info("==> deleteNotRelatedEntity " + entity + " " + ids);
        for (int id : ids)
            if (em.createNativeQuery("SELECT solution_id FROM daghub_dataentry." + entity + "s_in_solutions"
                    + " WHERE " + entity + "_id=:id").setParameter("id", id).getResultList().isEmpty()
                    && (entity.equals("language")
                            || em.createNativeQuery("SELECT id FROM daghub_dataentry.organisations"
                                    + " WHERE hqregion_id=:id").setParameter("id", id).getResultList().isEmpty()))
                em.createNativeQuery("DELETE FROM daghub_dataentry." + entity + "s WHERE id=:id").setParameter("id", id)
                        .executeUpdate();
    }

    private String[] findOwners() {
        List<String> owners = repoOrganisation.findOwners();
        if (owners.isEmpty())
            return new String[] { Integer.toString(getAuthUser().getId()) };
        else
            return owners.get(0).replaceFirst("\\{", "").replaceFirst("}", "").split(",");
    }

    @Transactional
    public ResponseEntity<DtoResponse> postOrganisation(DtoOrganisation organisation) {
        String[] owners = findOwners();
        Timestamp datemodifiedowner = (getAuthUser().getId() > 9999) ? new Timestamp(System.currentTimeMillis()) : null;
        int id = repoOrganisation.save(new Organisation(organisation.getName(), organisation.getDescription(),
                organisation.getUrl(), organisation.getFounded(),
                repoOrganisationType.findById(organisation.getOrganisationtype()).get(),
                repoCountry.findById(organisation.getHqcountry()).get(),
                repoRegion.findById(organisation.getHqregion()).get(),
                repoBusinessFundingStage.findById(organisation.getBusinessFundingStage()).get(),
                repoBusinessGrowthStage.findById(organisation.getBusinessGrowthStage()).get(), owners,
                datemodifiedowner))
                .getId();
        log.info("==> postOrganisation " + id + " " + organisation);
        insertIntoTranslations("organisation_translations", id, organisation.getTranslations());
        return ResponseEntity.status(HttpStatus.CREATED).body(new DtoResponse(id,
                HttpStatus.CREATED.value(), "Organisation " + id + " created", null));
    }

    private void updateOrganisation(int id, DtoOrganisation organisation) {
        log.info("==> updateOrganisation " + id);
        em.createNativeQuery("UPDATE daghub_dataentry.organisations SET "
                + "name=:name,description=:description,url=:url,organisationtype_id=:organisationtype,"
                + "founded=:founded,hqcountry_id=:hqcountry,hqregion_id=:hqregion,"
                + "business_growth_stage_id=:businessGrowthStage,business_funding_stage_id=:businessFundingStage,datemodified = now()"
                + ((getAuthUser().getId() > 9999) ? ",datemodifiedowner = now()" : "")
                + " WHERE id=:id")
                .setParameter("name", organisation.getName())
                .setParameter("description", organisation.getDescription() != null ? organisation.getDescription()
                        : new TypedParameterValue(StringType.INSTANCE, null))
                .setParameter("url", organisation.getUrl() != null ? organisation.getUrl()
                        : new TypedParameterValue(StringType.INSTANCE, null))
                .setParameter("organisationtype", organisation.getOrganisationtype())
                .setParameter("founded", organisation.getFounded() != null ? organisation.getFounded()
                        : new TypedParameterValue(IntegerType.INSTANCE, null))
                .setParameter("hqcountry", organisation.getHqcountry())
                .setParameter("hqregion", organisation.getHqregion())
                .setParameter("businessGrowthStage", organisation.getBusinessGrowthStage())
                .setParameter("businessFundingStage", organisation.getBusinessFundingStage())
                .setParameter("id", id)
                .executeUpdate();
    }

    @Transactional
    public ResponseEntity<DtoResponse> putOrganisation(int id, DtoOrganisation organisation) {
        log.info("==> putOrganisation " + id + " " + organisation);
        ResponseEntity<DtoResponse> response = isAuthorized(repoOrganisation.findById(id).get(), id);
        if (response != null)
            return response;
        updateOrganisation(id, organisation);
        deleteFromTranslations("organisation_translations", "organisation_id", id);
        insertIntoTranslations("organisation_translations", id, organisation.getTranslations());
        return ResponseEntity.ok(new DtoResponse(id, HttpStatus.OK.value(), "Organisation " + id + " updated", null));
    }

    @Transactional
    public ResponseEntity<DtoResponse> postSolution(DtoSolution solution) {
        Organisation organisation = repoOrganisation.findById(solution.getOrganisation()).get();
        int idOwner = getAuthUser().getId();
        String[] owners = organisation.addOwner(idOwner);
        Timestamp datemodifiedowner = (idOwner > 9999) ? new Timestamp(System.currentTimeMillis()) : null;
        int id = repoSolution.save(new Solution(solution.getName(), solution.getDescription(),
                solution.getUrl(), solution.getLaunch(), solution.getPlatform(), solution.getBundling(),
                solution.getRegisteredusers(), solution.getActiveusers(), solution.getShfusers(),
                solution.getWomenusers(), solution.getYouthusers(), solution.getRevenue(),
                solution.getYieldlowerbound(), solution.getYieldupperbound(), solution.getIncomelowerbound(),
                solution.getIncomeupperbound(), organisation,
                repoSubUseCase.findById(solution.getPrimarysubusecase()).get(), owners, datemodifiedowner))
                .getId();
        log.info("==> postSolution " + id + " " + solution);
        insertIntoInSolutionsAndTranslations(id, solution);
        return ResponseEntity.status(HttpStatus.CREATED).body(new DtoResponse(id,
                HttpStatus.CREATED.value(), "Solution " + id + " created", null));
    }

    private void updateSolution(int id, DtoSolution solution) {
        log.info("==> updateSolution " + id);
        em.createNativeQuery("UPDATE daghub_dataentry.solutions SET "
                + "name=:name,description=:description,url=:url,organisation_id=:organisation,"
                + "launch=:launch,platform=:platform,bundling=:bundling,primarysubusecase_id=:usecase,"
                + "registeredusers=:registeredusers,activeusers=:activeusers,shfusers=:shfusers,womenusers=:womenusers,youthusers=:youthusers,"
                + "revenue=:revenue,yieldlowerbound=:yieldlowerbound,yieldupperbound=:yieldupperbound,"
                + "incomelowerbound=:incomelowerbound,incomeupperbound=:incomeupperbound,datemodified = now()"
                + ((getAuthUser().getId() > 9999) ? ",datemodifiedowner = now()" : "")
                + " WHERE id=:id")
                .setParameter("name", solution.getName())
                .setParameter("description", solution.getDescription())
                .setParameter("url", solution.getUrl() != null ? solution.getUrl()
                        : new TypedParameterValue(StringType.INSTANCE, null))
                .setParameter("organisation", solution.getOrganisation())
                .setParameter("launch", solution.getLaunch())
                .setParameter("platform", solution.getPlatform() != null ? solution.getPlatform()
                        : new TypedParameterValue(IntegerType.INSTANCE, null))
                .setParameter("bundling", solution.getBundling() != null ? solution.getBundling()
                        : new TypedParameterValue(IntegerType.INSTANCE, null))
                .setParameter("usecase", solution.getPrimarysubusecase())
                .setParameter("registeredusers", solution.getRegisteredusers() != null ? solution.getRegisteredusers()
                        : new TypedParameterValue(IntegerType.INSTANCE, null))
                .setParameter("activeusers", solution.getActiveusers() != null ? solution.getActiveusers()
                        : new TypedParameterValue(IntegerType.INSTANCE, null))
                .setParameter("shfusers", solution.getShfusers() != null ? solution.getShfusers()
                        : new TypedParameterValue(IntegerType.INSTANCE, null))
                .setParameter("womenusers", solution.getWomenusers() != null ? solution.getWomenusers()
                        : new TypedParameterValue(IntegerType.INSTANCE, null))
                .setParameter("youthusers", solution.getYouthusers() != null ? solution.getYouthusers()
                        : new TypedParameterValue(IntegerType.INSTANCE, null))
                .setParameter("revenue", solution.getRevenue() != null ? solution.getRevenue()
                        : new TypedParameterValue(IntegerType.INSTANCE, null))
                .setParameter("yieldlowerbound", solution.getYieldlowerbound() != null ? solution.getYieldlowerbound()
                        : new TypedParameterValue(DoubleType.INSTANCE, null))
                .setParameter("yieldupperbound", solution.getYieldupperbound() != null ? solution.getYieldupperbound()
                        : new TypedParameterValue(DoubleType.INSTANCE, null))
                .setParameter("incomelowerbound",
                        solution.getIncomelowerbound() != null ? solution.getIncomelowerbound()
                                : new TypedParameterValue(DoubleType.INSTANCE, null))
                .setParameter("incomeupperbound",
                        solution.getIncomeupperbound() != null ? solution.getIncomeupperbound()
                                : new TypedParameterValue(DoubleType.INSTANCE, null))
                .setParameter("id", id)
                .executeUpdate();
    }

    @Transactional
    public ResponseEntity<DtoResponse> putSolution(int id, DtoSolution solution) {
        log.info("==> putSolution " + id + " " + solution);
        Solution sol = repoSolution.findById(id).get();
        ResponseEntity<DtoResponse> response = isAuthorized(sol, id);
        if (response != null)
            return response;

        List<Integer> listLanguages = getRelatedEntity("language", id);
        List<Integer> listRegions = getRelatedEntity("region", id);
        updateSolution(id, solution);
        deleteFromInSolutionsAndTranslations(id);
        insertIntoInSolutionsAndTranslations(id, solution);
        deleteNotRelatedEntity("language", listLanguages);
        deleteNotRelatedEntity("region", listRegions);
        return ResponseEntity.ok(new DtoResponse(id, HttpStatus.OK.value(), "Solution " + id + " updated", null));
    }

    private void updateDateRemoved(String table, int id) {
        log.info("==> updateDateRemoved " + table + " " + id);
        em.createNativeQuery("UPDATE daghub_dataentry." + table + " SET dateremoved = now() WHERE id=:id")
                .setParameter("id", id).executeUpdate();
    }

    @Transactional
    public ResponseEntity<?> deleteOrganisation(int id) {
        log.info("==> deleteOrganisation " + id);
        ResponseEntity<DtoResponse> response = isAuthorized(repoOrganisation.findById(id).get(), id);
        if (response != null)
            return response;
        // deleteFromTranslations("organisation_translations", "organisation_id", id);
        updateDateRemoved("organisations", id);
        for (DtoIdName solution : repoSolution.findByOrganisationId(id))
            deleteSolution(solution.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }

    @Transactional
    public ResponseEntity<?> deleteSolution(int id) {
        log.info("==> deleteSolution " + id);
        ResponseEntity<DtoResponse> response = isAuthorized(repoSolution.findById(id).get(), id);
        if (response != null)
            return response;
        // List<Integer> listLanguages = getRelatedEntity("language", id);
        // List<Integer> listRegions = getRelatedEntity("region", id);
        // deleteFromInSolutionsAndTranslations(id);
        // deleteNotRelatedEntity("language", listLanguages);
        // deleteNotRelatedEntity("region", listRegions);
        updateDateRemoved("solutions", id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }

    @Transactional
    public Object postFileOrganisations(MultipartFile file)
            throws StreamReadException, DatabindException, IOException {
        List<DtoOrganisation> organisations = mapper.readValue(file.getBytes(),
                new TypeReference<List<DtoOrganisation>>() {
                });
        List<Integer> ids = new ArrayList<>();
        for (DtoOrganisation organisation : organisations) {
            if (!organisation.isValid())
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new DtoResponse(null,
                        HttpStatus.BAD_REQUEST.value(), null,
                        "NOT NULL: name, url, organisationtype, hqcountry, hqregion, businessFundingStage, businessGrowthStage"));
            if (organisation.getId() != null && repoOrganisation.existsById(organisation.getId())) {
                ResponseEntity<DtoResponse> response = putOrganisation(organisation.getId(), organisation);
                if (response.getStatusCode() == HttpStatus.FORBIDDEN)
                    return response;
                ids.add(organisation.getId());
            } else {
                ids.add((Integer) (postOrganisation(organisation).getBody().getValue()));
            }
        }
        return ids;
    }

    @Transactional
    public Object postFileSolutions(MultipartFile file)
            throws StreamReadException, DatabindException, IOException {
        List<DtoSolution> solutions = mapper.readValue(file.getBytes(), new TypeReference<List<DtoSolution>>() {
        });
        List<Integer> ids = new ArrayList<>();
        for (DtoSolution solution : solutions) {
            if (!solution.isValid())
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new DtoResponse(null,
                        HttpStatus.BAD_REQUEST.value(), null,
                        "NOT NULL, NOT EMPTY: name, description, url, organisation, launch, sector, primarysubusecase,"
                                + " businessModels, channels, countries, languages, technologies"));
            if (solution.getId() != null && repoSolution.existsById(solution.getId())) {
                ResponseEntity<DtoResponse> response = putSolution(solution.getId(), solution);
                if (response.getStatusCode() == HttpStatus.FORBIDDEN)
                    return response;
                ids.add(solution.getId());
            } else {
                ids.add((Integer) (postSolution(solution).getBody().getValue()));
            }
        }
        return ids;
    }

    public Object getUserSolutions(String email, String company) {
        if (org.apache.commons.validator.routines.EmailValidator.getInstance().isValid(email))
            return repoSolution.findByEmailOrCompany(email.split("@")[1], company);
        else
            return ResponseEntity.badRequest().body(new DtoResponse(email, HttpStatus.BAD_REQUEST.value(),
                    null, "Email not valid"));
    }

    @Transactional
    private void trimUrl(List<List<Object>> list, String table) {
        log.info("==> trimUrl " + table);
        for (List<Object> entity : list) {
            String url = ((String) entity.get(1));
            if (!url.equals(url.trim()))
                em.createNativeQuery("UPDATE daghub_dataentry." + table + " SET url=:url WHERE id=:id")
                        .setParameter("url", url.trim())
                        .setParameter("id", entity.get(0))
                        .executeUpdate();
        }
    }

    private void trimUrl() {
        trimUrl(repoSolution.findIdAndUrl(), "solutions");
        trimUrl(repoOrganisation.findIdAndUrl(), "organisations");
    }

    @Transactional
    private void checkUrl(List<List<Object>> list, String table) {
        log.info("==> checkUrl " + table);
        Thread thread = new Thread() {
            @Transactional
            public void run() {
                List<String> result = new ArrayList<>();
                for (List<Object> entity : list) {
                    int id = (int) entity.get(0);
                    String url = ((String) entity.get(1));
                    try {
                        // ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
                        restTemplate.headForHeaders(url);
                    } catch (Exception e) {
                        // if (e instanceof org.springframework.web.client.ResourceAccessException)
                        // if (e instanceof org.springframework.web.client.HttpClientErrorException)
                        // if (e instanceof org.springframework.web.client.HttpServerErrorException)
                        if (e instanceof org.springframework.web.client.HttpClientErrorException
                                && !e.getLocalizedMessage().contains("400")
                                && !e.getLocalizedMessage().contains("404")) {
                            log.warn("==> checkUrl 400/404 " + table + " " + id + " " + url);
                            continue;
                        }
                        if (url.startsWith("https://")) {
                            url = url.replaceFirst("https://", "http://");
                            try {
                                restTemplate.headForHeaders(url);
                                log.warn("==> checkUrl https2http " + table + " " + id + " " + url);
                                em.createNativeQuery("UPDATE daghub_dataentry." + table + " SET url=:url WHERE id=:id")
                                        .setParameter("url", url.trim())
                                        .setParameter("id", id)
                                        .executeUpdate();
                                continue;
                            } catch (Exception e2) {
                                if (e2 instanceof org.springframework.web.client.HttpClientErrorException
                                        && !e2.getLocalizedMessage().contains("400")
                                        && !e2.getLocalizedMessage().contains("404")) {
                                    log.warn("==> checkUrl 400/404 " + table + " " + id + " " + url);
                                    continue;
                                }
                                url = url.replaceFirst("http://", "https://");
                            }
                        } else if (url.startsWith("http://")) {
                            url = url.replaceFirst("http://", "https://");
                            try {
                                restTemplate.headForHeaders(url);
                                log.warn("==> checkUrl http2https " + table + " " + id + " " + url);
                                em.createNativeQuery("UPDATE daghub_dataentry." + table + " SET url=:url WHERE id=:id")
                                        .setParameter("url", url.trim())
                                        .setParameter("id", id)
                                        .executeUpdate();
                                continue;
                            } catch (Exception e2) {
                                if (e2 instanceof org.springframework.web.client.HttpClientErrorException
                                        && !e2.getLocalizedMessage().contains("400")
                                        && !e2.getLocalizedMessage().contains("404")) {
                                    log.warn("==> checkUrl 400/404 " + table + " " + id + " " + url);
                                    continue;
                                }
                                url = url.replaceFirst("https://", "http://");
                            }
                        }
                        log.info("==> checkUrl " + table + " " + id + " " + url + " " + e.getLocalizedMessage());
                        result.add("<br>" + id + " " + url);
                    }
                }
                try {
                    InternetAddress[] emails = InternetAddress.parse(daghubEmailAdmin);
                    for (InternetAddress email : emails)
                        sendEmail(email.getAddress(), "DigitalAgriHub: " + table + " broken url", result.toString(),
                                true);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        thread.start();
    }

    @Transactional
    public void checkUrl(String table) {
        if (table.equals("solutions"))
            checkUrl(repoSolution.findIdAndUrl(), table);
        else if (table.equals("organisations"))
            checkUrl(repoOrganisation.findIdAndUrl(), table);
    }
}
