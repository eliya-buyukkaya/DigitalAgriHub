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

import { updateArray } from "../../helpers/updateState";

export const newUseCase = {
  id: "",
  subUseCases: [],
};

const getNewSolution = (organisationHref) => ({
  solutionId: null,
  organisation: organisationHref, // *
  name: "", // * string
  url: "", // string
  description: "", // * string (html)
  launch: "", // * integer
  sectors: [], // * select list - autocomplete
  businessModels: [], // array of options {label: string, value: any}
  platform: null, // boolean
  bundling: null, // boolean
  primaryUseCase: null, // {id: number, value: string, subUseCases: array of string (id)}}
  otherUseCases: [], // * array of {id: number, value: string, subUseCases: array of string (id)}} @todo?id=value?
  channels: [], // array of options {label: string, value: any}
  technologies: [], // array of options {label: string, value: any}
  countries: [], // array of options with regions as sub items {label: string, value: any, regions: [ {label: string, value: any} ]}
  languages: [], // array of options {label: string, value: any}
  registeredusers: "", // integer
  activeusers: "", // integer
  shfusers: "", // integer
  womenusers: "", // integer
  youthusers: "", // integer
  revenue: "", // integer ($)
  yieldlowerbound: "", // fraction (show as percentage)
  yieldupperbound: "", // fraction (show as percentage)
  incomelowerbound: "", // fraction (show as percentage)
  incomeupperbound: "", // fraction (show as percentage)
});

const newOrganisation = {
  organisationId: null,
  name: "",
  url: "",
  description: "",
  hqcountry: null,
  hqregion: null,
  founded: "",
  businessFundingStage: "",
  organisationtype: "",
  businessGrowthStage: "",
};

export const initialState = {
  organisations: [],
  solutions: null,
  currentOrganisationArrayIndex: null,
  currentSolutionArrayIndex: null,
  options: {
    countries: [],
    regions: {}, // per country
    businessFundingStages: [],
    organisationTypes: [],
    businessGrowthStages: [],
    sectors: [],
    businessModels: [],
    useCases: [],
    subUseCases: {}, // per useCase
    channels: [],
    technologies: [],
    languages: [],
  },
};

function updatedValue(value, prev) {
  if (typeof value === "function") {
    return value(prev);
  }
  return value;
}

