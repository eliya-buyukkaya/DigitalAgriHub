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

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.Getter;

@Entity
@Table(name = "sub_use_cases")
public class SubUseCase {
    private @Getter @Id @GeneratedValue(strategy = GenerationType.IDENTITY) int id;
    private @Getter @NotNull String description;
    private @Getter @NotNull @ManyToOne(fetch = FetchType.EAGER) UseCase usecase;
    // private @OneToMany(fetch = FetchType.LAZY, targetEntity = Solution.class, mappedBy = "primarysubusecase") Set<Solution> primarySolutions;
    // private @ManyToMany(fetch = FetchType.LAZY, targetEntity = Solution.class, mappedBy = "subUseCases") Set<Solution> solutions;
   
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
        SubUseCase other = (SubUseCase) obj;
        if (id != other.id)
            return false;
        return true;
    }
}
