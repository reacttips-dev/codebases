import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledModalContent,
    StyledModalBody,
    StyledModalTitle,
    StyledModalSubtitle,
    StyledModalFooter,
} from "../NewSavedSearchModal/styles";

type SavedSearchConfirmDeleteModalProps = {
    name: string;
    isOpen: boolean;
    numberOfResults: number;
    onCancel(): void;
    onConfirm(): void;
};

const CUSTOM_STYLES = {
    content: {
        height: 235,
        padding: 0,
        width: 460,
    },
    overlay: {
        backgroundColor: "transparent",
    },
};
const SavedSearchConfirmDeleteModal = (props: SavedSearchConfirmDeleteModalProps) => {
    const translate = useTranslation();
    const { isOpen, name, numberOfResults, onCancel, onConfirm } = props;

    return (
        <ProModal
            isOpen={isOpen}
            showCloseIcon={false}
            customStyles={CUSTOM_STYLES}
            shouldCloseOnOverlayClick={false}
        >
            <StyledModalContent>
                <StyledModalBody>
                    <StyledModalTitle>
                        {translate("si.components.save_search_modal.delete_confirm_title")}
                    </StyledModalTitle>
                    <StyledModalSubtitle>
                        <span>
                            {translate(
                                "si.components.save_search_modal.delete_confirm_subtitle_name",
                                { name },
                            )}
                        </span>
                        <br />
                        <span>
                            {translate(
                                "si.components.save_search_modal.delete_confirm_subtitle_results",
                                {
                                    numberOfResults,
                                },
                            )}
                        </span>
                    </StyledModalSubtitle>
                </StyledModalBody>
                <StyledModalFooter>
                    <Button type="flat" onClick={onCancel}>
                        {translate("si.components.save_search_modal.button.cancel")}
                    </Button>
                    <Button type="primary" onClick={onConfirm}>
                        {translate("si.components.save_search_modal.button.delete_confirm")}
                    </Button>
                </StyledModalFooter>
            </StyledModalContent>
        </ProModal>
    );
};

export default SavedSearchConfirmDeleteModal;
