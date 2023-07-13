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

export const isset = (value) => {
  return !(value === null || typeof value === "undefined");
};

export const validateString = (value, allowEmpty = true, trim = true) => {
  if (typeof value !== "string") {
    return { message: "Wrong type", valid: false, output: null };
  }
  let output = value.trim();
  if (!allowEmpty && value === "") {
    return { message: "Empty string not allowed.", valid: false, output: null };
  }
  return { valid: true, output, message: "" };
};

// export const validateNumber = (value, positive = false, allowZero = true) => {
//   // we only process strings!
//   if (typeof value !== "string") {
//     return { message: "Wrong type", valid: false, output: null };
//   }
//   let output = value;
//   try {
//     output = parseFloat(value);
//     valid =
//       !isNaN(value) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
//       !isNaN(output); // ...and ensure strings of whitespace fail
//   } catch (error) {
//     return { message: "Not a valid number", valid: false, output: null };
//   }

//   return { valid: true, output, message: "" };
// };

// @todo disallow fractions ie 0.8
export const validateInteger = (
  value,
  positive = false,
  allowZero = true,
  allowEmpty = false,
  min,
  max
) => {
  // we only process strings!
  if (typeof value !== "string") {
    return { message: "Wrong type", valid: false, output: null };
  }
  const invalid = { message: "Not a valid number", valid: false, output: null };

  let output = value;
  if (isNaN(value)) return invalid;

  if (allowEmpty && value.trim() === "") {
    return { valid: true, output: null, message: "" };
  }

  try {
    output = parseInt(value, 10);
  } catch (error) {
    return invalid;
  }
  if (isNaN(output)) return invalid;

  if (positive && output < 0)
    return { message: "Must be a positive number", valid: false, output: null };
  if (!allowZero && output === 0)
    return { message: "Zero is not allowed", valid: false, output: null };

  if (isset(min) && output < min) {
    return {
      message: `Value cannot be smaller than ${min}`,
      valid: false,
      output: null,
    };
  }
  if (isset(max) && output > max) {
    return {
      message: `Value cannot be exceed ${max}`,
      valid: false,
      output: null,
    };
  }
  return { valid: true, output, message: "" };
};

export const validateRange = (value, otherValue) => {
  let output = parseInt(value, 10);

  if (value === "0" && otherValue === "0") {
    output = null;
  }

  return { valid: true, output, message: "" };
};

export const validateSelect = (value, allowEmpty = true) => {
  const isEmpty = {
    message: allowEmpty ? "" : "Please select an option",
    valid: allowEmpty,
    output: null,
  };
  if (typeof value === "object") {
    if (!value) return isEmpty;
    if (!value.hasOwnProperty("value")) {
      if (Array.isArray(value))
        if (value.length === 0) return isEmpty;
        else return { valid: true, output: value.value, message: "" };
      return { message: "Invalid format", valid: false, output: null };
    }
    return { valid: true, output: value.value, message: "" };
  }
  if (!value && value !== 0) {
    return isEmpty;
  }
  return { valid: true, output: value, message: "" };
};

export const validateBool = (value, allowEmpty = true, emptyValue = 0) => {
  if (value === "" || value === null || typeof value === "undefined") {
    return {
      message: allowEmpty ? "" : "Please select an option",
      valid: allowEmpty,
      output: emptyValue,
    };
  }
  if (value === false || value === 0 || value === "0") {
    return {
      message: "",
      valid: true,
      output: 0,
    };
  }
  if (value === true || value === 1 || value === "1") {
    return {
      message: "",
      valid: true,
      output: 1,
    };
  }
  return { valid: false, output: value, message: "Invalid value" };
};

function validURL(myURL) {
  // https://www.tutorialspoint.com/How-to-validate-URL-address-in-JavaScript
  // var pattern = new RegExp(
  //   "^(https?://)?" + // protocol
  //     "((([a-zd]([a-zd-]*[a-zd])*).?)+[a-z]{2,}|" + // domain name
  //     "((d{1,3}.){3}d{1,3}))" + // ip (v4) address
  //     "(:d+)?(/[-a-zd%_.~+]*)*" + //port
  //     "(?[;&amp;a-zd%_.~+=-]*)?" + // query string
  //     "(#[-a-zd_]*)?$",
  //   "i"
  // );

  // https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php
  const pattern =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return pattern.test(myURL);
}

export const validateUrl = (value) => {
  const strValidation = validateString(value, false);
  if (!strValidation.valid) {
    return strValidation;
  }

  const stringValue = strValidation.output;

  let url;
  try {
    url = new URL(stringValue);
  } catch (err) {
    return {
      valid: false,
      output: value,
      message: `Value is not a valid url. ${err.message}`,
    };
  }

  if (!(url.protocol === "http:" || url.protocol === "https:")) {
    return {
      valid: false,
      output: value,
      message: `Url has no valid protocol, should start with 'http://'  or 'https://`,
    };
  }

  if (!validURL(stringValue)) {
    return {
      valid: false,
      output: value,
      message: `Value is not a valid url.`,
    };
  }

  // if (!stringValue.match(/.\../g)) {
  //   return {
  //     valid: false,
  //     output: value,
  //     message: `Value is not a valid url, should contain a top-level domain eg. ".com" or ".org"`,
  //   };
  // }

  return {
    message: "",
    valid: true,
    output: stringValue,
  };
};
