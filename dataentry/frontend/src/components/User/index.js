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

import { useEffect, useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { getKey } from '../../services/auth';
import Login from './Login';
import UserRegistration, { RegistrationConfirmation } from './UserRegistration';
import { ForgotPasswordForm, ResetPasswordForm } from './ChangePassword';


/** UserPage shows a login or registration form based on its props.
 * @param {object} props
 * @param {boolean} props.register
 * @param {boolean} props.confirm
*/
const User = (props) => {
    let page = <Login/>;
    let [key, setKey] = useState('');
    
    if (props.register) page = <UserRegistration/>;
    if (props.confirm) page = <RegistrationConfirmation token={props.confirm}/>;
    if (props.forgotpassword) page = <ForgotPasswordForm/>;
    if (props.resetpassword) page = <ResetPasswordForm token={props.resetpassword}/>;

    useEffect(() => {
        getKey().then((captchakey) => {
            setKey(atob(captchakey.captchaKey));
        });
    }, []);
    
    if (key === '') return null;

    return (
        <GoogleReCaptchaProvider reCaptchaKey={key}>
            { page }
        </GoogleReCaptchaProvider>
    );
}

export default User;
