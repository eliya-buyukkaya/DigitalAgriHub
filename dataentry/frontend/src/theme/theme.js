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

import { createGlobalStyle } from "styled-components";
import { createTheme } from "@mui/material/styles";
import { dahubDarkBlue, dahubDarkGreen, dahubGrey } from "./colors";

export const GlobalStyle = createGlobalStyle`
  body {
    color: var(--dahub-grey, ${dahubGrey});
    font-family: "Roboto", "Helvetica Neue", sans-serif;
    margin: 0;
  }
  
  a {
    color: var(--dahub-grey, ${dahubDarkBlue});
  }
`;

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: dahubDarkGreen
    },
    secondary: {
      main: dahubDarkBlue
    },
  },
});
