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

import { OptionHeader, OptionExplanation } from "../../HelperText";

const helperTextObjects = {
  name: {
    text: "The name of the organisation that deploys the digital solution (so not necessarily the organisation that has developed the solution)",
  },
  url: {
    text: "The URL of the homepage of the organisation's primary website",
  },
  description: {
    text: "A short description of the organisation's mission and objectives with regard to digitalisation in agriculture.",
  },
  country: {
    text: "Country where the organisation headquarter is located.",
  },
  hqregion: {
    text: "The area within a country, e.g. a province, county or administrative area where the organisation headquarter is located.",
  },
  founded: {
    text: "The year in which the organisation was founded.",
  },
  organisationtype: {
    text: "The type of the organisation that deploys the solution and brings it on the market.",
    more: (
      <div>
        <OptionHeader>Agribusiness</OptionHeader>
        <OptionExplanation>
          Agribusiness is the group of industries dealing with agricultural
          produce and services required in farming.
        </OptionExplanation>

        <OptionHeader>Agritech</OptionHeader>
        <OptionExplanation>
          Agritech uses technology in agriculture, horticulture, and aquaculture
          with the aim of improving yield, efficiency, and profitability.
        </OptionExplanation>

        <OptionHeader>Commercial enterprise</OptionHeader>
        <OptionExplanation>
          Commercial enterprise means any for-profit activity formed for the
          ongoing conduct of lawful business.
        </OptionExplanation>

        <OptionHeader>Government</OptionHeader>
        <OptionExplanation>
          A government is the political system by which a country or community
          is administered and regulated.
        </OptionExplanation>

        <OptionHeader>Mobile Network Operator (MNO)</OptionHeader>
        <OptionExplanation>
          A mobile network operator (MNO) is a telecommunications service
          provider organization that provides wireless voice and data
          communication for its subscribed mobile users.
        </OptionExplanation>

        <OptionHeader>Non-Governmental Organization (NGO)</OptionHeader>
        <OptionExplanation>
          A Non-Governmental Organization (NGO) is a non-profit organization
          that operates independently of any government, typically one whose
          purpose is to address a social or political issue.
        </OptionExplanation>
      </div>
    ),
  },
  businessGrowthStage: {
    text: "The growth stage of the organisation deploying the digital solution as a measure of the maturity and potential sustainabilty of the organisation.",
    more: (
      <div>
        <OptionHeader>Pilot</OptionHeader>
        <OptionExplanation>
          Test the untested dynamics of the business.
        </OptionExplanation>
        <OptionHeader>Startup</OptionHeader>
        <OptionExplanation>
          Bring business idea to life, get business up and running.
        </OptionExplanation>
        <OptionHeader>Scaling</OptionHeader>
        <OptionExplanation>
          Business plan is paying off, revenue is increasing and market share
          and customer base are growing.
        </OptionExplanation>
        <OptionHeader>Sustaining</OptionHeader>
        <OptionExplanation>
          &ldquo;Business runs itself&rdquo;, strong presence in target market,
          strong cash flow and unlikely a startup or business with less
          experience can take over the company's position.
        </OptionExplanation>
      </div>
    ),
  },
  businessFundingStage: {
    text: "The funding stage of the organisation, defined as the investment round that the organisation is typically aiming at to search for investments and the associated typical size of invenstments (ticket size).",
    more: (
      <div>
        <OptionHeader>Pre-seed</OptionHeader>
        <OptionExplanation>
          Pre-seed refers to the period during which a company's founders are
          getting their operations off the ground, typically funding the company
          themselves or with help from family, friends and supporters.
        </OptionExplanation>
        <OptionExplanation>Average ticket sizes: $50K-150K</OptionExplanation>
        <OptionHeader>Seed</OptionHeader>
        <OptionExplanation>
          Seed funding represents the first official money that a company
          raises, helping it to finance market research and product development,
          employ a founding team and determine its target demographic.
          <br />
          Average ticket sizes: $150K-500K
        </OptionExplanation>
        <OptionHeader>Series A</OptionHeader>
        <OptionExplanation>
          In Series A funding, investors look out for companies with great ideas
          and a strong strategy for turning ideas into a successful,
          money-making business.
          <br />
          Average ticket sizes: $500K-2M
        </OptionExplanation>
        <OptionHeader>Series B</OptionHeader>
        <OptionExplanation>
          Series B rounds involve taking businesses to the next level, past the
          development stage, by expanding market reach.
          <br />
          Average ticket sizes: $2M-10M
        </OptionExplanation>
        <OptionHeader>Series C</OptionHeader>
        <OptionExplanation>
          Companies at Series C funding rounds are already quite successful, and
          would seek additional funding in order to help them develop new
          products, expand into new markets, or acquire other companies
          <br />
          Average ticket sizes: $10M+
        </OptionExplanation>
      </div>
    ),
  },
  // key: {
  //   text: "mainexplanation",
  //   more: (
  //     <div>
  //       <OptionHeader>header</OptionHeader>
  //       <OptionExplanation>explanation</OptionExplanation>
  //     </div>
  //   ),
  // },
};
export default helperTextObjects;
