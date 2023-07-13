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
import FormHelperText from "@mui/material/FormHelperText";
import { errorRed } from "./style";

const StyledFieldSet = styled.fieldset`
  border: 1px solid #333;

  ${(props) => props.error && `border-color: ${errorRed};`}
`;
const StyledLegend = styled.legend`
  ${(props) => props.error && `color: ${errorRed};`}
`;

const FieldSet = ({
  label,
  children,
  error,
  helperText,
  helperTextPosition = "bottom",
  ...props
}) => {
  return (
    <StyledFieldSet error={error} {...props}>
      {label && <StyledLegend error={error}>{label}</StyledLegend>}
      {helperText && helperTextPosition === "top" && (
        <FormHelperText error={error} style={{ marginBottom: 16 }}>
          {helperText}
        </FormHelperText>
      )}
      {children}
      {helperText && helperTextPosition === "bottom" && (
        <FormHelperText error={error} style={{ marginBottom: 16 }}>
          {helperText}
        </FormHelperText>
      )}
    </StyledFieldSet>
  );
};
export default FieldSet;
