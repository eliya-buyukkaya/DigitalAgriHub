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

/** Function to make the font size of a react element resize with the screensize.
 * Kompressor is a factor to define how 'aggressive' the resizing should be (> 1 means more aggressive resizing, < 1 means less aggressive resizing). 
 * The options can contain a minFontSize and maxFontSize to limit the resizing.
 * 
 * Adapted from https://github.com/davatron5000/FitText.js
 */
export const fitText = (element, kompressor, options) => {
    let addEvent = function(el, type, fn) {
        if (el.addEventListener)
            el.addEventListener(type, fn, false);
        else
            el.attachEvent('on' + type, fn);
    };
  
    let extend = function(obj, ext) {
        for (let key in ext) {
            if(ext.hasOwnProperty(key)) {
                obj[key] = ext[key];
            }
        }
  
        return obj;
    };
  
    let settings = extend({'minFontSize' : -1/0, 'maxFontSize' : 1/0}, options);

    let fit = function(id) {
        let compressor = kompressor || 1;

        let resizer = function() {
            let el = document.getElementById(id);

            if (el) {
              el.style.fontSize = Math.max(Math.min(el.parentElement.clientWidth / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
            }
        };

        resizer();
                
        addEvent(window, 'resize', resizer);
        addEvent(window, 'orientationchange', resizer);
    };

    if (element.length) {
        for (let subelement of element) {
            fit(subelement.props.id);
        }
    } else {
        fit(element.props.id);
    }

    return element;
};
