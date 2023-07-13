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

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.core.convert.converter.Converter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "organisation_translations")
public class OrganisationTranslation {
    private @EmbeddedId PrimaryKey id;
    private @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "organisation_id", insertable = false, updatable = false) Organisation organisation;
    private @Getter @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "language_id", insertable = false, updatable = false) Language language;
    private @Getter String translation;

    public OrganisationTranslation() {
        this.id = new PrimaryKey();
    }

    public OrganisationTranslation(int organisationId, int languageId) {
        this.id = new PrimaryKey(organisationId, languageId);
    }

    public void setOrganisation(Organisation organisation) {
        this.organisation = organisation;
        if (organisation != null)
            id.organisationId = organisation.getId();
    }

    public void setLanguage(Language language) {
        this.language = language;
        if (language != null)
            id.languageId = language.getId();
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
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
        OrganisationTranslation other = (OrganisationTranslation) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }

    @Data
    @Embeddable
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PrimaryKey implements Serializable {
        private static final long serialVersionUID = 1L;
        private @Column(name = "organisation_id", nullable = false, updatable = false) int organisationId;
        private @Column(name = "language_id", nullable = false, updatable = false) int languageId;

        @Override
        public String toString() {
            return organisationId + "," + languageId;
        }
    }

    public static class PrimaryKeyConverter implements Converter<String, PrimaryKey> {
        @Override
        public PrimaryKey convert(String data) {
            String[] ids = data.split(",");
            return new OrganisationTranslation.PrimaryKey(Integer.parseInt(ids[0]), Integer.parseInt(ids[1]));
        }
    }

}
