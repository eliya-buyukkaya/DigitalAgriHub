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
import { Bar } from 'react-chartjs-2';
import { addDefaultTooltipOption } from './ChartOptions';
import { getLinearGradient, colors } from './Util';


function formatLabel(label, tickLength) {
    if (typeof label === "string") {
        if ((tickLength > 0) && (label.length > tickLength)) {
            return label.substring(0, tickLength) + "..";
        } else {
            return label;
        }
    } else {
        return label;
    }
}

export default class BarChart extends Component {
    getDatasets(data) {
        let datasets = [];
        
        for (let key in data) {
            let orientation = this.props.orientation;
            datasets.push({
                label: key,
                backgroundColor: function(context) {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
            
                    if (!chartArea) {
                        return;
                    }

                    return getLinearGradient(ctx, chartArea, colors.gradients.greenToBlue, orientation);
                },
                borderRadius: orientation === 'y' ? 20 : 0,
                hoverBackgroundColor: 'rgba(' + colors.hover.join() + ',0.5)',
                hoverBorderColor: 'rgba(' + colors.hover.join() + ',0)',
                data: data[key]
            });
        }
        
        return datasets;
    }
    
    getOptions() {
        let tickLength = this.props.tickLength ? this.props.tickLength : 0;
        let orientation = this.props.orientation ? this.props.orientation : 'x';
        let options = {
            indexAxis: orientation,
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: this.props.nolegend ? false : true
                }            
            },
            scales: {
                x: {
                    ticks: {
                        callback: function(value) {
                            return formatLabel(this.getLabelForValue(value), tickLength);
                        }
                    },
                    title: this.getTitle('x', orientation)
                },
                y: {
                    ticks: {
                        callback: function(value) {
                            return formatLabel(this.getLabelForValue(value), tickLength);
                        },
                        min: 0,
                        precision: 0
                    },
                    suggestedMax: 25,
                    title: this.getTitle('y', orientation)
                }
            }
        };
        addDefaultTooltipOption(options);

        return options;
    }
    
    getTitle(axis, orientation) {
        let isCaption = ((axis === 'x' && orientation === 'y') || (axis === 'y' && orientation === 'x'))
        
        return {
            text: isCaption ? this.props.caption : "",
            display: isCaption && this.props.caption
        }
    }

    render() {
        return (
            <div className="chart-container">
                <Bar 
                    data={{labels: this.props.data[0], datasets: this.getDatasets(this.props.data[1])}} 
                    options={this.getOptions()}
                />
            </div>
        );
    }
}

/** BarChart is a stylized ChartJS Bar component. The data is transformed to the required datasets.
 * The orientation is 'x' (horizontal bars) or 'y' (vertical bars).
 * The caption is displayed as title of an axis, i.e. on the y-axis when the orientation is x; on the x-axis when the orientation is y;
 * You can configure whether to display the legend and whether to limit the length of the tick labels
 */
BarChart.propTypes = {
    data: PropTypes.array,
    caption: PropTypes.string,
    nolegend: PropTypes.bool,
    tickLength: PropTypes.number,
    orientation: PropTypes.string
};
