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

package nl.wur.dataentry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import nl.wur.daghub.database.domain.Solution;
import nl.wur.daghub.database.domain.User;
import nl.wur.daghub.database.repository.RepositorySolution;
import nl.wur.daghub.database.repository.RepositoryUser;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
class RepositoryAuthorizationTests {

	private @Autowired RepositoryUser repositoryUser;
	private @Autowired RepositorySolution repositorySolution;

	private User admin, owner, user;
	private Solution solution, solutionOwner;
	private UsernamePasswordAuthenticationToken adminAuth, ownerAuth, userAuth;

	@BeforeEach
	void setup() {
		admin = new User();
		admin.setName("name");
		admin.setCompany("company");
		admin.setEmail("emailadmin");
		admin.setPassword("password");
		admin.setRoles(new String[] { "ROLE_ADMIN" });
		adminAuth = new UsernamePasswordAuthenticationToken(admin.getEmail(), admin.getPassword(),
				AuthorityUtils.createAuthorityList(admin.getRoles()));
		SecurityContextHolder.getContext().setAuthentication(adminAuth);
		admin = repositoryUser.save(admin);
		solution = repositorySolution.findById(0).get();

		owner = new User();
		owner.setName("name");
		owner.setCompany("company");
		owner.setEmail("emailowner");
		owner.setPassword("password");
		owner.setRoles(new String[] { "OWNER" });
		ownerAuth = new UsernamePasswordAuthenticationToken(owner.getEmail(), owner.getPassword(),
				AuthorityUtils.createAuthorityList(owner.getRoles()));
		SecurityContextHolder.getContext().setAuthentication(ownerAuth);
		owner = repositoryUser.save(owner);

		solutionOwner = new Solution();
		solutionOwner.setDescription(solution.getDescription());
		solutionOwner.setName(solution.getName());
		solutionOwner.setOrganisation(solution.getOrganisation());
		solutionOwner.setLaunch(solution.getLaunch());
		solutionOwner.setPrimarysubusecase(solution.getPrimarysubusecase());
		// solutionOwner.setSector(solution.getSector());
		solutionOwner.setUrl("test.solution.org");
		solutionOwner.setOwners(solutionOwner.addOwner(owner.getId()));
		solutionOwner = repositorySolution.save(solutionOwner);

		user = new User();
		user.setName("name");
		user.setCompany("company");
		user.setEmail("emailuser");
		user.setPassword("password");
		user.setRoles(new String[] { "OWNER" });
		userAuth = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword(),
				AuthorityUtils.createAuthorityList(user.getRoles()));
		SecurityContextHolder.getContext().setAuthentication(userAuth);
		user = repositoryUser.save(user);
	}

	@Test
	void findSolutionsForOwner() {
		SecurityContextHolder.getContext().setAuthentication(ownerAuth);
		assertEquals(solutionOwner, repositorySolution.findByIdForOwner(solutionOwner.getId()));
		assertThat(repositorySolution.findAllForOwner()).containsExactly(solutionOwner);
	}

	@Test
	void findSolutionsForAnotherUser() {
		SecurityContextHolder.getContext().setAuthentication(userAuth);
		assertThrows(AccessDeniedException.class, () -> {
			repositorySolution.findByIdForOwner(solutionOwner.getId());
		});
		assertFalse(repositorySolution.findAllForOwner().iterator().hasNext());
	}

	@Test
	void findSolutionsForAdmin() {
		SecurityContextHolder.getContext().setAuthentication(adminAuth);
		assertEquals(solutionOwner, repositorySolution.findByIdForOwner(solutionOwner.getId()));
		assertTrue(repositorySolution.findAllForOwner().iterator().hasNext());
	}

}
