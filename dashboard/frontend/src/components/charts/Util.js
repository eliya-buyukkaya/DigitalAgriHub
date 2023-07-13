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

export const colors = {
    gradients: {
        greenToBlue: [[70, 185, 128], [45, 46, 131]],
        lightToDarkBlue: [[14, 171, 193], [45, 46, 131]],
        lightToDarkGrey: [[203, 203, 203], [103, 103, 103]],
        lightToDarkGreen: [[140, 199, 64], [70, 185, 128]]
    },
    hover: [153, 153, 153]
};

export function getLinearGradient(context, chartArea, colors, orientation) {
    let gradient;

    if (orientation === 'x') {
        gradient = context.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    } else {
        gradient = context.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    }

    gradient.addColorStop(0, 'rgba(' + colors[0].join() + ',1)');
    gradient.addColorStop(1, 'rgba(' + colors[1].join() + ',1)');
    
    return gradient;
}

export function getLevelColor(colors, value, maximum) {
    let diffRed = colors[1][0] - colors[0][0];
    let diffGreen = colors[1][1] - colors[0][1];
    let diffBlue = colors[1][2] - colors[0][2];
    let fade = value / maximum;

    let color = [
        parseInt(Math.floor(colors[0][0] + (diffRed * fade)), 10),
        parseInt(Math.floor(colors[0][1] + (diffGreen * fade)), 10),
        parseInt(Math.floor(colors[0][2] + (diffBlue * fade)), 10)
    ];

    return 'rgba(' + color.join() + ',1)';
}
