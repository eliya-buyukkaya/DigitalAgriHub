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
* @author Marlies de Keizer (marlies.dekeizer@wur.nl)
* @author Eliya Buyukkaya (eliya.buyukkaya@wur.nl)
*/

import { useState, useEffect, useCallback } from "react";
import Alert from "@mui/material/Alert";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import { useAuth } from "../../context/Auth";
import { checkRegistration, getPotentialSolutions } from "../../services/auth";
import Panel, { PanelHeader } from "../Surfaces/Panel";
import Button from "../Button";
import TextField from "../Input/TextField";
import FieldGroup from "../Input/FieldGroup";
import { checkPassword } from "../../services/util";
import Checkbox from "../Input/Checkbox";
import CollapsiblePanel from "../Surfaces/CollapsiblePanel";


/** UserRegistration constructs a form to register for the website and redirects to the login page after registration */
const UserRegistration = (props) => {
    const [token, setToken] = useState();
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const [formState, setFormState] = useState({ 
        name: "", 
        email: "", 
        company: "", 
        website: "", 
        password: "", 
        matchingPassword: "", 
        solutions: [],
        comments: "",
        verified: false 
    });
    const [solutions, setSolutions] = useState(null);
    const [busy, setBusy] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [alertState, setAlertState] = useState({ message: null, severity: "error" });
    const auth = useAuth();
    const showError = (msg) => setAlertState({ message: msg, severity: "error" });

    const onVerify = useCallback((token) => {
        setToken(token);
    }, [setToken]);

    const getChangeHandler = (parameter) => (event) => {
        const value = event.target.value;
        setFormState((prev) => ({ ...prev, [parameter]: value }));
    };

    const checkSolutions = () => {
        setAlertState({ message: null });

        if ((formState.company !== '') && (formState.email !== '')) {
            getPotentialSolutions(formState.company, formState.email)
            .then(data => {
                if (data.length > 0) {
                    let solutionsPerOrganisation = {};
                    data.forEach(item => {
                        if (!solutionsPerOrganisation[item.organisationname]) solutionsPerOrganisation[item.organisationname] = [];
                        solutionsPerOrganisation[item.organisationname].push({id: item.id, name: item.name});
                    });
                    setSolutions(solutionsPerOrganisation);
                } else {
                    setSolutions(null);
                }
            })
            .catch((error) => {
                console.log(error);
                setSolutions(null);

                if (error.message.includes('Email not valid')) {
                    showError('You have not entered a valid email-address');
                }
            });
        } else {
            setSolutions(null);
        }
    };

    const handleCheckbox = (solutionId) => (checked) => {
        if (checked) {
            setFormState((prev) => ({ ...prev, solutions: [ ...prev.solutions, solutionId ] }));
        } else {
            setFormState((prev) => ({ ...prev, solutions: prev.solutions.filter((id) => id !== solutionId) }));
        }
    };

    const handleRegistration = () => {
        setAlertState({ message: null });

        let error = checkPassword(formState.password);
    
        if ((!formState.name) || (formState.name === '')) {
            showError('You have not entered your name');
        } else if ((!formState.company) || (formState.company === '')) {
            showError('You have not entered your company.');
        } else if ((!formState.email) || (formState.email === '')) {
            showError('You have not entered your email-address.');
        } else if ((!formState.password) || (formState.password === '')) {
            showError('You have not entered a password');
        } else if (error) {
            showError(error);
        } else if ((!formState.matchingPassword) || (formState.matchingPassword === '')) {
            showError('You have not entered a password for the second time');
        } else if (formState.password !== formState.matchingPassword) {
            showError('The two passwords do not match');
        } else {
            setBusy(true);
            auth
            .register(formState, token)
            .then(() => setRegistered(true))
            .catch((err) => {
                console.log(err.message);
                setRegistered(false);
                if (err.message.includes("ReCaptcha")) {
                    showError("There is an issue with Google Captcha. This is due to the combination of username and password. Please try again with a safer password.");
                } else if (err.message.includes("already in use")) {
                    showError('This user already exists.');
                } else {
                    showError('The user could not be registered.');
                }

                console.error(err);
            })
            .finally(() => {
                setBusy(false);
                setRefreshReCaptcha(refreshed => !refreshed);
            });
        }
    };

    if (registered) {
        return (
            <Panel centered="true" width="800px">
                <PanelHeader>Confirmation registration</PanelHeader>
                <div style={{ marginTop: 16 }}>
                    <p>You are registered for the Data Entry application of the Digital AgriHub.</p>
                    <p>To complete your registration you need to confirm your email address. An email is sent to the provided email address with a confirmation link. <b>This link will be valid for 24 hours.</b></p>
                </div>
            </Panel>
        );
    }

    return (
        <Panel centered="true" width="800px">
            <PanelHeader>Registration</PanelHeader>
            <FieldGroup flexDirection="column">
                <TextField
                    label={'your name'}
                    value={formState.name}
                    onChange={getChangeHandler("name")}
                    color="primary"
                    required
                />
                <TextField
                    label={'your organisation'}
                    value={formState.company}
                    onChange={getChangeHandler("company")}
                    onBlur={checkSolutions}
                    color="primary"
                    required
                />
                <TextField
                    label={'your email address'}
                    value={formState.email}
                    onChange={getChangeHandler("email")}
                    onBlur={checkSolutions}
                    type="email"
                    color="primary"
                    required
                />
                <TextField
                    label={'your personal website'}
                    value={formState.website}
                    onChange={getChangeHandler("website")}
                    color="primary"
                />
                <TextField
                    label={'your password'}
                    value={formState.password}
                    onChange={getChangeHandler("password")}
                    type="password"
                    color="primary"
                    required
                />
                <TextField
                    label={'confirm password'}
                    value={formState.matchingPassword}
                    onChange={getChangeHandler("matchingPassword")}
                    type="password"
                    color="primary"
                    required
                />
                { solutions ? [
                    <div key='found'>We have digital solutions on the Digital AgriHub that might be developed by your organisation.</div>,
                    <div key='check'>Please check the solutions that you think are yours (you can leave everything unchecked if you want to add new solutions).</div>,
                    <div key='note'><i>NB: If you are not sure whether the solution is yours, you can click on the link to get more information. You can also add comments below.</i></div>,
                    Object.keys(solutions).map((organisation, index) => (
                        <CollapsiblePanel key={organisation} title={organisation} startOpen={index === 0}>
                            {
                            solutions[organisation].map(solution => (
                                <div key={solution.id}>
                                    <Checkbox
                                        label={<a href={'https://digitalagrihub.org/solution-details?solutionid=' + solution.id} target='_blank'>{solution.name}</a>}
                                        key={solution.id}
                                        onChange={handleCheckbox(solution.id)}
                                        value={formState.solutions.filter(id => id === solution.id).length > 0}
                                    />
                                </div>
                            ))
                            }
                        </CollapsiblePanel>
                    ))
                ]
                    : ""
                }
                <TextField
                    label={'any remarks'}
                    multiline
                    minRows={2}
                    value={formState.comments}
                    onChange={getChangeHandler("comments")}
                    color="primary"
                />
            </FieldGroup>

            {alertState?.message && (<Alert severity={alertState.severity}>{alertState.message}</Alert>)}

            <div style={{ marginTop: 16 }}>
                <GoogleReCaptcha onVerify={onVerify} refreshReCaptcha={refreshReCaptcha}/>                
                
                <Button color="primary" disabled={busy} onClick={handleRegistration}>
                    Register
                </Button>
                <a style={{ marginLeft: 16 }} href='#/user/login'>Login</a>
            </div>
        </Panel>
    );
};

