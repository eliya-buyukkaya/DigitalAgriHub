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
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

const MainContainer = styled.div``;

const ActionContainer = styled.div`
  ${(props) => props.hidden && `visibility: hidden;`}
`;

const ListContainer = styled.div`
  padding: 2px 8px;
  border-bottom: 1px solid #aaa;
  /* cursor: pointer; */
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:first-child {
    border-top: 1px solid #aaa;
  }

  &:hover {
    background: #f9f9f9;
  }

  &:hover ${ActionContainer} {
    visibility: visible;
  }
`;

const ItemActionsList = ({
  items = null,
  deleteItem,
  editItem,
  emptyContent = null,
  customActions = [], // [{icon, action, tooltip}]
}) => {
  const hideActions = false;

  return (
    <MainContainer>
      {items?.length ? (
        items.map((item) => {
          return (
            <ListContainer
              key={item.key || item.name}
              // onClick={() => {
              //   editItem(item);
              // }}
            >
              {item.name}
              <ActionContainer hidden={hideActions}>
                {customActions.map((action, i) => (
                  <Tooltip
                    title={action.tooltip}
                    key={action.key || action.tooltip || i}
                    disableInteractive
                  >
                    <IconButton onClick={() => action.action(item)}>
                      {action.icon}
                    </IconButton>
                  </Tooltip>
                ))}
                {editItem && (
                  <Tooltip title="Edit" disableInteractive>
                    <IconButton
                      onClick={() => {
                        editItem(item);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {deleteItem && (
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => {
                        deleteItem(item);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </ActionContainer>
            </ListContainer>
          );
        })
      ) : items === null ? (
        <div>Loading...</div>
      ) : (
        emptyContent
      )}
    </MainContainer>
  );
};

export default ItemActionsList;
