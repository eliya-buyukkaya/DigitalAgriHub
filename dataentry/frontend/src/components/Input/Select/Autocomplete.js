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

import { useState } from "react";
import PropTypes from "prop-types";
import MuiAutocomplete, {
  createFilterOptions,
} from "@mui/material/Autocomplete";
import TextField from "../TextField";

const filter = createFilterOptions();

const valueEqualsOption = (value, options) => {
  return options.find(
    (option) => value.toLowerCase() === option.label.toLowerCase()
  );
};

const Autocomplete = ({
  label,
  freeSolo,
  freeSoloAddOption = false,
  onChange,
  options,
  value,
  required,
  error,
  helperText,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");

  let filterOptions;
  if (freeSolo && freeSoloAddOption) {
    filterOptions = (opts, params) => {
      const filtered = filter(opts, params);
      const { inputValue } = params;
      // Suggest the creation of a new value
      const isExisting = valueEqualsOption(inputValue, opts);
      if (inputValue !== "" && !isExisting) {
        filtered.push({
          label: `Add "${inputValue}"`,
          inputValue,
        });
      }

      return filtered;
    };
  }

  const handleInputChange = (ev, val, reason) => {
    setInputValue(val);
  };

  /**
   *
   * @param {*} event
   * @param {*} newValue
   * @param {*} reason - reason: One of "createOption", "selectOption", "removeOption", "blur" or "clear".
   */
  const handleChange = (event, newValue, reason) => {
    // console.log("MuiAutocomplete onChange newValue:", newValue);
    // console.log("reason:", reason);

    const newOption = (inputValue) => ({
      label: inputValue,
      value: inputValue,
      id: inputValue,
      custom: true,
    });

    const checkNewValue = (val) => {
      if (typeof val === "string") {
        const existing = valueEqualsOption(val, options);
        if (existing) {
          return existing;
        }
        return newOption(val);
      } else if (val && val.inputValue) {
        // Create a new value from the user input
        return newOption(val.inputValue);
      } else {
        return val;
      }
    };

    if (props.multiple) {
      if (
        reason === "selectOption" ||
        reason === "createOption" ||
        reason === "blur"
      ) {
        const newValuesCopy = [...newValue];
        const selectedValue = newValuesCopy.pop();
        newValuesCopy.push(checkNewValue(selectedValue));
        onChange(newValuesCopy);
      } else {
        onChange(newValue);
      }
    } else {
      onChange(checkNewValue(newValue));
    }

    setInputValue("");
  };

  // if (typeof props.value === "undefined") {
  //   if (props.renderInput) {
  //     return props.renderInput({
  //       value: "",
  //       disabled: true,
  //       // error: true,
  //       // helperText: "Invalid value",
  //     });
  //   }
  //   return props?.label || null;
  // }
  return (
    <MuiAutocomplete
      value={typeof value === "undefined" ? null : value}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
      freeSolo={freeSolo}
      filterOptions={filterOptions}
      onChange={handleChange}
      // onKeyDown={(event) => {
      //   if (event.key === "Enter") {
      //     // Prevent's default 'Enter' behavior.
      //     event.defaultMuiPrevented = true;
      //     // your handler code
      //   }
      // }}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      isOptionEqualToValue={(option, value) => {
        return option?.value === value?.value;
      }}
      // autoSelect
      // autoHighlight
      clearOnBlur
      {...props}
    />
  );
};

const optionPropType = PropTypes.shape({
  label: PropTypes.node,
  value: PropTypes.any,
});

Autocomplete.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(optionPropType),
  value: PropTypes.oneOfType([
    optionPropType,
    PropTypes.arrayOf(optionPropType), // if multiple == true
  ]),
  freeSolo: PropTypes.bool, // default false
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.node,
  onChange: PropTypes.func,
};
export default Autocomplete;
