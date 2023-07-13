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

package nl.wur.dataentry.test;

import lombok.Data;
import lombok.NoArgsConstructor;

public @Data @NoArgsConstructor class ResponseRest {
    String description;
    Link _links;
    Integer status;
    String message;
    String error;
    
    public @Data @NoArgsConstructor static class Link {
        LinkEntity self;
        //LinkEntity tag;
        LinkEntity solutions;
    }

    public @Data @NoArgsConstructor static class LinkEntity {
        String href;
    }
}
