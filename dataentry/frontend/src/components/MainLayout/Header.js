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

import { useAuth } from "../../context/Auth";
import styled from "styled-components";
import { Button } from "@mui/material";


const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 10px auto;
  min-height: 50px;
`;
const HeaderLabel = styled.div`
  margin-left: 20px;
  margin-right: 10px;
  margin-top: 8px;
  float: left;
  font-size: 14px;
`;

const Header = () => {
  const auth = useAuth();

  return (
    <HeaderContainer>
      <HeaderLabel>{auth.user?.email}</HeaderLabel>
      {auth.user && <Button onClick={auth.logout} sx={{ borderRadius: 4, fontSize: "12px" }} variant="outlined">Logout</Button>}

    </HeaderContainer>
  );
};

export default Header;
