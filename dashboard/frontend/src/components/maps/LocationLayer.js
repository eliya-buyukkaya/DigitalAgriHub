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
import { Marker } from 'react-leaflet';
import * as L from "leaflet";

import countries from '../../models/json/countries_centroids';
import marker from "./icons/location_green.png";


export default class LocationLayer extends Component {
    constructor(props) {
        super(props);
    
        this.state = {locationdata: [0, 0]};
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
        let feature = countries.features.filter((obj) => obj.properties.ISO_A3 === this.props.data)[0];
        this.setState({locationdata: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]});
    }
    
    render() {
        let myIcon = L.icon({
            iconUrl: marker,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        return (
            <Marker 
                name="location"
                key={this.props.location} 
                position={this.state.locationdata}
                icon={myIcon}
            ></Marker>
        );
    }
}

/** LocationLayer creates a Leaflet Marker component. It uses a png as icon and puts it at the country centroid for the country code that is in the data prop.
 *  The label is given by the location prop.
 */
 LocationLayer.propTypes = {
    data: PropTypes.string,
    location: PropTypes.array
};
