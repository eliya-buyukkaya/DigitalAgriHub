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
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Alert from "@mui/material/Alert";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/Auth";
import Panel, { PanelHeader } from "../Surfaces/Panel";
import TextField from "../Input/TextField";
import Button from "../Button";
import FieldGroup from "../Input/FieldGroup";
import { getSettings } from "../../services/auth";


const Login = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [registrationEnabled, setRegistrationEnabled] = useState(false);
    const [formState, setFormState] = useState({ email: "", password: "" });
    const [busy, setBusy] = useState(false);
    const [alertState, setAlertState] = useState({ message: null, severity: "error" });
    const auth = useAuth();
  
    useEffect(() => {
        getSettings().then((data) => setRegistrationEnabled(data.value));        
    }, [ setRegistrationEnabled ]);

    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) return;
  
        const captchaToken = await executeRecaptcha('login');
        return captchaToken;
    }, [ executeRecaptcha ]);

    if (auth.user?.bearerToken) return <Navigate to={'/'} replace/>;

    const showError = (msg) => setAlertState({ message: msg, severity: "error" });

    const getChangeHandler = (parameter) => (ev) => {
        const value = ev.target.value;
        setFormState((prev) => ({ ...prev, [parameter]: value }));
    };

    const handleLogin = () => {
        setAlertState({ message: null });
        
        if (!formState.email) {
            showError("Please enter your email");
        } else if (!formState.password) {
            showError("Please enter your password");
        } else {
            setBusy(true);
            handleReCaptchaVerify().then((token) => {
                auth.login(formState.email, formState.password, token)
                .catch((err) => {
                    if (err.message.includes("Bad credentials")) {
                        showError("The username and/or password is not correct.");
                    } else if (err.message.includes("not found")) {
                        showError("The username is not connected to an account.");
                    } else if (err.message.includes("disabled")) {
                        showError("You haven't confirmed your registration.");
                    } else if (err.message.includes("is locked")) {
                        showError("Account is being processed.");
                    } else {
                        showError("Unable to log in");
                    }

                    console.error(err);
                })
                .finally(() => {
                    setBusy(false);   
                });
            })
            .catch((err) => {
                showError("There is an issue with Google Captcha, please try again.");
                console.error(err);
                setBusy(false);   
            });
        };
    }

    return (
        <Panel>
            <PanelHeader>Login</PanelHeader>
            <FieldGroup>
                <TextField
                    label="email"
                    value={formState.email}
                    onChange={getChangeHandler("email")}
                />
                <TextField
                    label="password"
                    value={formState.password}
                    onChange={getChangeHandler("password")}
                    type="password"
                />
            </FieldGroup>
            
            {alertState?.message && (<Alert severity={alertState.severity}>{alertState.message}</Alert>)}
      
            <div style={{ marginTop: 16 }}>
                <Button disabled={busy} onClick={handleLogin}>
                    login
                </Button>
                { 
                    registrationEnabled ? 
                    [
                        <a key='forgotten' style={{ marginLeft: 16 }} href='#/user/forgot'>Forgot your password?</a>,
                        <a key='register' style={{ marginLeft: 16 }} href='#/user/register'>Register</a>
                    ] : ""
                }
            </div>
        </Panel>
    );
};

export default Login;
