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
import MultiSelectWithSubOptions from "../../../Input/Select/MultiSelectWithSubOptions";
import Modal from "../../../Dialog/Modal";
import HelperText from "../../../HelperText";
import helperTextObjects from "./helperText";

const MainContainer = styled.div``;

const SolutionFormCountriesRegionsLanguages = ({
  formState,
  setValue,
  options,
  fieldErrors,
}) => {
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

  const handleChangeCountriesRegions = ({ index, type, value }) => {
    if (type === "mainItem") {
      setValue("countries", (prevCountries) => {
        const updatedObject = { ...value, regions: [] };
        return [
          ...prevCountries.slice(0, index),
          updatedObject,
          ...prevCountries.slice(index + 1),
        ];
      });
    } else if (type === "subItem") {
      setValue("countries", (prevCountries) => {
        const prevCountryObject = prevCountries[index];
        const updatedObject = {
          ...prevCountryObject,
          regions:
            typeof value === "function"
              ? value(prevCountryObject.regions)
              : value,
        };
        return [
          ...prevCountries.slice(0, index),
          updatedObject,
          ...prevCountries.slice(index + 1),
        ];
      });
    } else {
      throw new Error("Unknown type");
    }
  };

  const handleDeleteCountriesRegions = (index) => {
    setValue("countries", (prevCountries) => [
      ...prevCountries.slice(0, index),
      ...prevCountries.slice(index + 1),
    ]);
  };

  const handleChangeLanguages = (newValueFunc) => {
    setValue("languages", newValueFunc);
  };

  return (
    <>
      <MainContainer>
        <FieldGroup>
          {options.countries?.length && (
            <MultiSelectWithSubOptions
              label="Countries & regions"
              values={formState.countries}
              required
              subItemsKey="regions"
              onChange={handleChangeCountriesRegions}
              onDelete={handleDeleteCountriesRegions}
              mainOptions={options.countries}
              subOptions={options.regions || {}}
              error={!!(fieldErrors.countries || fieldErrors.regions)}
              helperText={
                fieldErrors.countries ||
                fieldErrors.regions ||
                getHelperText("countriesRegions")
              }
              primaryHelperText={getHelperText("countries")}
              secondaryHelperText={getHelperText("regions")}
              mainItemLabel="Country"
              subItemLabel="Regions"
            />
          )}

          <MultiSelectFieldSet
            label="Languages"
            inputLabel="Add language"
            options={options.languages}
            values={formState.languages}
            required
            onChange={handleChangeLanguages}
            error={!!fieldErrors.languages}
            helperText={fieldErrors.languages || getHelperText("languages")}
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

export default SolutionFormCountriesRegionsLanguages;
