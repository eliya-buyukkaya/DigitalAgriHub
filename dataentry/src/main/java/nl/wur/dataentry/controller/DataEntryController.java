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

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import nl.wur.dataentry.dto.DtoResponse;

@Slf4j
@CrossOrigin(origins = { "${dataentry.cors.url}" })
@RestController
@RequestMapping("/rest")
public class DataEntryController {

    @DeleteMapping(path = "/organisations/{id}")
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public void restDeleteOrganisation(@PathVariable int id) {
    }

    @DeleteMapping(path = "/solutions/{id}")
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public void restDeleteSolution(@PathVariable int id) {
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(HttpServletRequest httpRequest, Exception e) {
        log.warn("==> " + httpRequest.getRequestURI() + " " + e.getMessage());
        return ResponseEntity.badRequest().body(new DtoResponse(null,
                HttpStatus.BAD_REQUEST.value(), null, e.getMessage()));
    }
}