export function reducer(state, action) {
  switch (action.type) {
    case "setStateValue": {
      const { key, value } = action.payload;
      return { ...state, [key]: updatedValue(value, state[key]) };
    }
    case "addOrganisation": {
      return {
        ...state,
        organisations: [...state.organisations, { ...newOrganisation }],
        currentOrganisationArrayIndex: state.organisations.length,
      };
    }
    case "cancelEditOrganisation": {
      return {
        ...state,
        organisations: [
          ...state.organisations
            .filter((org) => org.organisationId !== null)
            .map((org) => ({ organisationId: org.organisationId })),
        ],
        currentOrganisationArrayIndex: null,
      };
    }
    case "setActiveOrganisation": {
      // solutions need to be fetched
      const organisationId = action.payload;
      let idx;
      if (organisationId === null || typeof organisationId === "undefined") {
        idx = null;
      } else {
        idx = state.organisations.findIndex(
          (org) => org.organisationId === organisationId
        );
        if (idx < 0) {
          throw new Error(`Organisation ${organisationId} not found`);
        }
      }
      return {
        ...state,
        currentOrganisationArrayIndex: idx,
        solutions: null,
        // idx === null
        //   ? []
        //   : state.solutions.filter(
        //       (solution) =>
        //         solution.organisation ===
        //         state.organisations[idx]._links?.self?.href
        //     ),
        currentSolutionArrayIndex: null,
      };
    }
    case "setOrganisationStateValue": {
      const { key, value } = action.payload;
      if (
        !(
          state.currentOrganisationArrayIndex ||
          state.currentOrganisationArrayIndex === 0
        ) ||
        state.currentOrganisationArrayIndex > state.organisations.length - 1
      ) {
        throw new Error("Invalid operation. Organisations list out of bounds.");
      }
      return {
        ...state,
        organisations: updateArray(
          state.organisations,
          state.currentOrganisationArrayIndex,
          (prev) => ({ ...prev, [key]: updatedValue(value, prev[key]) })
        ),
      };
    }
    case "addSolution": {
      const organisationHref = action.payload;
      const newSolution = getNewSolution(organisationHref);
      const currentSolutions = state.solutions || [];
      return {
        ...state,
        solutions: [...currentSolutions, newSolution],
        currentSolutionArrayIndex: currentSolutions.length,
      };
    }
    case "setSolutionStateValue": {
      const { key, value } = action.payload;
      if (
        !(
          state.currentSolutionArrayIndex ||
          state.currentSolutionArrayIndex === 0
        ) ||
        !state.solutions ||
        state.currentSolutionArrayIndex > state.solutions.length - 1
      ) {
        throw new Error("Invalid operation. Organisations list out of bounds.");
      }
      return {
        ...state,
        solutions: updateArray(
          state.solutions,
          state.currentSolutionArrayIndex,
          (prev) => ({ ...prev, [key]: updatedValue(value, prev[key]) })
        ),
      };
    }
    case "setActiveSolution": {
      const solutionId = action.payload;
      if (!state.solutions) {
        throw new Error(`No solutions loaded`);
      }
      let idx;
      if (solutionId === null || typeof solutionId === "undefined") {
        idx = null;
      } else {
        idx = state.solutions.findIndex((sol) => sol.solutionId === solutionId);
        if (idx < 0) {
          throw new Error(`Solution ${solutionId} not found`);
        }
      }
      return {
        ...state,
        currentSolutionArrayIndex: idx,
      };
    }
    case "syncUserData": {
      const userData = action.payload;
      if (!userData)
        return {
          ...state,
          organisations: [],
          solutions: null,
        };
      const organisations = [
        ...userData.organisations,
        ...state.organisations.filter((o) => o.organisationId === null),
      ];
      let newOrganisationIndex = state.currentOrganisationArrayIndex;
      if (
        state.currentOrganisationArrayIndex ||
        state.currentOrganisationArrayIndex === 0
      ) {
        newOrganisationIndex = organisations.findIndex(
          (o) =>
            o.organisationId ===
            state.organisations[state.currentOrganisationArrayIndex]
              .organisationId
        );
        if (newOrganisationIndex < 0) {
          newOrganisationIndex = null;
        }
      }

      // const solutions = [
      //   ...userData.solutions,
      //   ...state.solutions.filter((s) => s.solutionId === null),
      // ];
      return {
        ...state,
        organisations,
        solutions: null,
        currentOrganisationArrayIndex: newOrganisationIndex,
        currentSolutionArrayIndex: null,
      };
    }
    case "syncOrganisationData": {
      const organisationData = action.payload;

      return {
        ...state,
        organisations: updateArray(
          state.organisations,
          (org) => org.organisationId === organisationData.organisationId,
          (org) => ({
            ...organisationData,
            businessFundingStage: organisationData.businessFundingStage?.value,
            businessGrowthStage: organisationData.businessGrowthStage?.value,
            organisationtype: organisationData.organisationtype?.value,
            founded: organisationData.founded?.toString(),
          })
        ),
      };
    }
    case "syncOrganisationsData": {
      const organisationsData = action.payload;

      const organisations = state.organisations.map((o) => {
        if (o.organisationId) {
          const orgData = organisationsData.find(
            (od) => od.organisationId === o.organisationId
          );
          if (orgData) {
            return {
              ...orgData,
              businessFundingStage: orgData.businessFundingStage?.value,
              businessGrowthStage: orgData.businessGrowthStage?.value,
              organisationtype: orgData.organisationtype?.value,
              founded: orgData.founded?.toString(),
            };
          }
        }
        return o;
      });

      return {
        ...state,
        organisations,
      };
    }
    case "setSolutions": {
      let solutions = action.payload;
      if (Array.isArray(solutions)) {
        solutions = solutions.map((solution) => {
          const { primarysubusecase, subUseCases, ...strippedSolution } =
            solution;

          let primaryUseCase = null;
          let otherUseCases = [];
          if (primarysubusecase) {
            const { usecase, ...subUseCase } = primarysubusecase;
            primaryUseCase = {
              ...usecase,
              subUseCases: [subUseCase],
            };
          }
          if (subUseCases) {
            otherUseCases = subUseCases.reduce((prev, subUseCase, i) => {
              const { usecase, ...curSubUseCase } = subUseCase;

              const parentIndex = prev.findIndex(
                (prevUseCase) => prevUseCase.id === subUseCase.usecase.id
              );
              if (parentIndex > -1) {
                return updateArray(prev, parentIndex, (prev) => ({
                  ...prev,
                  subUseCases: [...prev.subUseCases, curSubUseCase],
                }));
              }

              return [...prev, { ...usecase, subUseCases: [curSubUseCase] }];
            }, []);
          }
          return {
            ...strippedSolution,
            primaryUseCase,
            otherUseCases,
            launch: solution.launch.toString() || "",
            registeredusers: solution.registeredusers?.toString() || "",
            activeusers: solution.activeusers?.toString() || "",
            shfusers: solution.shfusers?.toString() || "",
            womenusers: solution.womenusers?.toString() || "",
            youthusers: solution.youthusers?.toString() || "",
            revenue: solution.revenue?.toString() || "",
            yieldlowerbound: solution.yieldlowerbound?.toString() || "",
            yieldupperbound: solution.yieldupperbound?.toString() || "",
            incomelowerbound: solution.incomelowerbound?.toString() || "",
            incomeupperbound: solution.incomeupperbound?.toString() || "",
            countries: solution.countries.map((country) => ({
              ...country,
              regions: (solution.regions || []).filter(
                (reg) => reg.country?.value === country.value
              ),
            })),
          };
        });
      }
      return {
        ...state,
        solutions,
      };
    }
    case "setOptions": {
      const { key, options } = action.payload;
      return {
        ...state,
        options: {
          ...state.options,
          [key]: updatedValue(options, state.options[key]),
        },
      };
    }
    default:
      throw new Error();
  }
}

