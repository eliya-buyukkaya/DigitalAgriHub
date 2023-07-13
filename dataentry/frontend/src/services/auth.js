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

import { AuthorizationError, FetchError } from "./rest";

// @todo: check for test + production, now only focussed on local development
// locally this is handled by a proxy for now
//   "https://digitalagrihub-test.containers.wur.nl/dataentry/api";
export const baseUrlRest = "/dataentry/rest";
export const baseUrlApi = "/dataentry/api";

export const makeUrlRelative = (url) => {
  if (url.startsWith("http")) {
    const regex = /(http.*\/\/(.*?)\/)/g;
    return url.replace(regex, "/");
  }
  return url;
};

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function basicAuthToken(login, password) {
  return btoa(`${login}:${password}`);
}

export function basicAuthHeaders(token) {
  let headers = new Headers();
  headers.append("Authorization", `Basic ${token}`);
  // myHeaders.append("Cookie", "JSESSIONID=E1CCD4FE78882411396C62C3E66D91D8; XSRF-TOKEN=96683dc5-37b9-481b-83dd-399236309db5");
  return headers;
}

export function authHeaders(bearerToken) {
  let xsrf = getCookie("XSRF-TOKEN");
  if (!xsrf) {
    throw new Error("Cannot get xsrf token");
  }
  let headers = new Headers();
  headers.append("X-XSRF-TOKEN", xsrf);
  setCookie("XSRF-TOKEN", xsrf, 1);

  headers.append("Authorization", `Bearer ${bearerToken}`);

  return headers;
}

export function logout(bearerToken) {
  return new Promise(async (resolve, reject) => {
    let xsrf = getCookie("XSRF-TOKEN");
    if (!xsrf) {
      return reject(new Error("Cannot get xsrf token"));
    }
    let headers = authHeaders(bearerToken);

    fetch(`${baseUrlApi}/logout`, {
      method: "POST",
      credentials: "include",
      headers,
      redirect: "follow",
    })
      .then(async (response) => {
        // const result =
        await response.json();
        // console.log("result:", result);
        // if(result [is ok]) { ... }
        resolve();
      })
      .catch(reject);
  });
}

/**
 * 
 * @param {*} basicAuthToken 
 * @returns {object} {
    "id": 6,
    "name": "ronnie",
    "email": "ronnie.vankempen@wur.nl",
    "company": "wur",
    "solutions": [],
    "organisations": []
}
 */
export function login(basicAuthToken, reCaptchaToken) {
  return new Promise(async (resolve, reject) => {
    let xsrf = getCookie("XSRF-TOKEN");
    if (!xsrf) {
      const requestOptions = {
        method: "GET",
        headers: new Headers(),
        redirect: "follow",
        credentials: "include",
      };
      // const response =
      await fetch(`${baseUrlApi}/csrf`, requestOptions).catch(() => {
        //ignore warnings, only want cookie
      });
      //   console.log("response:", response);
      //   console.log("response.headers:", response?.headers);
      xsrf = getCookie("XSRF-TOKEN");
    }
    if (!xsrf) {
      return reject(new Error("Cannot get xsrf token"));
    }
    let headers = basicAuthHeaders(basicAuthToken);
    headers.append("X-XSRF-TOKEN", xsrf);
    headers.append("g-recaptcha-token", reCaptchaToken);
    setCookie("XSRF-TOKEN", xsrf, 1);

    fetch(`${baseUrlApi}/login`, {
      method: "POST",
      credentials: "include",
      headers,
      redirect: "follow",
    })
      .then(async (response) => {
        if (response?.status === 401) {
            reject(new AuthorizationError(response.headers.get('error')));
        } else if ((response?.status === 400) && (response?.error.message.includes('reCaptcha'))) {
            reject(new AuthorizationError(response.error));
        } else {
            const authorizationHeader = response?.headers?.get("authorization");
            const token = authorizationHeader?.replace(/(^Bearer)/gi, "").trim();
            const user = await getUser(token);
            if (user.error) {
                reject(new AuthorizationError(response.error));
            } else {
            resolve({ ...user, bearerToken: token });
            }
        }
      })
      .catch(reject);
  });
}

function convertUserData(raw) {
  return {
    ...raw,
    organisations: raw.organisations.map((rawOrg) => ({
      organisationId: rawOrg.id,
      name: rawOrg.name,
    })),
    solutions: raw.solutions.map((rawSol) => ({
      solutionId: rawSol.id,
      solutionName: rawSol.name,
    })),
  };
}
/**
 * 
 * @param {*} bearerToken 
 * @returns {*} Promise {object} {
    "id": 6,
    "name": "ronnie",
    "email": "ronnie.vankempen@wur.nl",
    "company": "wur",
    "solutions": [],
    "organisations": []
}
 */
