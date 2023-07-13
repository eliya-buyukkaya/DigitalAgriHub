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

import java.util.Optional;

import org.springframework.data.repository.Repository;
import org.springframework.security.access.prepost.PreAuthorize;

import nl.wur.daghub.database.domain.Language;

public interface RepositoryLanguage extends Repository<Language, Integer> {
    Iterable<Language> findAll();
    Optional<Language> findById(Integer id);
    Optional<Language> findByDescription(String description);
    boolean existsByDescription(String description);

    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    <T extends Language> T save(T language);
}