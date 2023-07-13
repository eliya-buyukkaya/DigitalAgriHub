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

/** The ChartOptions holds functionality that can be added to all charts in the charts directory. */

/** addDefaultTooltipOption creates a customized element that shows only the value, with an optional unit, on hovering over a chart element. */
export const addDefaultTooltipOption = (options, unit = "", offsetX = 0, offsetY = 0) => {
    options.plugins.tooltip = {
        enabled: false,
        external: function(context) {
            let tooltipElement = document.getElementById('chartjs-tooltip');

            if (!tooltipElement) {
                tooltipElement = document.createElement('div');
                tooltipElement.id = 'chartjs-tooltip';
                document.body.appendChild(tooltipElement);
            }

            let tooltipModel = context.tooltip;
                
            if (tooltipModel.opacity === 0) {
                tooltipElement.style.opacity = 0;
                return;
            }

            if (tooltipModel.dataPoints.length > 0) {
                tooltipElement.innerHTML = tooltipModel.dataPoints[0].formattedValue + unit;
                tooltipElement.style.display = "inline";
            } else {
                tooltipElement.style.display = "none";                
            }

            let position = context.chart.canvas.getBoundingClientRect();
            tooltipElement.style.opacity = 0.9;
            tooltipElement.style.position = 'absolute';
            tooltipElement.style.color = 'rgb(255, 255, 255)';
            tooltipElement.style.backgroundColor = 'rgb(55, 55, 55)';
            tooltipElement.style.borderColor = 'rgb(55, 55, 55)';
            tooltipElement.style.borderStyle = 'solid';
            tooltipElement.style.borderWidth = 1;
            tooltipElement.style.borderRadius = '5px';
            tooltipElement.style.left = position.left + window.pageXOffset + tooltipModel.caretX + offsetX + 'px';
            tooltipElement.style.top = position.top + window.pageYOffset + tooltipModel.caretY + offsetY + 'px';
            tooltipElement.style.padding = '2px 2px';
            tooltipElement.style.pointerEvents = 'none';
        }
    };
        
    return options;
};
