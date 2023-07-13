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


export class GradientBarLegendItem extends Component {
    render() {
        return (
            <div>
                <div style={{textAlign: "center", padding: "2px", paddingBottom: "8px"}}>
                    {this.props.label}
                </div>
                <div style={{backgroundColor: "rgb(242,239,233)"}}>
                    <div style={{
                        width: "100%",
                        height: "10px", 
                        opacity: 0.9, 
                        background: "linear-gradient(to right, " + this.props.colors[0] + "," + this.props.colors[1] + ")"
                    }}/>
                </div>
                <div style={{float: "left"}}>{this.props.limits[0]}</div>
                <div style={{float: "right"}}>{this.props.limits[1]}</div>
            </div>
        );
    }
};

/** GradientBarLegendItem creates a div with gradient colored fixed width divs inside. At the beginning and at the end it will add label divs to hold the minimum
 *  and maximum value.
 */
 GradientBarLegendItem.propTypes = {
    label: PropTypes.string,
    colors: PropTypes.array,
    limits: PropTypes.array
};
