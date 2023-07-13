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
* @author Marlies de Keizer (marlies.dekeizer@wur.nl)
*/

import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'


/** Create a default styled bootstrap Tooltip */
export function IconTooltip({ icon, info, placement }) {
    return (
        <OverlayTrigger
            delay={{ hide: 150, show: 100 }}
            overlay={(props) => (
                <Tooltip className="info" {...props}>
                    {info}
                </Tooltip>
            )}
            placement={placement}
        >
            { icon }
        </OverlayTrigger>
    );
};

/** Create a default styled bootstrap Tooltip */
export function InfoTooltip({ info, placement }) {
    return (
        <OverlayTrigger
            delay={{ hide: 150, show: 100 }}
            overlay={(props) => (
                <Tooltip className="info" {...props}>
                    {info}
                </Tooltip>
            )}
            placement={placement}
        >
            <i className="fas fa-info-circle" style={{float: "right", lineHeight: "unset", color: "#2D2E83"}}></i>
        </OverlayTrigger>
    );
};

/** Create a default styled bootstrap Tooltip */
export function DisclaimerTooltip({ disclaimer, placement }) {
    return (
        <OverlayTrigger
            delay={{ hide: 150, show: 100 }}
            overlay={(props) => (
                <Tooltip className="disclaimer" {...props}>
                    {disclaimer}
                </Tooltip>
            )}
            placement={placement}
        >
            <i className="fas fa-exclamation-triangle" style={{float: "right", lineHeight: "unset", color: "#0EACC1", marginRight: "1rem", fontSize: "1rem"}}></i>
        </OverlayTrigger>
    );
};
