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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FieldSet from "../../Input/FieldSet";
import Autocomplete from "./Autocomplete";

const FieldItemContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldItem = ({
  mainItem,
  subItems,
  mainOptions,
  subOptions,
  onChangeMainItem,
  onChangeSubItems,
  deleteField,
  required = false,
  mainItemLabel,
  subItemLabel,
  primaryHelperText,
  secondaryHelperText,
  // maxSubSelections,
}) => {
  const handleChangeMain = (value) => {
    onChangeMainItem(value);
  };

  return (
    <FieldItemContainer>
      <Autocomplete
        required={required}
        label={mainItemLabel}
        helperText={primaryHelperText}
        value={mainItem || null}
        onChange={handleChangeMain}
        options={mainOptions}
        sx={{ width: 200 }}
        //   isOptionEqualToValue={(option, value) => {
        //   return option?.value === value?.value;
        // }}
      />

      {mainItem && (
        <Autocomplete
          multiple
          freeSolo
          freeSoloAddOption
          // required={required}
          label={subItemLabel}
          helperText={secondaryHelperText}
          // inputLabel={`Add ${subItemLabel}`} // @todo
          options={subOptions || []}
          onChange={(val) => {
            onChangeSubItems(val);
          }}
          // maxSelections={maxSubSelections}
          style={{ flex: "1" }}
          disabled={!mainItem}
          value={subItems || []}
          //filterSelectedOptions
        />
      )}

      {/*
      freeSolo
          freeSoloAddOption
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
       */}

      <div>
        <IconButton
          onClick={deleteField}
          color="error"
          aria-label="delete"
          sx={{ mt: 1, visibility: deleteField ? "visible" : "hidden" }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </FieldItemContainer>
  );
};

const emptyValue = (subItemsKey) => ({
  id: null,
  value: null,
  label: "",
  [subItemsKey]: [],
});

const MultiSelectWithSubOptions = ({
  required = false,
  values, // [{id: string, value: any, label: string, [subItemsKey]: array}]
  subItemsKey = "subItems",
  onChange, //({index: number, type: "mainItem" | "subItem", value: array | object}) => {}
  onDelete, //(index) => {}
  mainOptions = [],
  subOptions,
  error,
  helperText,
  primaryHelperText,
  secondaryHelperText,
  label,
  mainItemLabel,
  subItemLabel,
  // maxSubSelections,
}) => {
  const getHandleChange = (idx, key) => (val) => {
    onChange({ index: idx, type: key, value: val });
  };

  const getHandleDeleteUseCase = (idx) => () => {
    onDelete(idx);
  };

  return (
    <FieldSet
      label={label}
      error={error}
      helperText={helperText}
      helperTextPosition="top"
    >
      {[...values, emptyValue(subItemsKey)].map((value, i) => {
        return (
          <FieldItem
            required={required}
            key={value.id}
            mainItem={value.id ? value : null}
            subItems={value[subItemsKey] || []}
            mainOptions={mainOptions?.filter(
              (option) =>
                !values
                  .filter((selectedValue) => selectedValue.id !== value.id)
                  .some((selectedValue) => option.id === selectedValue.id)
            )}
            subOptions={value.id ? subOptions[value.id] : []}
            onChangeMainItem={getHandleChange(i, "mainItem")}
            onChangeSubItems={getHandleChange(i, "subItem")}
            deleteField={value.id === null ? null : getHandleDeleteUseCase(i)}
            mainItemLabel={mainItemLabel}
            subItemLabel={subItemLabel}
            primaryHelperText={i === values.length ? primaryHelperText : null}
            secondaryHelperText={
              i === values.length - 1 ? secondaryHelperText : null
            }
            // maxSubSelections={maxSubSelections}
          />
        );
      })}
    </FieldSet>
  );
};

export default MultiSelectWithSubOptions;
