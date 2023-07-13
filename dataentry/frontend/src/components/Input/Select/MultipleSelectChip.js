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
import styled from "styled-components";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import MuiSelect from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const StyledMenuItem = styled(MenuItem)`
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
`;

const MultipleSelectChip = ({
  label,
  value,
  options,
  onChange,
  maxSelections,
  helperText,
  ...props
}) => {
  const [opened, setOpened] = useState(false);

  const handleChange = (event) => {
    const {
      target: { value: inputValue },
    } = event;

    // On autofill we get a stringified value.
    const valueArray =
      typeof inputValue === "string" ? inputValue.split(",") : inputValue;
    if (maxSelections && valueArray.length === maxSelections) {
      setOpened(false);
    }
    if (!maxSelections || valueArray.length <= maxSelections) {
      onChange(valueArray);
    }
  };

  return (
    <FormControl variant="filled" {...props}>
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        multiple
        open={opened}
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        value={value}
        onChange={handleChange}
        renderValue={(selected) => {
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((selectedValue) => {
                const option = options.find(
                  (option) => option.value === selectedValue
                );
                return <Chip key={selectedValue} label={option?.label} />;
              })}
            </Box>
          );
        }}
        MenuProps={MenuProps}
      >
        {options.map((option) => {
          const selected = value.includes(option.value);
          return (
            <StyledMenuItem
              key={option.value}
              value={option.value}
              selected={selected}
              open
              disabled={
                !selected &&
                ((maxSelections && value.length >= maxSelections) ||
                  option.disabled)
              }
            >
              {option.label}
            </StyledMenuItem>
          );
        })}
      </MuiSelect>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

const valueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

MultipleSelectChip.propTypes = {
  label: PropTypes.node,
  value: PropTypes.arrayOf(valueType),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: valueType.isRequired,
      label: PropTypes.node.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  maxSelections: PropTypes.number, // integer
};

export default MultipleSelectChip;
