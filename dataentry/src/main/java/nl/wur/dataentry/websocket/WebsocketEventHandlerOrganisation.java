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

package nl.wur.dataentry.websocket;

import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import nl.wur.daghub.database.domain.Organisation;

@Component
@RepositoryEventHandler(Organisation.class)
public class WebsocketEventHandlerOrganisation {
	private final SimpMessagingTemplate websocket;
	private final EntityLinks entityLinks;

	public WebsocketEventHandlerOrganisation(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	@HandleAfterCreate
	public void newOrganisation(Organisation organisation) {
		this.websocket.convertAndSend("/topic/newOrganisation", getPath(organisation));
	}

	@HandleAfterDelete
	public void deleteOrganisation(Organisation organisation) {
		this.websocket.convertAndSend("/topic/deleteOrganisation", getPath(organisation));
	}

	@HandleAfterSave
	public void updateOrganisation(Organisation organisation) {
		this.websocket.convertAndSend("/topic/updateOrganisation", getPath(organisation));
	}

	private String getPath(Organisation organisation) {
		return this.entityLinks.linkForItemResource(organisation.getClass(), organisation.getId()).toUri().getPath();
	}

}
