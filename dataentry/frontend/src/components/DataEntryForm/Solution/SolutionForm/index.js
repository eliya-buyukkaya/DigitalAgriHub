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
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import SolutionFormGeneral from "./SolutionFormGeneral";
import SolutionFormUseCases from "./SolutionFormUseCases";
import SolutionFormChannelsTechnologies from "./SolutionFormChannelsTechnologies";
import SolutionFormCountriesRegionsLanguages from "./SolutionFormCountriesRegionsLanguages";
import SolutionFormOther from "./SolutionFormOther";
import { ButtonContainer, StyledButton } from "../../styled";
import { PanelHeader } from "../../../Surfaces/Panel";
import { actions, selectors } from "../../formState";
import parseField from "./parseField";

const steps = {
  general: "general",
  useCases: "useCases",
  channelsTechnologies: "channelsTechnologies",
  countriesRegionsLanguages: "countriesRegionsLanguages",
  other: "other",
};

const noAlert = {
  message: null,
  severity: "error",
};

const emptyFieldErrors = {
  [steps.general]: {},
  [steps.useCases]: {},
  [steps.channelsTechnologies]: {},
  [steps.countriesRegionsLanguages]: {},
  [steps.other]: {},
};

const Superscript = styled.span`
  vertical-align: super;
  font-size: 50%;
  cursor: default;
`;

