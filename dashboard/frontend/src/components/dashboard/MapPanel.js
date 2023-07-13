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

import { DataMap } from '../maps';
  

export default function MapPanel({data, filterData, callbackMapclick}) {
    return (
        <DataMap 
            center={[0, 0]}
            zoom={2}
            data={data} 
            filterData={filterData} 
            callback={callbackMapclick} 
            includeLegend
        />
    );
}


/** MapPanel constructs a DataMap component with a legend and centered at the 'middle of the earth'. 
 *  It forwards the data that should be visualized in the map, the filters that should be applied to the data and function to call when the map is clicked.
*/
MapPanel.propTypes = {
    data: PropTypes.object,
    filterData: PropTypes.array,
    callback: PropTypes.func
};
