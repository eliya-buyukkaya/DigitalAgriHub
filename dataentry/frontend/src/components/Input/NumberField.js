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

import React from "react";
import PropTypes from "prop-types";
import MuiTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import NumberFormat from "react-number-format";

export const numberFormats = {
  positiveInteger: "positiveInteger",
};

const NumberFormatCustom = React.forwardRef(function _NumberFormatCustom(
  props,
  ref
) {
  const { onChange, numberFormat, min, max, ...other } = props;
  /** NB user experience when min / max (or isAllowed function) is not good */
  let isAllowed;
  if (!(isNaN(min) && isNaN(max))) {
    isAllowed = (values) => {
      /* values: {
        floatValue: number,
        formattedValue: string,
        value: string
      } */
      const { floatValue } = values;
      let allowed = isNaN(min) || floatValue >= min;
      allowed = (allowed && isNaN(max)) || floatValue <= max;
      return allowed;
    };
  }

  let formatProps = { isAllowed };
  if (numberFormat === numberFormats.positiveInteger) {
    formatProps = {
      ...formatProps,
      decimalScale: 0,
      allowNegative: false,
    };
  }

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={"\u2009"}
      isNumericString
      {...formatProps}
      // prefix="$"
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

/**
 *
 * @param {object} props
 * @param {string} props.label
 * @returns
 */
const NumberField = ({
  min,
  max,
  inputProps = {},
  prefix,
  postfix,
  numberFormat,
  name,
  ...props
}) => {
  return (
    <MuiTextField
      variant="filled"
      inputProps={{ numberFormat, min, max }}
      InputProps={{
        startAdornment: prefix && (
          <InputAdornment position="start">{prefix}</InputAdornment>
        ),
        endAdornment: postfix && (
          <InputAdornment position="end">{postfix}</InputAdornment>
        ),
        inputComponent: NumberFormatCustom,
        name,
        ...inputProps,
      }}
      {...props}
    />
  );
};

export default NumberField;
