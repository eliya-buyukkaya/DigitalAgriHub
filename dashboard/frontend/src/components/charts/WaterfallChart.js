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

import PropTypes from 'prop-types';
import BarChart from './BarChart';
import { getLinearGradient, colors, getLevelColor } from './Util';


const dummyLabel = "Dummy";
const totalLabel = "Total";
const stackLabel = "Stack";

export default class WaterfallChart extends BarChart {
    getDatasets(data) {
        if (this.props.data.length === 0) return [];

        if (!this.props.data[0].includes(totalLabel)) {
            this.props.data[0].push(totalLabel);
        }

        let dummydata = new Array(this.props.data[0].length + 1).fill(0);
        let totaldata = new Array(this.props.data[0].length + 1).fill(0);
        let index;
        let cumulative;
        let maximum = 0;
        
        for (let key in data) {
            index = 1;
            cumulative = 0;

            for (let dataPoint of data[key]) {
                cumulative += dataPoint;
                dummydata[index] = cumulative;
                maximum = dataPoint > maximum ? dataPoint : maximum;
                index += 1;
            }
        }
        
        dummydata[index - 1] = 0;
        totaldata[index - 1] = cumulative;

        let orientation = this.props.orientation ? this.props.orientation : 'x';
        let datasets = [];

        for (let key in data) {
            let dataColors = data[key].map((value) => getLevelColor(colors.gradients.lightToDarkGrey, value, maximum));
            datasets.push({
                label: key,
                backgroundColor: dataColors,
                borderRadius: 0,
                hoverBackgroundColor: 'rgba(' + colors.hover.join() + ',0.5)',
                hoverBorderColor: 'rgba(' + colors.hover.join() + ',0)',
                data: data[key]
            });
        }
        
        for (let dataset of datasets) {
            dataset.stack = stackLabel;
        }
        
        datasets.splice(0, 0, {
            label: dummyLabel,
            data: dummydata,
            stack: stackLabel,
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            borderRadius: -10,
            hoverBackgroundColor: 'rgba(0,0,0,0)',
            hoverBorderColor: 'rgba(0,0,0,0)'
        });
        datasets.push({
            label: totalLabel,
            stack: stackLabel,
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
        
                if (!chartArea) {
                    return;
                }

                return getLinearGradient(ctx, chartArea, colors.gradients.greenToBlue, orientation);
            },
            hoverBackgroundColor: 'rgba(45,46,131,0.5)',
            hoverBorderColor: 'rgba(45,46,131,0)',
            data: totaldata
        });
            
        return datasets;
    }
    
    addTooltipOption(options) {
        super.addTooltipOption(options, this.props.unit);
        options.plugins.tooltip.filter =
            function(tooltipItem) {
                return ((tooltipItem.label === totalLabel) && (tooltipItem.dataset.label === totalLabel)) ||
                    ((tooltipItem.dataset.label !== dummyLabel) && (tooltipItem.dataset.label !== totalLabel));
            };
    }
}

/** WaterfallChart is an extension of BarChart. It makes the BarChart stacked and adds a dummy series at the bottom that is transparent and holds cumulative
 * values of the original data. It also adds a total series which shows the total cumulative value as the last bar.
 * In addition to the configuration of BarChart, you can configure what unit label should be added to the tooltip value.
 */
WaterfallChart.propTypes = {
    data: PropTypes.array,
    caption: PropTypes.string,
    nolegend: PropTypes.bool,
    height: PropTypes.number,
    tickLength: PropTypes.number,
    orientation: PropTypes.string,
    unit: PropTypes.string
};
