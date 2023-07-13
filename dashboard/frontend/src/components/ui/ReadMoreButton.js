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

import React, { useState } from "react";
import Button from 'react-bootstrap/Button';


/** ReadMoreButton splits a text based on the length prop, where the first part is always shown and the second part is toggled by the button
 * The text props can be a string or an array of strings. In case of an array the split is based on the first element in the array.
 * 
 * @param {object} props
 * @param {object} [props.text]
 * @param {string} [props.length]
 * @returns
** 
 */
const ReadMoreButton = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleOpen = () => { setIsOpen(!isOpen); };

    const getText = () => {
        if (Array.isArray(props.text)) {
            return isOpen ? props.text.map(text => <p key="readmore">{text}</p>) : props.text[0].slice(0, props.length);
        } else {
            return isOpen ? props.text : props.text.slice(0, props.length);
        }
    }
  
    return (
        <p sx={{display: "inline", width: "100%"}}>
            { getText() }
            { 
                props.text.length <= props.length ? "" : 
                <Button onClick={toggleOpen} sx={{ padding: -1 }} variant="light" size="sm">
                    { isOpen ? "<" : ">" }
                </Button>
            }                
        </p>
    );
};
  
export default ReadMoreButton;
