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

package nl.wur.daghub.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import nl.wur.daghub.service.ServiceDaghub;

@RestController
@CrossOrigin(origins = { "${daghub.cors.url.local}", "${daghub.cors.url.local2}" })
@RequestMapping("/api")
public class ControllerDaghub {

    private ServiceDaghub serviceDaghub;

    public ControllerDaghub(ServiceDaghub serviceDaghub) {
        this.serviceDaghub = serviceDaghub;
    }

    @GetMapping("/find/{request}")
    public Object find(@PathVariable String request, @RequestParam(required = false) Integer id) {
        return serviceDaghub.find(request, id);
    }

    @GetMapping("/query")
    public Map<String, Object> query(@RequestParam(required = false, defaultValue = "") List<Integer> technologies,
            @RequestParam(required = false, defaultValue = "") List<Integer> channels,
            @RequestParam(required = false, defaultValue = "") List<Integer> useCases,
            @RequestParam(required = false, defaultValue = "") List<Integer> organisationTypes,
            @RequestParam(required = false, defaultValue = "") List<Integer> stages,
            @RequestParam(required = false, defaultValue = "") List<Integer> tags,
            @RequestParam(required = false, defaultValue = "") List<String> countries) {
        return serviceDaghub.query(technologies, channels, useCases, organisationTypes, stages, tags, countries);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}
