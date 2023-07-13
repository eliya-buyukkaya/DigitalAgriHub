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

import { PageNavigation } from '../ui';
import { SolutionCard } from '../solution';
import { getLiferayUrl } from '../../models/data';
import config from '../../config.json';


export default class SolutionsPanel extends Component {
    constructor(props) {
        super(props);
            
        this.state = {
            solutions: [],
            numberOfPages: 0,
            currentPage: 1,
            liferayUrl: ''
        };
        this.searchRef = React.createRef();
    }

    componentDidMount() {
        this.setValues();
    
        getLiferayUrl().then((data) => {
            this.setState({liferayUrl: data + config.liferayPage});
        }).catch(console.error);
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.searchRef.current.value = '';
            this.setValues();
        }
    }

    setValues() {
        let mySolutions = this.props.data;
        let mySearchTerm = this.searchRef.current.value.toLowerCase();
        
        if (mySearchTerm !== '') {
            mySolutions = mySolutions.filter(
                solution => 
                (solution.name.toLowerCase().includes(mySearchTerm)) || 
                (solution.organisationname.toLowerCase().includes(mySearchTerm)) || 
                (solution.description.toLowerCase().includes(mySearchTerm))
            );
        }
    
        this.setState({
            solutions: mySolutions,
            numberOfPages: Math.ceil(mySolutions.length / this.props.numberPerPage)
        });
    }

    render() {
        return (
            <Container fluid className="p-0">
                <Row>
                    <Col>
                        <PageNavigation 
                            currentPage={this.state.currentPage}
                            numberOfPages={this.state.numberOfPages}
                            handleOnSelect={this.handleOnSelectPage}
                        />
                    </Col>
                    <Col>
                        <input
                            className={'search-col'}
                            type="text"
                            placeholder="Search in names and description ..."
                            onKeyPress={event => {if (event.key === 'Enter') {this.setValues();}}}
                            ref={this.searchRef}
                        />
                    </Col>
                </Row>
                <Row>
                    {
                        this.state.solutions.length === 0 ?
                        <Col className="m-2"><p><b>No solutions matching your search.</b></p></Col> :
                        this.state.solutions
                            .slice(
                                this.props.numberPerPage * (this.state.currentPage - 1), 
                                this.props.numberPerPage * this.state.currentPage
                            )
                            .map((solution) => (
                                <Col className="mb-3" xs={6} md={3} key={"col" + solution.id}>
                                    <SolutionCard
                                        key={solution.id}
                                        solution={solution}
                                        liferayUrl={this.state.liferayUrl}
                                    />
                                </Col>
                            ))
                    }
                </Row>
            </Container>
        );
    }

    handleOnSelectPage = (currentPage) => () => {
        this.setState((prevState) => {
            return {
                ...prevState.currentPage,
                currentPage
            };
        });
    };
}

/** SolutionsPanel holds the list of filtered solutions. It applies pagination to show a number of solutions at the time.
 *  It receives the information for the solutions in data and you can configure the number of solutions that should be shown on one page.
*/
SolutionsPanel.propTypes = {
    data: PropTypes.array,
    numberPerPage: PropTypes.number
};
