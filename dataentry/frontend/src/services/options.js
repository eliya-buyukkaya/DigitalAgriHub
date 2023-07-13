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
import { fetchData, urlToId, AuthorizationError } from "./rest";
import { fetchData as fetchApiData } from "./getData";
import { useAuth } from "../context/Auth";

export const dataToOption = (key, data) => {
  if (!data) {
    throw new Error("No data");
    // return data;
  }
  if (Array.isArray(data)) {
    return data.map((d) => dataToOption(key, d));
  }
  let id;
  if (typeof data.id !== "undefined" && data.id !== null) {
    id = data.id;
  } else if (data?._links?.self?.href) {
    id = urlToId(data._links.self.href);
  } else {
    throw new Error("No id");
  }
  const defaultOption = {
    label: data.description,
    id,
    value: id.toString(),
  };
  switch (key) {
    case "countries": {
      if (data.regions) {
        return {
          ...defaultOption,
          regions: dataToOption(
            "countries.regions", 
            data.regions.sort(
                (a, b) => a.description.substring(0, 10) === "new region" ? 1 : (b.description.substring(0, 10) === "new region" ? -1 : (a.description <= b.description ? -1 : 1)))
          )
        };
      }
      return defaultOption;
    }
    case "organisation": {
      return {
        ...defaultOption,
        label: data.name,
      };
    }
    case "primarysubusecase": {
      return {
        ...defaultOption,
        usecase: dataToOption("primarysubusecase.usecase", data.usecase),
      };
    }
    case "usecase": {
      return {
        ...defaultOption,
        subusecases: dataToOption("usecase.subusecases", data.subusecases.sort((a, b) => a.description === "No specification" ? 1 : (b.description === "No specification" ? -1 : (a.description <= b.description ? -1 : 1))))
      };
    }
    case "subUseCases": {
      if (data.usecase) {
        return {
          ...defaultOption,
          usecase: dataToOption("subUseCases.usecase", data.usecase),
        };
      }
      return defaultOption;
    }
    case "regions": {
      if (data.country) {
        return {
          ...defaultOption,
          country: dataToOption("regions.country", data.country),
        };
      }
      return defaultOption;
    }

    // case "primarysubusecase":
    // case "subUseCases": {
    //   return {
    //     ...defaultOption,
    //     usecaseHref: data._links.usecase?.href,
    //   };
    // }
    default:
      return defaultOption;
  }
};
const useOptions = () => {
  const { user, logout } = useAuth();

  const handleFetchError = useCallback(
    (err) => {
      if (err instanceof AuthorizationError) {
        console.log("handleFetchError err:", err);
        logout(user.bearerToken);
      }
    },
    [user.bearerToken, logout]
  );

  const fetchUseCases = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (user.bearerToken) {
        fetchApiData("useCases", user.bearerToken)
          .then((data) => {
            resolve(data.map((d) => dataToOption("usecase", d)).sort((a, b) => a.label <= b.label ? -1 : 1));
          })
          .catch((err) => {
            handleFetchError(err);
            reject(err);
          });
      } else {
        reject(new Error("User not logged in"));
      }
    });
  }, [user.bearerToken, handleFetchError]);

  const fetchCountries = useCallback(() => {
    return new Promise((resolve, reject) => {
      const identifier = "countries";
      if (user.bearerToken) {
        fetchApiData(identifier, user.bearerToken)
          .then((data) => {
            resolve(data.map((d) => dataToOption(identifier, d)));
          })
          .catch((err) => {
            handleFetchError(err);
            reject(err);
          });
      } else {
        reject(new Error("User not logged in"));
      }
    });
  }, [user.bearerToken, handleFetchError]);

  const fetchOptions = useCallback(
    (identifier, sort = false) => {
      if (identifier === "useCases") return fetchUseCases();

      return new Promise((resolve, reject) => {
        if (user.bearerToken) {
          fetchData(identifier, user.bearerToken)
            .then((data) => {
                let options = data?.[identifier].map((d) => {
                  return dataToOption(identifier, d);
                });
                
                if (sort) {
                  options.sort((a, b) => 
                    a.label === "Unspecified" || a.label === "Other" ? 1 : (
                      b.label === "Unspecified" || b.label === "Other" ? -1 : (
                        a.label <= b.label ? -1 : 1
                      )
                    )
                  );
                }
                resolve(options);
            })
            .catch((err) => {
              handleFetchError(err);
              reject(err);
            });
        } else {
          reject(new Error("User not logged in"));
        }
      });
    },
    [user.bearerToken, handleFetchError, fetchUseCases]
  );

  const fetchLanguages = useCallback(() => {
    return fetchOptions("languages", true);
  }, [fetchOptions]);

  const fetchBusinessFundingStages = useCallback(() => {
    return fetchOptions("businessFundingStages");
  }, [fetchOptions]);

  // const fetchCountries = useCallback(() => {
  //   return fetchOptions("countries");
  // }, [fetchOptions]);

  const fetchBusinessGrowthStages = useCallback(() => {
    return fetchOptions("businessGrowthStages");
  }, [fetchOptions]);

  const fetchOrganisationTypes = useCallback(() => {
    return fetchOptions("organisationTypes", true);
  }, [fetchOptions]);

  const fetchSectors = useCallback(() => {
    return fetchOptions("sectors", true);
  }, [fetchOptions]);

  const fetchBusinessModels = useCallback(() => {
    return fetchOptions("businessModels", true);
  }, [fetchOptions]);

  const fetchChannels = useCallback(() => {
    return fetchOptions("channels", true);
  }, [fetchOptions]);

  const fetchTechnologies = useCallback(() => {
    return fetchOptions("technologies", true);
  }, [fetchOptions]);

  return {
    fetchOptions,
    fetchLanguages,
    fetchCountries,
    fetchBusinessFundingStages,
    fetchBusinessGrowthStages,
    fetchOrganisationTypes,
    fetchUseCases,
    fetchSectors,
    fetchBusinessModels,
    fetchChannels,
    fetchTechnologies,
  };
};

export default useOptions;
