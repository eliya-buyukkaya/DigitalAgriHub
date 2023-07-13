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

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.transaction.annotation.Transactional;

import nl.wur.daghub.database.domain.User;

@RepositoryRestResource(exported = false)
public interface RepositoryUser extends Repository<User, Integer> {
    Optional<User> findById(Integer id);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Modifying
    @Query("UPDATE User SET"
            + " name=:name,company=:company,email=:email,password=:password,token=:token"
            + " WHERE id=:id")
    void update(int id, String name, String company, String email, String password, String token);
    
    <S extends User> S save(S entity);
   
    @PreAuthorize("#user.email == authentication.name or hasRole('ADMIN')")
    void delete(@Param("user") User user);

    @Query("select u.token from User u where u.email = :email")
    String findTokenByEmail(@Param(value = "email") String email);
        
    // @Modifying(flushAutomatically = true)
    // @Transactional
    // @Query("update User u set u.token = :token where u.email = :email")
    // void updateToken(@Param(value = "email") String email, @Param(value = "token") String token);
}
