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

package nl.wur.daghub.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import nl.wur.daghub.database.domain.LogQuery;
import nl.wur.daghub.database.domain.Solution;
import nl.wur.daghub.database.dto.DtoStatistics;
import nl.wur.daghub.database.repository.RepositoryCountryRegion;
import nl.wur.daghub.database.repository.RepositoryLogQuery;
import nl.wur.daghub.database.repository.RepositorySolution;
import nl.wur.daghub.exception.RequestNotFoundException;

@Slf4j
@Service
public class ServiceDaghub {
    private @Value("${daghub.url}") String url;
    private RepositoryLogQuery repoLogQuery;
    private RepositorySolution repoSolution;
    private RepositoryCountryRegion repoCountryRegion;
    private @PersistenceContext EntityManager em;

    public ServiceDaghub(RepositoryLogQuery repoLogQuery, RepositorySolution repoSolution,
            RepositoryCountryRegion repoCountryRegion) {
        this.repoLogQuery = repoLogQuery;
        this.repoSolution = repoSolution;
        this.repoCountryRegion = repoCountryRegion;
    }

    @SuppressWarnings("unchecked")
    public Object find(String request, Integer id) {
        log.info("==> find " + request + " " + id);
        switch (request) {
            case "url":
                return ResponseEntity.status(HttpStatus.OK).body(url);
            case "solution":
                if (id == null)
                    throw new RequestNotFoundException("Solution id should be provided");
                if (repoSolution.findById(id).isPresent()) {
                    Solution solution = repoSolution.findById(id).get();
                    Map<String, Object> result = new ObjectMapper().convertValue(solution, Map.class);
                    result.put("channels", repoSolution.findChannelsById(id));
                    result.put("countries", repoSolution.findCountriesById(id));
                    result.put("languages", repoSolution.findLanguagesById(id));
                    result.put("sectors", repoSolution.findSectorsById(id));
                    result.put("technologies", repoSolution.findTechnologiesById(id));
                    return result;
                } else
                    throw new RequestNotFoundException("Solution " + id + " does not exist");
            case "country":
                return repoSolution.findCountry();
            case "countryRegion":
                return repoCountryRegion.findAll();
            case "organisationType":
                return repoSolution.findOrganisationType();
            case "sector":
                return repoSolution.findSector();
            case "stage":
                return repoSolution.findBusinessGrowthStage();
            case "tag":
                return repoSolution.findTag();
            case "technology":
                return repoSolution.findTechnology();
            case "channel":
                return repoSolution.findChannel();
            case "useCase":
                return repoSolution.findUseCase();
            default:
                throw new RequestNotFoundException("Request Not Found");
        }
    }

    public Map<String, Object> query(List<Integer> idTech, List<Integer> idChannel, List<Integer> idUseCase,
            List<Integer> idOrgType, List<Integer> idStage, List<Integer> idTag, List<String> idCountry) {
        LogQuery logQuery = new LogQuery(idTech, idChannel, idUseCase, idOrgType, idStage, idTag, idCountry);
        repoLogQuery.save(logQuery);
        log.info("==> query " + logQuery.toString().replaceFirst("LogQuery", ""));
        Map<String, Object> result;
        Iterable<Integer> solutions = repoSolution.filterSolutions(idTech, idChannel, idUseCase, idOrgType, idStage,
                idTag, idCountry);
        log.info("==> filter " + solutions);
        if (!solutions.iterator().hasNext()) {
            result = new TreeMap<>();
            result.put("countSolutionByCountry", null);
            result.put("countSolutionByLaunch", null);
            result.put("countSolutionByOrganisationType", null);
            result.put("countSolutionByTechnology", null);
            result.put("countSolutionByUseCase", null);
            result.put("countSolutionByUseCaseNumber", null);
            result.put("statistics", null);
            result.put("solutions", null);
        } else
            result = getQueryReply(idCountry, solutions);
        return result;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getQueryReply(Iterable<String> idsCountry, Iterable<Integer> idsSolution) {
        Map<String, Object> result = new TreeMap<>();
        result.put("countSolutionByCountry", repoSolution.countSolutionByCountry(idsCountry, idsSolution));
        result.put("countSolutionByLaunch", repoSolution.countSolutionByLaunch(idsSolution));
        result.put("countSolutionByOrganisationType", repoSolution.countSolutionByOrganisationType(idsSolution));
        result.put("countSolutionByTechnology", repoSolution.countSolutionByTechnology(idsSolution));
        result.put("countSolutionByUseCase", repoSolution.countSolutionByUseCase(idsSolution));
        result.put("countSolutionByUseCaseNumber", repoSolution.countSolutionByUseCaseNumber(idsSolution));

        List<DtoStatistics> statistics = repoSolution.getStatistics(idsSolution, "women");
        statistics.addAll(repoSolution.getStatistics(idsSolution, "youth"));
        statistics.addAll(repoSolution.getStatistics(idsSolution, "shf"));
        result.put("statistics", statistics);

        Map<Integer, Map<String, Object>> mapSolutions = new TreeMap<>();

        List<Object[]> solutions = em.createNativeQuery("SELECT s.id, s.name, s.description, s.url, o.name AS orgname"
                + " FROM solutions s"
                + " LEFT JOIN organisations o ON o.id = s.organisation_id"
                + " WHERE s.dateremoved IS NULL AND s.id IN :solutions ORDER BY s.id")
                .setParameter("solutions", idsSolution).getResultList();
        for (Object[] solution : solutions) {
            Map<String, Object> mapSolution = new TreeMap<>();
            mapSolution.put("id", solution[0]);
            mapSolution.put("name", solution[1]);
            mapSolution.put("description", solution[2]);
            mapSolution.put("url", solution[3]);
            mapSolution.put("organisationname", solution[4]);
            mapSolution.put("translations", null);
            mapSolutions.put((Integer) solution[0], mapSolution);
        }

        List<Object[]> translations = em.createNativeQuery("SELECT t.solution_id, l.description, t.translation"
                + " FROM solution_translations t"
                + " LEFT JOIN languages l ON l.id = t.language_id"
                + " WHERE  t.solution_id IN :solutions"
                + " ORDER BY t.solution_id")
                .setParameter("solutions", idsSolution).getResultList();
        for (Object[] translation : translations) {
            int id = (int) translation[0];
            mapSolutions.get(id).putIfAbsent("translations", new ArrayList<Map<String, Object>>());
            Map<String, Object> mapTranslation = new TreeMap<>();
            mapTranslation.put("language", translation[1]);
            mapTranslation.put("translation", translation[2]);
            ((ArrayList<Map<String, Object>>) mapSolutions.get(id).get("translations")).add(mapTranslation);
        }
        result.put("solutions", mapSolutions.values());
        return result;
    }
}
