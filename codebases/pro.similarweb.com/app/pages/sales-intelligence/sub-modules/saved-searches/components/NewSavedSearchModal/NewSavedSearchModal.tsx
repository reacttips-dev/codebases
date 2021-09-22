import React, { useState } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { ProModal } from "components/Modals/src/ProModal";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { isSearchNameLongEnough } from "../../helpers";
import {
    StyledModalContent,
    StyledModalTitle,
    StyledModalSubtitle,
    StyledNameInputContainer,
    StyledNameInputLabel,
    StyledModalBody,
    StyledModalFooter,
    StyledUpdateSection,
    StyledUpdateDescription,
} from "./styles";

type NewSavedSearchModalProps = {
    isOpen: boolean;
    loading: boolean;
    autoRerunAvailable: boolean;
    autoRerunActivated?: boolean;
    onClose(): void;
    onSave(name: string, autoRerunActivated: boolean): void;
};

const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 460 },
};
const NewSavedSearchModal = (props: NewSavedSearchModalProps) => {
    const translate = useTranslation();
    const {
        isOpen,
        loading,
        autoRerunAvailable,
        autoRerunActivated = autoRerunAvailable,
        onClose,
        onSave,
    } = props;
    const [searchName, setSearchName] = React.useState("");
    const [autoRerunChecked, setAutoRerunChecked] = useState(autoRerunActivated);
    const isNameLongEnough = isSearchNameLongEnough(searchName);

    function handleSave() {
        if (isNameLongEnough) {
            onSave(searchName.trim(), autoRerunChecked);
        }
    }

    React.useEffect(() => {
        setAutoRerunChecked(autoRerunActivated);
    }, [autoRerunActivated]);

    return (
        <ProModal
            isOpen={isOpen}
            showCloseIcon={false}
            customStyles={CUSTOM_MODAL_STYLES}
            shouldCloseOnOverlayClick={false}
        >
            <StyledModalContent>
                <StyledModalBody>
                    <StyledModalTitle>
                        {translate("si.components.save_search_modal.title")}
                    </StyledModalTitle>
                    <StyledModalSubtitle>
                        <span>{translate("si.components.save_search_modal.subtitle")}</span>
                    </StyledModalSubtitle>
                    {/* TODO: Extract label + input to a separate component for re-use */}
                    <StyledNameInputContainer>
                        <StyledNameInputLabel>
                            <span>{translate("si.components.save_search_modal.input_label")}</span>
                        </StyledNameInputLabel>
                        <Textfield
                            autoFocus
                            maxLength={100}
                            defaultValue=""
                            onChange={setSearchName}
                            dataAutomation="si-components-save-search-modal-input"
                        />
                    </StyledNameInputContainer>
                </StyledModalBody>
                <StyledUpdateSection>
                    <StyledUpdateDescription>
                        <span>
                            {translate("si.components.save_search_modal.checkbox.description")}
                        </span>
                    </StyledUpdateDescription>
                </StyledUpdateSection>
                <StyledModalFooter>
                    <Button type="flat" onClick={onClose}>
                        {translate("si.components.save_search_modal.button.cancel")}
                    </Button>
                    <Button
                        type="primary"
                        isLoading={loading}
                        onClick={handleSave}
                        isDisabled={!isNameLongEnough || loading}
                    >
                        {translate("si.components.save_search_modal.button.save")}
                    </Button>
                </StyledModalFooter>
            </StyledModalContent>
        </ProModal>
    );
};

export default NewSavedSearchModal;
