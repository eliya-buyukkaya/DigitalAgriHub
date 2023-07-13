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

package nl.wur.daghub.database.domain;

import java.sql.Timestamp;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "organisations")
@NoArgsConstructor
public class Organisation extends Entry {
    private @JsonIgnore @Getter @Id @GeneratedValue(strategy = GenerationType.IDENTITY) int id;
    private @Getter @NotNull String name;
    private @Getter String description;
    private @Getter String url;
    private @Getter Integer founded;
    private @Getter @NotNull @ManyToOne(fetch = FetchType.EAGER) OrganisationType organisationtype;
    private @Getter @NotNull @ManyToOne(fetch = FetchType.EAGER) Country hqcountry;
    private @Getter @NotNull @ManyToOne(fetch = FetchType.EAGER) Region hqregion;
    private @Getter @NotNull @ManyToOne(fetch = FetchType.EAGER) BusinessFundingStage businessFundingStage;
    private @Getter @NotNull @ManyToOne(fetch = FetchType.EAGER) BusinessGrowthStage businessGrowthStage;

    private @OneToMany(fetch = FetchType.LAZY, targetEntity = Solution.class, mappedBy = "organisation") Set<Solution> solutions;
    private @Getter @OneToMany(fetch = FetchType.EAGER, targetEntity = OrganisationTranslation.class, mappedBy = "organisation", cascade = CascadeType.ALL) Set<OrganisationTranslation> translations;

    public Organisation(@NotNull String name, String description, String url, Integer founded,
            @NotNull OrganisationType organisationtype, @NotNull Country hqcountry, @NotNull Region hqregion,
            @NotNull BusinessFundingStage businessFundingStage, @NotNull BusinessGrowthStage businessGrowthStage,
            @NotNull String[] owners, Timestamp datemodifiedowner) {
        this.name = name;
        this.description = description;
        this.url = url;
        this.founded = founded;
        this.organisationtype = organisationtype;
        this.hqcountry = hqcountry;
        this.hqregion = hqregion;
        this.businessFundingStage = businessFundingStage;
        this.businessGrowthStage = businessGrowthStage;
        this.owners = owners;
        this.datemodifiedowner = datemodifiedowner;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + id;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Organisation other = (Organisation) obj;
        if (id != other.id)
            return false;
        return true;
    }

}
