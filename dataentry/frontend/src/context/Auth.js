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

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  basicAuthToken as generateBasicAuthToken,
  login as loginService,
  logout as logoutService,
  register as registerService,
  getUser,
  // checkLogin,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService
} from "../services/auth";

/**
 * @typedef {Object} TUser
 * @property {string} email
 * @property {string} basicAuthToken
 * @property {string} bearerToken
 * @property {number} id
 * @property {string} company
 * @property {array} organisations
 * @property {array} solutions
 *
 * @typedef TAuthContext
 * @property {TUser} user
 * @property {function} login
 * @property {function} logout
 * @property {function} changePassword
 * @property {function} verify
 * @property {function} toggleAdminMode
 */

/** @type {import('react').Context<TAuthContext>} */
let AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /**
   * Check if a token is stored in sessionStorage and if it is still valid:
   */
  useEffect(() => {
    const bearerToken = sessionStorage.getItem("bearerToken");
    if (bearerToken) {
      getUser(bearerToken)
        .then((userData) => {
          setUser({ ...userData, bearerToken });
        })
        .catch((err) => {
          console.warn("login error:", err);
          setUser(null);
          sessionStorage.setItem("bearerToken", null);
        });
    }
  }, []);

  const login = useCallback((email, password, reCaptchaToken) => {
    return new Promise((resolve, reject) => {
      const basicAuthToken = generateBasicAuthToken(email, password);
      loginService(basicAuthToken, reCaptchaToken)
        .then((loginResult) => {
          const newUser = {
            ...loginResult,
            basicAuthToken,
          };
          setUser(newUser);
          sessionStorage.setItem("bearerToken", loginResult.bearerToken);
          resolve(newUser);
        })
        .catch((loginError) => {
          console.warn("loginError:", loginError);
          setUser(null);
          reject(loginError);
        });
    });
  }, []);

  const logout = useCallback(() => {
    return new Promise((resolve, reject) => {
      const bearerToken = sessionStorage.getItem("bearerToken");
      if (!bearerToken) {
        setUser(null);
        reject(new Error("token not found"));
      }
      logoutService(bearerToken)
        .then(() => {
          setUser(null);
          resolve();
        })
        .catch(reject)
        .finally(() => {
          setUser(null);
          sessionStorage.setItem("bearerToken", null);
        });
    });
  }, []);

  const register = useCallback((name, company, password, matchingpassword, email, reCaptchaToken) => {
    return new Promise((resolve, reject) => {
        registerService(name, company, password, matchingpassword, email, reCaptchaToken)
        .then(() => {
            resolve();
        })
        .catch(reject);
    });
}, []);


  const reloadUser = useCallback(() => {
    const bearerToken = sessionStorage.getItem("bearerToken");
    if (bearerToken) {
      return getUser(bearerToken)
        .then((userData) => {
          setUser({ ...userData, bearerToken });
        })
        .catch((err) => {
          console.warn("login error:", err);
          setUser(null);
          sessionStorage.setItem("bearerToken", null);
        });
    }
  }, []);

  const forgotPassword = (email, reCaptchaToken) => {
    return new Promise((resolve, reject) => {
      forgotPasswordService(email, reCaptchaToken)
        .then(() => {
          resolve();
        })
      .catch(reject);
    });
  };

  const resetPassword = (password, matchingpassword, resetToken, reCaptchaToken) => {
    return new Promise((resolve, reject) => {
      resetPasswordService(password, matchingpassword, resetToken, reCaptchaToken)
        .then(() => {
          resolve();
        })
      .catch(reject);
    });
  };

  // const verify = () => {
  //   checkLogin()
  //     .then((result) => {
  //       if (result) {
  //         setUser({ ...result, adminMode: true });
  //       } else {
  //         setUser(null);
  //       }
  //     })
  //     .catch(console.warn);
  // };

  const value = {
    user,
    login,
    logout,
    register,
    reloadUser,
    forgotPassword,
    resetPassword,
    // verify,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
