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

import { useCallback } from "react";
import { baseUrlApi, authHeaders, makeUrlRelative } from "./auth";
import { useAuth } from "../context/Auth";
import { FetchError, AuthorizationError } from "./rest";

export class DeleteDataError extends FetchError {
  constructor(message) {
    super(message);
    this.name = "DeleteDataError";
  }
}

function deleteData(endpoint, bearerToken, method = "DELETE") {
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
    })
      .then(async (response) => {
        const responseData = await response.json().catch((err) => {
          // console.warn("response parse error", err); // (can be empty)
        });
        if (response.status >= 200 && response.status <= 299) {
          resolve(responseData);
        } else {
          const errMsg =
            responseData.error || responseData.message || response.statusText;
          if (response?.status === 401) {
            reject(new AuthorizationError(errMsg));
          } else {
            reject(new DeleteDataError(errMsg));
          }
          return response;
        }
      })
      .catch(reject);
  });
}

const useDeleteData = () => {
  const { user } = useAuth();

  const deleteSolution = useCallback(
    (solution) => {
      if (user.bearerToken) {
        const solutionId =
          typeof solution === "object" ? solution.solutionId : solution;
        if (solutionId) {
          return deleteData(`solutions/${solutionId}`, user.bearerToken);
        }
        return new Promise((resolve, reject) => {
          reject(new Error("No solution id"));
        });
      } else {
        return new Promise((resolve, reject) => {
          reject(new Error("User not logged in"));
        });
      }
    },
    [user.bearerToken]
  );

  const deleteOrganisation = useCallback(
    async (organisation) => {
      if (user.bearerToken) {
        if (organisation.organisationId) {
          if (organisation.solutions?.length) {
            await Promise.all(
              organisation.solutions.map((solutionId) =>
                deleteSolution(solutionId)
              )
            ).catch((err) => {
              console.warn(err);
              return new Promise((resolve, reject) => {
                reject(new Error("Could not delete solutions"));
              });
            });
          }
          return deleteData(
            `organisations/${organisation.organisationId}`,
            user.bearerToken
          );
        }
        return new Promise((resolve, reject) => {
          reject(new Error("No organisation id"));
        });
      } else {
        return new Promise((resolve, reject) => {
          reject(new Error("User not logged in"));
        });
      }
    },
    [user.bearerToken, deleteSolution]
  );

  return {
    deleteSolution,
    deleteOrganisation,
  };
};

export default useDeleteData;