/** ConfirmRegistrationForm constructs a page to confirm the registration of a user */
export const RegistrationConfirmation = (props) => {
    const [confirmed, setConfirmed] = useState(false);
    const [alertState, setAlertState] = useState({ message: null, severity: "error" });
    const showError = (msg) => setAlertState({ message: msg, severity: "error" });
    
    useEffect(() => {
        setConfirmed(true);
        checkRegistration(props.token).then((data) => {
            if (data.value) {
                showError(null);
                setConfirmed(true);
            } else {
                showError('Your registration could not be confirmed, try again later.');
                setConfirmed(false);
            }
        }).catch((err) => {
            if (err.message.includes("expired")) {
                showError('Your registration can not be confirmed, the link you used is expired.');
            } else {
                showError('Your registration can not be confirmed, the link you used is invalid.');
            }
        });
    }, [ props.token ]);

    return (
        <Panel centered="true" width="800px">
            <PanelHeader>Confirmation registration</PanelHeader>

            {alertState?.message && (<Alert severity={alertState.severity}>{alertState.message}</Alert>)}

            { confirmed ?
            <div style={{ marginTop: 16 }}>
                <p>You have confirmed your registration for the Data Entry application of the Digital AgriHub.</p>
                <List>
                    <ListItem style={{ padding: 2 }}>
                        <ListItemIcon><KeyboardDoubleArrowRightIcon/></ListItemIcon>
                        <ListItemText 
                            primary='If you have indicated in the registration process, that solutions currently on the Digital AgriHub are yours.'
                            primaryTypographyProps={{ style: { fontWeight: 'bold'} }}
                        />
                    </ListItem>
                    <ListItem style={{ padding: 2 }}>
                        <ListItemText 
                            inset 
                            primary='The existing solutions will be connected to your account and you will receive an e-mail once this is processed.
                                After that you can login and update your organisation or update and add digital solutions.'
                        />
                    </ListItem>                            
                    <ListItem style={{ padding: 2 }}>
                        <ListItemIcon><KeyboardDoubleArrowRightIcon/></ListItemIcon>
                        <ListItemText 
                            primary='If you have not indicated any solutions to be yours in the registration process.'
                            primaryTypographyProps={{ style: { fontWeight: 'bold'} }}
                        />
                    </ListItem>                            
                    <ListItem style={{ padding: 2 }}>
                        <ListItemText inset>
                            <a href='#/user/login'>Login</a> to get started with updating or adding your organisation and digital solutions.
                        </ListItemText>
                    </ListItem>                            
                </List>
            </div>
            : ""}
        </Panel>
    );
};

export default UserRegistration;
