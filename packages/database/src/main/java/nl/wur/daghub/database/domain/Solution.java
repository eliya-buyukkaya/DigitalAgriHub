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
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "solutions")
@NoArgsConstructor
public class Solution extends Entry {
    private @JsonIgnore @Getter @Id @GeneratedValue(strategy = GenerationType.IDENTITY) int id;
    private @Getter @Setter @NotNull String name;
    private @Getter @Setter @NotNull String description;
    private @Getter @Setter String url;
    private @Getter @Setter @NotNull int launch;
    private @Getter Integer platform;
    private @Getter Integer bundling;
    private @Getter Integer registeredusers;
    private @Getter Integer activeusers;
    private @Getter Integer shfusers;
    private @Getter Integer womenusers;
    private @Getter Integer youthusers;
    private @Getter Integer revenue;
    private @Getter Double yieldlowerbound;
    private @Getter Double yieldupperbound;
    private @Getter Double incomelowerbound;
    private @Getter Double incomeupperbound;
    private @Getter @Setter @NotNull @ManyToOne(fetch = FetchType.EAGER) Organisation organisation;
    private @Getter @Setter @NotNull @ManyToOne(fetch = FetchType.EAGER) SubUseCase primarysubusecase;

    private @Getter @ManyToMany(fetch = FetchType.EAGER) @JoinTable(name = "sectors_in_solutions", inverseJoinColumns = @JoinColumn(name = "sector_id"), joinColumns = @JoinColumn(name = "solution_id")) Set<Sector> sectors;
    private @Getter @ManyToMany(fetch = FetchType.EAGER) @JoinTable(name = "tags_in_solutions", inverseJoinColumns = @JoinColumn(name = "tag_id"), joinColumns = @JoinColumn(name = "solution_id")) Set<Tag> tags;
    private @Getter @ManyToMany(fetch = FetchType.EAGER) @JoinTable(name = "sub_use_cases_in_solutions", inverseJoinColumns = @JoinColumn(name = "subusecase_id"), joinColumns = @JoinColumn(name = "solution_id")) Set<SubUseCase> subUseCases;
    private @Getter @ManyToMany(fetch = FetchType.EAGER) @JoinTable(name = "business_models_in_solutions", inverseJoinColumns = @JoinColumn(name = "businessmodel_id"), joinColumns = @JoinColumn(name = "solution_id")) Set<BusinessModel> businessModels;
    private @Getter @ManyToMany(fetch = FetchType.EAGER) @JoinTable(name = "regions_in_solutions", inverseJoinColumns = @JoinColumn(name = "region_id"), joinColumns = @JoinColumn(name = "solution_id")) Set<Region> regions;

    private @Getter @OneToMany(fetch = FetchType.EAGER, targetEntity = SolutionTranslation.class, mappedBy = "solution", cascade = CascadeType.ALL) Set<SolutionTranslation> translations;
    // private @Getter @OneToOne(mappedBy = "solution", cascade = CascadeType.ALL) @PrimaryKeyJoinColumn SolutionTranslation solutionTranslations;

    public Solution(@NotNull String name, @NotNull String description, String url, @NotNull int launch,
            Integer platform, Integer bundling, Integer registeredusers, Integer activeusers, Integer shfusers,
            Integer womenusers, Integer youthusers, Integer revenue, Double yieldlowerbound, Double yieldupperbound,
            Double incomelowerbound, Double incomeupperbound, @NotNull Organisation organisation,
            @NotNull SubUseCase primarysubusecase, @NotNull String[] owners, Timestamp datemodifiedowner) {
        this.name = name;
        this.description = description;
        this.url = url;
        this.launch = launch;
        this.platform = platform;
        this.bundling = bundling;
        this.registeredusers = registeredusers;
        this.activeusers = activeusers;
        this.shfusers = shfusers;
        this.womenusers = womenusers;
        this.youthusers = youthusers;
        this.revenue = revenue;
        this.yieldlowerbound = yieldlowerbound;
        this.yieldupperbound = yieldupperbound;
        this.incomelowerbound = incomelowerbound;
        this.incomeupperbound = incomeupperbound;
        this.organisation = organisation;
        this.primarysubusecase = primarysubusecase;
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
        Solution other = (Solution) obj;
        if (id != other.id)
            return false;
        return true;
    }

}
