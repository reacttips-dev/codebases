import { colorsPalettes, rgba } from "@similarweb/styles";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { ConfirmationModal, IConfirmationModalProps } from "./ConfirmationModal";

const FreeText = styled.p`
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    font-size: 14px;
    padding-top: 15px;
    min-height: 68px;
`;

const Header = styled.h2`
    line-height: 24px;
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    color: ${colorsPalettes.carbon["500"]};
`;

interface IConfirmationTextModalProps extends IConfirmationModalProps {
    headerText: string;
    contentText: React.ReactNode;
    extraComponent?: React.ReactNode;
}

export const ConfirmationTextModal: StatelessComponent<IConfirmationTextModalProps> = (props) => {
    const { headerText, contentText, extraComponent, ...modalProps } = props;
    return (
        <>
            <ConfirmationModal {...modalProps}>
                <Header>{headerText}</Header>
                <FreeText>{contentText}</FreeText>
            </ConfirmationModal>
            {extraComponent}
        </>
    );
};

ConfirmationTextModal.displayName = "ConfirmationTextModal";
