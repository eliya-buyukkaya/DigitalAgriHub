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

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import nl.wur.daghub.database.domain.BusinessFundingStage;
import nl.wur.daghub.database.domain.BusinessGrowthStage;
import nl.wur.daghub.database.domain.BusinessModel;
import nl.wur.daghub.database.domain.Channel;
import nl.wur.daghub.database.domain.Language;
import nl.wur.daghub.database.domain.OrganisationType;
import nl.wur.daghub.database.domain.Region;
import nl.wur.daghub.database.domain.Sector;
import nl.wur.daghub.database.domain.SubUseCase;
import nl.wur.daghub.database.domain.Tag;
import nl.wur.daghub.database.domain.Technology;
import nl.wur.dataentry.dto.DtoOrganisation;
import nl.wur.dataentry.dto.DtoResponse;
import nl.wur.dataentry.dto.DtoSolution;
import nl.wur.dataentry.service.DataEntryService;

@Slf4j
@CrossOrigin(origins = { "${dataentry.cors.url}" })
@RestController
@RequestMapping("/api")
public class DataEntryRestController {

    private DataEntryService service;

    public DataEntryRestController(DataEntryService service) {
        this.service = service;
    }

    @Operation(summary = "Get businessFundingStages", tags = "4-others")
    @GetMapping("/businessFundingStages")
    public Iterable<BusinessFundingStage> getBusinessFundingStages() {
        return service.getBusinessFundingStages();
    }

    @Operation(summary = "Get businessGrowthStages", tags = "4-others")
    @GetMapping("/businessGrowthStages")
    public Iterable<BusinessGrowthStage> getBusinessGrowthStages() {
        return service.getBusinessGrowthStages();
    }

    @Operation(summary = "Get businessModels", tags = "4-others")
    @GetMapping("/businessModels")
    public Iterable<BusinessModel> getBusinessModels() {
        return service.getBusinessModels();
    }

    @Operation(summary = "Get channels", tags = "4-others")
    @GetMapping("/channels")
    public Iterable<Channel> getChannels() {
        return service.getChannels();
    }

    @Operation(summary = "Get countries", tags = "4-others")
    @GetMapping("/countries")
    public Iterable<Map<String, Object>> getCountries() {
        return service.getCountries();
    }

    @Operation(summary = "Get country", tags = "4-others")
    @GetMapping("/countries/{id}")
    public Map<String, Object> getCountries(@PathVariable String id) {
        return service.getCountries(id);
    }

    @Operation(summary = "Get languages", tags = "4-others")
    @GetMapping("/languages")
    public Iterable<Language> getLanguages() {
        return service.getLanguages();
    }

    @Operation(summary = "Get organisation", tags = "2-organisation")
    @GetMapping("/organisations/{id}")
    public Map<String, Object> getOrganisations(@PathVariable int id) {
        return service.getOrganisations(id);
    }

    @Operation(summary = "Get organisationTypes", tags = "4-others")
    @GetMapping("/organisationTypes")
    public Iterable<OrganisationType> getOrganisationTypes() {
        return service.getOrganisationTypes();
    }

    @Operation(summary = "Get regions", tags = "4-others")
    @GetMapping("/regions")
    public Iterable<Region> getRegions() {
        return service.getRegions();
    }

    @Operation(summary = "Get sectors", tags = "4-others")
    @GetMapping("/sectors")
    public Iterable<Sector> getSectors() {
        return service.getSectors();
    }

    @Operation(summary = "Get solution", tags = "3-solution")
    @GetMapping("/solutions/{id}")
    public Map<String, Object> getSolution(@PathVariable int id) {
        return service.getSolutions(id);
    }

    @Operation(summary = "Get subUseCases", tags = "4-others")
    @GetMapping("/subUseCases")
    public Iterable<SubUseCase> getSubUseCases() {
        return service.getSubUseCases();
    }

    @Operation(summary = "Get tags", tags = "4-others")
    @GetMapping("/tags")
    public Iterable<Tag> getTags() {
        return service.getTags();
    }

    @Operation(summary = "Get technologies", tags = "4-others")
    @GetMapping("/technologies")
    public Iterable<Technology> getTechnologies() {
        return service.getTechnologies();
    }

    @Operation(summary = "Get useCases", tags = "4-others")
    @GetMapping("/useCases")
    public Iterable<Map<String, Object>> getUseCases() {
        return service.getUseCases();
    }

    @Operation(summary = "Get useCase", tags = "4-others")
    @GetMapping("/useCases/{id}")
    public Map<String, Object> getUseCases(@PathVariable Integer id) {
        return service.getUseCases(id);
    }

    @Operation(summary = "Insert a new organisation", tags = "2-organisation")
    @PostMapping(path = "/organisations")
    public ResponseEntity<DtoResponse> postOrganisation(@RequestBody @Valid DtoOrganisation organisation) {
        return service.postOrganisation(organisation);
    }

    @Operation(summary = "Insert a new solution", tags = "3-solution")
    @PostMapping(path = "/solutions")
    public ResponseEntity<DtoResponse> postSolution(@RequestBody @Valid DtoSolution solution) {
        return service.postSolution(solution);
    }

