import React, { ReactChild } from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ProModal } from "components/Modals/src/ProModal";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    StyledContentOutOfLimitModal,
    StyledOutOfLimitModal,
    StyledFooterOutOfLimitModal,
    StyledTitleOutOfLimitModal,
} from "./styles";

const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 460, border: 0 },
    overlay: {
        backgroundColor: rgba(colorsPalettes.midnight["300"], 0.7),
    },
};

type OutOfLimitModalProps = {
    isOpen: boolean;
    onClose(): void;
    title: string;
    contentText: string | React.ReactChild;
};

const OutOfLimitModal = (props: OutOfLimitModalProps) => {
    const { isOpen, onClose, title, contentText } = props;
    const translate = useTranslation();

    return (
        <ProModal isOpen={isOpen} showCloseIcon={false} customStyles={CUSTOM_MODAL_STYLES}>
            <StyledOutOfLimitModal>
                <StyledTitleOutOfLimitModal>{title}</StyledTitleOutOfLimitModal>
                <StyledContentOutOfLimitModal>{contentText}</StyledContentOutOfLimitModal>
                <StyledFooterOutOfLimitModal>
                    <Button type="flat" onClick={onClose}>
                        {translate("GOT IT")}
                    </Button>
                </StyledFooterOutOfLimitModal>
            </StyledOutOfLimitModal>
        </ProModal>
    );
};

export default OutOfLimitModal;
