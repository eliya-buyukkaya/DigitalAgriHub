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
* @author Ronnie van Kempen  (ronnie.vankempen@wur.nl)
* @author Marlies de Keizer (marlies.dekeizer@wur.nl)
* @author Eliya Buyukkaya (eliya.buyukkaya@wur.nl)
*/

import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import TextField from "../TextField";

const Select = ({ onChange, options, ...props }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <TextField select {...props} onChange={handleChange}>
      {options.map(({ value, label, disabled }, i) => (
        <MenuItem key={value} value={value} disabled={disabled}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
};

const valueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

Select.propTypes = {
  label: PropTypes.node,
  value: valueType,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: valueType.isRequired,
      label: PropTypes.node.isRequired,
      disabled: PropTypes.bool,
    })
  ),
};

export default Select;
