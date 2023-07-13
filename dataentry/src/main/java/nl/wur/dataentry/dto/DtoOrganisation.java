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
* @author Eliya Buyukkaya (eliya.buyukkaya@wur.nl)
*/

package nl.wur.dataentry.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import nl.wur.dataentry.validation.ValidUrl;
import nl.wur.dataentry.validation.ValidYear;

@Data
@NoArgsConstructor
@ToString
public class DtoOrganisation {
    private Integer id;
    private @NotNull String name;
    private String description;
    private @NotNull @ValidUrl String url;
    private @ValidYear Integer founded;
    private @NotNull Integer organisationtype;
    private @NotNull String hqcountry;
    private @NotNull Integer hqregion;
    private @NotNull Integer businessFundingStage;
    private @NotNull Integer businessGrowthStage;
    private List<DtoTranslation> translations;

    public DtoOrganisation(Integer id, @NotNull String name, String description, @NotNull String url, Integer founded,
            @NotNull Integer organisationtype, @NotNull String hqcountry, @NotNull Integer hqregion,
            @NotNull Integer businessFundingStage, @NotNull Integer businessGrowthStage,
            List<DtoTranslation> translations) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = (url.startsWith("http://") || url.startsWith("https://")) ? url : "http://" + url;
        this.founded = founded;
        this.organisationtype = organisationtype;
        this.hqcountry = hqcountry;
        this.hqregion = hqregion;
        this.businessFundingStage = businessFundingStage;
        this.businessGrowthStage = businessGrowthStage;
        this.translations = translations;
    }

    public boolean isValid() {
        if (name == null || url == null || organisationtype == null || hqcountry == null || hqregion == null
                || businessFundingStage == null || businessGrowthStage == null)
            return false;
        return true;
    }
}
