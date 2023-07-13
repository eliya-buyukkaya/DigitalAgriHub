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
import Choropleth from 'react-leaflet-choropleth';

import countries from '../../models/json/countries';
import { getPossibleValues } from '../../models/data';


export default class CountryLayer extends Component {
    state = {
        geodata: [],
        limits: [10000000000, 0],
        colorscale: ['#46B980', '#2D2E83'],
        steps: 50
    };

    style(feature) {
        if (!feature.properties.value) {
            return {
                weight: 1,
                opacity: 0.1,
                color: 'white',
                dashArray: '1',
                fillOpacity: 0.5,
                fillColor: '#CCCCCC'
            };
        } else {            
            return {
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '1',
                fillOpacity: 1
            };
        }
    }
    
    componentDidMount() {
        this.setValues();
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setValues();
        }
    }
    
    setValues() {
        getPossibleValues('country').then(data => {
            let lmicCountries;
            let featureLimits = [10000000000, 0];
    
            let countryKeys = data.map(item => item.key);
            lmicCountries = countries.features.filter((feature) => countryKeys.includes(feature.properties.ISO_A3));

            for (const feature of lmicCountries) {
                let item = this.props.data.filter((data) => feature.properties.ISO_A3 === data.key);

                if (item.length > 0) {
                    feature.properties.value = item[0].value;
                
                    if (item[0].value < featureLimits[0]) {
                        featureLimits[0] = item[0].value;
                    }
                    if (item[0].value > featureLimits[1]) {
                        featureLimits[1] = item[0].value;
                    }
                } else {
                    feature.properties.value = null;
                }
            }

            this.setState({geodata: lmicCountries, limits: featureLimits});
            this.props.onLayerAdded({
                label: '# digital solutions in a country',
                type: 'gradientbar',
                params: {
                    colors: this.state.colorscale, 
                    limits: featureLimits
                }
            });        
        });
    }
    
    getIdentity(feature) {
        let featureIndicator = feature.properties.ADMIN + feature.properties.value;
        let hash = 0;
        
        if (featureIndicator.length === 0) {
            return hash;
        }
        
        for (let i = 0; i < featureIndicator.length; i++) {
            let char = featureIndicator.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash;
        }
        
        return hash;
    }
    
    render() {
        return (
            <Choropleth
                name="countries"
                identity={(feature) => this.getIdentity(feature)}
                data={this.state.geodata}
                visible={(feature) => feature.properties.value}
                valueProperty={(feature) => feature.properties.value}
                scale={this.state.colorscale}
                steps={this.state.steps}
                mode='e'
                onEachFeature={
                    (feature, layer) => {
                        let tooltip = "<b>" + feature.properties.Name + "</b>" + (feature.properties.value ? "<br/>" + feature.properties.value + " digital solutions" : "");
                        
                        layer.bindTooltip(tooltip, {sticky: true});                            
                        
                        if (this.props.filterCallback) {
                            layer.on({
                                click: () => {this.props.filterCallback(feature.properties.ISO_A3)}
                            });                            
                        }
                    }
                }
                style={this.style.bind(this)}
            />
        );
    }
}

/** CountryLayer creates a Leaflet Chloropeth component.
 *  It shows the countries with colors based on a frequency for that country that is in the data. Highlighting of countries is based on filterData.
 *  When the map is clicked a callback is triggered to filter on the clicked country. When the values are set a callback is triggered to indicate that
 *  the country layer is added.
 */
CountryLayer.propTypes = {
    data: PropTypes.array,
    filterCallback: PropTypes.func,
    onLayerAdded: PropTypes.func
};
