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
import styled from "styled-components";
import FieldGroup from "../../../Input/FieldGroup";
import MultiSelectFieldSet from "../../../Input/Select/MultiSelectFieldSet";
import Modal from "../../../Dialog/Modal";
import HelperText from "../../../HelperText";
import helperTextObjects from "./helperText";

const MainContainer = styled.div``;

const SolutionFormChannelsTechnologies = ({
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

  const handleChangeChannels = (newValueFunc) => {
    setValue("channels", newValueFunc);
  };

  const handleChangeTechnologies = (newValueFunc) => {
    setValue("technologies", newValueFunc);
  };

  return (
    <>
      <MainContainer>
        <FieldGroup>
          <MultiSelectFieldSet
            label="Channels"
            inputLabel="Add channel"
            options={options.channels}
            values={formState.channels}
            required
            onChange={handleChangeChannels}
            maxSelections={3}
            error={!!fieldErrors.channels}
            helperText={fieldErrors.channels || getHelperText("channels")}
            allowCustom={false}
          />

          <MultiSelectFieldSet
            label="Technologies"
            inputLabel="Add technology"
            options={options.technologies}
            values={formState.technologies}
            required
            onChange={handleChangeTechnologies}
            maxSelections={5}
            error={!!fieldErrors.technologies}
            helperText={
              fieldErrors.technologies || getHelperText("technologies")
            }
            allowCustom={false}
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

export default SolutionFormChannelsTechnologies;
