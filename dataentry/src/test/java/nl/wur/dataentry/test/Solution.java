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

/**
 * Tests might need to be updated
 */

package nl.wur.dataentry.test;

import java.util.List;
import lombok.Data;

public @Data class Solution {
    private Long version;
    private String description;
    private String url;
    private String name;
    private int launch;
    private int platform;
    private int bundling;
    private int registeredusers;
    private int activeusers;
    private int shfusers;
    private int womenusers;
    private int youthusers;
    private int revenue;
    private double yieldlowerbound;
    private double yieldupperbound;
    private double incomelowerbound;
    private double incomeupperbound;
    private String organisation;
    private String primarysubusecase;
    private String sector;
    private List<String> tags;
    private List<String> subUseCases;
    private List<String> businessModels;
    private List<String> regions;

    public Solution(String description, String url, String name, int launch, int platform, int bundling,
            int registeredusers, int activeusers, int shfusers, int womenusers, int youthusers, int revenue,
            double yieldlowerbound, double yieldupperbound, double incomelowerbound, double incomeupperbound,
            String organisation, String primarysubusecase, String sector, List<String> tags, List<String> subUseCases,
            List<String> businessModels, List<String> regions) {
        this.description = description;
        this.url = url;
        this.name = name;
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
        this.sector = sector;
        this.tags = tags;
        this.subUseCases = subUseCases;
        this.businessModels = businessModels;
        this.regions = regions;
    }

}
