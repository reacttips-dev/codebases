import React from "react";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { ProModal } from "components/Modals/src/ProModal";
import {
    ButtonBox,
    CustomTitle,
    MainBox,
    modalWithHiddenOverlayStyles,
    Subtitle,
} from "pages/lead-generator/lead-generator-wizard/components/SaveSearch/StyledSaveSearchPopUp";
import I18n from "components/React/Filters/I18n";

const subtitleStyleOverrides = {
    marginTop: "15px",
    marginBottom: "95px",
    fontSize: "14px",
    color: "rgba(42, 62, 82, 0.8)",
};

interface ConfirmDialogProps {
    searchName: string;
    resultCount: number;
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDialog = ({
    onCancel,
    onConfirm,
    searchName,
    resultCount,
    isOpen,
}: ConfirmDialogProps) => (
    <ProModal customStyles={modalWithHiddenOverlayStyles} showCloseIcon={false} isOpen={isOpen}>
        <MainBox>
            <I18n component={CustomTitle}>
                workspace.sales.leadgenerator.results-page.delete.title
            </I18n>
            <I18n
                component={Subtitle}
                style={subtitleStyleOverrides}
                dataObj={{
                    searchName,
                    resultCount,
                }}
            >
                workspace.sales.leadgenerator.results-page.delete.subtitle
            </I18n>
            <ButtonBox>
                <Button type="flat" onClick={onCancel}>
                    <I18n component={ButtonLabel}>
                        workspace.sales.leadgenerator.results-page.delete.cancel
                    </I18n>
                </Button>
                <Button type="primary" buttonHtmlType="button" onClick={onConfirm}>
                    <I18n component={ButtonLabel}>
                        workspace.sales.leadgenerator.results-page.delete.confirm
                    </I18n>
                </Button>
            </ButtonBox>
        </MainBox>
    </ProModal>
);

export default ConfirmDialog;
