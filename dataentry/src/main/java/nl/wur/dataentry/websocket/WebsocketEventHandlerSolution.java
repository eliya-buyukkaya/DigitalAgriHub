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

import nl.wur.daghub.database.domain.Solution;

@Component
@RepositoryEventHandler(Solution.class)
public class WebsocketEventHandlerSolution {
	private final SimpMessagingTemplate websocket;
	private final EntityLinks entityLinks;

	public WebsocketEventHandlerSolution(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	@HandleAfterCreate
	public void newSolution(Solution solution) {
		this.websocket.convertAndSend("/topic/newSolution", getPath(solution));
	}

	@HandleAfterDelete
	public void deleteSolution(Solution solution) {
		this.websocket.convertAndSend("/topic/deleteSolution", getPath(solution));
	}

	@HandleAfterSave
	public void updateSolution(Solution solution) {
		this.websocket.convertAndSend("/topic/updateSolution", getPath(solution));
	}

	private String getPath(Solution solution) {
		return this.entityLinks.linkForItemResource(solution.getClass(), solution.getId()).toUri().getPath();
	}

}
