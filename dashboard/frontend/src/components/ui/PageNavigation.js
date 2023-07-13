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
* @author Marlies de Keizer (marlies.dekeizer@wur.nl)
*/

import React from 'react';
import Pagination from 'react-bootstrap/Pagination';


/** Create bootstrap Pagination components. */
export const PageNavigation = ({ currentPage, numberOfPages, handleOnSelect }) => {
    return (
        <Pagination>
            <Pagination.First onClick={handleOnSelect(1)} />
            <Pagination.Prev
                onClick={handleOnSelect(currentPage - 1)}
                disabled={currentPage === 1 ? true : false}
            />
            { 
                getPageIndices(currentPage, numberOfPages).map((pageNumber) => {
                    return (
                        <Pagination.Item
                            key={pageNumber}
                            onClick={handleOnSelect(pageNumber)}
                            active={currentPage === pageNumber ? true : false}
                        >
                            {pageNumber}
                        </Pagination.Item>
                    );
                })
            }
            <Pagination.Next
                onClick={handleOnSelect(currentPage + 1)}
                disabled={currentPage === numberOfPages ? true : false}
            />
            <Pagination.Last onClick={handleOnSelect(numberOfPages)} />
        </Pagination>
    );
};

function getPageIndices(currentPage, numberOfPages) {
    let maximumNumberOfItems = 5;
    let indices = Array(Math.min(maximumNumberOfItems, numberOfPages));
    let i;

    if (numberOfPages < maximumNumberOfItems) {
        for (i = 0; i < numberOfPages; i++) {
            indices[i] = i + 1;
        }
    } else {
        for (i = 0; i < maximumNumberOfItems; i++) {
            indices[i] = currentPage + i;

            if (currentPage === 2) {
                indices[i] -= 1;
            } else if (currentPage > 2) {
                indices[i] -= 2;

                if (currentPage === numberOfPages) {
                    indices[i] -= 2;
                } else if (currentPage === numberOfPages - 1) {
                    indices[i] -= 1;
                }
            }
        }
    }
    
    return indices;
}
