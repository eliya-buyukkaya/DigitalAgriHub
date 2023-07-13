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
import L from 'leaflet';
import { Map, TileLayer } from 'react-leaflet';

import CountryLayer from './CountryLayer';
import LocationLayer from './LocationLayer';
import Legend from './Legend';


export default class DataMap extends Component {
    constructor(props) {
        super(props);
    
        this.state = {layers: []};
        this.leafletMap = React.createRef();
        this.maxBounds = L.latLngBounds([[-45, -100], [45, 100]]);
    }
    
    componentDidMount() {
        this.resizeToFitLayers();
    }
    
    componentDidUpdate() {
        this.resizeToFitLayers();
    }
    
    resizeToFitLayers() {
        let myBounds;
        
        this.leafletMap.current.leafletElement.eachLayer(function(layer) {
            if (layer.options.name === 'countries') {
                if (layer._bounds && layer.options.data.properties.value) {
                    if (!myBounds) {
                        myBounds = layer.getBounds();
                    } else {
                        myBounds.extend(layer.getBounds());
                    }
                }
            }
            if (layer.options.name === 'location') {
                if (!myBounds) {
                    myBounds = L.latLngBounds([layer.getLatLng()]);
                } else {
                    myBounds.extend(layer.getLatLng());
                }
            }
        });    

        if (myBounds) {
            if ((myBounds._northEast.lat === myBounds._southWest.lat) && (myBounds._northEast.lng === myBounds._southWest.lng)) {
                myBounds._northEast.lat -= 5;
                myBounds._northEast.lng -= 5;
                myBounds._southWest.lat += 5;
                myBounds._southWest.lng += 5;

                this.leafletMap.current.leafletElement.fitBounds(myBounds);
            } else if ((myBounds._northEast.lat !== 0) && (myBounds._northEast.lng !== 0) && (myBounds._southWest.lat !== 0) && (myBounds._southWest.lng !== 0)) {
                if (this.maxBounds.contains(myBounds)) {
                    this.leafletMap.current.leafletElement.fitBounds(myBounds);
                } else {
                    this.leafletMap.current.leafletElement.fitBounds(this.maxBounds);
                }
            } else {
                this.leafletMap.current.leafletElement.fitBounds(this.maxBounds);
            }
        }
    }

    render() {
        return (
            <div id="map">
                <Map ref={this.leafletMap} center={this.props.center} zoom={this.props.zoom} minZoom={1} scrollWheelZoom={false} style={{ height: "450px"}} tap={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <CountryLayer 
                        data={this.props.data.countries} 
                        filterData={this.props.filterData}
                        onLayerAdded={this.handleOnLayerAdded} 
                        filterCallback={this.handleOnLayerSelected}                                
                    />
                    {
                        (this.props.data.location) ? <LocationLayer data={this.props.data.location}/> : <></>
                    }
                    {
                        (this.props.includeLegend) ? <Legend items={this.state.layers}/> : <></>
                    }
                </Map>
            </div>
        );
    }
    
    handleOnLayerAdded = (layer) => {
        let newLayers = this.state.layers;
        let index = newLayers.findIndex(item => item.label === layer.label);
            
        if (index >= 0) {
            newLayers[index] = layer;
        } else {
            newLayers.push(layer);
        }
        
        this.setState({layers: newLayers});
    }
    
    handleOnLayerSelected = (selected) => {
        if ((this.props.filterData.length > 0) && (this.props.filterData[0] === selected)) {
            this.props.callback([]);
        } else {
            this.props.callback([selected]);
        }
    }
}

/** DataMap creates a Leaflet Map component.
 *  It adds a CountryLayer and, depending on whether there is a location in the data, a LocationLayer. Depending on the includeLegend prop a Legend is added.
 *  It keeps a list of its layers to provide to the legend, which is updated when a layer is added.
 *  When a selection is made in the map it checks whether it is a new selection or whether it is actually a deselect, and then triggers the callback.
 *  When the data changes the map also resizes to fit that data.
 */
 DataMap.propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    data: PropTypes.object,
    filterData: PropTypes.array,
    callback: PropTypes.func,
    includeLegend: PropTypes.bool
};
