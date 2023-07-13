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
* @author Ronnie van Kempen  (ronnie.vankempen@wur.nl)
*/

import styled from "styled-components";
import Paper from "@mui/material/Paper";
import { dahubDarkBlue } from "../../theme/colors";

const Panel = styled(Paper)`
  max-width: 800px;
  padding: 16px;
  margin: 16px;

  background-color: #eee;
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 hsl(0deg 0% 39% / 20%),
    0 6px 20px 0 hsl(0deg 0% 39% / 19%);
  color: inherit;
`;

export const PanelHeader = styled.h2`
  color: var(--dahub-dark-blue, ${dahubDarkBlue});
  font-family: "Titillium Web", "Roboto", sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: 42px;
  margin-bottom: 10px;
  text-transform: none;
`;

export default Panel;
