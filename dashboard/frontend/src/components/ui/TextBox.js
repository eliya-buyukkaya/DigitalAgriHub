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

export function TruncatedTextBox({ text, numberOfLines = 2 }) {
    let textContainerStyle = {
        height: 'calc(' + numberOfLines * 1.5 + 'em + 3px)'
    }
    let textContentStyle = {
        maxHeight: (numberOfLines + 1) * 1.5 + 'em'
    }
    let ellipsisStyle = {
        top: 'calc(' + (numberOfLines * 2) * 1.5 + 'em + 1px - 100%)'
    }
    
    return (
        <div className="text-container" style={textContainerStyle}>
            <span className="text-content" style={textContentStyle}>
                {text}
                <div class="ellipsis" style={ellipsisStyle}>...</div>
            </span>
        </div>                        
    );
}
