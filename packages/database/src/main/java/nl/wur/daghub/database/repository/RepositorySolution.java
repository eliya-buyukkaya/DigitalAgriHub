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

package nl.wur.daghub.database.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import nl.wur.daghub.database.domain.Solution;
import nl.wur.daghub.database.dto.DtoIdName;
import nl.wur.daghub.database.dto.DtoKeyValue;
import nl.wur.daghub.database.dto.DtoStatistics;
import nl.wur.daghub.database.dto.DtoTable;

public interface RepositorySolution extends PagingAndSortingRepository<Solution, Integer> {
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER')")
    @Query(value = "SELECT DISTINCT(s.id), s.name"
            + " FROM solutions s"
            + " LEFT JOIN users u ON cast(u.id as text) = ANY(s.owners)"
            + " WHERE s.dateremoved IS NULL AND ("
            + "    (?#{hasRole('ADMIN')} AND (?#{authentication.name} not like 'inder.kumar@wur.nl' OR"
            + "                                 (?#{authentication.name} like 'inder.kumar@wur.nl' AND s.visible IS NULL)"
            + "                              )"
            + "    ) OR (?#{hasRole('OWNER')} AND u.email like ?#{authentication.name}))"
            + " ORDER BY s.name", nativeQuery = true)
    Iterable<DtoIdName> findAllByUserRole();

    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER')")
    @Query(value = "SELECT s.id, s.name"
            + " FROM solutions s"
            + " WHERE s.dateremoved IS NULL AND s.organisation_id = :organisationid"
            + " ORDER BY s.name", nativeQuery = true)
    Iterable<DtoIdName> findByOrganisationId(@Param("organisationid") int organisationid);

    // used only in test
    @Query(value = "SELECT *"
            + " FROM solutions s"
            + " LEFT JOIN users u ON cast(u.id as text) = ANY(s.owners)"
            + " WHERE ?#{hasRole('ADMIN')} OR u.email like ?#{authentication.name}", nativeQuery = true)
    Iterable<Solution> findAllForOwner();

    // used only in test
    // @PostAuthorize("returnObject.orElse(null)?.user?.email == authentication?.name")
    @PostAuthorize("hasRole('ADMIN') or returnObject.hasOwner(@repositoryUser.findByEmail(authentication?.name)?.get().getId())")
    @Query("SELECT s FROM Solution s WHERE s.id = :id")
    Solution findByIdForOwner(@Param("id") Integer id);

    @Override
    @PreAuthorize("hasRole('ADMIN') or #solution.hasOwner(@repositoryUser.findByEmail(authentication?.name)?.get().getId())")
    <S extends Solution> S save(@Param("solution") S solution);

    @Override
    @PreAuthorize("hasRole('ADMIN') or @repositorySolution.findById(#id)?.get().hasOwner(@repositoryUser.findByEmail(authentication?.name)?.get().getId())")
    void deleteById(@Param("id") Integer id);

    @Override
    @PreAuthorize("hasRole('ADMIN') or #solution.hasOwner(@repositoryUser.findByEmail(authentication?.name)?.get().getId())")
    void delete(@Param("solution") Solution solution);

    @PreAuthorize("hasRole('ADMIN')")
    @Query(value = "SELECT id, url FROM Solution WHERE dateremoved IS NULL ORDER BY id")
    List<List<Object>> findIdAndUrl();

    @Query(value = "SELECT DISTINCT(s.id) as id, s.name as name, o.name as organisationname"
            + " FROM solutions s"
            + " LEFT JOIN organisations o ON o.id = s.organisation_id"
            + " WHERE s.dateremoved IS NULL AND s.visible = true AND"
            + "    (s.url ILIKE concat('%',:email,'%') OR s.name ILIKE concat('%',:company,'%') OR :company ILIKE concat('%',s.name,'%')"
            + "    OR o.url ILIKE concat('%',:email,'%') OR o.name ILIKE concat('%',:company,'%') OR :company ILIKE concat('%',o.name,'%'))", nativeQuery = true)
    List<Map<String, Object>> findByEmailOrCompany(String email, String company);

