import { Button, ButtonLabel, IconButton } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { Component } from "react";
import styled from "styled-components";
import { ProModal } from "../../Modals/src/ProModal";
import { WithContext } from "../../Workspace/Wizard/src/WithContext";
import { Footer, ModalSubtitle, ModalTitle, TitleContainer } from "./SelectWorkspaceTrialModal";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";

export interface IThankYouModalProps {
    isOpen: boolean;
    onCloseClick: () => void;
    title: string;
    ThankUModalImage?: any;
    hasGaToken?: boolean;
    privacyStatus?: string;
    gaButtonLabel?: string;
    onGAButtonClick?: () => void;
    subtitle?: string;
    closeLabel: string;
}
const modalStyle: any = {
    customStyles: {
        content: {
            boxSizing: "content-box",
            width: "500px",
            padding: "16px",
        },
    },
};
const StyledModalTitle = styled(ModalTitle)`
    font-size: 20px;
    margin-bottom: 24px;
    line-height: 24px;
`;

const StyledTitleContainer = styled(TitleContainer)`
    justify-content: center;
    margin-top: 30px;
`;

const StyledFooter = styled(Footer)`
    margin: 0px;
`;
const CustomButton = styled.span`
    align-items: center;
    display: flex;
    &:hover {
        cursor: pointer;
    }
    margin-right: 20px;
`;
const Label = styled.span`
    text-align: center;
    font-size: 0.875rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-left: 4px;
    color: ${colorsPalettes.blue["400"]};
    &:hover {
        color: ${colorsPalettes.blue["500"]};
    }
`;

export class ThankYouModal extends Component<IThankYouModalProps, any> {
    constructor(props) {
        super(props);
    }
    public render() {
        const {
            isOpen,
            onCloseClick,
            title,
            subtitle,
            closeLabel,
            ThankUModalImage,
            gaButtonLabel,
            onGAButtonClick,
            hasGaToken,
            privacyStatus,
        } = this.props;
        return (
            <WithContext>
                {({ translate }) => {
                    return (
                        <ProModal isOpen={isOpen} onCloseClick={onCloseClick} {...modalStyle}>
                            <StyledTitleContainer>
                                <StyledModalTitle>{translate(title)}</StyledModalTitle>
                            </StyledTitleContainer>
                            {subtitle && (
                                <StyledModalSubtitle>{translate(subtitle)}</StyledModalSubtitle>
                            )}
                            {ThankUModalImage && <ThankUModalImage />}
                            <StyledFooter>
                                {gaButtonLabel && privacyStatus !== "Public" && !hasGaToken && (
                                    <CustomButton onClick={onGAButtonClick}>
                                        <SWReactIcons size="xs" iconName="ga-icon" />
                                        <Label>{translate(gaButtonLabel)}</Label>
                                    </CustomButton>
                                )}
                                <Button onClick={onCloseClick} type="primary">
                                    <ButtonLabel>{translate(closeLabel)}</ButtonLabel>
                                </Button>
                            </StyledFooter>
                        </ProModal>
                    );
                }}
            </WithContext>
        );
    }
}

const StyledModalSubtitle = styled(ModalSubtitle)`
    max-width: 70%;
`;
