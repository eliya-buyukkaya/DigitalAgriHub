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
import Alert from "@mui/material/Alert";
import OrganisationsOverview from "./OrganisationsOverview";
import OrganisationForm from "./OrganisationForm";
import { PanelHeader } from "../../Surfaces/Panel";
import { actions, selectors } from "../formState";

const noAlert = { message: null, severity: "error" };

const Organisations = ({
  formState,
  dispatch,
  startEditOrganisation,
  saveOrganisation,
  deleteOrganisation,
  reloadData,
  toSolutions
}) => {
    const [busy, setBusy] = useState(false);
    const [alertState, setAlertState] = useState(noAlert);

    const currentOrganisation = selectors.currentOrganisation(formState);
    const isNew = currentOrganisation?.organisationId === null;

    const editOrganisation = (organisationId) => {
        setAlertState(noAlert);
        startEditOrganisation(organisationId);
    };

    const addOrganisation = () => {
        setAlertState(noAlert);
        dispatch(actions.addOrganisation());
    };

    const handleSaveOrganisation = (...args) => {
        // @todo disable buttons when busy
        if (busy) return;
    
        setBusy(true);
    
        return saveOrganisation(...args)
        .then((saveResult) => {
            dispatch(
                actions.setOrganisationValue("organisationId", saveResult.value)
            );
            // if (isNew) {
            //   // toSolutions(saveResult.value, true);
            // } else {
            //   // @todo: if no solution goto add solution
        
            dispatch(actions.setActiveOrganisation(null));
            // }
            setAlertState({
                message: "Organisation saved successfully.",
                severity: "success",
            });
            reloadData();
            // .then(() => {
            //   if (isNew) {
            //     toSolutions(saveResult.value, true);
            //   }
            // });
        })
        .finally(() => {
            setBusy(false);
        });
    };

    const handleDeleteOrganisation = (organisationData) => {
        if (busy) return;

        const onSuccess = () => {
            dispatch(actions.setActiveOrganisation(null));
            setAlertState({
                message: "Organisation deleted successfully.",
                severity: "success"
            });
            reloadData();
        };

        const onError = (err) => {
            setAlertState({
                message: `Organisation not deleted.${
                err?.messsage ? ` [${err.message}]` : ""
                }`,
                severity: "error",
            });
        };

        deleteOrganisation(organisationData, onSuccess, onError);
    };

    const handleCancelEditOrganisation = () => {
        dispatch(actions.cancelEditOrganisation());
        dispatch(actions.setActiveOrganisation(null));
        reloadData?.();
    };

    let headerContent = null;
    let headerLabel = "Your organisations";
    let content = null;

    if (currentOrganisation) {
        if (
            formState.organisations.length === 1 &&
            formState.currentOrganisationArrayIndex === 0 &&
            formState.organisations[formState.currentOrganisationArrayIndex]
                .organisationId === null
        ) {
            headerContent = (
                <Alert severity="info">
                    Your account does not include an organisation yet. Please add the
                    information for your organisation in the form below.
                </Alert>
            );
        }

        if (isNew) {
            headerLabel = "New organisation";
        } else {
            headerLabel = "Edit organisation";
        }

        content = (
            <OrganisationForm
                formState={currentOrganisation}
                options={formState.options}
                setValue={(key, value) => {
                    dispatch(actions.setOrganisationValue(key, value));
                }}
                onSave={handleSaveOrganisation}
                onCancel={handleCancelEditOrganisation}
            />
        );
    } else {
        content = (
            <OrganisationsOverview
                organisations={formState.organisations}
                editOrganisation={editOrganisation}
                addOrganisation={addOrganisation}
                deleteOrganisation={handleDeleteOrganisation}
                toSolutions={toSolutions}
                busy={busy}
            />
        );
    }

    return (
        <>
            {alertState.message && (<Alert severity={alertState.severity} onClose={() => {setAlertState(noAlert);}}>{alertState.message}</Alert>)}
      
            <PanelHeader>{headerLabel}</PanelHeader>
            {headerContent}
            {content}
        </>
    );
};

export default Organisations;
