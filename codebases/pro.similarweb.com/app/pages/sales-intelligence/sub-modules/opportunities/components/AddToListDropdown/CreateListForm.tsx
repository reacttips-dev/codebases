import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { isOpportunityListNameLongEnough } from "../../helpers";
import {
    StyledCreateListForm,
    StyledCreateListSubmitSection,
    StyledCreateListInputContainer,
    StyledCreateListInputLabel,
} from "./styles";
import { CreateListFormProps } from "./types";

const CreateListForm = ({ loading, onSubmit, onCancel, labelCreateBtn }: CreateListFormProps) => {
    const translate = useTranslation();

    const [name, setName] = React.useState("");

    const isNameLongEnough = isOpportunityListNameLongEnough(name);

    const handleSubmit = () => {
        if (isNameLongEnough) {
            onSubmit(name.trim());
        }
    };

    return (
        <StyledCreateListForm>
            <StyledCreateListInputContainer>
                <StyledCreateListInputLabel>
                    <span>{translate("si.components.add_to_list_dropdown.create.label")}</span>
                </StyledCreateListInputLabel>
                <Textfield
                    autoFocus
                    maxLength={100}
                    defaultValue=""
                    onChange={setName}
                    dataAutomation="si-components-save-search-modal-input"
                    placeholder={translate("si.components.add_to_list_dropdown.create.placeholder")}
                />
            </StyledCreateListInputContainer>
            <StyledCreateListSubmitSection>
                <Button type="flat" onClick={onCancel}>
                    {translate("si.common.button.cancel")}
                </Button>
                <Button
                    type="primary"
                    isLoading={loading}
                    onClick={handleSubmit}
                    isDisabled={!isNameLongEnough || loading}
                >
                    {labelCreateBtn || translate("si.common.button.save")}
                </Button>
            </StyledCreateListSubmitSection>
        </StyledCreateListForm>
    );
};

export default CreateListForm;
