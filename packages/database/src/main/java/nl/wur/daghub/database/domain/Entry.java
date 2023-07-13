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

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
public abstract class Entry {
    protected @JsonIgnore @CreationTimestamp @ColumnDefault("CURRENT_TIMESTAMP") Timestamp datecreated;
    protected @JsonIgnore @UpdateTimestamp Timestamp datemodified;
    protected @JsonIgnore Timestamp dateremoved;
    protected @JsonIgnore @Setter Timestamp datemodifiedowner;
    protected @JsonIgnore @Version Long version;
    protected @JsonIgnore @Getter @Setter @Column(columnDefinition = "text[]") @Type(type = "nl.wur.daghub.database.hibernate.TypeStringArray") String[] owners;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((datecreated == null) ? 0 : datecreated.hashCode());
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
        Entry other = (Entry) obj;
        if (datecreated == null) {
            if (other.datecreated != null)
                return false;
        } else if (!datecreated.equals(other.datecreated))
            return false;
        return true;
    }

    public String[] addOwner(int id) {
        String[] ids;
        if (owners == null) {
            ids = new String[1];
        } else if (hasOwner(id)) {
            return owners;
        } else {
            ids = new String[owners.length + 1];
            for (int i = 0; i < owners.length; i++)
                ids[i] = owners[i];
        }
        ids[ids.length - 1] = Integer.toString(id);
        return ids;
    }

    public boolean hasOwner(int id) {
        String sid = Integer.toString(id);
        for (int i = 0; i < owners.length; i++)
            if (owners[i].equals(sid))
                return true;
        return false;
    }

}