    @Operation(summary = "Update organisation", tags = "2-organisation")
    @PutMapping(path = "/organisations/{id}")
    public ResponseEntity<DtoResponse> putOrganisation(@PathVariable int id,
            @RequestBody @Valid DtoOrganisation organisation) {
        return service.putOrganisation(id, organisation);
    }

    @Operation(summary = "Update solution", tags = "3-solution")
    @PutMapping(path = "/solutions/{id}")
    public ResponseEntity<DtoResponse> putSolution(@PathVariable int id, @RequestBody @Valid DtoSolution solution) {
        return service.putSolution(id, solution);
    }

    @Operation(summary = "Delete organisation", tags = "2-organisation")
    @DeleteMapping(path = "/organisations/{id}")
    public ResponseEntity<?> deleteOrganisation(@PathVariable int id) {
        return service.deleteOrganisation(id);
    }

    @Operation(summary = "Delete solution", tags = "3-solution")
    @DeleteMapping(path = "/solutions/{id}")
    public ResponseEntity<?> deleteSolution(@PathVariable int id) {
        return service.deleteSolution(id);
    }

    @Operation(summary = "Insert or update a list of organisations", description = "Updating in case of existing ids. OWNER can only update their organisations, while ADMIN can update all organisations.", tags = "5-json")
    @PostMapping(value = "/json/organisations", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Object postFileOrganisations(@Parameter(description = "The template of the list of organisations:\n"
            + "```\n"
            + "[\n"
            + "  {\n"
            + "    \"id\": 0,\n"
            + "    \"name\": \"string\",\n"
            + "    \"description\": \"string\",\n"
            + "    \"url\": \"string\",\n"
            + "    \"founded\": 0,\n"
            + "    \"organisationtype\": 0,\n"
            + "    \"hqcountry\": \"string\",\n"
            + "    \"hqregion\": 0,\n"
            + "    \"businessFundingStage\": 0,\n"
            + "    \"businessGrowthStage\": 0,\n"
            + "    \"translations\": [\n"
            + "      {\n"
            + "        \"language\": 0,\n"
            + "        \"translation\": \"string\"\n"
            + "      }\n"
            + "    ]\n"
            + "  },\n"
            + "  ...\n"
            + "]\n"
            + "```") @RequestParam(name = "file") MultipartFile file)
            throws StreamReadException, DatabindException, IOException {
        return service.postFileOrganisations(file);
    }

    @Operation(summary = "Insert or update a list of solutions", description = "Updating in case of existing ids. OWNER can only update their solutions, while ADMIN can update all solutions.", tags = "5-json")
    @PostMapping(value = "/json/solutions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Object postFileSolutions(@Parameter(description = "The template of the list of solutions:\n"
            + "```\n"
            + "[\n"
            + "  {\n"
            + "    \"id\": 0,\n"
            + "    \"name\": \"string\",\n"
            + "    \"description\": \"string\",\n"
            + "    \"url\": \"string\",\n"
            + "    \"organisation\": 0,\n"
            + "    \"launch\": 0,\n"
            + "    \"platform\": 0,\n"
            + "    \"bundling\": 0,\n"
            + "    \"sector\": 0,\n"
            + "    \"primarysubusecase\": 0,\n"
            + "    \"registeredusers\": 0,\n"
            + "    \"activeusers\": 0,\n"
            + "    \"shfusers\": 0,\n"
            + "    \"womenusers\": 0,\n"
            + "    \"youthusers\": 0,\n"
            + "    \"revenue\": 0,\n"
            + "    \"yieldlowerbound\": 0,\n"
            + "    \"yieldupperbound\": 0,\n"
            + "    \"incomelowerbound\": 0,\n"
            + "    \"incomeupperbound\": 0,\n"
            + "    \"businessModels\": [ 0 ],\n"
            + "    \"channels\": [ 0 ],\n"
            + "    \"countries\": [ \"string\" ],\n"
            + "    \"languages\": [ 0 ],\n"
            + "    \"regions\": [ 0 ],\n"
            + "    \"subUseCases\": [ 0 ],\n"
            + "    \"tags\": [ 0  ],\n"
            + "    \"technologies\": [ 0 ],\n"
            + "    \"translations\": [\n"
            + "      {\n"
            + "        \"language\": 0,\n"
            + "        \"translation\": \"string\"\n"
            + "      }\n"
            + "    ],\n"
            + "    \"otherLanguages\": [ \"string\" ],\n"
            + "    \"otherRegions\": [\n"
            + "      {\n"
            + "        \"country\": \"string\",\n"
            + "        \"regions\": [ \"string\" ]\n"
            + "      }\n"
            + "    ]\n"
            + "  },\n"
            + "  ...\n"
            + "]\n"
            + "```") @RequestParam(name = "file") MultipartFile file)
            throws StreamReadException, DatabindException, IOException {
        return service.postFileSolutions(file);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(HttpServletRequest httpRequest, Exception e) {
        log.warn("==> " + httpRequest.getRequestURI() + " " + e.getMessage());
        return ResponseEntity.badRequest().body(new DtoResponse(null,
                HttpStatus.BAD_REQUEST.value(), null, e.getMessage()));
    }
}
