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

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { ShadowPanel } from '../ui';
import { FilterPanel, MapPanel, ChartsPanel, KPIsPanel, SolutionsPanel } from '.';
import { getSolutions, getMaximum, translateDescriptions, hasTranslation } from '../../models/data';
import config from '../../config.json';


export default function MainPanel(props) {
    const [filters, setFilters] = useState(props.filters);
    const [data, setData] = useState({
        kpis: null,
        map: [], 
        charts: {
            countSolutionByLaunch: [],
            statistics: [],
            countSolutionByUseCase: [],
            countSolutionByUseCaseNumber: [],
            countSolutionByTechnology: [],
            countSolutionByOrganisationType: []
        },
        solutions: []
    });

    const setTranslations = (solutionsData, language) => {
        solutionsData.solutions = solutionsData.solutions.map(solution => translateDescriptions(solution, language));
      
        solutionsData.solutions = solutionsData.solutions.sort(function(a, b) { 
            let aHasTranslation = hasTranslation(a, language);
            let bHasTranslation = hasTranslation(b, language);

            if ((aHasTranslation && bHasTranslation) || (!aHasTranslation && !bHasTranslation)) {
                return solutionsData.solutions.indexOf(a) < solutionsData.solutions.indexOf(b);
            } else {
                if (aHasTranslation) {
                    return -1;
                } else {
                    return 1;
                }
            }
        });
    }

    const getKPIs = (solutionsData) => {
        return {
            solutions: solutionsData.solutions ? solutionsData.solutions.length : 0,
            useCases: solutionsData.countSolutionByUseCase ? getMaximum(solutionsData.countSolutionByUseCase) : {key: "undetermined", value: 0},
            countries: solutionsData.countSolutionByCountry ? solutionsData.countSolutionByCountry.length : 0
        }
    };
     
    const getChartData = (solutionsData) => {
        return {
            countSolutionByLaunch: solutionsData.countSolutionByLaunch ? solutionsData.countSolutionByLaunch : {},
            statistics: solutionsData.statistics ? solutionsData.statistics : [],
            countSolutionByUseCase: solutionsData.countSolutionByUseCase ? solutionsData.countSolutionByUseCase : [],
            countSolutionByUseCaseNumber: solutionsData.countSolutionByUseCaseNumber ? solutionsData.countSolutionByUseCaseNumber : [],
            countSolutionByTechnology: solutionsData.countSolutionByTechnology ? solutionsData.countSolutionByTechnology : [],
            countSolutionByOrganisationType: solutionsData.countSolutionByOrganisationType ? solutionsData.countSolutionByOrganisationType : []
        };
    }

    const query = () => {
        getSolutions(filters).then((solutionsData) => {
            if (solutionsData) {
                if (solutionsData.solutions) {
                    solutionsData.solutions = solutionsData.solutions.sort(() => (Math.random() > .5) ? 1 : -1);
                    
                    if (props.language) setTranslations(solutionsData, props.language);
                }
                
                setData({
                    kpis: getKPIs(solutionsData),
                    map: solutionsData.countSolutionByCountry ? {countries: solutionsData.countSolutionByCountry} : {countries: {}},
                    charts: getChartData(solutionsData),
                    solutions: solutionsData.solutions ? solutionsData.solutions : []
                });
            }
        });
    }

    useEffect(() => {
        query();
    }, [filters]);
    
    const handleOnChangeFilter = (filterKey) => (selected) => {
        let updatedFilters = {
            ...filters,
            [filterKey]: selected.map(function(item) {return item.id;})
        };

        if (filterKey === 'countryRegions') {
            updatedFilters.countries = [];
            selected.forEach(function(item) {
                updatedFilters.countries.push(...item.optionInfo.map(function(option) { return option.id}));
            });
        }

        setFilters(updatedFilters);
    };

    const handleOnChangeCountryFilter = (selected) => {
        setFilters({ 
            ...filters,
            countryRegions: [],
            countries: selected
        });
    };

    const handleOnResetFilter = () => {
        setFilters({...config.filters});
    };

    return (     
        <Container fluid>
            <Row className="mb-4">
                <Col sm={12} md={4}>
                    <Row>
                        <Col>
                            <ShadowPanel>
                                <KPIsPanel data={data.kpis}/>
                            </ShadowPanel>
                        </Col>
                    </Row>
                    <Row className="mt-5 mb-5">
                        <Col>
                            <FilterPanel data={filters} callbackChange={handleOnChangeFilter} callbackReset={handleOnResetFilter}/>                        
                        </Col>
                    </Row>
                </Col>
                {
                    (data.solutions && data.solutions.length > 0) ?
                    <Col sm={12} md={8}>
                        <MapPanel data={data.map} filterData={filters.countries} callbackMapclick={handleOnChangeCountryFilter}/>
                    </Col> :
                    <div/>
                }
            </Row>
            <Row>
                <Col>
                {
                    (data.solutions && data.solutions.length > 0) ?
                    <div>
                        <Row className="mb-5">
                            <Col>
                                <ShadowPanel>
                                    <SolutionsPanel data={data.solutions} numberPerPage={12}/>
                                </ShadowPanel>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ChartsPanel data={data.charts}/>
                            </Col>
                        </Row>
                    </div> :
                    <h4>No data available for selected solutions.</h4>
                }
                </Col>
            </Row>
        </Container>
    );
}

/** MainPanel sets the overall structure of the dashboard */
MainPanel.propTypes = {
    filters: PropTypes.object
};