export function getUser(bearerToken) {
  return new Promise(async (resolve, reject) => {
    let xsrf = getCookie("XSRF-TOKEN");
    if (!xsrf) {
      const requestOptions = {
        method: "GET",
        headers: new Headers(),
        redirect: "follow",
        credentials: "include",
      };
      // const response =
      await fetch(`${baseUrlApi}/csrf`, requestOptions).catch(() => {
        //ignore warnings, only want cookie
      });
      //   console.log("response:", response);
      //   console.log("response.headers:", response?.headers);
      xsrf = getCookie("XSRF-TOKEN");
    }
    if (!xsrf) {
      return reject(new Error("Cannot get xsrf token"));
    }
    let headers = authHeaders(bearerToken);

    fetch(`${baseUrlApi}/user`, {
      method: "GET",
      credentials: "include",
      headers,
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          reject(new AuthorizationError(data.error));
        } else {
          resolve(convertUserData(data));
        }
      })
      .catch(reject);
  });
}

/** Sends request to backend to get potential solutions based on email and company
 * 
 * @param {string} company
 * @param {string} email
 * @returns {Promise}
 */
export function getPotentialSolutions(company, email) {
    return new Promise(async (resolve, reject) => {
        fetch(`${baseUrlApi}/user/solutions?company=${company}&email=${email}`, {
            method: "GET",
            redirect: "follow",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                reject(new FetchError(data.error));
            } else {
                resolve(data);
            }
        })
        .catch(reject);
    });
}


/** Sends request to backend to register user
 * 
 * @param {Object} formInput 
 * @param {string} reCaptchaToken
 * @returns {Promise}
 */
export function register(formInput, reCaptchaToken = null) {
    let xsrf = getCookie("XSRF-TOKEN");
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-XSRF-TOKEN", xsrf);
    headers.append("g-recaptcha-token", reCaptchaToken);

    return new Promise(async (resolve, reject) => {
        fetch(`${baseUrlApi}/user`, {
            method: "POST",
            headers,
            redirect: "follow",
            body: JSON.stringify({
                "name": formInput.name,
                "company": formInput.company,
                "password": formInput.password,
                "matchingPassword": formInput.matchingPassword,
                "email": formInput.email,
                "website": formInput.website === '' ? null : formInput.website,
                "editSolutions": formInput.solutions.length > 0,
                "solutions": formInput.solutions,
                "comments": formInput.comments === '' ? null : formInput.comments
        })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                reject(new AuthorizationError(data.error));
            } else {
                resolve(data);
            }
        })
        .catch(reject);
    });
}

/** Sends request to backend to check registration token
 * 
 * @param {string} token
 * @returns {Promise}
 */
 export function checkRegistration(token) {
    return new Promise(async (resolve, reject) => {
        fetch(`${baseUrlApi}/user/confirm?token=${token}`, {
            method: "GET",
            redirect: "follow",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                reject(new AuthorizationError(data.error));
            } else {
                resolve(data);
            }
        })
        .catch(reject);
    });
}

/** Sends request to backend to get basic settings
 * 
 * @returns {Promise}
 */
export function getSettings() {
    return new Promise(async (resolve, reject) => {
        fetch(`${baseUrlApi}/user/registration`, {
            method: "GET",
            redirect: "follow",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                reject(new FetchError(data.error));
            } else {
                resolve(data);
            }
        })
        .catch(reject);
    });
}

export function getKey() {
    return new Promise(async (resolve, reject) => {
        fetch(`${baseUrlApi}/captchakey`, {
            method: "GET",
            credentials: "include",
            headers: new Headers(),
            redirect: "follow",
        })
        .then((response) => {
            if (response?.status === 200) {
                return response.json();
            } else if (response?.error) {
                reject(new FetchError(response.error));
            } else {
                console.log(response);
                reject(new FetchError("Unknown error while fetching data."));
            }
        })
        .then((data) => resolve(data))
        .catch(reject);
    });
}

/** Sends request to backend to initiate the change password process
 * 
 * @param {string} email
 * @param {string} reCaptchaToken
 * @returns {Promise}
 */
export function forgotPassword(email, reCaptchaToken) {
    let xsrf = getCookie("XSRF-TOKEN");
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-XSRF-TOKEN", xsrf);
    headers.append("g-recaptcha-token", reCaptchaToken);

    return new Promise(async (resolve, reject) => {
        fetch(`${baseUrlApi}/user/forgot?email=${email}`, {
            method: "POST",
            headers,
            redirect: "follow",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                reject(new FetchError(data.error));
            } else {
                resolve(data);
            }
        })
        .catch(reject);
    });
}

/** Sends request to backend to change password
 * 
 * @param {string} password
 * @param {string} matchingPassword 
 * @param {string} resetToken
 * @param {string} reCaptchaToken
 * @returns {Promise}
 */
export function resetPassword(password, matchingPassword, resetToken, reCaptchaToken) {
    let xsrf = getCookie("XSRF-TOKEN");
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-XSRF-TOKEN", xsrf);
    headers.append("g-recaptcha-token", reCaptchaToken);

    return new Promise(async (resolve, reject) => {
        fetch(`${baseUrlApi}/user/reset`, {
            method: "POST",
            headers,
            redirect: "follow",
            body: JSON.stringify({                
                "password": password,
                "matchingPassword": matchingPassword,
                "token": resetToken
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                reject(new FetchError(data.error));
            } else {
                resolve(data);
            }
        })
        .catch(reject);
    });
}
