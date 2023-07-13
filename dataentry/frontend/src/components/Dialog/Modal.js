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
import MuiModal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ContentContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: #fff;
  border: 1px solid #000;
  box-shadow: 24px;
  padding: 32px;
  overflow-y: auto;
  max-height: 90%;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 4px;
  top: 4px;
`;

const Modal = ({ open, onClose, children, ...props }) => {
  return (
    <MuiModal {...{ open, onClose, ...props }}>
      <ContentContainer>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        {children}
      </ContentContainer>
    </MuiModal>
  );
};

export default Modal;
