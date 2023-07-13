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

import React from "react";
import styled from "styled-components";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

const StyledLegend = styled.legend`
  font-size: 0.9em !important;
`;

/**
 *
 * @param {object} props
 * @param {string} props.label
 * @returns
 */
const RangeSlider = ({
  label,
  lowerbound,
  upperbound,
  helperText,
  ...props
}) => {
  return (
    <FormControl fullWidth>
      <Grid
        container
        colspacing={2}
        sx={{ background: "#ddd", px: 2, pt: 3, pb: 2, mt: 2 }}
      >
        <Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
          <StyledLegend>{label}:</StyledLegend>
        </Grid>
        <Grid item xs={8} style={{ display: "flex", alignItems: "center" }}>
          <Slider
            value={[
              !lowerbound ? 0 : parseInt(lowerbound),
              !upperbound ? 0 : parseInt(upperbound),
            ]}
            valueLabelFormat={(value) => value + "%"}
            sx={{ marginTop: 2 }}
            {...props}
          />
        </Grid>
      </Grid>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default RangeSlider;
