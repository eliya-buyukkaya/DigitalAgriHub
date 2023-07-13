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

package nl.wur.dataentry.rest;

import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import nl.wur.daghub.database.domain.Entry;
import nl.wur.daghub.database.repository.RepositoryUser;

@Component
@RepositoryEventHandler
public class EventHandler {

	private final RepositoryUser repositoryUser;

	public EventHandler(RepositoryUser repositoryUser) {
		this.repositoryUser = repositoryUser;
	}

	@HandleBeforeCreate
	public void applyUserBeforeCreate(Entry entry) {
		entry.setOwners(entry.addOwner(repositoryUser.findByEmail(
				SecurityContextHolder.getContext().getAuthentication().getName()).get().getId()));
	}

	@HandleBeforeSave
	public void applyUserBeforeSave(Entry entry) {
		if (entry.getOwners() == null)
			entry.setOwners(entry.addOwner(repositoryUser.findByEmail(
					SecurityContextHolder.getContext().getAuthentication().getName()).get().getId()));
	}
}
