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

import MuiCheckbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

/**
 *
 * @param {object} props
 * @param {string} props.label
 * @returns
 */
const Checkbox = ({
  label,
  value,
  onChange,
  disabled,
  helperText,
  ...props
}) => {
  const handleChange = (event) => {
    onChange(event.target.checked);
  };

  if (!label && !helperText) {
    return <MuiCheckbox {...props} />;
  }
  return (
    <FormControl>
      <FormControlLabel
        disabled={disabled}
        checked={!!value}
        onChange={handleChange}
        control={<MuiCheckbox {...props} />}
        label={label}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default Checkbox;
