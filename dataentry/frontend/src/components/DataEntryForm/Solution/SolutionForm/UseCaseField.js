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

import PropTypes from "prop-types";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Select from "../../../Input/Select";
import MultipleSelectChip from "../../../Input/Select/MultipleSelectChip";

const UseCaseContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const UseCaseField = ({
  useCase,
  subUseCases,
  useCaseOptions,
  subUseCaseOptions,
  onChangeUseCase,
  onChangeSubUseCases,
  deleteField,
  required = false,
  primary = false,
  helperTextUseCase,
  helperTextSubUseCase,
}) => {
  return (
    <UseCaseContainer>
      <Select
        required={required}
        label="Use case"
        value={useCase || ""}
        onChange={onChangeUseCase}
        options={useCaseOptions}
        sx={{ width: 200 }}
        helperText={helperTextUseCase}
      />

      <MultipleSelectChip
        required={required}
        label={primary ? "Primary sub use case" : "Sub use cases"}
        value={subUseCases || []}
        options={subUseCaseOptions || []}
        onChange={(val) => {
          onChangeSubUseCases(val);
        }}
        maxSelections={primary ? 1 : 2}
        style={{ flex: "1" }}
        disabled={!useCase}
        helperText={helperTextSubUseCase}
      />

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
    </UseCaseContainer>
  );
};

const valueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

const optionType = PropTypes.shape({
  value: valueType.isRequired,
  label: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
});

UseCaseField.propTypes = {
  useCase: valueType,
  subUseCases: PropTypes.arrayOf(valueType),
  useCaseOptions: PropTypes.arrayOf(optionType),
  subUseCaseOptions: PropTypes.arrayOf(optionType),
  onChangeUseCase: PropTypes.func,
  onChangeSubUseCases: PropTypes.func,
  deleteField: PropTypes.func,
  required: PropTypes.bool, // = false
  primary: PropTypes.bool, // = false,
};

export default UseCaseField;
