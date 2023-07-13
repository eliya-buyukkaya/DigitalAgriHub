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

import stepIcon from './icons/step-icon.png';
import businessModelIcon from './icons/business-model.png';
import { fitText } from '../../models/style';
import { UNLanguages } from '../../models/json/UN_languages';
import ReadMoreButton from '../ui/ReadMoreButton';
import { IconTooltip } from '../ui/Tooltip';


export default class SolutionDetails extends Component {
    constructor(props) {
        super(props);
    
        this.state = {organisationElements: [], solutionElements: []};
    }
    
    componentDidMount() {
        this.setElements();
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setElements();
        }
    }
    
    renderElement(key, info, icon, prefix, description, color = "#2D2E83") {
        let tooltipIcon;
        
        if (icon.substring(0, 3) === 'fas') {
            tooltipIcon = fitText(<i id={key} className={icon} style={{color: color, fontSize: "calc(15px + 1vw)"}}></i>, 0.2, {"minFontSize": 15, "maxFontSize": 25});
        } else {
            tooltipIcon = <img src={icon} width="25vw" alt={key}></img>;
        }

        return (
            <Row key={key}>
                <Col>
                    <p style={{textAlign: "center", float: "left", width: "20%"}}>
                        <IconTooltip 
                            info={info} 
                            icon={tooltipIcon}
                        />
                    </p>
                    <p style={{float: "left", width: "75%"}}>
                        {prefix} {description}
                    </p>
                </Col>
            </Row>
        );
    }

    renderOrganisation() {
        let elements = [];
        let organisationElements = [
            ['organisationtype', 'Type of organisation that deploys the solution', 'fas fa-sitemap', ''],
            ['businessGrowthStage', 'Business growth stage the organisation is in', stepIcon, 'At stage '],
            ['businessFundingStage', 'Business funding stage the organisation is at', 'fas fa-dollar-sign', 'At stage '],
            ['hqcountry', 'Country in which the headquarter of the organisation is located', 'fas fa-map-marker-alt', 'Headquartered in ']
        ];

        organisationElements.forEach((organisationElement) => {
            let element = this.props.data.organisation[organisationElement[0]];

            if ((element) && (element.description !== 'No specification')) {
                elements.push(this.renderElement(...organisationElement, element.description));
            }        
        })

        this.setState({organisationElements: elements});
    }

    renderSolution() {
        let elements = [
            this.renderElement(
                'countries', 'Countries in which the solution is deployed', 'fas fa-map', 'Deployed in ', 
                <ReadMoreButton text={this.getCountriesAsString(this.props.data.countries)} length={100}/>,
                '#46b980'
            )
        ];
        let solutionElements = [
            ['launch', 'Year in which the solution is launched', 'fas fa-stopwatch', 'Since '],
            ['businessModels', 'Business models used for the solution', businessModelIcon, ''],
            ['subUseCases', '(Sub) use cases implemented by the solution', 'fas fa-users', ''],
            ['channels', 'Channels through which the solution is provided', 'fas fa-comments', ''],
            ['technologies', 'Technologies used by the solution', 'fas fa-cogs', ''],
            ['languages', 'Languages in which the solution is available', 'fas fa-globe', '']
        ];

        solutionElements.forEach((solutionElement) => {
            let element = this.props.data[solutionElement[0]];
            let description = element;
            
            if (solutionElement[0] === 'subUseCases') {
                description = this.getUseCasesAsString(element, this.props.data.primarysubusecase);
            } else if (Array.isArray(element)) {
                if ((element.length === 0) || ((element.length === 1) && (element[0].description === 'Other'))) {
                    description = null;
                } else {
                    if (solutionElement[0] === 'languages') {
                        description = this.getLanguagesAsString(element);
                    } else { 
                        description = this.getListAsString(element);
                    }
                }
            }            

            if ((element) && (description)) {
                elements.push(this.renderElement(...solutionElement, description));
            }        
        })

        this.setState({solutionElements: elements});
    }

    setElements() {     
        if (this.props.data) {
            this.renderSolution();
            
            if (this.props.data.organisation) {
                this.renderOrganisation();
            }
        }
    }

    render() {
        return this.state.organisationElements.concat(...this.state.solutionElements);
    }
    
    getListAsString(list, focusElement = null, focusLabel = "", elementLabel = "") {
        let elements = list.map(element => {
            let focus = "";

            if (elementLabel) {
                element = element[elementLabel];
                focusElement = focusElement[elementLabel];
            }

            if ((focusElement) && (element.id === focusElement.id)) {
                focus = " (" + focusLabel + ")";
            }

            return element.description + focus;
        })
        
        return (<span style={{verticalAlign: "middle"}}>{elements.sort().join(", ")}</span>);
    }

    getUseCasesAsString(list, primary) {
        let useCases = {};
        let texts = [];

        list.forEach(element => {
            if (!(element.usecase.description in useCases))  useCases[element.usecase.description] = [];
            
            useCases[element.usecase.description].push(element.description + ((element.id === primary.id) ? " (primary)" : ""))
        });

        for (let [key, values] of Object.entries(useCases)) {
            let realValues = values.filter(value => value.indexOf('No specification') < 0);
            let isPrimary = values.filter(value => value.indexOf('primary') >= 0).length > 0;
            let primaryInRealValues = realValues.filter(value => value.indexOf('primary') >= 0).length > 0;

            if (realValues.length === 0) {
                texts.push(key + (isPrimary ? " (primary)" : ""));
            } else {
                texts.push(key + (!primaryInRealValues ? " (primary)" : "") + ": " + realValues.sort().join(", "));
            }
        }

        return (<span style={{verticalAlign: "middle"}}>{texts.join("; ")}</span>);
    }

    getCountriesAsString(list) {
        let countries = [];

        list.forEach((element) => {
            countries.push(element.description);
        });

        return countries.sort().join(", ");
    }

    getLanguagesAsString(list) {
        let focusLanguages = [];
        let otherLanguages = [];

        list.forEach((element) => {
            if (UNLanguages.includes(element.description)) {
                focusLanguages.push(element.description);
            } else {
                otherLanguages.push(element.description);
            }
        });

        let line = focusLanguages.sort().join(", ");
        
        if (otherLanguages.length > 0) {
            line += ((focusLanguages.length > 0) ? ', ' : '') + otherLanguages.sort().join(", ");
        }

        return (<span style={{verticalAlign: "middle"}}>{line}</span>);
    }
}

/** SolutionDetails creates a list of Row elements where each Row summarizes one attribute of a solution.
 *  It checks for each attribute whether it exists and then constructs a column for an icon that mimics the attribute and a column for the value of the attribute.
 *  If the value is a list it is shown as a comma-separated text.
*/
SolutionDetails.propTypes = {
    data: PropTypes.object
};
