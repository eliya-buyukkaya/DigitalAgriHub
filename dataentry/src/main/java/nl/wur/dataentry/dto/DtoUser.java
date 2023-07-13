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
import javax.validation.constraints.Size;

import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.wur.daghub.database.domain.User;
import nl.wur.dataentry.validation.ValidEmail;

@NoArgsConstructor
public class DtoUser extends DtoUserPassword {
    private @Getter @NotNull @Size(min = 2, message = "Length must be greater than {min}") String name;
    private @Getter @NotNull @Size(min = 2, message = "Length must be greater than {min}") @ValidEmail String email;
    private @Getter @NotNull @Size(min = 2, message = "Length must be greater than {min}") String company;
    private @Getter @Size(min = 2, message = "Length must be greater than {min}") String website;
    private @Getter boolean editSolutions;
    private @Getter List<Integer> solutions;
    private @Getter @Size(min = 2, message = "Length must be greater than {min}") String comments;

    public DtoUser(String name, String password, String matchingPassword, String email, String company) {
        super(password, matchingPassword);
        this.name = name;
        this.email = email;
        this.company = company;
    }

    public void setSolutions(List<Integer> solutions) {
        this.solutions = solutions;
        editSolutions = (solutions != null && !solutions.isEmpty()) || (comments != null && comments.length() > 1);
    }

    public void setComments(String comments) {
        this.comments = comments;
        editSolutions = (solutions != null && !solutions.isEmpty()) || (comments != null && comments.length() > 1);
    }

    public User toUser(PasswordEncoder passwordEncoder) {
        return new User(name, passwordEncoder.encode(this.password), email, company,
                editSolutions + "#" + website + "#" + solutions + "#" + comments);
    }

    @Override
    public String toString() {
        return "name:\t\t" + name + "\nemail:\t\t" + email + "\ncompany:\t" + company + "\nwebsite:\t" + website
                + "\neditSolutions:\t" + editSolutions + "\nsolutions:\t" + solutions + "\ncomments:\t" + comments;
    }

}
