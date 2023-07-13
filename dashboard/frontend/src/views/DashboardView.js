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

import { useState } from 'react';
import { useParams } from "react-router-dom";

import { MainPanel } from '../components/dashboard';
import config from '../config.json';


/** DashboardView gets filter values from the url, if available, and passes it to the MainPanel for the dashboard page */
function DashboardView() {
    let { language } = useParams();

    let parametersIndex = window.location.href.indexOf("?");
    let parametersFilter = {...config.filters};
        
    if (parametersIndex >= 0) {
        let parameters = window.location.href.substring(parametersIndex + 1).split("&");

        for (let parameter of parameters) {
            let parameterFilter = parameter.split("=");
            parametersFilter[parameterFilter[0]] = parameterFilter[1].split(",");
        }
    }

    const [filters] = useState(parametersFilter);

    return <MainPanel filters={filters} language={language}/>;
}

export default DashboardView;
