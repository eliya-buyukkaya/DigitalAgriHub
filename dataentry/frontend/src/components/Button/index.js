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
* @author Marlies de Keizer (marlies.dekeizer@wur.nl)
* @author Eliya Buyukkaya (eliya.buyukkaya@wur.nl)
*/

import styled, { css } from "styled-components";
import MuiButton from "@mui/material/Button";
import { dahubDarkGreen, dahubDarkBlue } from "../../theme/colors";
const lightGrey = "#999";
const mediumGrey = "#666";

const containedStyle = css`
  color: #fff;
  border: 3px solid transparent;
  background-color: ${dahubDarkGreen};

  &:hover {
    background-color: ${dahubDarkGreen};
    border-color: ${dahubDarkBlue};
  }
`;

const outlinedStyle = css`
  color: ${dahubDarkGreen};
  border: 2px solid ${dahubDarkGreen};

  &:hover {
    border-color: ${dahubDarkBlue};
    border-width: 2px;
    color: ${dahubDarkBlue};
  }
`;

const outlinedStyleSecondary = css`
  color: ${lightGrey};
  border: 2px solid ${lightGrey};

  &:hover {
    border-color: ${mediumGrey};
    border-width: 2px;
    color: ${mediumGrey};
  }
`;

const outlinedStyleCancel = css`
  ${outlinedStyleSecondary}

  &:hover {
    border-color: red;
    color: red;
  }
`;

const Button = styled(MuiButton).attrs((props) => ({
  variant: props.variant || "contained",
  secondary: undefined,
  $secondary: props.secondary,
  cancel: undefined,
  $cancel: props.cancel,
}))`
  border-radius: 0.25rem;

  ${(props) => props.variant === "contained" && containedStyle}

  ${(props) =>
    props.variant === "outlined" && props.$secondary && outlinedStyleSecondary}
  
  ${(props) =>
    props.variant === "outlined" && props.$cancel && outlinedStyleCancel}
  
  ${(props) =>
    props.variant === "outlined" && !props.$secondary && outlinedStyle}
`;

export default Button;