const SolutionForm = ({
  formState,
  dispatch,
  saveSolution,
  reloadData,
  reloadOptions,
}) => {
  const [currentStep, setCurrentStep] = useState(steps.general);
  const [fieldErrors, setFieldErrors] = useState(emptyFieldErrors);
  const [lastStepValidated, setLastStepValidated] = useState(false);
  const [pristine, setPristine] = useState(true);

  const [busy, setBusy] = useState(false);
  const [alertState, setAlertState] = useState(noAlert);

  const clearAllWarnings = () => {
    setFieldErrors(emptyFieldErrors);
    setAlertState(noAlert);
  };

  const handleCancelEditSolution = () => {
    dispatch(actions.setActiveSolution(null));
    clearAllWarnings();
    reloadData?.();
  };

  const handleChangeValue = (key, value) => {
    const fieldErrorsCurrentStep = fieldErrors[currentStep];
    if (typeof fieldErrorsCurrentStep[key] !== "undefined") {
      delete fieldErrorsCurrentStep[key];
      setFieldErrors((prev) => ({
        ...prev,
        [currentStep]: fieldErrorsCurrentStep,
      }));
    }
    dispatch(actions.setSolutionStateValue(key, value));
    setPristine(false);
  };

  // validate and parse:
  const validate = (step) => {
    const fields = {
      [steps.general]: [
        "solutionId",
        "organisation",
        "name",
        "url",
        "description",
        "launch",
        "sectors",
        "businessModels",
        "platform",
        "bundling",
      ],
      [steps.useCases]: ["primaryUseCase", "otherUseCases"],
      [steps.channelsTechnologies]: ["channels", "technologies"],
      [steps.countriesRegionsLanguages]: ["countries", "languages"],
      [steps.other]: [
        "registeredusers",
        "activeusers",
        "shfusers",
        "womenusers",
        "youthusers",
        "revenue",
        "yieldlowerbound",
        "yieldupperbound",
        "incomelowerbound",
        "incomeupperbound",
      ],
    };
    const parsedFields = fields[step].reduce(
      (prev, fieldName) => {
        const currentSolution =
          formState.solutions[formState.currentSolutionArrayIndex];
        const parsed = parseField(fieldName, currentSolution);
        let newErrors;
        let newParsedValues;
        if (parsed.error) {
          newErrors = { ...prev.errors, [fieldName]: parsed.error };
          if (parsed.errors) {
            newErrors = { ...newErrors, ...parsed.errors };
          }
        } else {
          newErrors = prev.errors;
        }
        if (parsed.spread) {
          newParsedValues = { ...prev.parsedValues, ...parsed.value };
        } else {
          newParsedValues = { ...prev.parsedValues, [fieldName]: parsed.value };
        }
        return { errors: newErrors, parsedValues: newParsedValues };
      },
      { errors: {}, parsedValues: {} }
    );
    setFieldErrors((prev) => ({ ...prev, [step]: parsedFields.errors }));
    return Object.values(parsedFields.errors).length === 0
      ? parsedFields.parsedValues
      : false;
  };

  const handleSaveSolution = () => {
    setAlertState(noAlert);
    const validation = Object.values(steps).reduce((prev, curStep) => {
      if (!prev) return false;
      const stepValidation = validate(curStep);
      if (stepValidation) {
        return { ...prev, ...stepValidation };
      }
      return false;
    }, {});
    if (validation) {
      setBusy(true);
      saveSolution(validation)
        .then(() => {
          setAlertState({
            message: "Solution saved.",
            severity: "success",
          });
          dispatch(actions.setActiveSolution(null));
          if (validation.otherRegions?.length) {
            // force reload of country + region options:
            reloadOptions("countries");
          }
          if (validation.otherLanguages?.length) {
            // force reload of language options:
            reloadOptions("languages");
          }
          setCurrentStep(steps.general);
          //@todo
          reloadData?.();
        })
        .catch((err) => {
          console.error(err);
          setAlertState({
            message: (
              <div>
                <p>Could not save solution.</p>
                <code>{err.message}</code>
              </div>
            ),
            severity: "error",
          });
        })
        .finally(() => {
          setBusy(false);
        });
    }
  };

  const handlePreviousStep = () => {
    const newStep = {
      [steps.general]: null,
      [steps.useCases]: steps.general,
      [steps.channelsTechnologies]: steps.useCases,
      [steps.countriesRegionsLanguages]: steps.channelsTechnologies,
      [steps.other]: steps.countriesRegionsLanguages, // save
    };

    if (currentStep === steps.other) {
      setLastStepValidated(validate(currentStep));
    }
    setCurrentStep(newStep[currentStep]);
  };

  const handleNextStep = () => {
    const nextStep = {
      [steps.general]: steps.useCases,
      [steps.useCases]: steps.channelsTechnologies,
      [steps.channelsTechnologies]: steps.countriesRegionsLanguages,
      [steps.countriesRegionsLanguages]: steps.other,
      [steps.other]: null, // save
    };
    if (validate(currentStep)) {
      setCurrentStep(nextStep[currentStep]);
    }
  };

  const currentSolution =
    formState.solutions[formState.currentSolutionArrayIndex];
  let subformTitle = null;
  let subFormContent = null;

  if (currentStep === steps.general) {
    subformTitle = "General";
    subFormContent = (
      <SolutionFormGeneral
        formState={formState.solutions[formState.currentSolutionArrayIndex]}
        setValue={handleChangeValue}
        options={formState.options}
        // onSave={saveOrganisation}
        onCancel={handleCancelEditSolution}
        fieldErrors={fieldErrors[currentStep]}
      />
    );
  }

  if (currentStep === steps.useCases) {
    subformTitle = "Use cases (fields of application)";
    subFormContent = (
      <SolutionFormUseCases
        formState={formState.solutions[formState.currentSolutionArrayIndex]}
        setValue={handleChangeValue}
        options={formState.options}
        // onSave={saveOrganisation}
        onCancel={handleCancelEditSolution}
        fieldErrors={fieldErrors[currentStep]}
      />
    );
    /* <ButtonContainer>
            <StyledButton
              variant="text"
              onClick={handleCancelEditSolution}
              color="error"
              disabled={busy}
              tabIndex={-1}
            >
              cancel
            </StyledButton>
            <StyledButton
              variant="text"
              onClick={() => setCurrentStep(steps.general)}
              disabled={busy}
              tabIndex={-1}
            >
              back
            </StyledButton>
            <StyledButton onClick={handleNextStep} disabled={busy}>
              next step
            </StyledButton>
          </ButtonContainer> */
  }

  if (currentStep === steps.channelsTechnologies) {
    subformTitle = "Channels & technologies";
    subFormContent = (
      <SolutionFormChannelsTechnologies
        formState={formState.solutions[formState.currentSolutionArrayIndex]}
        setValue={handleChangeValue}
        options={formState.options}
        // onSave={saveOrganisation}
        onCancel={handleCancelEditSolution}
        fieldErrors={fieldErrors[currentStep]}
      />
    );
  }

  if (currentStep === steps.countriesRegionsLanguages) {
    subformTitle = "Countries, regions & languages";
    subFormContent = (
      <SolutionFormCountriesRegionsLanguages
        formState={formState.solutions[formState.currentSolutionArrayIndex]}
        setValue={handleChangeValue}
        options={formState.options}
        // onSave={saveOrganisation}
        onCancel={handleCancelEditSolution}
        fieldErrors={fieldErrors[currentStep]}
      />
    );
  }

  if (currentStep === steps.other) {
    subformTitle = "Reach, finance and impact";
    subFormContent = (
      <SolutionFormOther
        formState={formState.solutions[formState.currentSolutionArrayIndex]}
        setValue={handleChangeValue}
        options={formState.options}
        // onSave={saveOrganisation}
        onCancel={handleCancelEditSolution}
        fieldErrors={fieldErrors[currentStep]}
      />
    );

    // <StyledButton onClick={handleSaveSolution} disabled={busy}>
    //   save solution
    // </StyledButton>
  }

  const editMode = currentSolution?.solutionId !== null;
  const saveEnabled =
    (editMode && !pristine) || currentStep === steps.other || lastStepValidated;
  let saveCancelClose = [];

  const cancelButton = (
    <StyledButton
      key="cancel"
      variant="outlined"
      secondary
      cancel
      color="error"
      onClick={handleCancelEditSolution}
      disabled={busy}
      tabIndex={-1}
    >
      cancel
    </StyledButton>
  );
  const saveNewButton = (
    <StyledButton
      key="saveNew"
      onClick={handleSaveSolution}
      disabled={busy || !saveEnabled}
    >
      Save solution
    </StyledButton>
  );
  const saveChangesButton = (
    <StyledButton
      key="saveChanges"
      onClick={handleSaveSolution}
      disabled={busy || !saveEnabled}
    >
      Save changes
    </StyledButton>
  );

  const closeButton = (
    <StyledButton
      key="close"
      variant="outlined"
      onClick={handleCancelEditSolution}
      disabled={busy}
      tabIndex={-1}
    >
      Close
    </StyledButton>
  );

  if (editMode) {
    if (pristine) {
      saveCancelClose.push(closeButton);
    } else {
      saveCancelClose.push(cancelButton, saveChangesButton);
    }
  } else {
    saveCancelClose.push(cancelButton, saveNewButton);
  }

  const organisation = selectors.currentOrganisation(formState);

  return (
    <>
      <PanelHeader>
        {editMode ? (
          `Edit solution`
        ) : (
          <span>
            Add solution
            <Tooltip
              title=<div>
                <p>
                  A D4Ag solution that is deployed and that users can register
                  for and/or license.
                </p>
                <p>
                  We define a solution as a product or service that utilises
                  digital tools, digital channels, or digitally-enabled data
                  analytics (e.g., machine learning, AI) to deliver information,
                  advice, farming input linkages, market access, logistics
                  support, financial services, and decision-making tools
                  directly to smallholder farmers or other intermediaries of
                  smallholder value chains, including extension agents,
                  agro-dealers, agribusinesses, financial service providers and
                  policymakers. This can be a solution that supports one or more
                  use cases, a platform or a bundle of services.
                </p>
              </div>
            >
              <Superscript>*</Superscript>
            </Tooltip>{" "}
            to {organisation.name}
          </span>
        )}
      </PanelHeader>
      {alertState.message && (
        <Alert
          severity={alertState.severity}
          onClose={() => {
            setAlertState(noAlert);
          }}
          sx={{ mt: 2, mb: 2 }}
        >
          {alertState.message}
        </Alert>
      )}
      <h3>{subformTitle}</h3>
      {subFormContent}
      <ButtonContainer flex>
        <div>
          <StyledButton
            variant="outlined"
            onClick={handlePreviousStep}
            disabled={busy || currentStep === steps.general}
            tabIndex={-1}
          >
            back
          </StyledButton>
          {currentStep !== steps.other && (
            <StyledButton onClick={handleNextStep} disabled={busy}>
              next step
            </StyledButton>
          )}
        </div>
        <div>{saveCancelClose}</div>
      </ButtonContainer>
    </>
  );
};

export default SolutionForm;
