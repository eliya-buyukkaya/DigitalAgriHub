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

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;
import nl.wur.daghub.database.domain.Organisation;
import nl.wur.daghub.database.dto.DtoIdName;

public interface RepositoryOrganisation extends PagingAndSortingRepository<Organisation, Integer> {
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER')")
    @Query(value = "SELECT DISTINCT(o.id), o.name"
            + " FROM organisations o"
            + " LEFT JOIN users u ON cast(u.id as text) = ANY(o.owners)"
            + " WHERE o.dateremoved IS NULL AND ("
            + "    (?#{hasRole('ADMIN')} AND (?#{authentication.name} not like 'inder.kumar@wur.nl' OR"
            + "                                 (?#{authentication.name} like 'inder.kumar@wur.nl' AND ("
            + "                                    o.id IN (SELECT DISTINCT(s.organisation_id) FROM solutions s WHERE s.visible IS NULL)"
            + "                                    OR (SELECT COUNT(s.organisation_id) FROM solutions s WHERE s.organisation_id = o.id) = 0)"
            + "                                 )"
            + "                              )"
            + "    ) OR (?#{hasRole('OWNER')} AND u.email like ?#{authentication.name}))"
            + " ORDER BY o.name", nativeQuery = true)
    Iterable<DtoIdName> findAllByUserRole();

    @Override
    // @PreAuthorize("#organisation?.user?.email == authentication?.name")
    @PreAuthorize("hasRole('ADMIN') or #organisation.hasOwner(@repositoryUser.findByEmail(authentication?.name)?.get().getId())")
    <S extends Organisation> S save(@Param("organisation") S organisation);

    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER')")
    @Query(value = "SELECT DISTINCT(cast(o.owners as text))"
            + " FROM organisations o"
            + " LEFT JOIN users u ON cast(u.id as text) = ANY(o.owners)"
            + " WHERE u.email like ?#{authentication.name}", nativeQuery = true)
    List<String> findOwners();

    @PreAuthorize("hasRole('ADMIN')")
    @Query(value = "SELECT id, url FROM Organisation WHERE dateremoved IS NULL ORDER BY id")
    List<List<Object>> findIdAndUrl();

    @Override
    @PreAuthorize("hasRole('ADMIN') or @repositoryOrganisation.findById(#id)?.get().hasOwner(@repositoryUser.findByEmail(authentication?.name)?.get().getId())")
    void deleteById(@Param("id") Integer id);

    @Override
    @PreAuthorize("hasRole('ADMIN') or #organisation?.hasOwner(@repositoryUser.findByEmail(authentication?.name)?.get().getId())")
    void delete(@Param("organisation") Organisation organisation);
}
