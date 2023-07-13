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

import { useState, useCallback } from "react";
import Alert from "@mui/material/Alert";
import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { useAuth } from "../../context/Auth";
import Panel, { PanelHeader } from "../Surfaces/Panel";
import TextField from "../Input/TextField";
import Button from "../Button";
import FieldGroup from "../Input/FieldGroup";
import { checkPassword } from "../../services/util";


/** ForgotPasswordForm constructs a form to enter an email-adress to ask for a reset */
export const ForgotPasswordForm = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [formState, setFormState] = useState({ email: "" });
    const [busy, setBusy] = useState(false);
    const [alertState, setAlertState] = useState({ message: null, severity: "error" });
    const auth = useAuth();
  
    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) return;
  
        const captchaToken = await executeRecaptcha('login');
        return captchaToken;
    }, [executeRecaptcha]);
  
    if (auth.user && auth.user.bearerToken) {
        return <Navigate to='/' replace/>;
    }

    const showError = (msg) => setAlertState({ message: msg, severity: "error" });

    const getChangeHandler = (parameter) => (event) => {
        const value = event.target.value;
        setFormState((prev) => ({ ...prev, [parameter]: value }));
    };

    const handleSubmit = () => {
        if (!formState.email) {
            showError('You have not entered your email-address.');
        } else {
            setBusy(true);
            handleReCaptchaVerify().then((token) => {
                auth.
                forgotPassword(formState.email, token)
                .then(() => {
                    setAlertState({ message: 'Password reset link sent.', severity: "success" });
                })
                .catch((err) => {
                    if (err.message.includes("Bad credentials")) {
                        showError('The email-address you entered is not registered at Digital AgriHub.');
                    } else {
                        showError('We could not sent an email to the given email-address. Please check the address or try again later.');
                    }

                    console.error(err);
                })
                .finally(() => {
                    setBusy(false);   
                });
            })
            .catch((err) => {
                showError('We could not reset your password.');
                setBusy(false);   
            });
        }
    }
        
    return (
        <Panel centered="true" width="500px">
            <PanelHeader>Forgot password</PanelHeader>
            <Box sx={{ mt: 3, mb: 4 }}>Enter the email address associated with your Digital AgriHub account. We will sent you a link with which you can reset
                your password.</Box>
            <FieldGroup flexDirection="column">
                <TextField
                    label="your email address"
                    value={formState.email}
                    onChange={getChangeHandler("email")}
                    color="primary"
                />
            </FieldGroup>

            {alertState?.message && (<Alert severity={alertState.severity}>{alertState.message}</Alert>)}

            <div style={{ marginTop: 16 }}>
                <Button color="primary" disabled={busy} onClick={handleSubmit}>
                    Send link
                </Button>
                <a style={{ marginLeft: 16 }} href='#/user/login'>Login</a>
            </div>
        </Panel>
    );
};

/** ResetPasswordForm constructs a form to enter a password for actual resetting */
export const ResetPasswordForm = (props) => {
    const [token, setToken] = useState();
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const [formState, setFormState] = useState({ password: "", matchingPassword: "", verified: false });
    const [busy, setBusy] = useState(false);
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

    const handleReset = () => {
        setAlertState({ message: null });

        let error = checkPassword(formState.password);
    
        if (!formState.password) {
            showError('You have not entered a password');
        } else if (error) {
            showError(error);
        } else if (!formState.matchingPassword) {
            showError('You have not entered a password for the second time');
        } else if (formState.password !== formState.matchingPassword) {
            showError('The two passwords do not match');
        } else {
            setBusy(true);
            auth
            .resetPassword(formState.password, formState.matchingPassword, props.token, token)
            .then(() => {
                setAlertState({ message: 'Your password is reset.', severity: "success" });
            })
            .catch((err) => {
                if (err.message.includes("Invalid token")) {
                    showError('The link you have used for changing your password is not valid.');
                } else {
                    showError(err.message);
                }

                console.error(err);
            })
            .finally(() => {
                setBusy(false);
                setRefreshReCaptcha(refreshed => !refreshed);
            });
        }
    };

    return (
        <Panel centered="true" width="800px">
            <PanelHeader>Change password</PanelHeader>
            <FieldGroup flexDirection="column">
                <TextField
                    label="your password"
                    value={formState.password}
                    onChange={getChangeHandler("password")}
                    type="password"
                    color="primary"
                />
                <TextField
                    label="confirm password"
                    value={formState.matchingPassword}
                    onChange={getChangeHandler("matchingPassword")}
                    type="password"
                    color="primary"
                />
            </FieldGroup>

            {alertState?.message && (<Alert severity={alertState.severity}>{alertState.message}</Alert>)}

            <div style={{ marginTop: 16 }}>
                <GoogleReCaptcha onVerify={onVerify} refreshReCaptcha={refreshReCaptcha}/>
                <Button color="primary" disabled={busy} onClick={handleReset}>
                    Send
                </Button>
                <a style={{ marginLeft: 16 }} href='#/user/login'>Login</a>
            </div>
        </Panel>
    );
};