    @Query(value = "SELECT cis.country_id AS key, COUNT(cis.solution_id) AS value"
            + " FROM countries_in_solutions cis"
            + " LEFT JOIN countries c ON c.id = cis.country_id"
            + " WHERE c.lmic = true AND (COALESCE(:countries, NULL) IS NULL OR cis.country_id IN :countries) AND cis.solution_id IN :solutions"
            + " GROUP BY cis.country_id"
            + " ORDER BY cis.country_id", nativeQuery = true)
    Iterable<DtoKeyValue<String, Integer>> countSolutionByCountry(@Param("countries") Iterable<String> countries,
            @Param("solutions") Iterable<Integer> solutions);

    @Query(value = "SELECT s.launch AS key, COUNT(s.id) AS value"
            + " FROM solutions s"
            + " WHERE s.dateremoved IS NULL AND s.id IN :solutions"
            + " GROUP BY s.launch"
            + " ORDER BY s.launch", nativeQuery = true)
    Iterable<DtoKeyValue<Integer, Integer>> countSolutionByLaunch(@Param("solutions") Iterable<Integer> solutions);

    @Query(value = "SELECT ot.description AS key, COUNT(s.id) AS value"
            + " FROM solutions s"
            + " LEFT JOIN organisations o       ON o.id = s.organisation_id"
            + " LEFT JOIN organisation_types ot ON ot.id = o.organisationtype_id"
            + " WHERE s.dateremoved IS NULL AND s.id IN :solutions"
            + " GROUP BY ot.description"
            + " ORDER BY ot.description", nativeQuery = true)
    Iterable<DtoKeyValue<String, Integer>> countSolutionByOrganisationType(
            @Param("solutions") Iterable<Integer> solutions);

    @Query(value = "SELECT t.description AS key, COUNT(tis.solution_id) AS value"
            + " FROM technologies_in_solutions tis"
            + " LEFT JOIN technologies t ON t.id = tis.technology_id"
            + " WHERE tis.solution_id IN :solutions"
            + " GROUP BY t.description"
            + " ORDER BY t.description", nativeQuery = true)
    Iterable<DtoKeyValue<String, Integer>> countSolutionByTechnology(
            @Param("solutions") Iterable<Integer> solutions);

    @Query(value = "SELECT uc.description AS key, COUNT(DISTINCT(sucis.solution_id)) AS value"
            + " FROM sub_use_cases_in_solutions sucis"
            + " LEFT JOIN sub_use_cases suc ON suc.id = sucis.subusecase_id"
            + " LEFT JOIN use_cases uc      ON uc.id = suc.usecase_id"
            + " WHERE sucis.solution_id IN :solutions"
            + " GROUP BY uc.description"
            + " ORDER BY uc.description", nativeQuery = true)
    Iterable<DtoKeyValue<String, Integer>> countSolutionByUseCase(@Param("solutions") Iterable<Integer> solutions);

    @Query(value = "SELECT tempTable.usecase_number AS key, COUNT(tempTable.solution) AS value"
            + " FROM (SELECT sucis.solution_id AS solution, COUNT(DISTINCT(suc.usecase_id)) AS usecase_number"
            + "       FROM sub_use_cases_in_solutions sucis"
            + "       LEFT JOIN sub_use_cases suc ON suc.id = sucis.subusecase_id"
            + "       WHERE sucis.solution_id IN :solutions"
            + "       GROUP BY sucis.solution_id) AS tempTable"
            + " GROUP BY tempTable.usecase_number"
            + " ORDER BY tempTable.usecase_number", nativeQuery = true)
    Iterable<DtoKeyValue<Integer, Integer>> countSolutionByUseCaseNumber(
            @Param("solutions") Iterable<Integer> solutions);

    @Query(value = "WITH temp AS (SELECT registeredusers, (CASE WHEN :column = 'women' THEN womenusers WHEN :column = 'youth' THEN youthusers ELSE shfusers END) as users"
            + " FROM solutions WHERE id IN :solutions AND NOT (CASE WHEN :column = 'women' THEN womenusers WHEN :column = 'youth' THEN youthusers ELSE shfusers END) IS NULL)"
            + " (SELECT :column AS label, 'min' AS statistic, registeredusers, users FROM temp ORDER BY users ASC LIMIT 1) UNION"
            + " (SELECT :column AS label, 'max' AS statistic, registeredusers, users FROM temp ORDER BY users DESC LIMIT 1) UNION"
            + " (SELECT :column AS label, 'avg' AS statistic, ROUND(AVG(registeredusers), 3) AS registeredusers, ROUND(AVG(users), 3) AS users FROM temp)", nativeQuery = true)
    List<DtoStatistics> getStatistics(@Param("solutions") Iterable<Integer> solutions,
            @Param("column") String column);

