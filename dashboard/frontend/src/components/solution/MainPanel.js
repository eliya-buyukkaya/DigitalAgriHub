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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import DataMap from '../maps/DataMap';
import { SolutionSummary, SolutionDetails } from '.';
import { getSolution, translateDescriptions } from '../../models/data';


export class MainPanel extends Component {
    state = {
        mapData: {countries: {}},
        solutionData: null
    };

    componentDidMount() {
        getSolution(this.props.id).then((data) => {
            if (data.name) {
                let countryCounts = [];

                if (data.countries) {
                    data.countries.forEach((country) => countryCounts.push({key: country.id, value: 1}));
                }

                if (this.props.language) {
                    data = translateDescriptions(data, this.props.language);
                }

                this.setState({
                    mapData: {countries: countryCounts, location: data.organisation.hqcountry.id},
                    solutionData: data
                });
            } else {
                this.setState({solutionData: []});
            }
        });
    }
    
    render() {
        if (this.state.solutionData) {
            if (this.state.solutionData.name) {
                return (     
                    <Container>
                        <Row>
                            <Col sm={8}>
                                <SolutionSummary data={this.state.solutionData}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={8}>
                                <DataMap center={[20, -10]} zoom={2} data={this.state.mapData}  filterData={[]} fitLayers tap={false}/>
                            </Col>
                            <Col sm={4} className="mt-2">
                                <SolutionDetails data={this.state.solutionData}/>
                            </Col>
                        </Row> 
                    </Container>
                );
            } else {
                return (
                    <Container>
                        <Row><Col><h4>No data available for selected solution.</h4></Col></Row>
                    </Container>
                );
            }    
        } else {
            return (     
                <Container>
                    <Row><Col><h4>Loading data...</h4></Col></Row>
                </Container>
            );
        }
    }
}

/** MainPanel sets the overall structure of the solution page. It gets the data based on the ID in the props. */
MainPanel.propTypes = {
    id: PropTypes.string,
    language: PropTypes.string
};
