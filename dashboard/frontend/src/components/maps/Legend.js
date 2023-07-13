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
import Control from 'react-leaflet-control';

import { GradientBarLegendItem } from './LegendItems';


export default class Legend extends Component {
    render() {
        return (
            <Control className="legend" position="bottomleft" >
            {
                this.props.items.map((item) => {
                    if (item.type ===  "gradientbar") {
                        return <GradientBarLegendItem 
                            key={item.label} 
                            label={item.label} 
                            {...item.params}
                        />
                    } else {
                        return <div key={item.label}/>;
                    }
                })
            }                    
            </Control>
        );
    }
}

/** Legend creates a Leaflet Control component.
 *  It receives a list of items and for each item it gets the type and adds a legend item for that type.
 */
 Legend.propTypes = {
    items: PropTypes.array
};
