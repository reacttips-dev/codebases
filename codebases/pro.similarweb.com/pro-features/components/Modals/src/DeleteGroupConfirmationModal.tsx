import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import I18n from "components/React/Filters/I18n";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { FC } from "react";
import styled from "styled-components";
import { ConfirmationModal } from "../../../../.pro-features/components/Modals/src/ConfirmationModal";

export interface IDeleteGroupConfirmationModalProps {
    onCancelClick: () => void;
    onApproveClick: () => void;
    onCloseClick: () => void;
    isOpen: boolean;
    groupname: string;
    confirmationTitle: string;
    confirmationSubtitle: string;
}

const DeleteConfirmationContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const DeleteConfirmationTitle = styled.div`
    margin-top: 23px;
    margin-bottom: 12px;
    ${setFont({ $size: 24, $color: colorsPalettes.carbon[200] })};
`;

const DeleteConfirmationSubtitle = styled.div`
    margin-bottom: 30px;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[200] })};
`;

const DeleteConfirmationIcon = styled(SWReactIcons)`
    margin-top: 18px;
`;

export const DeleteGroupConfirmationModal: FC<IDeleteGroupConfirmationModalProps> = ({
    onCancelClick,
    onApproveClick,
    onCloseClick,
    isOpen,
    groupname,
    confirmationTitle,
    confirmationSubtitle,
}) => {
    return (
        <ConfirmationModal
            onCancelClick={onCancelClick}
            onApproveClick={onApproveClick}
            onCloseClick={onCloseClick}
            isOpen={isOpen}
            approveButtonText={i18nFilter()("conversion.delete.segment.group.ok")}
            cancelButtonText={i18nFilter()("conversion.delete.segment.group.cancel")}
        >
            <DeleteConfirmationContainer>
                <DeleteConfirmationIcon iconName="warning" size="xl" />
                <DeleteConfirmationTitle>
                    <I18n dataObj={{ groupname }}>{confirmationTitle}</I18n>
                </DeleteConfirmationTitle>
                <DeleteConfirmationSubtitle>
                    <I18n dataObj={{ groupname }}>{confirmationSubtitle}</I18n>
                </DeleteConfirmationSubtitle>
            </DeleteConfirmationContainer>
        </ConfirmationModal>
    );
};
