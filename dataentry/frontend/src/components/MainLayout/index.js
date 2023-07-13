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

import styled from "styled-components";
import Header from "./Header";

const MainContainer = styled.div`
  padding: 0 16px;
`;
const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0px auto;
`;
const MainLayout = ({ children, ...props }) => {
  return (
    <MainContainer {...props}>
      <Header />
      <ContentContainer>{children}</ContentContainer>
    </MainContainer>
  );
};

export default MainLayout;
