import * as React from "react";
import styled from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "../../../../filters/ngFilters";
import { ConfirmationTextModal } from "../../../../../.pro-features/components/Modals/src/ConfirmationTextModal";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

const OptionButton = styled(IconButton)`
    margin-right: 0px;
    svg path {
        fill-opacity: 1;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    ${OptionButton} {
        &:last-child {
            margin-right: 0;
        }
    }
`;

export interface IMarketingWorkspaceDrillDownEllipsisProps {
    onGroupRowDelete: (groupRowSource: any) => void; //todo
    onGroupRowEdit: (groupRowSource: any) => void; //todo
    onGroupRowDuplicate?: (groupRowSource: any) => void; //todo
    onDownloadExcel: () => void; //todo
    groupRowSource: any;
    getConfirmationContentText: (groupRowSource: any) => string; //todo
    getConfirmationHeaderText: (groupRowSource: any) => string; //todo
    editable?: boolean;
    deletable?: boolean;
    duplicateable?: boolean;
    duplicateInProgress?: boolean;
    onDeleteClick?: () => void;
    onCloseClick?: () => void;
}

export interface IMarketingWorkspaceDrillDownEllipsisState {
    isConfirmationOpen: boolean;
}

export class MarketingWorkspaceDrillDownEllipsis extends React.Component<
    IMarketingWorkspaceDrillDownEllipsisProps,
    IMarketingWorkspaceDrillDownEllipsisState
> {
    public static defaultProps = {
        editable: true,
        deletable: true,
        duplicateable: false,
    };

    private readonly i18n;

    constructor(props, context) {
        super(props, context);
        this.state = {
            isConfirmationOpen: false,
        };
        this.i18n = i18nFilter();
    }

    private setStateAsync = (newState) => {
        return new Promise<void>((resolve) => {
            this.setState(newState, resolve);
        });
    };

    private closeConfirmation = async () => {
        await this.setStateAsync({ isConfirmationOpen: false });
    };

    private onConfirmationCloseClick = async () => {
        if (this.props.onCloseClick) {
            this.props.onCloseClick();
        }
        await this.closeConfirmation();
    };
    private onConfirmationCancelClick = async () => {
        if (this.props.onCloseClick) {
            this.props.onCloseClick();
        }
        await this.closeConfirmation();
    };
    private onConfirmationApproveClick = async () => {
        const { onGroupRowDelete, groupRowSource } = this.props;
        onGroupRowDelete(groupRowSource);
        await this.closeConfirmation();
    };

    private onDeleteClick = (groupRowSource) => async () => {
        if (this.props.onDeleteClick) {
            this.props.onDeleteClick();
        }
        await this.setStateAsync({ confirmationItem: groupRowSource, isConfirmationOpen: true });
    };

    private onDuplicateClick = (groupRowSource) => async () => {
        if (typeof this.props.onGroupRowDuplicate === "function") {
            this.props.onGroupRowDuplicate(groupRowSource);
        }
    };

    render() {
        const {
            getConfirmationHeaderText,
            getConfirmationContentText,
            onGroupRowEdit,
            groupRowSource,
            onDownloadExcel,
        } = this.props;
        return (
            <>
                <ButtonGroup>
                    <OptionButton type="flat" iconName="excel" onClick={onDownloadExcel} />
                    {this.props.editable && (
                        <OptionButton
                            type="flat"
                            iconName="edit-icon"
                            onClick={() => onGroupRowEdit(groupRowSource)}
                        />
                    )}
                    {this.props.deletable && (
                        <OptionButton
                            type="flat"
                            iconName="delete"
                            onClick={this.onDeleteClick(groupRowSource)}
                        />
                    )}
                    {this.props.duplicateable && (
                        <PlainTooltip
                            tooltipContent={this.i18n("keyword.groups.sharing.duplicate.tooltip")}
                            placement="top"
                        >
                            <span>
                                <OptionButton
                                    isLoading={this.props.duplicateInProgress}
                                    type="flat"
                                    iconName="copy-and-edit"
                                    onClick={this.onDuplicateClick(groupRowSource)}
                                />
                            </span>
                        </PlainTooltip>
                    )}
                </ButtonGroup>
                <ConfirmationTextModal
                    key={`MarketingWorkspaceEllipsisConfirmation`}
                    isOpen={this.state.isConfirmationOpen}
                    onCloseClick={this.onConfirmationCloseClick}
                    onCancelClick={this.onConfirmationCancelClick}
                    onApproveClick={this.onConfirmationApproveClick}
                    cancelButtonText={this.i18n("workspaces.grouprow.confirmaion.cancel.button")}
                    approveButtonText={this.i18n("workspaces.grouprow.confirmaion.ok.button")}
                    headerText={getConfirmationHeaderText(groupRowSource)}
                    contentText={getConfirmationContentText(groupRowSource)}
                />
            </>
        );
    }
}
