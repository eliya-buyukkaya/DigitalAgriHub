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

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Alert from "@mui/material/Alert";
import ItemActionsList from "../../List/ItemActionsList";
import ListIcon from "@mui/icons-material/List";
import { ButtonContainer, StyledButton } from "../styled";
import useGetData from "../../../services/getData";

const MainContainer = styled.div``;
const SpreadContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const noAlert = {
  message: null,
  severity: "error",
};

const OrganisationsOverview = ({
  organisations,
  editOrganisation,
  deleteOrganisation,
  addOrganisation,
  toSolutions,
  busy
}) => {
  const [noSolutionsAlert, setNoSolutionsAlert] = useState(noAlert);

  const { getOrganisation } = useGetData();

  const singleOrganisationId = useMemo(() => {
    if (organisations.length === 1) {
      const [organisation] = organisations;
      return organisation.organisationId;
    }
    return null;
  }, [organisations]);

  useEffect(() => {
    let mounted = true;

    if (singleOrganisationId) {
      getOrganisation(singleOrganisationId).then((organisationData) => {
        if (!mounted) {
          return;
        }
        if (organisationData.solutions?.length === 0) {
          setNoSolutionsAlert({
            message:
              "Your organisation has no solutions yet, please add one or more solutions by pressing the 'add solution' button below.",
            severity: "warning",
          });
        } else {
          setNoSolutionsAlert(noAlert);
        }
      });
    } else {
      setNoSolutionsAlert(noAlert);
    }

    return () => {
      mounted = false;
    };
  }, [singleOrganisationId]);

  const handleDeleteOrganisation = (organisation) => {
    deleteOrganisation(organisation);
  };

  const handleAddSolution = () => {
    const [organisation] = organisations;
    if (!organisation?.organisationId) {
      return;
    }
    toSolutions(organisation.organisationId, true);
  };

  return (
    <MainContainer>
      <ItemActionsList
        items={organisations.map((o) => ({ ...o, key: o.organisationId }))}
        editItem={(organisation) =>
          editOrganisation(organisation.organisationId)
        }
        deleteItem={handleDeleteOrganisation}
        customActions={[
          {
            tooltip: "Edit solutions",
            action: (organisation) => toSolutions(organisation.organisationId),
            icon: <ListIcon />,
          },
        ]}
      />
      {noSolutionsAlert.message && (
        <Alert
          style={{ marginTop: 16 }}
          severity={noSolutionsAlert.severity}
          onClose={() => {
            setNoSolutionsAlert(noAlert);
          }}
        >
          {noSolutionsAlert.message}
        </Alert>
      )}
      <SpreadContainer>
        <ButtonContainer>
          {organisations.length === 1 && (
            <StyledButton onClick={handleAddSolution} disabled={busy}>
              add solution
            </StyledButton>
          )}
          {organisations.length === 0 && (
            <StyledButton onClick={addOrganisation} disabled={busy}>
              add organisation
            </StyledButton>
          )}
        </ButtonContainer>
        <ButtonContainer>
          {organisations.length > 0 && (
            <StyledButton
              onClick={addOrganisation}
              disabled={busy}
              variant="text"
            >
              add organisation
            </StyledButton>
          )}
        </ButtonContainer>
      </SpreadContainer>
    </MainContainer>
  );
};

export default OrganisationsOverview;