    @Query(value = "SELECT DISTINCT(s.id)"
            + " FROM solutions s"
            + " LEFT JOIN technologies_in_solutions techis ON s.id = techis.solution_id"
            + " LEFT JOIN channels_in_solutions       chis ON s.id = chis.solution_id"
            + " LEFT JOIN sub_use_cases_in_solutions sucis ON s.id = sucis.solution_id"
            + " LEFT JOIN sub_use_cases                suc ON suc.id = sucis.subusecase_id"
            + " LEFT JOIN organisations                  o ON s.organisation_id = o.id"
            + " LEFT JOIN tags_in_solutions          tagis ON s.id = tagis.solution_id"
            + " LEFT JOIN countries_in_solutions       cis ON s.id = cis.solution_id"
            + " LEFT JOIN countries                      c ON c.id = cis.country_id"
            + " WHERE c.lmic = true AND s.dateremoved IS NULL AND s.visible = true"
            + " AND (COALESCE(:technologies, NULL) IS NULL         OR techis.technology_id       IN :technologies)"
            + " AND (COALESCE(:channels, NULL) IS NULL             OR chis.channel_id            IN :channels)"
            + " AND (COALESCE(:useCases, NULL) IS NULL             OR suc.usecase_id             IN :useCases)"
            + " AND (COALESCE(:organisationTypes, NULL) IS NULL    OR o.organisationtype_id      IN :organisationTypes)"
            + " AND (COALESCE(:businessGrowthStages, NULL) IS NULL OR o.business_growth_stage_id IN :businessGrowthStages)"
            + " AND (COALESCE(:tags, NULL) IS NULL                 OR tagis.tag_id               IN :tags)"
            + " AND (COALESCE(:countries, NULL) IS NULL            OR cis.country_id             IN :countries)", nativeQuery = true)
    Iterable<Integer> filterSolutions(@Param("technologies") Iterable<Integer> technologies,
            @Param("channels") Iterable<Integer> channels,
            @Param("useCases") Iterable<Integer> useCases,
            @Param("organisationTypes") Iterable<Integer> organisationTypes,
            @Param("businessGrowthStages") Iterable<Integer> businessGrowthStages,
            @Param("tags") Iterable<Integer> tags,
            @Param("countries") Iterable<String> countries);

    @Query(value = "SELECT DISTINCT(c.id) AS key, c.description AS value"
            + " FROM countries_in_solutions cis"
            + " LEFT JOIN countries c ON cis.country_id = c.id"
            + " WHERE c.lmic = true"
            + " ORDER BY c.id", nativeQuery = true)
    Iterable<DtoKeyValue<String, String>> findCountry();

    @Query(value = "SELECT DISTINCT(ot.id) AS key, ot.description AS value"
            + " FROM solutions s"
            + " LEFT JOIN organisations o       ON o.id = s.organisation_id"
            + " LEFT JOIN organisation_types ot ON ot.id = o.organisationtype_id"
            + " WHERE s.dateremoved IS NULL AND s.visible = true"
            + " ORDER BY ot.description", nativeQuery = true)
    Iterable<DtoKeyValue<Integer, String>> findOrganisationType();

    @Query(value = "SELECT DISTINCT(s.id) AS key, s.description AS value"
            + " FROM sectors_in_solutions sis"
            + " LEFT JOIN sectors s ON s.id = sis.sector_id"
            + " ORDER BY s.description", nativeQuery = true)
    Iterable<DtoKeyValue<Integer, String>> findSector();

