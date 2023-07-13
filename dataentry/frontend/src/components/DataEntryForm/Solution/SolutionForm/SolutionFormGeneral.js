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

import { useState } from "react";
import styled from "styled-components";
import FieldGroup from "../../../Input/FieldGroup";
import MultiSelectFieldSet from "../../../Input/Select/MultiSelectFieldSet";
import TextField from "../../../Input/TextField";
// import Autocomplete from "../../../Input/Select/Autocomplete";
import HTMLContent from "../../../Input/HTMLContent";
import Checkbox from "../../../Input/Checkbox";
import { boundsLaunch } from "./parseField";
import Modal from "../../../Dialog/Modal";
import HelperText from "../../../HelperText";
import helperTextObjects from "./helperText";

const MainContainer = styled.div``;

const SolutionFormGeneral = ({ formState, setValue, options, fieldErrors }) => {
  // const [sectorInputValue, setSectorInputValue] = useState("");

  const [helpModal, setHelpModal] = useState({ content: null, open: false });
  const openHelp = (helpText) => {
    setHelpModal({ content: helpText, open: true });
  };
  const getHelperText = (identifier) => (
    <HelperText
      identifier={identifier}
      openPopup={openHelp}
      helperTextObjects={helperTextObjects}
    />
  );

  const getChangeEventHandler = (key) => (ev) => {
    const val = ev.target.value;
    setValue(key, val);
  };

  const handleChangeBusinessModels = (newValueFunc) => {
    setValue("businessModels", newValueFunc);
  };

  const handleChangeSectors = (newValueFunc) => {
    setValue("sectors", newValueFunc);
  };

  const onBlurUrl = () => {
    const value = formState.url;
    if (!value) {
      return;
    }
    if (!(value.startsWith("http://") || value.startsWith("https://"))) {
      setValue("url", `http://${value}`);
    }
  };

  const textFieldProps = (identifier) => ({
    value: formState[identifier],
    onChange: getChangeEventHandler(identifier),
    error: !!fieldErrors[identifier],
    helperText: fieldErrors[identifier] || getHelperText(identifier),
    label: identifier[0].toUpperCase() + identifier.slice(1),
  });

  return (
    <>
      <MainContainer>
        <FieldGroup>
          <TextField {...textFieldProps("name")} required autoFocus />
          <TextField
            {...textFieldProps("url")}
            required
            label="URL"
            type="url"
            spellCheck={false}
            onBlur={onBlurUrl}
          />
          <HTMLContent
            {...textFieldProps("description")}
            tabIndex="0"
            required
            onChange={(val) => {
              setValue("description", val);
            }}
            editable={true}
          />
          <TextField
            {...textFieldProps("launch")}
            label="Year of launch"
            type="number"
            required
            min={boundsLaunch.min}
            max={boundsLaunch.max}
          />
          {/* <Autocomplete
            id="sector"
            label="Sector"
            value={formState.sector}
            required
            onChange={(newValue) => {
              setValue("sector", newValue);
            }}
            inputValue={sectorInputValue}
            onInputChange={(event, newInputValue) => {
              setSectorInputValue(newInputValue);
            }}
            options={options.sectors}
            error={!!fieldErrors.sector}
            helperText={fieldErrors.sector || getHelperText("sector")}
          /> */}
          <MultiSelectFieldSet
            label="Sectors"
            inputLabel="Add sectors"
            options={options.sectors}
            values={formState.sectors}
            required
            onChange={handleChangeSectors}
            error={!!fieldErrors.sectors}
            helperText={
              fieldErrors.sectors || getHelperText("sectors")
            }
            allowCustom={false}
          />
          <MultiSelectFieldSet
            label="Business Models"
            inputLabel="Add business models"
            options={options.businessModels}
            values={formState.businessModels}
            required
            onChange={handleChangeBusinessModels}
            error={!!fieldErrors.businessModels}
            helperText={
              fieldErrors.businessModels || getHelperText("businessModels")
            }
            allowCustom={false}
          />
          <Checkbox
            label="Platform"
            value={formState.platform}
            onChange={(val) => setValue("platform", val)}
            helperText={fieldErrors.platform || getHelperText("platform")}
          />
          <Checkbox
            label="Bundling"
            value={formState.bundling}
            onChange={(val) => setValue("bundling", val)}
            helperText={fieldErrors.bundling || getHelperText("bundling")}
          />
        </FieldGroup>
      </MainContainer>
      <Modal
        open={helpModal.open}
        onClose={() => setHelpModal((prev) => ({ ...prev, open: false }))}
      >
        {helpModal.content}
      </Modal>
    </>
  );
};

export default SolutionFormGeneral;
