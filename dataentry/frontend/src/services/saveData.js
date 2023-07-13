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
import { baseUrlApi, authHeaders, makeUrlRelative } from "./auth";
import { useAuth } from "../context/Auth";
import { FetchError, AuthorizationError } from "./rest";

export class SaveDataError extends FetchError {
  constructor(message) {
    super(message);
    this.name = "SaveDataError";
  }
}

function saveData(endpoint, bearerToken, data, method = "POST") {
  return new Promise(async (resolve, reject) => {
    const headers = authHeaders(bearerToken);
    headers.append("Content-Type", "application/json");
    const url = endpoint.startsWith("http")
      ? makeUrlRelative(endpoint)
      : `${baseUrlApi}/${endpoint}`;
    fetch(url, {
      method,
      credentials: "include",
      headers,
      redirect: "follow",
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const responseData = await response.json();
        if (response.status >= 200 && response.status <= 299) {
          resolve(responseData);
        } else {
          const errMsg =
            responseData.error || responseData.message || response.statusText;
          if (response?.status === 401) {
            reject(new AuthorizationError(errMsg));
          } else {
            reject(new SaveDataError(errMsg));
          }
          return response;
        }
      })
      .catch(reject);
  });
}

const useSaveData = () => {
  const { user } = useAuth();

  const saveOrganisation = useCallback(
    (organisation) => {
      // console.log("save organisation:", organisation);
      // return new Promise((resolve, reject) => {
      //   reject(new Error("Debugging"));
      // });

      if (user.bearerToken) {
        if (organisation.organisationId) {
          return saveData(
            `organisations/${organisation.organisationId}`,
            user.bearerToken,
            organisation,
            "PUT"
          );
        }
        return saveData("organisations", user.bearerToken, organisation);
      } else {
        return new Promise((resolve, reject) => {
          reject(new Error("User not logged in"));
        });
      }
    },
    [user.bearerToken]
  );

  /* see https://digitalagrihub.org/dataentry/api/swagger-ui/index.html#/solution-entity-controller/postCollectionResource-solution-post for example*/
  const saveSolution = useCallback(
    (solution) => {
      if (user.bearerToken) {
        // console.log("saveSolution:", solution);
        // return new Promise((resolve, reject) => {
        //   reject(new Error("Debugging"));
        // });

        if (solution.solutionId) {
          return saveData(
            `solutions/${solution.solutionId}`,
            user.bearerToken,
            solution,
            "PUT"
          );
        }
        const { solutionId, ...solutionData } = solution;
        return saveData("solutions", user.bearerToken, {
          ...solutionData,
        });
      } else {
        return new Promise((resolve, reject) => {
          reject(new Error("User not logged in"));
        });
      }
    },
    [user.bearerToken]
  );

  return {
    saveOrganisation,
    saveSolution,
  };
};

export default useSaveData;
