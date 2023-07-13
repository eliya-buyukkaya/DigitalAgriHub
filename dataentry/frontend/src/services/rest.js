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

import { baseUrlRest, authHeaders, makeUrlRelative } from "./auth";

export class FetchError extends Error {
  constructor(message) {
    super(message);
    this.name = "FetchError";
  }
}

export class AuthorizationError extends FetchError {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
  }
}

// /dataentry/rest/languages
// @todo: use /dataentry/api/countries instead?
export function fetchData(endpoint, bearerToken) {
  return new Promise(async (resolve, reject) => {
    const headers = authHeaders(bearerToken);
    const url = endpoint.startsWith("http")
      ? makeUrlRelative(endpoint)
      : `${baseUrlRest}/${endpoint}`;
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
        } else if (response.hasOwnProperty("_embedded")) {
          resolve(response._embedded);
        } else {
          reject(new FetchError("Unknown error while fetching data."));
        }
      })
      .catch(reject);
  });
}

export function urlToId(url) {
  const regex = /[^/\\]+$/g;
  const [id] = url.match(regex);
  return id;
}

// for testing only:
export function fetchLanguages(bearerToken) {
  return new Promise((resolve, reject) => {
    fetchData("languages", bearerToken)
      .then((data) => {
        console.log("data:", data);
        resolve(data?.languages);
      })
      .catch(reject);
  });
}
