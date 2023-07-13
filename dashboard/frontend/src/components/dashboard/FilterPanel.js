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
import Button from 'react-bootstrap/Button';
import Multiselect from 'multiselect-react-dropdown';

import { InfoTooltip } from '../ui';
import { getPossibleValues } from '../../models/data';
  

export default class FilterPanel extends Component {
    constructor(props) {
        super(props);
            
        this.state = { 
            technologies: { query: 'technology', label: 'technologies', options: [], selectedValues: [] }, 
            channels: { query: 'channel', label: 'channels', options: [], selectedValues: [] }, 
            useCases: { query: 'useCase', label: 'use cases', options: [], selectedValues: [] }, 
            organisationTypes: { query: 'organisationType', label: 'organisation types', options: [], selectedValues: [] }, 
            stages: { query: 'stage', label: 'stages', options: [], selectedValues: [] },
            tags: { query: 'tag', label: 'tags', options: [], selectedValues: [] },
            countryRegions: { query: 'countryRegion', label: 'regions', options: [], selectedValues: [] },
            countries: { query: 'country', label: 'LMICs', options: [], selectedValues: [] }
        };
        
        this.multiselectRefs = {
            technologies: React.createRef(), 
            channels: React.createRef(), 
            useCases: React.createRef(), 
            organisationTypes: React.createRef(), 
            stages: React.createRef(),
            tags: React.createRef(),
            countryRegions: React.createRef(),
            countries: React.createRef()
        }
    }
    
    componentDidMount() {
        for (const [key, value] of Object.entries(this.state)) {
            getPossibleValues(value.query)
                .then((items) => {
                    let options = items.map(function(item) {
                        if (((typeof item.key === 'number') && (item.key >= 0)) || (item.key))  {
                            return {id: item.key, name: item.value};
                        } else {
                            return {id: item.id, name: item.label, optionInfo: item.countries};
                        }
                    });
                    
                    this.setState((prevState) => ({
                        ...prevState,
                        [key]: {
                            ...prevState[key],
                            options: options.sort((a, b) => {
                                if (a.id === 0) return 1;
                                if (b.id === 0) return -1;
                                return a.name.toLowerCase() > b.name.toLowerCase();
                            })
                        }
                    }));
                })
                .catch(console.error);
        }
    }
    
    translateSelectedValues(filterKey) {
        if (this.state[filterKey].options) {
            let selected = this.props.data[filterKey];
            let selectedOptions = this.state[filterKey].options.filter(item => selected.includes(item.id));

            if ((selectedOptions.length === 0) && (this.multiselectRefs[filterKey].current)) {
                this.multiselectRefs[filterKey].current.resetSelectedValues();
            }

            return selectedOptions;
        } else {
            return [];
        }
    }
    
    handleResetFilters = () => {
        for (const value of Object.values(this.multiselectRefs)) {
            value.current.resetSelectedValues();
        }
        
        this.props.callbackReset();
    }
    
    render() {
        return (
            <Container>
                <Row>
                    <Col className="mb-2">
                        <h2>Find digital solutions
                            <InfoTooltip 
                                info="Use the filters below to update the map, charts and solutions overview."
                                placement="bottom"
                            />
                        </h2>
                    </Col>
                </Row>
                <Row>
                    {
                        Object.keys(this.state).map((filterKey) => (
                            <Col key={filterKey + '-select-col'}>
                                <Multiselect
                                    id={filterKey + '-select'}
                                    displayValue="name"
                                    onRemove={this.props.callbackChange(filterKey)}
                                    onSelect={this.props.callbackChange(filterKey)}
                                    options={this.state[filterKey].options}
                                    selectedValues={this.translateSelectedValues(filterKey)}
                                    placeholder={"Select " + this.state[filterKey].label + " ..."}
                                    ref={this.multiselectRefs[filterKey]}
                                />
                            </Col>
                        ))
                    }
                </Row>
                <Row>
                    <Col><div className="country-select">You can also select individual countries by clicking in the map</div></Col>
                </Row>
                <Row>
                    <Col>
                        <Button className="filter-button" variant="secondary" onClick={this.handleResetFilters}>
                            Clear filters
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

/** FilterPanel creates a dropdown list for each key that is in the state dictionary. It gets the elements for the lists through the data prop. 
 *  The FilterPanel controls the selections and redirects the actions as a consequence of a selection to the callback functions.
 *  The panel also holds a button to reset all filters.
*/
FilterPanel.propTypes = {
    data: PropTypes.object,
    callbackChange: PropTypes.func,
    callbackResetFilter: PropTypes.func
};
