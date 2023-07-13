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

/** The dashboard directory holds all building blocks (i.e. panels) that the dashboard is constructed from. */

import '../../styles/dashboard.scss';

import MainPanel from './MainPanel';
import FilterPanel from './FilterPanel';
import MapPanel from './MapPanel';
import ChartsPanel from './ChartsPanel';
import KPIsPanel from './KPIsPanel';
import SolutionsPanel from './SolutionsPanel';

export { MainPanel, FilterPanel, MapPanel, ChartsPanel, KPIsPanel, SolutionsPanel }
