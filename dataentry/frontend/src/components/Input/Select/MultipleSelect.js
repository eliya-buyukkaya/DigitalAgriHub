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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import MuiSelect from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import FieldSet from "../../Input/FieldSet";
import Autocomplete from "./Autocomplete";


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

const FieldItemContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MultipleSelect = ({
    label,
    value,
    options,
    onChange,
    maxSelections,
    required,
    disabled,
    ...props
}) => {
    return (
        <FieldItemContainer>
            <Autocomplete
                multiple
                freeSolo
                freeSoloAddOption
                required={required}
                label={label}
                options={options}
                getOptionDisabled={(option) => {
                    console.log(maxSelections);
                    console.log(option);
                    return (value.includes(option.value) &&
                    ((maxSelections && value.length >= maxSelections) ||
                    option.disabled));
                    }
                }
                onChange={onChange}
                style={{ flex: "1" }}
                disabled={disabled}
                value={value}
            >
            </Autocomplete>
        </FieldItemContainer>
    );
};

const valueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

MultipleSelect.propTypes = {
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

export default MultipleSelect;
