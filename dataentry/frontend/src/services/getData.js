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

import { useCallback } from "react";
import { baseUrlRest, baseUrlApi, makeUrlRelative, authHeaders } from "./auth";
import { useAuth } from "../context/Auth";
import { FetchError, AuthorizationError } from "./rest";
import { dataToOption } from "./options";

export function fetchData(endpoint, bearerToken, rest = false) {
  return new Promise(async (resolve, reject) => {
    const headers = authHeaders(bearerToken);
    headers.append("Content-Type", "application/json");
    // @todo don't replace for test + production environment, only local:
    let url;
    if (endpoint.startsWith("http")) {
      url = makeUrlRelative(endpoint);
    } else if (rest) {
      url = `${baseUrlRest}/${endpoint}`;
    } else {
      url = `${baseUrlApi}/${endpoint}`;
    }

    fetch(url, {
      method: "GET",
      credentials: "include",
      headers,
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response?.status === 401) {
          reject(new AuthorizationError(response.error));
        } else if (response?.error) {
          reject(new FetchError(response.error));
        } else if (response?.hasOwnProperty?.("_embedded")) {
          resolve(response._embedded);
        } else {
          //   resolve(response._embedded);
          resolve(response);
          // } else {
          //   reject(new FetchError("Unknown error while fetching data."));
        }
      })
      .catch(reject);
  });
}

const useGetData = () => {
  const { user } = useAuth();

  const getData = useCallback(
    (endpoint, rest = false) => {
      if (user.bearerToken) {
        return fetchData(endpoint, user.bearerToken, rest);
      } else {
        return new Promise((resolve, reject) => {
          reject(new Error("User not logged in"));
        });
      }
    },
    [user.bearerToken]
  );

  // // @obsolete
  // const linksToParams = useCallback(
  //   async (data, ownKey) => {
  //     const skip = [
  //       "self",
  //       "organisationTranslations",
  //       "solutionTranslations",
  //       ownKey,
  //     ];
  //     const { _links } = data;
  //     let links = {};
  //     let linksParams = {};
  //     if (_links) {
  //       links = Object.entries(_links)
  //         .filter(([key]) => !skip.includes(key))
  //         .map(([key, value]) => [key, value?.href]);
  //       const linksParamsData = await Promise.all(
  //         links.map(([key, href]) => getData(href, true))
  //       );
  //       // console.log("linksParamsData:", linksParamsData);
  //       linksParams = links.reduce((prev, [key, valueHref], i) => {
  //         let valueData = linksParamsData[i];
  //         if (
  //           typeof valueData === "object" &&
  //           valueData.hasOwnProperty("_embedded") &&
  //           valueData._embedded.hasOwnProperty(key)
  //         ) {
  //           valueData = valueData._embedded[key];
  //         }
  //         let value;
  //         if (Array.isArray(valueData)) {
  //           value = valueData.map((val) => dataToOption(key, val));
  //         } else {
  //           value = dataToOption(key, valueData);
  //         }

  //         return {
  //           ...prev,
  //           [key]: value,
  //         };
  //       }, {});
  //     }
  //     // return {...rest, linksParams};
  //     return { ...data, ...linksParams };
  //   },
  //   [getData]
  // );

  const convertOptions = useCallback(async (data, optionParamKeys) => {
    const convertedData = optionParamKeys.reduce((prev, key) => {
      return { ...prev, [key]: dataToOption(key, prev[key]) };
    }, data);
    return convertedData;
  }, []);

  const getOrganisation = useCallback(
    async (organisationId) => {
      return getData(`organisations/${organisationId}`).then(async (org) => {
        let converted = await convertOptions(org, [
          "hqcountry",
          "hqregion",
          "businessFundingStage",
          "organisationtype",
          "businessGrowthStage",
        ]);
        return {
          organisationId,
          ...converted,
          solutions: org.solutions.map((sol) => ({
            solutionId: sol.id,
            name: sol.name,
          })),
        };
      });
    },
    [getData, convertOptions]
  );

  const getOrganisations = useCallback(
    (organisationIds) => {
      return Promise.all(
        organisationIds.map((organisationId) => getOrganisation(organisationId))
      );
    },
    [getOrganisation]
  );

  const getSolution = useCallback(
    async (solutionId) => {
      return getData(`solutions/${solutionId}`).then(async (solution) => {
        let converted = await convertOptions(solution, [
          "sectors",
          "businessModels",
          "channels",
          "technologies",
          "primarysubusecase",
          "subUseCases",
          "countries",
          "regions",
          "languages",
        ]);
        return {
          ...converted,
          solutionId,
        };
      });
    },
    [getData, convertOptions]
  );

  const getSolutions = useCallback(
    (solutionIds = []) => {
      return Promise.all(
        solutionIds.map((solutionId) => getSolution(solutionId))
      );
    },
    [getSolution]
  );

  // const getSolutionsOfOrganisation = useCallback(
  //   (organisationId) => {
  //     return getData(`organisations/${organisationId}/solutions`, true).then(
  //       (data) => {
  //         console.log("getSolutionsOfOrganisation data", data);
  //         return data.solutions || [];
  //       }
  //     );
  //   },
  //   [getSolution]
  // );

  return {
    getData,
    getOrganisation,
    getOrganisations,
    getSolutions,
    // getSolutionsOfOrganisation,
    getSolution,
  };
};

export default useGetData;
