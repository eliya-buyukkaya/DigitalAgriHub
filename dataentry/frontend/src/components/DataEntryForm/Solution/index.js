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
import Alert from "@mui/material/Alert";
import SolutionsOverview from "./SolutionsOverview";
import SolutionForm from "./SolutionForm";
import { ButtonContainer, StyledButton } from "../styled";
import { PanelHeader } from "../../Surfaces/Panel";
import { actions, selectors } from "../formState";

const noAlert = {
  message: null,
  severity: "error",
};

const Solutions = ({
  formState,
  dispatch,
  saveSolution,
  deleteSolution,
  reloadData,
  reloadOptions,
  toOrganisations,
}) => {
  // const { getSolution } = useGetData();
  const [busy, setBusy] = useState(false);
  const [alertState, setAlertState] = useState(noAlert);

  const currentOrganisation = selectors.currentOrganisation(formState);

  const editSolution = (solution) => {
    dispatch(actions.setActiveSolution(solution.solutionId));
  };

  const addSolution = () => {
    dispatch(actions.addSolution(currentOrganisation.organisationId));
  };

  const handleDeleteSolution = (solutionData) => {
    if (busy) return;
    setBusy(true);

    const onSuccess = () => {
      dispatch(actions.setActiveSolution(null));
      setAlertState({
        message: "Solution deleted successfully.",
        severity: "success",
      });
      reloadData();
      setBusy(false);
    };

    const onError = (err) => {
      setAlertState({
        message: `Solution not deleted.${
          err?.messsage ? ` [${err.message}]` : ""
        }`,
        severity: "error",
      });
      setBusy(false);
    };

    deleteSolution(solutionData, onSuccess, onError);
  };

  if (
    formState.currentSolutionArrayIndex ||
    formState.currentSolutionArrayIndex === 0
  ) {
    // const currentSolution =
    //   formState.solutions[formState.currentSolutionArrayIndex];

    return (
      <SolutionForm
        formState={formState}
        dispatch={dispatch}
        saveSolution={saveSolution}
        reloadData={reloadData}
        reloadOptions={reloadOptions}
      />
    );
  }

  return (
    <>
      <PanelHeader>Solutions of {currentOrganisation?.name}</PanelHeader>
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
      <SolutionsOverview
        solutions={formState.solutions}
        editSolution={editSolution}
        deleteSolution={handleDeleteSolution}
      />
      <ButtonContainer>
        <StyledButton
          variant="outlined"
          onClick={toOrganisations}
          disabled={busy}
          tabIndex={-1}
        >
          back to organisation
        </StyledButton>
        <StyledButton onClick={addSolution} disabled={busy}>
          add solution
        </StyledButton>
      </ButtonContainer>
    </>
  );
};
export default Solutions;
