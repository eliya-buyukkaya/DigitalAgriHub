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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MuiTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const StyledTextField = styled(MuiTextField)``;
/**
 *
 * @param {object} props
 * @param {string} props.label
 * @returns
 */
const TextField = ({ prefix, postfix, min, max, ...props }) => {
  const inputProps = {
    startAdornment: prefix && (
      <InputAdornment position="start">{prefix}</InputAdornment>
    ),
    endAdornment: postfix && (
      <InputAdornment position="end">{postfix}</InputAdornment>
    ),
    inputProps: { min, max },
  };

  return (
    <ThemeProvider
      theme={(theme) =>
        createTheme({
          ...theme,
          palette: {
            ...theme.palette,
            primary: theme.palette.secondary,
            secondary: theme.palette.primary,
          },
        })
      }
    >
      <StyledTextField
        // variant="outlined"
        variant="filled"
        InputProps={{ ...inputProps }}
        {...props}
        SelectProps={{
            MenuProps: {
                autoFocus: false,
                disableAutoFocusItem: true,
                disableEnforceFocus: true,
                disableAutoFocus: true
            }
        }}
      />
    </ThemeProvider>
  );
};

export default TextField;
