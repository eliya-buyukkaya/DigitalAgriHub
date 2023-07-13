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
* @author Marlies de Keizer (marlies.dekeizer@wur.nl)
*/

/** Create a url parameter from the filters and get the solutions data. */
export const getSolutions = (filters = {}) => {
    let url = '/query?';
        
    for (const [key, values] of Object.entries(filters)) {
        if (key === 'countryRegions') {
            url += '';
        } else {
            url += key + '=';
        
            if (values.length > 0) {
                url += values.join();
            }    
        } 
        
        url += '&';
    }

    return getData(url);
}

/** Call the backend to find the list of values for an attribute indicated by its key. */
export const getPossibleValues = (key) => {
    return getData('/find/' + key);
}

/** Call the backend to find the url of Liferay. */
export const getLiferayUrl = () => {
    return getData('/find/url');
}

/** Call the backend to find the data for the solution indicated by its id. */
export const getSolution = (id) => {
    return getData('/find/solution?id=' + id);
}
    
/** Call the backend to get the data that is defined by the path, i.e. url and parameters. */
const getData = (path) => {
    return new Promise((resolve, reject) => {
        fetch('/dashboard/api' + path, {
            'method': 'GET'
        })
        .then((response) => {
            if (response.status === 200) {
                if (response.headers.get("content-type") === "application/json") {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                return [];
            }
        })
        .then((data) => resolve(data))
        .catch(reject);
    });
};

/** Transform the data so that it can be used for a chart.
 *  Input data is given as a list of map items with keys and values, output data is given as an array of keys and data values.
 *  If the option filled is true, the keys will be supplemented to make it a sequential list and empty data arrays will be added for the extra keys.
 *  If the option label has elements it will be used to update the keys.
 *  if the option top is larger than 0 the data will be truncated to only hold the top values.
*/
export const transposeData = (key, data, sortOn='key', filled=false, label=[], top=0) => {
    let sortedData = getSortedData(data, sortOn, top);
    let dataKeys = getDataKeys(sortedData, filled);
    let transposedData = {};
    transposedData[key] = (dataKeys.length > 0) ? getTransposedData(sortedData, dataKeys) : [];
    dataKeys = updateDataKeys(dataKeys, label);

    return [dataKeys, transposedData];
};

const getSortedData = (data, sortOn='key', top=0) => {
    let sortedData;

    if (sortOn === 'key') {
        sortedData = data.sort(function(a, b) {
            if ((String(b.key).indexOf('<') > 0) || (a.key === 'Other')) {
                return 1;
            } else {
                if ((String(a.key).indexOf('<') > 0) || (b.key === 'Other')) {
                    return -1;
                } else {
                    if  (a.key > b.key) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            }
        });
    } else {
        sortedData = data.sort((a, b) => b.value - a.value);
    }
    
    if (top > 0) {
        sortedData = sortedData.filter(item => item.key !== 'Other');
        sortedData = sortedData.slice(0, top);
    }

    return sortedData;
}

const getDataKeys = (data, filled) => {
    let dataKeys = data.map(item => item.key);
    
    if (dataKeys.length > 0) {
        if (filled) {
            let max = Math.max(...(dataKeys.map(el => parseInt(el))));
            dataKeys = [...Array(max + 1).keys()];
        }
    }

    return dataKeys;
}

const updateDataKeys = (dataKeys, label) => {
    if (label.length > 0) {
        dataKeys = dataKeys.map(value => value + " " + (value === 1 ? label[0] : label[1]));
    } else {
        dataKeys = dataKeys.map(value => truncateText(value, 40));
    }

    return dataKeys;
}

const getTransposedData = (data, dataKeys) => {
    return dataKeys.map(function(dataKey) {
        let index = 0;
        let item = data[0];
        
        while (item.key !== dataKey) {
            index++;

            if (index > data.length) {
                return 0;
            }

            item = data[index];
        }
        
        return item.value;
    });
}

/** The data values will be copied while all values for which the key is smaller than the startingKey are summed and inserted with the new key. */
export const aggregateFirstHalfOfData = (data, startingKey, newKey) => {
    let aggregatedFirstHalfOfData = {key: newKey, value: 0};
    let aggregatedData = [];
    let dataKeys = [];
    let maximum = startingKey;
    let dataKey;
    
    for (const item of data) {
        if (item.key <= startingKey) {
            aggregatedFirstHalfOfData.value += item.value;
        } else {
            aggregatedData.push(item);
            dataKeys.push(item.key);
            
            if (item.key > maximum) {
                maximum = item.key;
            }
        }
    }

    for (dataKey = parseInt(startingKey) + 1; dataKey <= parseInt(maximum); dataKey++) {
        if (!dataKeys.includes(dataKey)) {
            aggregatedData.push({key: dataKey, value: 0})
        }
    }
    
    aggregatedData.push(aggregatedFirstHalfOfData);

    return aggregatedData;
};

export const escapeHtml = (unsafe) => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 };
 
/** If the text is larger than the limit it is truncated up to the limit and three dots are added. */
export const truncateText = (text, limit) => {
    if (text) {
        if (text.length > limit) {
            return text.substr(0, limit) + "\u2026";
        } else {
            return text;
        }
    } else {
        return "";
    }
}

/** Format number text with comma's for 1000's and truncated to the given number of decimals */
export const formatNumberText = (text, decimals) => {
    if (text) {
        let number = parseFloat(text).toFixed(decimals);
        text = (number.toString() + '').replace(/(\..*)$|(\d)(?=(\d{3})+(?!\d))/g, (digit, fract) => fract || digit + ',');

        return text;
    } else {
        return "";
    }
}

/** Get the key for which the value is the maximum in the dictionary */
export const getMaximum = (dictionary) => {
    return dictionary.reduce(function (previous, current) {
        if (previous.key === 'Other') {
            return current;
        } else {
            if (current.key === 'Other') {
                return previous;
            } else {
                if (previous.value > current.value) {
                    return previous;
                } else {
                    return current;
                }
            }
        }
    });
}

export const translateDescriptions = (solution, language) => {
    if (hasTranslation(solution, language)) {
        solution.description = solution.translations.find(translation => {
            if (translation.language.id) {
                return translation.language.description.toLowerCase() === language;
            } else {
                return translation.language.toLowerCase() === language;        
            }
        }).translation;
    }
    
    if (hasTranslation(solution, language, true)) {
        solution.organisation.description = solution.organisation.translations.find(translation => translation.language.description.toLowerCase() === language).translation;
    }

    return solution;
}

export const hasTranslation = (solution, language, checkForOrganisation = false) => {
    if ((checkForOrganisation) && !(solution.organisation)) return false;
    
    if (checkForOrganisation) return ((solution.organisation.translations) && (solution.organisation.translations.some(translation => translation.language.description.toLowerCase() === language)));
    
    if (solution.translations) {
        let languages = solution.translations.map(translation => { 
            if (translation.language.id) {
                return translation.language.description.toLowerCase();
            } else {
                return translation.language.toLowerCase();            
            }
        });

        return (languages.includes(language));
    }
}
