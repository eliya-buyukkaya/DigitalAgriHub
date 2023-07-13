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

import { useState } from "react";
import styled from "styled-components";
import TinyMCEEditor from "./TinyMCEEditor";
// import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
// import InputLabel from "@mui/material/InputLabel";
import { errorRed } from "../style";

const EditorWraper = styled.div`
  margin-bottom: 4px;
`;

/**
 * styling of content in public\tinymce.css
 * that way the styling is also applied while editing
 */

/**
 * styling copied from Material ui to be consistent with other inputs:
 */
const MainContainer = styled.div`
  position: relative;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.06);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  transition: background-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  margin-bottom: 1px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.09);
  }

  &:before {
    content: "\\00a0";
    color: green;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid ${" "}
      ${(props) => (props.error ? errorRed : "rgba(0, 0, 0, 0.42)")};
    pointer-events: none;
    transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }

  &:hover:before {
    border-bottom: 1px solid ${" "}
      ${(props) => (props.error ? errorRed : "rgba(0, 0, 0, 0.87)")};
  }

  &:focus {
    outline: none;
  }
`;

const FieldLabel = styled.div`
  margin: 8px 12px;
  color: ${(props) => (props.error ? errorRed : "rgba(0, 0, 0, 0.6)")};
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  font-size: 0.75rem;
  letter-spacing: 0.00938em;
`;

const ViewerContainer = styled.div.attrs({ className: "tinymce-content" })`
  background: #fff;
  margin: 4px;
  overflow: auto;
  cursor: text;
`;
/* &::after {
    content: "";
    clear: both;
    display: table;
  } */

const TinyMCEContent = ({
  value,
  onChange,
  editable = false,
  label,
  singleLineMarkup = false,
  required,
  error,
  helperText,
  tabIndex,
  ...props
}) => {
  const [editMode, setEditMode] = useState(false);

  const startEdit = () => {
    if (editable) {
      setEditMode(true);
    }
  };

  return (
    <div>
      <MainContainer
        error={error}
        {...props}
        // onClick={startEdit}
        tabIndex={tabIndex}
        onFocus={startEdit}
      >
        <FieldLabel error={error}>
          {label}
          {required && " *"}
        </FieldLabel>

        {editMode && (
          <EditorWraper>
            <TinyMCEEditor
              value={value}
              onChange={onChange}
              singleLineMarkup={singleLineMarkup}
              onBlur={(evt) => {
                evt.stopImmediatePropagation();
                setEditMode(false);
              }}
            />
          </EditorWraper>
        )}

        {!editMode && (
          <ViewerContainer>
            <div dangerouslySetInnerHTML={{ __html: value || "&nbsp;" }} />
          </ViewerContainer>
        )}
      </MainContainer>
      {helperText && (
        <FormHelperText sx={{ ml: "14px" }} error={error}>
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
};

export default TinyMCEContent;
