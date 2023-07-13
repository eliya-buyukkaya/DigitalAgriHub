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

import { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import { useAuth } from "./context/Auth";
import MainLayout from "./components/MainLayout";
import DataEntryForm from "./components/DataEntryForm";
import { GlobalStyle, muiTheme } from "./theme/theme";
import User from "./components/User";
import { getSettings } from "./services/auth";

function App() {
  const auth = useAuth();
  const [params] = useSearchParams();
  const [registrationEnabled, setRegistrationEnabled] = useState(false);

  useEffect(() => {
      getSettings().then((data) => setRegistrationEnabled(data.value));
  }, []);

  let pageContent = null;

  if (!auth?.user) {
    pageContent = <User />;
  } else {
    pageContent = <DataEntryForm />;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <GlobalStyle />
      <MainLayout>
        <Routes>
          <Route path="/user/login" element={<User/>} />
            { registrationEnabled ? <Route path="/user/register" element={<User register/>} /> : ""}
            { registrationEnabled ? <Route path="/user/confirm" element={<User confirm={params.get("token")}/>} /> : ""}
            { registrationEnabled ? <Route path="/user/forgot" element={<User forgotpassword/>} /> : ""}
            { registrationEnabled ? <Route path="/user/reset" element={<User resetpassword={params.get("token")}/>} /> : ""}
          <Route path="/" element={pageContent}></Route>
        </Routes>
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
