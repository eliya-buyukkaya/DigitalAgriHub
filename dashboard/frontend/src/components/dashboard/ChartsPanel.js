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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BarChart, WaterfallChart, BoxPlot } from '../charts';
import { UpDownPanel, DisclaimerTooltip } from '../ui';
import { transposeData, aggregateFirstHalfOfData } from '../../models/data';


const initialState = {
    years: [],
    users: {avg: [], min: [], max: [], types: []},
    useCases: [],
    numberOfUseCases: [],
    technologies: [],
    organisationTypes: []
}

export default function ChartsPanel({ data }) {
    const [ chartData, setChartData ] = useState(initialState);
    
    function getUsersData(statistics) {
        let usersData = {
            'types': ['Smallholder farmers', 'Women', 'Youth'], 
            'avg': [-1, -1, -1]
        };

        statistics.forEach(element => {
            let index = 0;
            if (element.label === "women") index = 1;
            if (element.label === "youth") index = 2;

            if (element.statistic === "avg") {
                usersData["avg"][index] = Math.round(element.users / element.registeredusers * 1000)/10;
            }
        });
        
        return usersData;
    }

    useEffect(() => { 
        setChartData({
            years: transposeData('Number of solutions', aggregateFirstHalfOfData(data.countSolutionByLaunch, 2009, " < 2010")),
            users: getUsersData(data.statistics),
            useCases: transposeData('Number of solutions', data.countSolutionByUseCase, "value"),
            numberOfUseCases: transposeData('Number of solutions', data.countSolutionByUseCaseNumber, "value", false, ["use case implemented", "use cases implemented"]),
            technologies: transposeData('Number of solutions', data.countSolutionByTechnology, "value", false, "", 10),
            organisationTypes: transposeData('Number of solutions', data.countSolutionByOrganisationType, "value")
        });
    }, [data]);

    return (
        <Container fluid className="p-0">
            <Row>
                <Col sm={12} md={6} className="mt-2 mb-2">
                    <UpDownPanel title="Number of solutions launched over the years">
                        <WaterfallChart data={chartData.years} caption='Number of solutions launched' nolegend/>
                    </UpDownPanel>
                </Col>
                <Col sm={12} md={6} className="mt-2 mb-2">
                    <UpDownPanel title="A categorization of registered users">
                        <BoxPlot data={chartData.users} caption='% of registered users' nolegend unit='%' orientation='y'/>
                        <DisclaimerTooltip
                            disclaimer="The percentages are calculated based on the solutions for which there is data available about the specific user group."
                            placement="left"
                        />
                    </UpDownPanel>
                </Col>
                { [
                    ['useCases', 'The main use cases that solutions implement'], 
                    ['numberOfUseCases', 'Implementation of multiple use cases'], 
                    ['technologies', 'Top 10 technologies used by solutions'], 
                    ['organisationTypes', 'The organisation types of solutions']
                ].map((item) => (
                    <Col sm={12} md={6} className="mt-2 mb-2" key={item[0]}>
                        <UpDownPanel title={item[1]}>
                            <BarChart data={chartData[item[0]]} caption='Number of solutions' nolegend orientation='y'/>
                        </UpDownPanel>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

/** ChartsPanel sets the overall structure of the charts on the dashboard */
ChartsPanel.propTypes = {
    data: PropTypes.object
};
