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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default class SolutionSummary extends Component {
    render() {
        return (    
            <Row>
                <Col>
                    <h1>{this.props.data.name}</h1>
                    {
                        (this.props.data.organisation && (this.props.data.organisation.name !== this.props.data.name)) ?
                        <h2>{this.props.data.organisation.name}</h2> :
                        ""
                    }
                    <i><a href={this.props.data.url} target='_blank'>{this.props.data.url}</a></i> 
                    <br/><br/>
                    <div dangerouslySetInnerHTML={{__html: this.props.data.description}}></div>
                </Col>
            </Row>
	);
    }
}

/** SolutionSummary creates a Row that holds the main information of a solution. */
SolutionSummary.propTypes = {
    data: PropTypes.object
};
