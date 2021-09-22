import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { isSearchNameLongEnough } from "pages/sales-intelligence/sub-modules/saved-searches/helpers";
import {
    CUSTOM_MODAL_STYLES,
    StyledModalContent,
    StyledHeader,
    StyledTitle,
    StyledSubtitle,
    StyledButtonsContainer,
    StyledNameInputContainer,
    StyledNameInputLabel,
} from "./styles";

type SaveSearchModalProps = {
    title: string;
    isOpened: boolean;
    isSubmitting: boolean;
    onCancel(): void;
    onSubmit(name: string): void;
};

const SaveSearchModal = (props: SaveSearchModalProps) => {
    const translate = useTranslation();
    const { title, isOpened, isSubmitting, onCancel, onSubmit } = props;
    const [name, setName] = React.useState("");
    const isNameLongEnough = isSearchNameLongEnough(name);

    const handleSubmit = () => {
        if (isNameLongEnough) {
            onSubmit(name.trim());
        }
    };

    return (
        <ProModal
            isOpen={isOpened}
            showCloseIcon={false}
            shouldCloseOnOverlayClick={false}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <StyledModalContent>
                <StyledHeader>
                    <StyledTitle>{title}</StyledTitle>
                    <StyledSubtitle>
                        {translate("si.components.save_new_search_modal.subtitle")}
                    </StyledSubtitle>
                </StyledHeader>
                <StyledNameInputContainer>
                    <StyledNameInputLabel>
                        <span>
                            {translate("si.components.save_new_search_modal.text_field_label")}
                        </span>
                    </StyledNameInputLabel>
                    <Textfield
                        autoFocus
                        defaultValue=""
                        maxLength={100}
                        onChange={setName}
                        dataAutomation="save-new-search-modal-input"
                    />
                </StyledNameInputContainer>
                <StyledButtonsContainer>
                    <Button
                        type="flat"
                        onClick={onCancel}
                        isDisabled={isSubmitting}
                        dataAutomation="save-new-search-modal-button-cancel"
                    >
                        {translate("si.common.button.cancel")}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        isDisabled={!isNameLongEnough || isSubmitting}
                        dataAutomation="save-new-search-modal-button-submit"
                    >
                        {translate("si.components.save_new_search_modal.button.submit.primary")}
                    </Button>
                </StyledButtonsContainer>
            </StyledModalContent>
        </ProModal>
    );
};

export default SaveSearchModal;
