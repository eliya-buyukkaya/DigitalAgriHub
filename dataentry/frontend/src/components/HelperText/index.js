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

import styled from "styled-components";

const MoreLink = styled.a`
  text-decoration: underline;
  cursor: pointer;
  white-space: nowrap;
`;

export const PrimaryOptionHeader = styled.h3`
  margin-bottom: 1em;

  &:first-child {
    margin-top: 0;
  }
`;

export const OptionHeader = styled.h4`
  margin-bottom: 0.5em;

  &:first-child {
    margin-top: 0;
  }
`;

export const OptionExplanation = styled.p`
  margin-top: 0.5em;

  & + & {
    margin-bottom: 0.5em;
  }
`;

export const OptionExplanationExample = styled.p`
  margin-top: 0.25em;
  margin-bottom: 0.5em;
  font-size: 80%;
  font-style: italic;

  & + & {
    margin-bottom: 0.25em;
  }
`;

const HelperText = ({
  identifier,
  openPopup = (txt) => console.log(txt),
  helperTextObjects = {},
  moreLabel = "read more...",
}) => {
  const helpObject = helperTextObjects[identifier];
  if (!helpObject) {
    console.log("identifier:", identifier);
    return null;
  }
  if (!helpObject.more) {
    return helpObject.text;
  }

  return (
    <span>
      {helpObject.text}{" "}
      <MoreLink onClick={() => openPopup(helpObject.more)}>
        {moreLabel}
      </MoreLink>
    </span>
  );
};

export default HelperText;