export const selectors = {
  currentOrganisation: (state) => {
    const currentOrganisation =
      state.currentOrganisationArrayIndex ||
      state.currentOrganisationArrayIndex === 0
        ? state.organisations[state.currentOrganisationArrayIndex]
        : null;
    return currentOrganisation;
  },
};

/*****************************************************************/
/*                              ACTIONS                          */
/*****************************************************************/

/**
 * @typedef {Object} TAction
 * @property {string} type
 * @property {*} payload
 *
 * @typedef {import('../../context/Auth').TUser} TUser
 *
 * @typedef {Object} TOption
 * @property {string} label
 * @property {*} value
 */

/**
 * @returns {TAction} - action object
 */
export const addOrganisation = () => ({
    type: "addOrganisation",
    payload: null
});

/**
 * @param {number} organisationId
 * @returns {TAction} - action object
 */
export const setActiveOrganisation = (organisationId) => ({
  type: "setActiveOrganisation",
  payload: organisationId,
});

/**
 * @param {string} key
 * @param {*} value - value
 * @returns {TAction} - action object
 */
export const setOrganisationValue = (key, value) => ({
    type: "setOrganisationStateValue",
    payload: { key, value },
});

/**
 * @returns {TAction} - action object
 */
export const addSolution = (organisationHref) => ({
  type: "addSolution",
  payload: organisationHref,
});

/**
 * @param {string} key
 * @param {*} value - value or setter function (prev)=>value
 * @returns {TAction} - action object
 */
export const setSolutionStateValue = (key, value) => ({
  type: "setSolutionStateValue",
  payload: { key, value },
});

/**
 * @param {string} solutionId
 * @returns {TAction} - action object
 */
export const setActiveSolution = (solutionId) => ({
  type: "setActiveSolution",
  payload: solutionId,
});

/**
 * @param {TUser} user
 * @returns {TAction} - action object
 */
export const syncUserData = (user) => ({
  type: "syncUserData",
  payload: user,
});

/**
 * @param {object} organisation
 * @returns {TAction} - action object
 */
export const syncOrganisationData = (organisation) => ({
  type: "syncOrganisationData",
  payload: organisation,
});

/**
 * @param {object[]} organisations
 * @returns {TAction} - action object
 */
export const syncOrganisationsData = (organisations) => ({
  type: "syncOrganisationsData",
  payload: organisations,
});

/**
 * @param {object[]} solutions
 * @returns {TAction} - action object
 */
export const setSolutions = (solutions) => ({
  type: "setSolutions",
  payload: solutions,
});

/**
 * @param {object[]} organisation
 * @returns {TAction} - action object
 */
export const cancelEditOrganisation = () => ({
  type: "cancelEditOrganisation",
  payload: null,
});

/**
 * @param {string} key
 * @param {TOption[]} options
 * @returns {TAction} - action object
 */
export const setOptions = (key, options) => ({
  type: "setOptions",
  payload: { key, options },
});

export const actions = {
  syncUserData,
  syncOrganisationData,
  syncOrganisationsData,
  setSolutions,
  addOrganisation,
  cancelEditOrganisation,
  setActiveOrganisation,
  setOrganisationValue,
  addSolution,
  setSolutionStateValue,
  setActiveSolution,
  setOptions,
};
