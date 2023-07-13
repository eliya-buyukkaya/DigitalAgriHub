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

/* Check password on:
- length between 8 and 32 characters
- at least one upper-case character
- at least one lower-case character
- at least one digit character
- at least one symbol (special character)
- some illegal sequences that will fail when >= 5 chars long alphabetical is of the form 'abcde', numerical is '34567', qwery is 'asdfg'*/
export function checkPassword(password) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "1234567890";
    const qwerty = "qwertyuiopasdfghjklzxcvbnm";
    
    if ((password.length < 8) || (password.length > 32)) {
        return 'Your password needs to be between 8 and 32 characters long';
    } else if (password.toUpperCase() === password) {
        return 'Your password should contain at least one lowercase letter';
    } else if (password.toLowerCase() === password) {
        return 'Your password should contain at least one uppercase letter';
    } else if (password.replaceAll(" ", "") !== password) {
        return 'Your password can not contain white spaces';
    } else if (!/\d/.test(password)) {
        return 'Your password should contain at least one number';
    } else if (!specialChars.test(password)) {
        return 'Your password should contain at least one special character';
    } else if (!checkSequences(alphabet, password)) {
        return 'Your password can not have more than 4 letters in alphabetical order';
    } else if (!checkSequences(numbers, password)) {
        return 'Your password can not have more than 4 sequential numbers';
    } else if (!checkSequences(qwerty, password)) {
        return 'Your password can not have more than 4 letters that are sequential on a QWERTY keyboard';
    }

    return null;
}

/* Check if a text occurs as a consecutive sequence in the list of characters  */
function checkSequences(listOfCharacters, text) {
    for (let i  = 0; i < listOfCharacters.length - 5; i++) {
        if (text.toLowerCase().includes(listOfCharacters.substring(i, i + 5))) {
            return false;
        }
    }

    return true;
}
