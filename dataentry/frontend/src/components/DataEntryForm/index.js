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

import { useState, useReducer, useEffect, useCallback } from "react";
// import Alert from "@mui/material/Alert";
import { useAuth } from "../../context/Auth";
import useSaveData from "../../services/saveData";
import useDeleteData from "../../services/deleteData";
import useGetData from "../../services/getData";
import useOptions from "../../services/options";
import Panel from "../Surfaces/Panel";
import Organisations from "./Organisation";
import Solutions from "./Solution";
import { initialState, reducer, actions } from "./formState";
import ConfirmationDialog from "../Dialog/ConfirmationDialog";

const views = {
  initializing: "initializing",
  organisations: "organisations",
  solutions: "solutions",
};

const initializationStates = {
  false: 0,
  busy: 1,
  ready: 2,
};

const DataEntryForm = () => {
  const { user, reloadUser } = useAuth();
  const { saveOrganisation, saveSolution } = useSaveData();
  const { deleteOrganisation, deleteSolution } = useDeleteData();
  const { getSolutions, getOrganisation } = useGetData();
  const {
    fetchCountries,
    fetchLanguages,
    fetchBusinessFundingStages,
    fetchBusinessGrowthStages,
    fetchOrganisationTypes,
    fetchSectors,
    fetchBusinessModels,
    fetchUseCases,
    fetchTechnologies,
    fetchChannels,
  } = useOptions();

  const [formState, dispatch] = useReducer(reducer, initialState);
  // const [busy, setBusy] = useState(false);
  const [initialized, setInitialized] = useState({
    user: initializationStates.false,
    organisations: initializationStates.false,
    solutions: initializationStates.false,
    options: {
      countries: initializationStates.false,
      languages: initializationStates.false,
      businessFundingStages: initializationStates.false,
      businessGrowthStages: initializationStates.false,
      organisationTypes: initializationStates.false,
      sectors: initializationStates.false,
      businessModels: initializationStates.false,
      useCases: initializationStates.false,
      technologies: initializationStates.false,
      channels: initializationStates.false,
    },
  });

  const [currentView, setCurrentView] = useState(views.initializing);

  const [confirmationState, setConfirmationState] = useState({
    title: "",
    text: "",
    open: false,
    action: null,
  });

  // const [alertState, setAlertState] = useState({
  //   message: null,
  //   severity: "error",
  // });

  const initializeUser = useCallback(() => {
    if (!user) return;

    if (initialized.user === initializationStates.false) {
      setInitialized((prev) => ({ ...prev, user: initializationStates.busy }));

      dispatch(actions.syncUserData(user));

      const currentOrganisation =
        formState.currentOrganisationArrayIndex ||
        formState.currentOrganisationArrayIndex === 0
          ? formState.organisations[formState.currentOrganisationArrayIndex]
          : null;
      const currentOrganisationId = currentOrganisation?.organisationId;

      if (
        user.organisations?.length &&
        user.organisations.some(
          (org) => org.organisationId === currentOrganisationId
        )
      ) {
        // reload current organisation:
        getOrganisation(currentOrganisationId)
          .then((organisationData) => {
            dispatch(actions.syncOrganisationData(organisationData));
            if (organisationData.solutions.length) {
              getSolutions(
                organisationData.solutions.map((s) => s.solutionId)
              ).then((solutionData) => {
                dispatch(actions.setSolutions(solutionData));
              });
            } else {
              dispatch(actions.setSolutions([]));
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        //
      }
    } else {
      if (!formState.organisations?.length) {
        dispatch(actions.addOrganisation());
      }
    }
  }, [
    // formState.organisations?.length,
    formState.organisations,
    formState.currentOrganisationArrayIndex,
    getSolutions,
    getOrganisation,
    initialized.user,
    user,
  ]);

  useEffect(() => {
    // check if user initialization is ready:
    if (!user) return;

    if (initialized.user === initializationStates.busy) {
      let userOrganisationsInitialized = false;
      if (user.organisations?.length) {
        userOrganisationsInitialized =
          formState.organisations.length >= user.organisations.length &&
          formState.organisations.every((organisation) => {
            return Object.keys(organisation).length > 1;
          });
      } else {
        userOrganisationsInitialized = true; //!!formState.organisations?.length
      }

      let userSolutionsInitialized = false;
      userSolutionsInitialized = true;
      if (userOrganisationsInitialized && userSolutionsInitialized) {
        setInitialized((prev) => ({
          ...prev,
          user: initializationStates.ready,
        }));
      }
    }
  }, [user, formState.organisations, formState.solutions, initialized.user]);

  const toSolutions = (organisationId, add = false) => {
    getOrganisation(organisationId).then((organisationData) => {
      dispatch(actions.syncOrganisationData(organisationData));
      dispatch(actions.setActiveOrganisation(organisationId));
      if (organisationData.solutions.length) {
        getSolutions(organisationData.solutions.map((s) => s.solutionId)).then(
          (solutionData) => {
            dispatch(actions.setSolutions(solutionData));
          }
        );
      } else {
        dispatch(actions.setSolutions([]));
        if (add) {
          dispatch(actions.addSolution(organisationId));
        }
      }
    });
    dispatch(actions.setActiveOrganisation(organisationId));
    setCurrentView(views.solutions);
  };

  const toOrganisations = () => {
    dispatch(actions.setActiveOrganisation(null));
    setCurrentView(views.organisations);
  };

  const reloadData = () => {
    // triggers reloading data from user:
    return reloadUser().then(() => {
      setInitialized((prev) => ({ ...prev, user: initializationStates.false }));
    });
  };

  const handleSaveOrganisation = (organisationData) => {
    if (!organisationData) {
      throw new Error("Nothing to save");
    }

    // results handled by child components
    return saveOrganisation(organisationData);
  };

  const handleDeleteOrganisation = (organisationData, onSuccess, onError) => {
    if (!organisationData) {
      throw new Error("Nothing to delete");
    }

    setConfirmationState({
      title: "Delete organisation",
      text: (
        <div>
          <p>
            You are about to delete organisation '{organisationData.name}' and
            all of its solutions.
          </p>
          <p>
            <b>Are you sure?</b>
          </p>
        </div>
      ),
      action: () => {
        deleteOrganisation(organisationData)
          .then((...response) => {
            onSuccess?.(...response);
          })
          .catch((...response) => {
            onError?.(...response);
          })
          .finally(() => {
            setConfirmationState((prev) => ({ ...prev, open: false }));
          });
      },
      open: true,
    });
  };

  const handleStartEditOrganisation = (organisationId) => {
    getOrganisation(organisationId)
      .then((data) => {
        dispatch(actions.syncOrganisationData(data));
        dispatch(actions.setActiveOrganisation(organisationId));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSaveSolution = (solutionData) => {
    if (!solutionData) {
      throw new Error("Nothing to save");
    }

    // results handled by child components
    return saveSolution(solutionData);
  };

  const handleDeleteSolution = (solutionData, onSuccess, onError) => {
    if (!solutionData) {
      throw new Error("Nothing to delete");
    }

    setConfirmationState({
      title: "Delete solution",
      text: (
        <div>
          <p>You are about to delete solution '{solutionData.name}'.</p>
          <p>
            <b>Are you sure?</b>
          </p>
        </div>
      ),
      action: () => {
        deleteSolution(solutionData)
          .then((...response) => {
            onSuccess?.(...response);
          })
          .catch((...response) => {
            onError?.(...response);
          })
          .finally(() => {
            setConfirmationState((prev) => ({ ...prev, open: false }));
          });
      },
      open: true,
    });
  };

  const handleCancelEditSolution = () => {
    setInitialized((prev) => ({ ...prev, user: initializationStates.false }));
  };

  const setOptions = useCallback((key, options) => {
    dispatch(actions.setOptions(key, options));
    if (key === "countries") {
      dispatch(
        actions.setOptions(
          "regions",
          options.reduce((prev, country) => {
            return { ...prev, [country.value]: country.regions || [] };
          }, {})
        )
      );
    }
    setInitialized((prev) => ({
      ...prev,
      options: { ...prev.options, [key]: initializationStates.ready },
    }));
  }, []);

  useEffect(() => {
    // check initialization of options data
    const todo = Object.entries(initialized.options).filter(
      ([optionsKey, initializationState]) =>
        initializationState === initializationStates.false
    );

    const handlePromise = (promise, optionsKey, noData = []) => {
      promise
        .then((data) => {
          setOptions(optionsKey, data);
        })
        .catch((err) => {
          console.error(`fetch options ${optionsKey} error:`, err);
          setOptions(optionsKey, noData);
        });
    };

    todo.forEach(([optionsKey]) => {
      switch (optionsKey) {
        case "countries":
          handlePromise(fetchCountries(), optionsKey);
          break;
        case "languages":
          handlePromise(fetchLanguages(), optionsKey);
          break;
        case "businessFundingStages":
          handlePromise(fetchBusinessFundingStages(), optionsKey);
          break;
        case "businessGrowthStages":
          handlePromise(fetchBusinessGrowthStages(), optionsKey);
          break;
        case "organisationTypes":
          handlePromise(fetchOrganisationTypes(), optionsKey);
          break;
        case "sectors":
          handlePromise(fetchSectors(), optionsKey);
          break;
        case "businessModels":
          handlePromise(fetchBusinessModels(), optionsKey);
          break;
        case "useCases": {
          fetchUseCases()
            .then((data) => {
              const useCases = data.map((d) => ({
                label: d.label,
                value: d.value,
              }));
              const subUseCases = data.reduce((prev, cur) => {
                return { ...prev, [cur.value]: cur.subusecases };
              }, {});
              setOptions("useCases", useCases);
              setOptions("subUseCases", subUseCases);
            })
            .catch((err) => {
              console.warn("fetchUseCases err:", err);
              setOptions("useCases", []);
              setOptions("subUseCases", {});
            });
          break;
        }
        case "technologies":
          handlePromise(fetchTechnologies(), optionsKey);
          break;
        case "channels":
          handlePromise(fetchChannels(), optionsKey);
          break;
        default:
          break;
      }
      setInitialized((prev) => ({
        ...prev,
        options: { ...prev.options, [optionsKey]: initializationStates.busy },
      }));
    });
  }, [
    // initialized.options.countries,
    // initialized.options.businessFundingStages,
    // initialized.options.businessGrowthStages,
    // initialized.options.organisationTypes,
    // initialized.options.sectors,
    initialized.options,
  ]);

  const reloadOptions = useCallback((optionsKey) => {
    setInitialized((prev) => ({
      ...prev,
      options: { ...prev.options, [optionsKey]: initializationStates.false },
    }));
  }, []);

  const initializeOrganisations = useCallback(() => {
    if (initialized.organisations === initializationStates.busy) return;

    /** @obsolete Got redundant by refactoring options management */
    setInitialized((prev) => ({
      ...prev,
      organisations: initializationStates.busy,
    }));
  }, [initialized.organisations]);

  useEffect(() => {
    // check initialization of organisations data
    if (initialized.organisations === initializationStates.ready) return;
    const organisationsInitialized =
      initialized.options.countries === initializationStates.ready &&
      initialized.options.businessFundingStages ===
        initializationStates.ready &&
      initialized.options.businessGrowthStages === initializationStates.ready &&
      initialized.options.organisationTypes === initializationStates.ready;
    if (organisationsInitialized) {
      setInitialized((prev) => ({
        ...prev,
        organisations: initializationStates.ready,
      }));
    }
  }, [
    initialized.options.countries,
    initialized.options.businessFundingStages,
    initialized.options.businessGrowthStages,
    initialized.options.organisationTypes,
    initialized.organisations,
  ]);

  const initializeSolutions = useCallback(() => {
    if (initialized.solutions === initializationStates.busy) return;

    setInitialized((prev) => ({
      ...prev,
      solutions: initializationStates.busy,
    }));

    /** @obsolete Got redundant by refactoring options management */
  }, [initialized.solutions]);

  useEffect(() => {
    // check initialization of solutions data
    if (initialized.solutions === initializationStates.ready) return;

    const solutionsInitialized =
      initialized.options.sectors === initializationStates.ready;

    if (solutionsInitialized) {
      setInitialized((prev) => ({
        ...prev,
        solutions: initializationStates.ready,
      }));
    }
  }, [initialized.options.sectors, initialized.solutions]);

  useEffect(() => {
    if (initialized.user === initializationStates.false) {
      initializeUser();
    }
    if (initialized.user !== initializationStates.ready) {
      return;
    }
    if (
      currentView === views.initializing &&
      initialized.organisations === initializationStates.false
    ) {
      initializeOrganisations();
      return;
    }
    if (
      currentView === views.initializing &&
      initialized.organisations === initializationStates.ready
    ) {
      setCurrentView(views.organisations);
      return;
    }
    if (
      currentView === views.solutions &&
      initialized.organisations === initializationStates.false
    ) {
      initializeSolutions();
    }
  }, [
    currentView,
    initialized.user,
    initialized.organisations,
    initializeOrganisations,
    initializeSolutions,
    initializeUser,
  ]);

  // RENDER
  if (currentView === views.initializing) {
    return <Panel>Loading...</Panel>;
  }
  if (currentView === views.organisations) {
    return (
      <Panel>
        <Organisations
          formState={formState}
          dispatch={dispatch}
          startEditOrganisation={handleStartEditOrganisation}
          saveOrganisation={handleSaveOrganisation}
          deleteOrganisation={handleDeleteOrganisation}
          reloadData={reloadData}
          toSolutions={toSolutions}
        />
        <ConfirmationDialog
          open={confirmationState.open}
          onCancel={() =>
            setConfirmationState((prev) => ({ ...prev, open: false }))
          }
          onConfirm={confirmationState.action}
          title={confirmationState.title}
        >
          {confirmationState.text}
        </ConfirmationDialog>
      </Panel>
    );
  }
  if (currentView === views.solutions) {
    return (
      <Panel>
        <Solutions
          formState={formState}
          dispatch={dispatch}
          saveSolution={handleSaveSolution}
          deleteSolution={handleDeleteSolution}
          reloadData={handleCancelEditSolution}
          reloadOptions={reloadOptions}
          toOrganisations={toOrganisations}
        />
        <ConfirmationDialog
          open={confirmationState.open}
          onCancel={() =>
            setConfirmationState((prev) => ({ ...prev, open: false }))
          }
          onConfirm={confirmationState.action}
          title={confirmationState.title}
        >
          {confirmationState.text}
        </ConfirmationDialog>
      </Panel>
    );
  }
  return <div>Something went wrong...</div>;
};
export default DataEntryForm;
