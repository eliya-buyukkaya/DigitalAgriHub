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

import { useState } from "react";
import { Alert } from "@mui/material";
import styled from "styled-components";
import FieldGroup from "../../Input/FieldGroup";
import TextField from "../../Input/TextField";
import HTMLContent from "../../Input/HTMLContent";
import Select from "../../Input/Select";
import Autocomplete from "../../Input/Select/Autocomplete";
import { validateString, validateInteger, validateSelect, validateUrl } from "../../../helpers/validate";
import { ButtonContainer, StyledButton } from "../styled";
import Modal from "../../Dialog/Modal";
import helperTextObjects from "./helperText";
import HelperText from "../../HelperText";

const MainContainer = styled.div``;

const OrganisationForm = ({
    formState,
    setValue,
    onSave,
    onCancel,
    options
}) => {
    const [alertState, setAlertState] = useState({ message: null, severity: "error" });

    const [hqcountryInputValue, setHqcountryInputValue] = useState("");
    const [hqregionInputValue, setHqregionInputValue] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});

    const [helpModal, setHelpModal] = useState({ content: null, open: false });
    const openHelp = (helpText) => {
        setHelpModal({ content: helpText, open: true });
    };
    const getHelperText = (identifier) => (
        <HelperText
            identifier={identifier}
            openPopup={openHelp}
            helperTextObjects={helperTextObjects}
        />
    );

    const getChangeHandler = (key) => (ev) => {
        setFieldErrors((prev) => ({ ...prev, [key]: null }));
        const val = ev.target.value;
        setValue(key, val);
    };

    const handleChangeCountry = (newValue) => {
        setFieldErrors((prev) => ({ ...prev, hqcountry: null }));
        setValue("hqcountry", newValue);
        setValue("hqregion", null);
        setHqregionInputValue("");
    };

    const boundsFounded = { min: 1900, max: new Date().getFullYear() };

    const parseField = (fieldname) => {
        switch (fieldname) {
            case "name":
            case "description": {
                const fieldValidation = validateString(formState[fieldname], false);
                
                if (!fieldValidation.valid) {
                    return { error: fieldValidation.message };
                }
                
                return { value: fieldValidation.output };
            }
            case "organisationtype":
            case "businessFundingStage":
            case "businessGrowthStage":
            case "hqcountry": {
                const fieldValidation = validateSelect(formState[fieldname], false);
        
                if (!fieldValidation.valid) {
                    return { error: fieldValidation.message };
                }
        
                return { value: fieldValidation.output };
            }
            case "hqregion": {
                // always fill with other when no existing option is chosen
                // @todo is this solid enough?
                if (
                    typeof formState[fieldname] !== "object" ||
                    formState[fieldname] === null
                ) {
                    return { value: "0" };
                }
        
                const fieldValidation = validateSelect(formState[fieldname], true);
                
                if (!fieldValidation.valid) {
                    return { error: fieldValidation.message };
                }
        
                return { value: fieldValidation.output };
            }
            case "founded": {
                const fieldValidation = validateInteger(
                    formState[fieldname],
                    true,
                    false,
                    true,
                    boundsFounded.min,
                    boundsFounded.max
                );
        
                if (!fieldValidation.valid) {
                    return { error: fieldValidation.message };
                }
        
                return { value: fieldValidation.output };
            }
            case "url": {
                const fieldValidation = validateUrl(formState[fieldname]);
        
                if (!fieldValidation.valid) {
                    return { error: fieldValidation.message };
                }
        
                return { value: fieldValidation.output };
            }
            default:
                return { value: formState[fieldname] };
        }
    };

    const validate = () => {
        const fields = [
            "organisationId",
            "name",
            "url",
            "description",
            "hqcountry",
            "hqregion",
            "founded",
            "businessFundingStage",
            "organisationtype",
            "businessGrowthStage"
        ];
        const parsedFields = fields.reduce(
            (prev, fieldName) => {
                const parsed = parseField(fieldName);
                let newErrors;
                let newParsedValues;
        
                if (parsed.error) {
                    newErrors = { ...prev.errors, [fieldName]: parsed.error };
                } else {
                    newErrors = prev.errors;
                }
        
                newParsedValues = { ...prev.parsedValues, [fieldName]: parsed.value };
            
                return { errors: newErrors, parsedValues: newParsedValues };
            },
            { errors: {}, parsedValues: {} }
        );
    
        setFieldErrors(parsedFields.errors);
    
        return Object.values(parsedFields.errors).length === 0 ? parsedFields.parsedValues : false;
    };

    const handleCancel = () => {
        onCancel?.();
    };

    const handleSave = () => {
        const validation = validate();
    
        if (validation) {
            onSave(validation).catch((err) => {
                console.error(err);
                setAlertState({
                    message: (
                        <div>
                            <p>Could not save organisation.</p>
                            <code>{err.message}</code>
                        </div>
                    ),
                    severity: "error",
                });
            });
        }
    };

    const onBlurUrl = () => {
        const value = formState.url;
        
        if (!value) return;
    
        if (!(value.startsWith("http://") || value.startsWith("https://"))) {
            setValue("url", `http://${value}`);
        }
    };

    const showRegionInput =
        formState.hqcountry &&
        options.regions?.[formState.hqcountry.value]?.length > 0;

    return (
        <>
            <MainContainer>
                <FieldGroup>
                    <TextField
                        label="Name"
                        value={formState.name}
                        required
                        onChange={getChangeHandler("name")}
                        error={!!fieldErrors.name}
                        helperText={fieldErrors.name || getHelperText("name")}
                        autoFocus
                    />
                    <TextField
                        label="URL"
                        value={formState.url}
                        required
                        onChange={getChangeHandler("url")}
                        error={!!fieldErrors.url}
                        helperText={fieldErrors.url || getHelperText("url")}
                        type="url"
                        spellCheck={false}
                        onBlur={onBlurUrl}
                    />
                    <HTMLContent
                        label="Description"
                        value={formState.description}
                        required
                        onChange={(val) => {
                            setValue("description", val);
                            setFieldErrors((prev) => ({ ...prev, description: null }));
                        }}
                        editable={true}
                        error={!!fieldErrors.description}
                        helperText={fieldErrors.description || getHelperText("description")}
                        tabIndex="0"
                    />
                    <Autocomplete
                        id="hqcountry"
                        value={formState.hqcountry}
                        onChange={handleChangeCountry}
                        inputValue={hqcountryInputValue}
                        onInputChange={(event, newInputValue) => {
                            setHqcountryInputValue(newInputValue);
                        }}
                        options={options.countries}
                        renderInput={(params) => (
                            <TextField
                                required
                                {...params}
                                label="Headquarter country"
                                error={!!fieldErrors.hqcountry}
                                helperText={fieldErrors.hqcountry || getHelperText("country")}
                            />
                        )}
                        // disableClearable
                        // isOptionEqualToValue={(option, value) => option?.code === value}
                        // getOptionLabel={(option) => option?.label || ""}
                    />
                    {showRegionInput && (
                        <Autocomplete
                            id="hqregion"
                            value={formState.hqregion}
                            required
                            onChange={(newValue) => {
                                setFieldErrors((prev) => ({ ...prev, hqregion: null }));
                                setValue("hqregion", newValue);
                            }}
                            inputValue={hqregionInputValue}
                            onInputChange={(event, newInputValue) => {
                                setHqregionInputValue(newInputValue);
                            }}
                            options={
                                formState.hqcountry
                                ? options.regions?.[formState.hqcountry.value] || []
                                : []
                            }
                            // freeSolo
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Headquarter region"
                                    // error={!!fieldErrors.hqregion}
                                    helperText={fieldErrors.hqregion || getHelperText("hqregion")}
                                />
                            )}
                            // disableClearable
                            // isOptionEqualToValue={(option, value) => option?.code === value}
                            // getOptionLabel={(option) => option?.label || ""}
                        />
                    )}
                    <TextField
                        label="Year founded"
                        type="number"
                        value={formState.founded}
                        onChange={getChangeHandler("founded")}
                        error={!!fieldErrors.founded}
                        helperText={fieldErrors.founded || getHelperText("founded")}
                        min={boundsFounded.min}
                        max={boundsFounded.max}
                    />
                    <Select
                        label="Organisation type"
                        value={formState.organisationtype}
                        required
                        onChange={(val) => {
                            setFieldErrors((prev) => ({ ...prev, organisationtype: null }));
                            setValue("organisationtype", val);
                        }}
                        options={options.organisationTypes}
                        error={!!fieldErrors.organisationtype}
                        helperText={
                            fieldErrors.organisationtype || getHelperText("organisationtype")
                        }
                    />
                    <Select
                        label="Business growth stage"
                        value={formState.businessGrowthStage}
                        required
                        onChange={(val) => {
                            setFieldErrors((prev) => ({
                                ...prev,
                                businessGrowthStage: null,
                            }));
                            setValue("businessGrowthStage", val);
                        }}
                        options={options.businessGrowthStages}
                        error={!!fieldErrors.businessGrowthStage}
                        helperText={
                            fieldErrors.businessGrowthStage ||
                            getHelperText("businessGrowthStage")
                        }
                    />
                    <Select
                        required
                        label="Business funding stage"
                        value={formState.businessFundingStage}
                        onChange={(val) => {
                            setFieldErrors((prev) => ({
                                ...prev,
                                businessFundingStage: null,
                            }));
                            setValue("businessFundingStage", val);
                        }}
                        options={options.businessFundingStages}
                        error={!!fieldErrors.businessFundingStage}
                        helperText={
                            fieldErrors.businessFundingStage ||
                            getHelperText("businessFundingStage")
                        }
                    />
                </FieldGroup>
        
                {alertState.message && (<Alert sx={{ mt: 2 }} severity={alertState.severity}>{alertState.message}</Alert>)}
        
                <ButtonContainer flex>
                    <div></div>
                    <div>
                        <StyledButton
                            key="skip"
                            variant="outlined"
                            onClick={handleCancel}
                            secondary
                            // color="error"
                            tabIndex={-1}
                        >
                            cancel
                        </StyledButton>
                        <StyledButton key="saveOrganisation" onClick={handleSave}>
                            save organisation
                        </StyledButton>
                    </div>
                </ButtonContainer>
            </MainContainer>
            <Modal
                open={helpModal.open}
                onClose={() => setHelpModal((prev) => ({ ...prev, open: false }))}
            >
                {helpModal.content}
            </Modal>
        </>
    );
};

export default OrganisationForm;
