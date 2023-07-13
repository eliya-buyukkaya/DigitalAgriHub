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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';


export default function KPIsPanel({ data }) {
    const [ state, setState ] = useState({
        solutions: 0,
        useCases: {key: "undetermined", value: 0},
        countries: 0
    });

    useEffect(() => {
        if (!data) return;
        
        setState(data);
    }, [data]);

    return (
        <Table className="kpi-panel">
            <tbody>
                <tr>
                    <td>Digital solutions</td>
                    <th className="kpi">{state.solutions}</th>
                </tr>
                <tr>
                    <td>Number of Low- and Middle-Income Countries in which solutions are deployed</td>
                    <th className="kpi">{state.countries}</th>
                </tr>
                <tr>
                    <td>{"Most frequent use case '" + state.useCases.key + "'"}</td>
                    <th className="kpi">{state.useCases.value}</th>
                </tr>
            </tbody>
        </Table>
    );
}

/** KPIsPanel holds the KPIs that need to stand out. It shows them as styled table.
 *  The values for each KPI comes from the data prop.
*/
KPIsPanel.propTypes = {
    data: PropTypes.object
};
