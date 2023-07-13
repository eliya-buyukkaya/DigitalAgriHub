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

import {
  validateString,
  validateInteger,
  validateSelect,
  validateBool,
  validateRange,
  validateUrl,
} from "../../../../helpers/validate";

export const boundsLaunch = { min: 1900, max: new Date().getFullYear() };
/**
 * 'parseField' validates and parses the input parameters
 * It converts the (form)values from the state to the values that are
 * needed for the api
 * ie. select options are stored in the state as objects: {label, value}
 * this function converts them to string or number as the backend expects
 *
 * If the validation fails the return object contains an error:
 * {error: "error message here"}
 * If the validation succeeds the return object contains the parsed value:
 * {value: "parsed value here"}
 *
 * Normally the fieldname is the key for the backend parameter too. If not or if
 * multiple backend values are filled from the same state parameter, the return
 * object has 'spread: true' to show that the output contains keys with values:
 * {
 *    value: { countries: [...], regions: [...], otherRegions: [...] },
 *    spread: true
 *  }
 */
const parseField = (fieldname, solution) => {
  switch (fieldname) {
    case "organisation": {
      const fieldValidation = validateSelect(solution[fieldname], false);
      if (!fieldValidation.valid) {
        // throw new Error(fieldValidation.message);
        return { error: fieldValidation.message };
      }
      return { value: fieldValidation.output };
    }
    case "name":
    case "description": {
      const fieldValidation = validateString(solution[fieldname], false);
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      return { value: fieldValidation.output };
    }
    case "url": {
      const fieldValidation = validateUrl(solution[fieldname], true);
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      return { value: fieldValidation.output };
    }
    case "launch": {
      const fieldValidation = validateInteger(
        solution[fieldname],
        true,
        false,
        false,
        boundsLaunch.min,
        boundsLaunch.max
      );
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      return { value: fieldValidation.output };
    }
    // case "sector": {
    //   const fieldValidation = validateSelect(solution[fieldname], false);
    //   if (!fieldValidation.valid) {
    //     return { error: fieldValidation.message };
    //   }
    //   return { value: fieldValidation.output };
    // }
    case "platform":
    case "bundling": {
      const fieldValidation = validateBool(solution[fieldname]);
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      return { value: fieldValidation.output };
    }
    case "primaryUseCase": {
      const fieldValidation = validateSelect(solution[fieldname], false);
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      if (!solution[fieldname].subUseCases?.length) {
        return { error: "Please select a sub use case" };
      }
      const subFieldValidation = validateSelect(
        solution[fieldname].subUseCases[0]
      );
      if (!subFieldValidation.valid) {
        return { error: subFieldValidation.message };
      }
      return {
        value: { primarysubusecase: subFieldValidation.output },
        spread: true,
      };
    }
    case "otherUseCases": {
      if (
        solution[fieldname] === "" ||
        solution[fieldname] === null ||
        typeof solution[fieldname] === "undefined"
      ) {
        return { value: [] };
      }
      if (!Array.isArray(solution[fieldname])) {
        return { error: "Wrong type, array expected" };
      }

      const subUseCases = [];
      for (const element of solution[fieldname]) {
        if (!element.subUseCases?.length) {
          return { error: "Please select a sub use case" };
        }
        const fieldValidation = validateSelect(element, false);
        if (!fieldValidation.valid) {
          return { error: fieldValidation.message };
        }
        for (const subUseCase of element.subUseCases) {
          const subUseCaseValidation = validateSelect(subUseCase, false);
          if (!subUseCaseValidation.valid) {
            return { error: subUseCaseValidation.message };
          }
          subUseCases.push(subUseCaseValidation.output);
        }
      }
      return { value: { subUseCases }, spread: true };
    }
    case "countries": {
      // if (
      //   solution[fieldname] === "" ||
      //   solution[fieldname] === null ||
      //   typeof solution[fieldname] === "undefined"
      // ) {
      //   return { value: [] };
      // }
      if (!Array.isArray(solution[fieldname])) {
        return { error: "Wrong type, array expected" };
      }
      const fieldValidation = validateSelect(solution[fieldname], false);
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      let countries = [];
      let regions = [];
      let otherRegions = [];
      for (const element of solution[fieldname]) {
        const fieldValidation = validateSelect(element, false);
        if (!fieldValidation.valid) {
          return { error: fieldValidation.message };
        }
        const countryValue = fieldValidation.output;
        countries.push(countryValue);

        if (element.regions?.length) {
          let countryCustomRegions = [];
          for (const region of element.regions) {
            if (region.custom) {
              countryCustomRegions.push(region.value);
            } else {
              const regionFieldValidation = validateSelect(region, false);
              if (!regionFieldValidation.valid) {
                return { error: regionFieldValidation.message };
              }
              regions.push(regionFieldValidation.output);
            }
          }
          if (countryCustomRegions.length) {
            otherRegions.push({
              country: countryValue,
              regions: countryCustomRegions,
            });
          }
        }
      }
      return { value: { countries, regions, otherRegions }, spread: true };
    }
    case "languages": {
      // if (
      //   solution[fieldname] === "" ||
      //   solution[fieldname] === null ||
      //   typeof solution[fieldname] === "undefined"
      // ) {
      //   return { value: [] };
      // }
      if (!Array.isArray(solution[fieldname])) {
        return { error: "Wrong type, array expected" };
      }
      const fieldValidation = validateSelect(solution[fieldname], false);
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      const languages = [];
      const otherLanguages = [];
      for (const element of solution[fieldname]) {
        if (element.custom) {
          const fieldValidation = validateString(element.value, false);
          if (!fieldValidation.valid) {
            return { error: fieldValidation.message };
          }
          otherLanguages.push(fieldValidation.output);
        } else {
          const fieldValidation = validateSelect(element, false);
          if (!fieldValidation.valid) {
            return { error: fieldValidation.message };
          }
          languages.push(fieldValidation.output);
        }
      }
      return { value: { languages, otherLanguages }, spread: true };
    }
    case "sectors":
    case "businessModels":
    case "channels":
    case "technologies": {
      // if (
      //   solution[fieldname] === "" ||
      //   solution[fieldname] === null ||
      //   typeof solution[fieldname] === "undefined"
      // ) {
      //   return { value: [] };
      // }
      if (!Array.isArray(solution[fieldname])) {
        return { error: "Wrong type, array expected" };
      }
      const fieldValidation = validateSelect(solution[fieldname], false);
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      const output = [];
      for (const element of solution[fieldname]) {
        const fieldValidation = validateSelect(element, false);
        if (!fieldValidation.valid) {
          return { error: fieldValidation.message };
        }
        output.push(fieldValidation.output);
      }
      return { value: output };
    }
    case "registeredusers": {
      const fieldValidation = validateInteger(
        solution[fieldname],
        false,
        true,
        true
      );
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      return { value: fieldValidation.output };
    }
    case "activeusers":
    case "shfusers":
    case "womenusers":
    case "youthusers": {
      const fieldValidation = validateInteger(
        solution[fieldname],
        true,
        false,
        true
      );
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      const registeredusers = validateInteger(
        solution.registeredusers,
        false,
        true,
        true
      );
      if (registeredusers.valid) {
        if (fieldValidation.output > registeredusers.output) {
          return { error: "Value cannot be larger than registered users!" };
        }
      }
      return { value: fieldValidation.output };
    }
    case "revenue": {
      const fieldValidation = validateInteger(
        solution[fieldname],
        false,
        true,
        true
      );
      if (!fieldValidation.valid) {
        return { error: fieldValidation.message };
      }
      return { value: fieldValidation.output };
    }
    case "yieldlowerbound": {
      const fieldValidation = validateRange(
        solution[fieldname],
        solution["yieldupperbound"]
      );
      return { value: fieldValidation.output };
    }
    case "yieldupperbound": {
      const fieldValidation = validateRange(
        solution[fieldname],
        solution["yieldlowerbound"]
      );
      return { value: fieldValidation.output };
    }
    case "incomelowerbound": {
      const fieldValidation = validateRange(
        solution[fieldname],
        solution["incomeupperbound"]
      );
      return { value: fieldValidation.output };
    }
    case "incomeupperbound": {
      const fieldValidation = validateRange(
        solution[fieldname],
        solution["incomelowerbound"]
      );
      return { value: fieldValidation.output };
    }
    default:
      return { value: solution[fieldname] };
  }
};

export default parseField;
