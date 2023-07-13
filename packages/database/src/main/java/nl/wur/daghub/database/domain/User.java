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
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Table(name = "users")
public class User {
    private @Getter @Id @GeneratedValue(strategy = GenerationType.IDENTITY) int id;
    private @Getter @Setter @NotNull String name;
    private @Getter @Setter @JsonIgnore @NotNull String password;
    private @Getter @Setter @NotNull String email;
    private @Getter @Setter @NotNull String company;
    private @Getter @Setter @JsonIgnore @NotNull @Column(columnDefinition = "text[]") @Type(type = "nl.wur.daghub.database.hibernate.TypeStringArray") String[] roles;
    private @JsonIgnore @Getter @Setter @NotNull boolean enabled = false;
    private @Getter @Setter @JsonIgnore String token;
    private @JsonIgnore @CreationTimestamp @ColumnDefault("CURRENT_TIMESTAMP") Timestamp datecreated;
    private @JsonIgnore @UpdateTimestamp Timestamp datelastlogin;
    private @JsonIgnore @Getter String comments;
    private @Getter @Setter @JsonIgnore String tokenreset;
    private @Getter @Setter boolean approved;
    
    public User(String name, String password, String email, String company, String comments) {
        this.name = name;
        this.email = email;
        this.company = company;
        this.password = password;
        roles = new String[] { UserRole.OWNER.toString() };
        this.comments = comments;
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
        User other = (User) obj;
        if (id != other.id)
            return false;
        return true;
    }

    public boolean isAdmin() {
        for (int i = 0; i < roles.length; i++)
            if (roles[i].equals("ADMIN"))
                return true;
        return false;
    }

    public boolean editSolutions() {
        if (comments == null || comments.split("#")[0].equals("false"))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "id:\t\t" + id + "\nname:\t\t" + name + "\nemail:\t\t" + email + "\ncompany:\t" + company
                + "\nroles:\t\t" + Arrays.toString(roles) + "\nenabled:\t" + enabled + "\ndatecreated:\t" + datecreated
                + "\ndatelastlogin:\t" + datelastlogin + "\ncomments:\t " + comments.replaceAll("#", "\n\t\t");
    }
}
