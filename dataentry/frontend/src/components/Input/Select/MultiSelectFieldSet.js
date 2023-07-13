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

import styled from "styled-components";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import FieldSet from "../FieldSet";
import Autocomplete from "./Autocomplete";

const ChipContainer = styled(Stack).attrs({
  direction: "row",
  spacing: 0,
  sx: { flexWrap: "wrap" },
})`
  margin-bottom: 16px;
  gap: 8px;
`;

const MultiSelectFieldSet = ({
  required = false,
  allowCustom = true,
  label,
  inputLabel = "Add",
  options = [],
  values = [],
  onChange,
  maxSelections,
  error,
  helperText,
  ...props
}) => {
  const handleSelect = (newVal) => {
    if (newVal) {
      if (typeof newVal.value === "undefined" || newVal.custom) {
        // custom user input
        if (!allowCustom) {
          return;
        }
        // check if none of the existing options has the same label (case ignored):
        if (
          options.some(
            (option) =>
              option.label.toLowerCase() === newVal.label.toLowerCase()
          )
        ) {
          // an option with this label already exists!
          console.log("Label exists!");
          return;
        }
      }
      onChange((prev) => {
        if (prev?.some((option) => option.label === newVal.label)) {
          // an option with the custom label is already selected!
          // do nothing
          return prev;
        }
        return [...prev, newVal];
      });
    }
  };

  const getDeleteHandler = (val) => () => {
    onChange((prev) => prev.filter((selection) => selection !== val));
  };

  const showInput = !maxSelections || values.length < maxSelections;

  return (
    <FieldSet label={label} error={error} helperText={helperText} {...props}>
      <ChipContainer>
        {values.map((val) => {
          return (
            <Chip
              key={val.value || val.label}
              label={val.label}
              onDelete={getDeleteHandler(val)}
            />
          );
        })}
      </ChipContainer>
      {showInput && (
        <Autocomplete
          required={required} 
          freeSolo
          freeSoloAddOption={allowCustom}
          options={options.filter(
            (option) => !values.some((val) => val.value === option.value)
          )}
          getOptionDisabled={(option) =>
            option.inputValue &&
            values.some(
              (val) =>
                val.label.toLowerCase() === option.inputValue.toLowerCase()
            )
          }
          value={null}
          onChange={handleSelect}
          fullWidth
          label={inputLabel}
        />
      )}
    </FieldSet>
  );
};

export default MultiSelectFieldSet;
