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
*/

import { useState } from "react";
import styled from "styled-components";
import FieldGroup from "../../../Input/FieldGroup";
import FieldSet from "../../../Input/FieldSet";
import { newUseCase } from "../../formState";
import UseCaseField from "./UseCaseField";
import Modal from "../../../Dialog/Modal";
import HelperText from "../../../HelperText";
import helperTextObjects, { helperTextsubUseCases } from "./helperText";

const MainContainer = styled.div``;

const sameOption = (a, b) => {
  if (!a || !b) return false;
  return a.value === b.value;
};

const SolutionFormUseCases = ({
  formState,
  setValue,
  options,
  fieldErrors,
}) => {
  const [helpModal, setHelpModal] = useState({ content: null, open: false });
  const openHelp = (helpText) => {
    setHelpModal({ content: helpText, open: true });
  };
  const getHelperText = (identifier, primaryLabel) => {
    return (
      <HelperText
        identifier={identifier}
        openPopup={openHelp}
        helperTextObjects={helperTextObjects}
      />
    );
  };
  const getHelperTextSubUsecase = (identifier, primaryLabel) => {
    let helpTexts = {
      [identifier]: {
        ...helperTextObjects[identifier],
        more: [
          helperTextObjects[identifier]?.more,
          helperTextsubUseCases[primaryLabel] || (
            <b>- Select a use case first -</b>
          ),
        ],
      },
    };
    return (
      <HelperText
        identifier={identifier}
        openPopup={openHelp}
        helperTextObjects={helpTexts}
      />
    );
  };

  const updatedUseCase = (key, parentKey, val, prev) => {
    let updatedObject;
    if (key === "value") {
      const optionVal = options.useCases.find((option) => option.value === val);
      updatedObject = { ...optionVal, subUseCases: newUseCase.subUseCases };
    } /* key === "subUseCases" */ else {
      const optionVal = val.map((subVal) =>
        options.subUseCases[parentKey].find((option) => option.value === subVal)
      );
      updatedObject = { ...prev, subUseCases: optionVal };
    }
    return updatedObject;
  };

  const getHandleChangePrimaryUseCase = (key, parentKey) => (val) => {
    setValue("primaryUseCase", (prev) => {
      const updatedObject = updatedUseCase(
        key,
        parentKey,
        val,
        prev || newUseCase
      );
      return updatedObject;
    });
  };

  const getHandleChangeUseCase = (idx, key, parentKey) => (val) => {
    setValue("otherUseCases", (prevArray) => {
      const prevObject = prevArray[idx] || newUseCase;
      const updatedObject = updatedUseCase(key, parentKey, val, prevObject);
      return [
        ...prevArray.slice(0, idx),
        updatedObject,
        ...prevArray.slice(idx + 1),
      ];
    });
  };

  // const handleDeletePrimaryUseCase = () => {
  //   setValue("primaryUseCase", { ...newUseCase });
  // };

  const getHandleDeleteUseCase = (idx) => () => {
    setValue("otherUseCases", (prev) => [
      ...prev.slice(0, idx),
      ...prev.slice(idx + 1),
    ]);
  };

  const primaryUseCase = formState.primaryUseCase;
  const [secondUseCase, thirdUseCase] = formState.otherUseCases;

  if (!options.useCases?.length) return null;

  return (
    <>
      <MainContainer>
        <FieldGroup>
          <FieldSet
            label="Primary use case"
            error={!!fieldErrors.primaryUseCase}
            helperText={
              fieldErrors.primaryUseCase || getHelperText("primaryUseCase")
            }
            helperTextPosition="top"
          >
            <UseCaseField
              helperTextUseCase={getHelperText("primaryUseCaseUseCase")}
              helperTextSubUseCase={getHelperTextSubUsecase(
                "primaryUseCaseSubUseCase",
                primaryUseCase?.label
              )}
              primary
              required
              useCase={primaryUseCase?.value}
              subUseCases={primaryUseCase?.subUseCases.map(
                (useCase) => useCase.value
              )}
              useCaseOptions={options.useCases}
              subUseCaseOptions={
                primaryUseCase?.value &&
                options.subUseCases[primaryUseCase.value]
                  ? options.subUseCases[primaryUseCase.value].map((sub) => {
                      let disabled = false;
                      if (secondUseCase) {
                        disabled = secondUseCase.subUseCases.some((primSub) =>
                          sameOption(primSub, sub)
                        );
                      }
                      if (thirdUseCase) {
                        disabled =
                          disabled ||
                          thirdUseCase.subUseCases.some((primSub) =>
                            sameOption(primSub, sub)
                          );
                      }
                      return { ...sub, disabled };
                    })
                  : []
              }
              onChangeUseCase={getHandleChangePrimaryUseCase("value")}
              onChangeSubUseCases={getHandleChangePrimaryUseCase(
                "subUseCases",
                primaryUseCase?.value
              )}
              // deleteField={handleDeletePrimaryUseCase}
            />
          </FieldSet>

          {primaryUseCase?.value && (
            <FieldSet
              label="Other use cases"
              error={!!fieldErrors.otherUseCases}
              helperText={
                fieldErrors.otherUseCases || getHelperText("otherUseCases")
              }
              helperTextPosition="top"
            >
              {/* second UseCase */}
              <UseCaseField
                helperTextUseCase={getHelperText("primaryUseCaseUseCase")}
                helperTextSubUseCase={getHelperTextSubUsecase(
                  "otherUseCasesSubUseCase",
                  secondUseCase?.label
                )}
                useCase={secondUseCase?.value}
                subUseCases={secondUseCase?.subUseCases.map(
                  (useCase) => useCase.value
                )}
                useCaseOptions={options.useCases.map((useCase) => ({
                  ...useCase,
                  disabled: sameOption(thirdUseCase, useCase),
                }))}
                subUseCaseOptions={
                  secondUseCase?.value &&
                  options.subUseCases[secondUseCase.value]
                    ? options.subUseCases[secondUseCase.value].map((sub) => {
                        let disabled = false;
                        disabled = primaryUseCase.subUseCases.some((primSub) =>
                          sameOption(primSub, sub)
                        );
                        if (thirdUseCase) {
                          disabled =
                            disabled ||
                            thirdUseCase.subUseCases.some((primSub) =>
                              sameOption(primSub, sub)
                            );
                        }
                        return { ...sub, disabled };
                      })
                    : []
                }
                onChangeUseCase={getHandleChangeUseCase(0, "value")}
                onChangeSubUseCases={getHandleChangeUseCase(
                  0,
                  "subUseCases",
                  secondUseCase?.value
                )}
                deleteField={getHandleDeleteUseCase(0)}
              />

              {secondUseCase && (
                /* third UseCase */
                <UseCaseField
                  helperTextUseCase={getHelperText("primaryUseCaseUseCase")}
                  helperTextSubUseCase={getHelperTextSubUsecase(
                    "otherUseCasesSubUseCase",
                    thirdUseCase?.label
                  )}
                  useCase={thirdUseCase?.value}
                  subUseCases={thirdUseCase?.subUseCases.map(
                    (useCase) => useCase.value
                  )}
                  useCaseOptions={options.useCases.map((useCase) => ({
                    ...useCase,
                    disabled: sameOption(secondUseCase, useCase),
                  }))}
                  subUseCaseOptions={
                    thirdUseCase?.value &&
                    options.subUseCases[thirdUseCase.value]
                      ? options.subUseCases[thirdUseCase.value].map((sub) => {
                          let disabled = false;
                          disabled = primaryUseCase.subUseCases.some(
                            (primSub) => sameOption(primSub, sub)
                          );
                          if (secondUseCase) {
                            disabled =
                              disabled ||
                              secondUseCase.subUseCases.some((primSub) =>
                                sameOption(primSub, sub)
                              );
                          }
                          return { ...sub, disabled };
                        })
                      : []
                  }
                  onChangeUseCase={getHandleChangeUseCase(1, "value")}
                  onChangeSubUseCases={getHandleChangeUseCase(
                    1,
                    "subUseCases",
                    thirdUseCase?.value
                  )}
                  deleteField={getHandleDeleteUseCase(1)}
                />
              )}
            </FieldSet>
          )}
        </FieldGroup>
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

export default SolutionFormUseCases;
