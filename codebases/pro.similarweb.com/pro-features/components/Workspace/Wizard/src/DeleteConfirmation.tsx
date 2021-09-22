import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { ConfirmationModal, IConfirmationModalProps } from "../../../Modals/src/ConfirmationModal";
import I18n from "../../../WithTranslation/src/I18n";

interface IDeleteConfirmationProps {
    isOpen: boolean;
    onCloseClick: () => void;
    onCancelClick: () => void;
    onApproveClick: () => void;
    arenaName: string;
    deleteButtonIsDisabled?: boolean;
    deleteButtonIsLoading?: boolean;
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

export const DeleteConfirmation: StatelessComponent<IDeleteConfirmationProps> = (
    {
        onCancelClick,
        onApproveClick,
        isOpen,
        onCloseClick,
        arenaName,
        deleteButtonIsDisabled = false,
        deleteButtonIsLoading = false,
    },
    { translate },
) => {
    return (
        <ConfirmationModal
            onCancelClick={onCancelClick}
            onApproveClick={onApproveClick}
            onCloseClick={onCloseClick}
            isOpen={isOpen}
            approveButtonText={translate("workspace.marketing.wizard.delete.ok")}
            cancelButtonText={translate("workspace.marketing.wizard.delete.cancel")}
            approveButtonIsLoading={deleteButtonIsLoading}
        >
            <DeleteConfirmationContainer>
                <DeleteConfirmationIcon iconName="warning" size="xl" />
                <DeleteConfirmationTitle>
                    <I18n>workspace.marketing.wizard.delete.title</I18n>
                </DeleteConfirmationTitle>
                <DeleteConfirmationSubtitle>
                    <I18n dataObj={{ arena: arenaName }}>
                        workspace.marketing.wizard.delete.subtitle
                    </I18n>
                </DeleteConfirmationSubtitle>
            </DeleteConfirmationContainer>
        </ConfirmationModal>
    );
};

DeleteConfirmation.displayName = "DeleteConfirmation";
DeleteConfirmation.contextTypes = {
    translate: PropTypes.func,
};
