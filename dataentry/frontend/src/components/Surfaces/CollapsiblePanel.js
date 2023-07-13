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

import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';



const CollapsiblePanel = ({title, startOpen, children}) => {
    const [open, setOpen] = useState(startOpen);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div>
            <div onClick={handleClick} style={{borderBottom: '1px solid #ccc'}}>
                {open ? <ExpandLess sx={{verticalAlign: 'middle'}}/> : <ExpandMore sx={{verticalAlign: 'middle'}}/>}
                {title}
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit sx={{marginLeft: 5}}>
                {children}
            </Collapse>
        </div>
    );
}

export default CollapsiblePanel;
