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

/** Default panels */

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';


/** Create a Container width a sticky left-side panel and a scrolling right-side panel. */
export function SidebarPanel({ children, widths = [] }) {
    return (
        <Container fluid className="h-100">
            <Row className="h-100">
                <Col sm={widths[0]} className="h-100">{ children[0] }</Col>
                <Col sm={widths[1]} className="h-100 overflow-scroll">{ children[1] }</Col>
            </Row>
        </Container>
    );
}

/** Create a div with a clickable header that (un)collapses the panel below it. */
export function UpDownPanel({ children, title }) {
    const [open, setOpen] = useState(true);

    return (
        <div style={{ padding: '1rem'}} className={open ? "collapse-heading open" : "collapse-heading closed"}>
            <Button
                onClick={() => setOpen(!open)}
                aria-controls="collapse-text"
                aria-expanded={open}
            >
                <span className="btn-text" style={{ width: 'fit-content', fontSize: 'var(--bs-btn-font-size)', marginBottom: '1rem'}}>{ title }</span>
                <span className="btn-icon">
                    {open ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                </span>
            </Button>
            <Collapse in={open}>
                <div id="collapse-text">
                    { children }
                </div>
            </Collapse>
        </div>
    );
}

/** Create a div with a shadow around it. */
export function ShadowPanel({ children }) {
    return (
        <div className="p-3 shadow-panel">
            { children }
        </div>
    );
}
