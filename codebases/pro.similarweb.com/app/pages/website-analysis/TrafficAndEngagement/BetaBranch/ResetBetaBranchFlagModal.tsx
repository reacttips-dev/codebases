import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";
import { ProModal } from "components/Modals/src/ProModal";
import { Footer } from "components/OptIn/components/SelectWorkspaceTrialModal";
import { colorsPalettes } from "@similarweb/styles";

export interface IResetBetaBranchFlagModalProps {
    isOpen: boolean;
    onCloseClick: () => void;
    onContinueClick: () => void;
    title: string;
    subtitle?: string;
    continueLabel: string;
    closeLabel: string;
}
const modalStyle: any = {
    customStyles: {
        content: {
            boxSizing: "content-box",
            width: "500px",
            padding: "0px",
        },
    },
};

export const ModalTitle = styled.div.attrs({
    "data-automation": "reset-beta-modal-title",
} as any)`
    line-spacing: 24px;
    color: ${colorsPalettes.carbon["500"]};
    font-weight: 500;
    margin-top: 5px;
    font-size: 20px;
    margin-bottom: 24px;
    line-height: 24px;
`;

export const ModalSubtitle = styled.div.attrs({
    "data-automation": "reset-beta-modal-subtitle",
} as any)`
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    margin-bottom: 12px;
    max-width: 90%;
    display: flex;
    color: ${colorsPalettes.carbon["300"]};
`;

export const TextContainer = styled.div`
    display: block;
    padding: 24px;
`;

const StyledFooter = styled(Footer)`
    padding: 12px 24px;
    margin-top: 0px;
    border-top: 1px solid ${colorsPalettes.carbon["100"]};
`;

export const ResetBetaBranchFlagModal: React.FC<IResetBetaBranchFlagModalProps> = (
    props: IResetBetaBranchFlagModalProps,
) => {
    const {
        isOpen,
        onCloseClick,
        onContinueClick,
        continueLabel,
        closeLabel,
        title,
        subtitle,
    } = props;

    return (
        <ProModal isOpen={isOpen} onCloseClick={onCloseClick} showCloseIcon={false} {...modalStyle}>
            <TextContainer>
                <ModalTitle>{i18nFilter()(title)}</ModalTitle>
                {subtitle && <ModalSubtitle>{i18nFilter()(subtitle)}</ModalSubtitle>}
            </TextContainer>
            <StyledFooter>
                <Button onClick={onCloseClick} type="flat">
                    <ButtonLabel>{i18nFilter()(closeLabel)}</ButtonLabel>
                </Button>
                <Button onClick={onContinueClick} type="primary">
                    <ButtonLabel>{i18nFilter()(continueLabel)}</ButtonLabel>
                </Button>
            </StyledFooter>
        </ProModal>
    );
};

const StyledModalSubtitle = styled(ModalSubtitle)`
    max-width: 70%;
`;
