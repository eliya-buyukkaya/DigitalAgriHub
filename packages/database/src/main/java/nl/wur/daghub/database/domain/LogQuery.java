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

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@Entity
@Table(name = "log_query")
public class LogQuery {
    private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) int id;
    private @ToString.Exclude String currenttime;
    private String technologies;
    private String channels;
    private String usecases;
    private String organisationtypes;
    private String stages;
    private String tags;
    private String countries;

    public LogQuery(List<Integer> technologies, List<Integer> channels, List<Integer> useCases, List<Integer> organisationTypes,
            List<Integer> stages, List<Integer> tags, List<String> countries) {
        Collections.sort(technologies);
        Collections.sort(channels);
        Collections.sort(useCases);
        Collections.sort(organisationTypes);
        Collections.sort(stages);
        Collections.sort(countries);
        currenttime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date());
        this.technologies = technologies.toString();
        this.channels = channels.toString();
        this.usecases = useCases.toString();
        this.organisationtypes = organisationTypes.toString();
        this.stages = stages.toString();
        this.tags = tags.toString();
        this.countries = countries.toString();
    }

}
