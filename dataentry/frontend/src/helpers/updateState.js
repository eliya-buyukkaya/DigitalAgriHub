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

export function updateArray(immutableobjectArray, itemSelector, updateFunc) {
  let itemIndex = -1;
  if (typeof itemSelector === "function") {
    itemIndex = immutableobjectArray.findIndex(itemSelector);
  } else if (typeof itemSelector === "number") {
    itemIndex = itemSelector;
  }
  if (itemIndex < 0) {
    return immutableobjectArray;
  }
  return [
    ...immutableobjectArray.slice(0, itemIndex),
    updateFunc(immutableobjectArray[itemIndex]),
    ...immutableobjectArray.slice(itemIndex + 1),
  ];
}

export function removeFromObject(immutableObject, key) {
  const { [key]: removeItem, ...newState } = immutableObject;
  return newState;
}

export function filterObject(immutableObject, compareFunc) {
  Object.entries(immutableObject).reduce((prev, [key, value]) => {
    if (compareFunc(value, key)) {
      return { ...prev, [key]: value };
    }
    return prev;
  }, {});
}

export function updateEachObjectValue(immutableObject, updateFunc) {
  return Object.entries(immutableObject).reduce((prev, [key, value]) => {
    return { ...prev, [key]: updateFunc(value, key) };
  }, {});
}
