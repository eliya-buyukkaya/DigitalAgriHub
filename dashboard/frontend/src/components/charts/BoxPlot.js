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
import { colors, getLinearGradient } from './Util';


export default class BoxPlot extends Component {
    getDatasets(data) {
        let datasets = [];

        datasets.push({
            type: 'line',
            label: 'Minimum',
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
        
                if (!chartArea) {
                    return;
                }

                return getLinearGradient(ctx, chartArea, colors.gradients.lightToDarkGreen, 'y');
            },
            borderWidth: 5,
            pointStyle: 'line',
            pointRadius: 10,
            showLine: false,
            data: data.min
        });
        datasets.push({
            type: 'line',
            label: 'Average',
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
        
                if (!chartArea) {
                    return;
                }

                return getLinearGradient(ctx, chartArea, colors.gradients.greenToBlue, 'y');
            },
            pointRadius: data.avg.map(value => value / 5),
            pointHoverRadius: data.avg.map(value => value / 4),
            showLine: false,
            data: data.avg
        });
        datasets.push({
            type: 'line',
            label: 'Maximum',
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
        
                if (!chartArea) {
                    return;
                }

                return getLinearGradient(ctx, chartArea, colors.gradients.lightToDarkBlue, 'y');
            },
            borderWidth: 2,
            pointStyle: 'line',
            pointRadius: 10,
            showLine: false,
            data: data.max
        });
        
        return datasets;
    }

    getScale(unit) {
        return {
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
                callback: function(value) {
                    return value + unit;
                },
                precision: 0
            },
            title: {
                text: this.props.caption,
                display: this.props.caption
            }
        }
    }

    getOptions() {
        let orientation = this.props.orientation ? this.props.orientation : 'x';
        let scale = this.getScale(this.props.unit);
        let grid = { grid: {offset: true} }

        let options = {
            indexAxis: orientation,
            responsive: true,
            maintainAspectRatio: true,
            plugins: {legend: {display: this.props.nolegend ? false : true}},
            scales: {
                x: (orientation === 'y') ? scale : grid,
                y: (orientation === 'x') ? scale : grid
            }
        };
        addDefaultTooltipOption(options, this.props.unit, 10, -20);

        return options;
    }

    render() {
        return (
            <div className="chart-container">
                <Bar 
                    data={{labels: this.props.data.types, datasets: this.getDatasets(this.props.data)}} 
                    options={this.getOptions()}                
                />
            </div>
        );
    }
}

/** Boxplot is a stylized ChartJS Bar component with line datasets. It has a series for the min values, a series for the avg values and a series
 * for the max values that are given for a list of types (i.e. labels of categories) in the data prop. The series are shown as dots.
 * The caption is displayed as title of the y axis. You can configure the whether to display the legend and what unit label should be added the y tick labels.
 */
 BoxPlot.propTypes = {
    data: PropTypes.object,
    caption: PropTypes.string,
    nolegend: PropTypes.bool,
    unit: PropTypes.string
};
