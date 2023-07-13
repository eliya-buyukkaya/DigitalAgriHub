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

/*
    form: 
const newOrganisation = {
    organisationId: null,
    name: "",
    url: "",
    description: "",
    hqcountry: null,
    hqregion: null,
    founded: "",
    businessFundingStage: "",
    organisationtype: "",
    businessGrowthStage: "",
  };

  =>

  api:{
  "name": "string",
  "description": "string",
  "url": "string",
  "founded": 0,
  "organisationtype": "string",
  "hqcountry": "string",
  "hqregion": "string",
  "businessFundingStage": "string",
  "businessGrowthStage": "string"
}
*/

const parseIntegerInput = (str) => {
  return parseInt(str, 10);
};
export const prepareOrganisationData = (formData) => {
  return {
    name: formData.name,
    description: formData.description,
    url: formData.url,
    founded: parseIntegerInput(formData.founded), // convert string to int
    organisationtype: formData.organisationtype?.value || "",
    hqcountry: formData.hqcountry?.value || "",
    hqregion: formData.hqregion?.value || "",
    businessFundingStage: formData.businessFundingStage?.value || "",
    businessGrowthStage: formData.businessGrowthStage?.value || "",
  };
};
