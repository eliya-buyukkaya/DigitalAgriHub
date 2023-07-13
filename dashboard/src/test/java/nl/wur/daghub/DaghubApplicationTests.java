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

package nl.wur.daghub;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
// import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hamcrest.core.IsNull;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class DaghubApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @PersistenceContext
    private EntityManager entityManager;

    private @Value("${daghub.cors.url.local}") String corsUrl;

    @Test
    public void testCountsAndStatistics() throws Exception {
        mockMvc.perform(get("/api/query?technologies=&useCases=&organisationTypes=&stages=&countries=&tags="))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.countSolutionByCountry", hasSize(233)))
                .andExpect(jsonPath("$.countSolutionByCountry[0].key").value("ABW"))
                .andExpect(jsonPath("$.countSolutionByCountry[0].value").value(3))
                .andExpect(jsonPath("$.countSolutionByLaunch", hasSize(greaterThan(30))))
                .andExpect(jsonPath("$.countSolutionByLaunch[0].key").value("1900"))
                .andExpect(jsonPath("$.countSolutionByLaunch[0].value").value(8))
                .andExpect(jsonPath("$.countSolutionByOrganisationType", hasSize(greaterThan(6))))
                .andExpect(jsonPath("$.countSolutionByOrganisationType[0].key").value("Agribusiness"))
                .andExpect(jsonPath("$.countSolutionByOrganisationType[0].value").value(greaterThan(100)))
                .andExpect(jsonPath("$.countSolutionByTechnology", hasSize(24)))
                .andExpect(jsonPath("$.countSolutionByTechnology[0].key").value("Artificial Intelligence (AI)"))
                .andExpect(jsonPath("$.countSolutionByTechnology[0].value").value(greaterThan(100)))
                .andExpect(jsonPath("$.countSolutionByUseCase", hasSize(greaterThan(5))))
                .andExpect(jsonPath("$.countSolutionByUseCase[0].key").value("Ecosystem support"))
                .andExpect(jsonPath("$.countSolutionByUseCase[0].value").value(greaterThan(90)))
                .andExpect(jsonPath("$.countSolutionByUseCaseNumber", hasSize(5)))
                .andExpect(jsonPath("$.countSolutionByUseCaseNumber[0].key").value(1))
                .andExpect(jsonPath("$.countSolutionByUseCaseNumber[0].value").value(greaterThan(300)))
                .andExpect(jsonPath("$.statistics[2].label").value("women"))
                .andExpect(jsonPath("$.statistics[2].registeredusers").value(1428375.0))
                .andExpect(jsonPath("$.statistics[2].statistic").value("max"))
                .andExpect(jsonPath("$.statistics[2].users").value(571350.0));
    }

    @Test
    public void testEntityManager() throws Exception {
        String sql = "SELECT DISTINCT(s.id)"
                + " FROM solutions s"
                + " LEFT JOIN technologies_in_solutions   ON technologies_in_solutions.solution_id = s.id"
                + " LEFT JOIN sub_use_cases_in_solutions  ON sub_use_cases_in_solutions.solution_id = s.id"
                + " LEFT JOIN sub_use_cases               ON sub_use_cases.id = sub_use_cases_in_solutions.subusecase_id"
                + " LEFT JOIN organisations               ON organisations.id = s.organisation_id"
                + " LEFT JOIN tags_in_solutions           ON tags_in_solutions.solution_id = s.id"
                + " LEFT JOIN countries_in_solutions      ON countries_in_solutions.solution_id = s.id"
                + " WHERE (COALESCE(:technologies, NULL) IS NULL       OR technologies_in_solutions.technology_id IN :technologies)"
                + " AND (COALESCE(:useCases, NULL) IS NULL             OR sub_use_cases.usecase_id IN :useCases)"
                + " AND (COALESCE(:organisationTypes, NULL) IS NULL    OR organisations.organisationtype_id IN :organisationTypes)"
                + " AND (COALESCE(:businessGrowthStages, NULL) IS NULL OR organisations.business_growth_stage_id IN :businessGrowthStages)"
                + " AND (COALESCE(:tags, NULL) IS NULL                 OR tags_in_solutions.tag_id IN :tags)"
                + " AND (COALESCE(:countries, NULL) IS NULL            OR countries_in_solutions.country_id IN :countries)";

        assertTrue(670 < entityManager.createNativeQuery(sql)
                .setParameter("technologies", Arrays.asList())
                .setParameter("useCases", Arrays.asList())
                .setParameter("organisationTypes", Arrays.asList())
                .setParameter("businessGrowthStages", Arrays.asList())
                .setParameter("tags", Arrays.asList())
                .setParameter("countries", Arrays.asList())
                .getResultList().size());

        assertEquals(4, entityManager.createNativeQuery(sql)
                .setParameter("technologies", Arrays.asList())
                .setParameter("useCases", Arrays.asList())
                .setParameter("organisationTypes", Arrays.asList())
                .setParameter("businessGrowthStages", Arrays.asList())
                .setParameter("tags", Arrays.asList())
                .setParameter("countries", Arrays.asList("ABW", "AFG"))
                .getResultList().size());
        entityManager.close();
    }

    @Test
    public void testQuery() throws Exception {
        mockMvc.perform(get("/api/query")).andExpect(status().isOk())
                .andExpect(jsonPath("$.solutions", hasSize(greaterThan(670))));

        mockMvc.perform(get("/api/query?technologies=1")).andExpect(status().isOk())
                .andExpect(jsonPath("$.solutions", hasSize(greaterThan(120))));
        mockMvc.perform(get("/api/query?technologies=3")).andExpect(status().isOk())
                .andExpect(jsonPath("$.solutions", hasSize(greaterThan(70))));
        mockMvc.perform(get("/api/query?technologies=1,3")).andExpect(status().isOk())
                .andExpect(jsonPath("$.solutions", hasSize(greaterThan(140))));
        mockMvc.perform(get("/api/query?technologies=1,3,999")).andExpect(status().isOk())
                .andExpect(jsonPath("$.solutions", hasSize(greaterThan(140))));

        mockMvc.perform(get("/api/query?technologies=1,22&organisationTypes=1,22&useCases=1,22&tags=2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutions").value(IsNull.nullValue()));

        mockMvc.perform(get("/api/query?technologies=1,22&organisationTypes=1,22&useCases=1,22"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutions", hasSize(greaterThan(7))))
                .andExpect(jsonPath("$.solutions[0].id").value(101));
    }

    @Test
    public void testCors() throws Exception {
        mockMvc.perform(get("/api/find/country").header("Origin", corsUrl)).andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", corsUrl))
                .andExpect(jsonPath("$[0].key").value("ABW"));
        mockMvc.perform(get("/api/find/country").header("Origin", "http://localhost:4000"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testTables() throws Exception {
        mockMvc.perform(get("/api/find/organisationType")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThan(6))));
        mockMvc.perform(get("/api/find/stage")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));
        mockMvc.perform(get("/api/find/technology")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(24)));
        mockMvc.perform(get("/api/find/channel")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(19)));
        mockMvc.perform(get("/api/find/useCase")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThan(5))));
    }

    @Test
    public void testException() throws Exception {
        mockMvc.perform(get("/api/find/x"))// .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andExpect(jsonPath("$").value("Request Not Found"));
    }

}