    @Query(value = "SELECT DISTINCT(bgs.id) AS key, bgs.description AS value"
            + " FROM solutions s"
            + " LEFT JOIN organisations o             ON o.id = s.organisation_id"
            + " LEFT JOIN business_growth_stages bgs  ON bgs.id = o.business_growth_stage_id"
            + " WHERE s.dateremoved IS NULL AND s.visible = true"
            + " ORDER BY bgs.description", nativeQuery = true)
    Iterable<DtoKeyValue<Integer, String>> findBusinessGrowthStage();

    @Query(value = "SELECT DISTINCT(t.id) AS key, t.description AS value"
            + " FROM tags_in_solutions tis"
            + " LEFT JOIN tags t ON t.id = tis.tag_id"
            + " ORDER BY t.description", nativeQuery = true)
    Iterable<DtoKeyValue<Integer, String>> findTag();

    @Query(value = "SELECT DISTINCT(t.id) AS key, t.description AS value"
            + " FROM technologies_in_solutions tis"
            + " LEFT JOIN technologies t ON t.id = tis.technology_id"
            + " ORDER BY t.description", nativeQuery = true)
    Iterable<DtoKeyValue<Integer, String>> findTechnology();

    @Query(value = "SELECT DISTINCT(c.id) AS key, c.description AS value"
            + " FROM channels_in_solutions cis"
            + " LEFT JOIN channels c ON c.id = cis.channel_id"
            + " ORDER BY c.description", nativeQuery = true)
    Iterable<DtoKeyValue<Integer, String>> findChannel();

    @Query(value = "SELECT DISTINCT(uc.id) AS key, uc.description AS value"
            + " FROM sub_use_cases_in_solutions sucis"
            + " LEFT JOIN sub_use_cases suc ON suc.id = sucis.subusecase_id"
            + " LEFT JOIN use_cases uc      ON uc.id = suc.usecase_id"
            + " ORDER BY uc.description", nativeQuery = true)
    Iterable<DtoKeyValue<Integer, String>> findUseCase();

    @Query(value = "SELECT c.id, c.description"
            + " FROM channels_in_solutions cis"
            + " LEFT JOIN channels c ON c.id = cis.channel_id"
            + " WHERE cis.solution_id = :id"
            + " ORDER BY c.id", nativeQuery = true)
    Iterable<DtoTable<Integer>> findChannelsById(@Param("id") int id);

    @Query(value = "SELECT c.id, c.description"
            + " FROM countries_in_solutions cis"
            + " LEFT JOIN countries c ON c.id = cis.country_id"
            + " WHERE cis.solution_id = :id"
            + " ORDER BY c.id", nativeQuery = true)
    Iterable<DtoTable<String>> findCountriesById(@Param("id") int id);

    @Query(value = "SELECT l.id, l.description"
            + " FROM languages_in_solutions lis"
            + " LEFT JOIN languages l ON l.id = lis.language_id"
            + " WHERE lis.solution_id = :id"
            + " ORDER BY l.id", nativeQuery = true)
    Iterable<DtoTable<Integer>> findLanguagesById(@Param("id") int id);

    @Query(value = "SELECT s.id, s.description"
            + " FROM sectors_in_solutions sis"
            + " LEFT JOIN sectors s ON s.id = sis.sector_id"
            + " WHERE sis.solution_id = :id"
            + " ORDER BY s.id", nativeQuery = true)
    Iterable<DtoTable<Integer>> findSectorsById(@Param("id") int id);

    @Query(value = "SELECT t.id, t.description"
            + " FROM technologies_in_solutions tis"
            + " LEFT JOIN technologies t ON t.id = tis.technology_id"
            + " WHERE tis.solution_id = :id"
            + " ORDER BY t.id", nativeQuery = true)
    Iterable<DtoTable<Integer>> findTechnologiesById(@Param("id") int id);

    @Query(value = "SELECT suc.id, suc.description"
            + " FROM sub_use_cases suc"
            + " WHERE suc.usecase_id = :id"
            + " ORDER BY suc.id", nativeQuery = true)
    Iterable<DtoTable<Integer>> findSubUseCasesByUseCaseId(@Param("id") int id);

    @Query(value = "SELECT r.id, r.description"
            + " FROM regions r"
            + " WHERE r.country_id = :id"
            + " ORDER BY r.id", nativeQuery = true)
    Iterable<DtoTable<Integer>> findRegionsByCountryId(@Param("id") String id);
}
