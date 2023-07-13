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
import FieldSet from "../../../Input/FieldSet";
import NumberField, { numberFormats } from "../../../Input/NumberField";
import RangeSlider from "../../../Input/RangeSlider";
import Modal from "../../../Dialog/Modal";
import HelperText from "../../../HelperText";
import helperTextObjects from "./helperText";

const MainContainer = styled.div``;

const IntegerField = styled(NumberField).attrs({
  numberFormat: numberFormats.positiveInteger,
})`
  flex-shrink: 0;
  width: 300px;

  /* & .MuiInputBase-formControl {
    width: 200px;
  } */
`;

const FieldRow = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const SolutionFormOther = ({ formState, setValue, fieldErrors }) => {
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

  const onChangeRegisteredUsers = (ev) => {
    const val = ev.target.value;
    setValue("registeredusers", val);
  };

  const getOnChangeValue = (key) => (ev) => {
    const val = ev.target.value;
    setValue(key, val);
  };

  const handleChange = (key) => (ev) => {
    const val = ev.target.value;

    setValue(key + "lowerbound", val[0].toString());
    setValue(key + "upperbound", val[1].toString());
  };

  return (
    <>
      <MainContainer>
        <FieldGroup>
          <FieldSet label="Users">
            <IntegerField
              label="Registered users"
              name="registeredusers"
              value={formState.registeredusers}
              onChange={onChangeRegisteredUsers}
              error={!!fieldErrors.registeredusers}
              helperText={
                fieldErrors.registeredusers || getHelperText("registeredusers")
              }
            />
            <FieldRow>
              <IntegerField
                label="Active users"
                name="activeusers"
                value={formState.activeusers}
                onChange={getOnChangeValue("activeusers")}
                // max={formState.registeredusers.value}
                error={!!fieldErrors.activeusers}
                helperText={
                  fieldErrors.activeusers || getHelperText("activeusers")
                }
              />

              <IntegerField
                label="Smallholder farmer users"
                name="shfusers"
                value={formState.shfusers}
                onChange={getOnChangeValue("shfusers")}
                error={!!fieldErrors.shfusers}
                helperText={fieldErrors.shfusers || getHelperText("shfusers")}
              />
            </FieldRow>
            <FieldRow>
              <IntegerField
                label="Female users"
                name="womenusers"
                value={formState.womenusers}
                onChange={getOnChangeValue("womenusers")}
                error={!!fieldErrors.womenusers}
                helperText={
                  fieldErrors.womenusers || getHelperText("womenusers")
                }
              />
              <IntegerField
                label="Youth users"
                name="youthusers"
                value={formState.youthusers}
                onChange={getOnChangeValue("youthusers")}
                error={!!fieldErrors.youthusers}
                helperText={
                  fieldErrors.youthusers || getHelperText("youthusers")
                }
              />
            </FieldRow>
          </FieldSet>
          <FieldSet label="Financial">
            <IntegerField
              label="Revenue"
              name="revenue"
              value={formState.revenue}
              onChange={getOnChangeValue("revenue")}
              prefix="$"
              error={!!fieldErrors.revenue}
              helperText={fieldErrors.revenue || getHelperText("revenue")}
            />
          </FieldSet>
          <FieldSet label="Impact">
            <RangeSlider
              label={"Change in yield"}
              lowerbound={formState.yieldlowerbound}
              upperbound={formState.yieldupperbound}
              onChange={handleChange("yield")}
              min={0}
              max={100}
              valueLabelDisplay="on"
              helperText={fieldErrors.yield || getHelperText("yield")}
            />
            <RangeSlider
              label={"Change in income"}
              lowerbound={formState.incomelowerbound}
              upperbound={formState.incomeupperbound}
              onChange={handleChange("income")}
              min={0}
              max={100}
              valueLabelDisplay="on"
              helperText={fieldErrors.income || getHelperText("income")}
            />
          </FieldSet>
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

export default SolutionFormOther;
