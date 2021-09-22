import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledModalBody,
    StyledModalContent,
    StyledModalFooter,
    StyledModalSubtitle,
    StyledModalTitle,
} from "../../../../saved-searches/components/NewSavedSearchModal/styles";

type FiltersResetConfirmationModalProps = {
    isOpened: boolean;
    onCancel(): void;
    onConfirm(): void;
};

const CUSTOM_STYLES = {
    content: {
        height: 160,
        padding: 0,
        width: 460,
    },
};
const FiltersResetConfirmationModal = (props: FiltersResetConfirmationModalProps) => {
    const translate = useTranslation();
    const { isOpened, onCancel, onConfirm } = props;

    return (
        <ProModal
            isOpen={isOpened}
            showCloseIcon={false}
            customStyles={CUSTOM_STYLES}
            shouldCloseOnOverlayClick={false}
        >
            <StyledModalContent>
                <StyledModalBody>
                    <StyledModalTitle>
                        {translate("si.lead_gen_filters.reset_modal.title")}
                    </StyledModalTitle>
                    <StyledModalSubtitle>
                        {translate("si.lead_gen_filters.reset_modal.subtitle")}
                    </StyledModalSubtitle>
                </StyledModalBody>
                <StyledModalFooter>
                    <Button type="flat" onClick={onCancel}>
                        {translate("si.common.button.cancel")}
                    </Button>
                    <Button type="primary" onClick={onConfirm}>
                        {translate("si.lead_gen_filters.button.clear_confirm")}
                    </Button>
                </StyledModalFooter>
            </StyledModalContent>
        </ProModal>
    );
};

export default FiltersResetConfirmationModal;
