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

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import nl.wur.dataentry.validation.ValidUrl;
import nl.wur.dataentry.validation.ValidYear;

@Data
@NoArgsConstructor
@ToString
public class DtoSolution {
    private Integer id;
    private @NotNull String name;
    private @NotNull String description;
    private @NotNull @ValidUrl String url;
    private @NotNull Integer organisation;
    private @NotNull @ValidYear Integer launch;
    private Integer platform;
    private Integer bundling;
    private @NotNull Integer primarysubusecase;
    private Integer registeredusers;
    private Integer activeusers;
    private Integer shfusers;
    private Integer womenusers;
    private Integer youthusers;
    private Integer revenue;
    private Double yieldlowerbound;
    private Double yieldupperbound;
    private Double incomelowerbound;
    private Double incomeupperbound;
    private @NotNull @NotEmpty List<Integer> businessModels;
    private @NotNull @NotEmpty List<Integer> channels;
    private @NotNull @NotEmpty List<String> countries;
    private @NotNull @NotEmpty List<Integer> languages;
    private List<Integer> regions;
    private @NotNull @NotEmpty List<Integer> sectors;
    private List<Integer> subUseCases;
    private List<Integer> tags;
    private @NotNull @NotEmpty List<Integer> technologies;
    private List<DtoTranslation> translations;
    private List<String> otherLanguages;
    private List<DtoRegion> otherRegions;

    public DtoSolution(Integer id, @NotNull String name, @NotNull String description, @NotNull String url,
            @NotNull Integer organisation, @NotNull Integer launch, Integer platform, Integer bundling,
            @NotNull Integer primarysubusecase, Integer registeredusers, Integer activeusers, Integer shfusers,
            Integer womenusers, Integer youthusers, Integer revenue, Double yieldlowerbound, Double yieldupperbound,
            Double incomelowerbound, Double incomeupperbound, @NotNull @NotEmpty List<Integer> businessModels,
            @NotNull @NotEmpty List<Integer> channels, @NotNull @NotEmpty List<String> countries,
            @NotNull @NotEmpty List<Integer> languages, List<Integer> regions, @NotNull @NotEmpty List<Integer> sectors,
            List<Integer> subUseCases, List<Integer> tags, @NotNull @NotEmpty List<Integer> technologies,
            List<DtoTranslation> translations, List<String> otherLanguages, List<DtoRegion> otherRegions) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = (url.startsWith("http://") || url.startsWith("https://")) ? url : "http://" + url;
        this.organisation = organisation;
        this.launch = launch;
        this.platform = platform;
        this.bundling = bundling;
        this.primarysubusecase = primarysubusecase;
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
        this.businessModels = businessModels;
        this.channels = channels;
        this.countries = countries;
        this.languages = languages;
        this.regions = regions;
        this.sectors = sectors;
        this.subUseCases = subUseCases;
        this.tags = tags;
        this.technologies = technologies;
        this.translations = translations;
        this.otherLanguages = otherLanguages;
        this.otherRegions = otherRegions;
    }

    @Data
    @ToString
    public static class DtoRegion {
        private String country;
        private List<String> regions;
    }

    public boolean isValid() {
        if (name == null || description == null || url == null || organisation == null || launch == null
                || primarysubusecase == null)
            return false;
        if (businessModels == null || channels == null || countries == null || languages == null
                || sectors == null || technologies == null)
            return false;
        if (businessModels.isEmpty() || channels.isEmpty() || countries.isEmpty() || languages.isEmpty()
                || sectors.isEmpty() || technologies.isEmpty())
            return false;
        return true;
    }
}
