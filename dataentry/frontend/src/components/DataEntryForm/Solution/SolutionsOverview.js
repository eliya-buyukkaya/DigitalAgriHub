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
import ItemActionsList from "../../List/ItemActionsList";

const MainContainer = styled.div``;

const SolutionsOverview = ({ solutions, deleteSolution, editSolution }) => {
  return (
    <MainContainer>
      <ItemActionsList
        items={solutions?.map((s) => ({ ...s, key: s.solutionId }))}
        editItem={editSolution}
        deleteItem={deleteSolution}
        emptyContent={
          <div style={{ fontStyle: "italic" }}>
            <p>
              The D4Ag solution(s) that are deployed and that users can register
              for and/or license.
            </p>
            <p>
              We define a solution as a product or service that utilises digital
              tools, digital channels, or digitally-enabled data analytics
              (e.g., machine learning, AI) to deliver information, advice,
              farming input linkages, market access, logistics support,
              financial services, and decision-making tools directly to
              smallholder farmers or other intermediaries of smallholder value
              chains, including extension agents, agro-dealers, agribusinesses,
              financial service providers and policymakers. This can be a
              solution that supports one or more use cases, a platform or a
              bundle of services.
            </p>
            <i>
              This organisation does not have any solutions yet, add one by
              clicking the button below.
            </i>
          </div>
        }
      />
    </MainContainer>
  );
};

export default SolutionsOverview;
