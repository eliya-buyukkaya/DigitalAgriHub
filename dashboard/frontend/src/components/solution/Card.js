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
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


export default class SolutionCard extends Component {
    render() {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>{this.props.solution.name}</Card.Title>
                    <Card.Text>
                        {(this.props.solution.organisationname && (this.props.solution.organisationname !== this.props.solution.name)) ? (
                            <>
                                <b>{this.props.solution.organisationname}</b>
                                <br />
                            </>
                        ) : null}
                    </Card.Text>
                    <Card.Text>
                        <div style={{height: "100%", overflow: "hidden"}} dangerouslySetInnerHTML={{__html: this.props.solution.description}}></div>
                    </Card.Text>
                    <Card.Text>
                        <Button variant="primary" size="sm" href={this.props.liferayUrl + '?solutionid=' + this.props.solution.id} target="_blank">
                            Read more
                        </Button>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

/** SolutionCard creates a stylized bootstrap Card which shows a summary of a solution. */
SolutionCard.propTypes = {
    solution: PropTypes.object
};
