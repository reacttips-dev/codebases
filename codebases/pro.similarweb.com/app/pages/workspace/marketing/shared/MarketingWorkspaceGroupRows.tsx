import * as React from "react";
import { GroupRowsContainer } from "../../../../../.pro-features/components/Workspace/GroupRow/src/GroupRow.styled";
import { StyledBoxWithBorder } from "../../../../../.pro-features/styled components/Workspace/src/StyledWorkspaceBox";
import { GroupRow } from "../../../../../.pro-features/components/Workspace/GroupRow/src/GroupRow";
import swLog from "@similarweb/sw-log";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { IconButton } from "@similarweb/ui-components/dist/button";
import I18n from "../../../../components/React/Filters/I18n";
import { ConfirmationTextModal } from "../../../../../.pro-features/components/Modals/src/ConfirmationTextModal";
import { i18nFilter } from "filters/ngFilters";

export interface IMarketingWorkspaceGroupRowsProps {
    isNoData: (any) => boolean; //todo
    sortRows: (a, b) => number; //todo
    onGroupRowClick: (groupRowSource: any) => () => void; //todo
    onGroupRowDelete: (groupRowSource: any) => void; //todo
    onGroupRowEdit: (groupRowSource: any) => void; //todo
    createGroupRowProps: (groupRowSource: any, groupRowData: any) => void; //todo
    createNoDataGroupRowProps: (groupRowSource: any, groupRowData: any) => void; //todo
    createErrorDataGroupRowProps: (any) => void; //todo
    groupRowSources: any[]; //todo
    loadFromGroupRowSource: (any) => Promise<any>; //todo
    getConfirmationContentText: (groupRowSource: any) => string; //todo
    getConfirmationHeaderText: (groupRowSource: any) => string; //todo
}
export interface IMarketingWorkspaceGroupRowsState {
    isConfirmationOpen: boolean;
    confirmationItem: any;
    groupRows: any[];
    groupRowsNoData: any[];
    groupRowsLoading: any[];
    groupRowsError: any[];
    isLoading: boolean;
}
export class MarketingWorkspaceGroupRows extends React.Component<
    IMarketingWorkspaceGroupRowsProps,
    IMarketingWorkspaceGroupRowsState
> {
    private loadingCounter;
    private readonly i18n;
    constructor(props, context) {
        super(props, context);
        this.state = {
            isConfirmationOpen: false,
            confirmationItem: null,
            groupRows: [],
            groupRowsNoData: [],
            groupRowsLoading: [],
            groupRowsError: [],
            isLoading: false,
        };
        this.i18n = i18nFilter();
    }

    public async componentWillMount() {
        await this.loadGroupRowsAndUpdateState();
    }

    private setStateAsync = (newState) => {
        return new Promise<void>((resolve) => {
            this.setState(newState, resolve);
        });
    };

    private sortRow = (a, b) => {
        const _a = a.groupRowProps.titles.groupRowTitle;
        const _b = b.groupRowProps.titles.groupRowTitle;
        return this.props.sortRows(_a, _b);
    };

    //Called from parent via ref
    public async loadGroupRowsAndUpdateState() {
        if (this.state.isLoading) return;
        const groupRows = [],
            groupRowsNoData = [],
            groupRowsError = [];
        const groupRowsLoading = Array.from(Array(this.props.groupRowSources.length), () => ({
            groupRowProps: { loading: true },
        }));
        await this.setStateAsync({
            groupRows,
            groupRowsNoData,
            groupRowsLoading,
            groupRowsError,
            isLoading: true,
        });
        this.loadingCounter = this.props.groupRowSources.length;
        this.props.groupRowSources.map(this.loadGroupRowAndUpdateState);
    }

    private loadFromGroupRowSourceDone() {
        this.loadingCounter--;
        if (this.loadingCounter === 0) {
            this.setState({ isLoading: false });
        }
    }

    private onDropdownClick = (groupRowSource) => async (dropDownItem) => {
        const { onGroupRowEdit } = this.props;
        switch (dropDownItem.id) {
            case "group_row_edit":
                onGroupRowEdit(groupRowSource);
                break;
            case "group_row_delete":
                await this.setStateAsync({
                    confirmationItem: groupRowSource,
                    isConfirmationOpen: true,
                });
                break;
        }
    };

    public loadGroupRowAndUpdateState = async (groupRowSource) => {
        const {
            isNoData,
            onGroupRowClick,
            createGroupRowProps,
            createNoDataGroupRowProps,
            createErrorDataGroupRowProps,
        } = this.props;
        this.props
            .loadFromGroupRowSource(groupRowSource)
            .then((groupRowData) => {
                const groupRowsLoading = [...this.state.groupRowsLoading];
                groupRowsLoading.shift();
                this.setState({ groupRowsLoading });
                if (isNoData(groupRowData)) {
                    let groupRowsNoData = [...this.state.groupRowsNoData];
                    groupRowsNoData.push({
                        onDropdownClick: this.onDropdownClick(groupRowSource),
                        groupRowProps: createNoDataGroupRowProps(groupRowSource, groupRowData),
                    });
                    groupRowsNoData.sort(this.sortRow);
                    this.setState({ groupRowsNoData });
                } else {
                    let groupRows = [...this.state.groupRows];
                    groupRows.push({
                        onDropdownClick: this.onDropdownClick(groupRowSource),
                        onGroupRowClick: onGroupRowClick(groupRowSource),
                        groupRowProps: createGroupRowProps(groupRowSource, groupRowData),
                    });
                    groupRows.sort(this.sortRow);
                    this.setState({ groupRows });
                }
                this.loadFromGroupRowSourceDone();
            })
            .catch((error) => {
                swLog.error(error);
                const groupRowsLoading = [...this.state.groupRowsLoading];
                groupRowsLoading.shift();
                let groupRowsError = [...this.state.groupRowsError];
                groupRowsError.push({ groupRowProps: createErrorDataGroupRowProps(error) });
                this.setState({ groupRowsError });
                this.loadFromGroupRowSourceDone();
            });
    };

    private closeConfirmation = async () => {
        await this.setStateAsync({ confirmationItem: null, isConfirmationOpen: false });
    };

    public onConfirmationCloseClick = async () => {
        await this.closeConfirmation();
    };
    public onConfirmationCancelClick = async () => {
        await this.closeConfirmation();
    };
    public onConfirmationApproveClick = async () => {
        this.props.onGroupRowDelete(this.state.confirmationItem);
        await this.closeConfirmation();
    };

    public render() {
        const { getConfirmationHeaderText, getConfirmationContentText } = this.props;
        return (
            <GroupRowsContainer>
                {this.renderRows(this.state.groupRows, "groupRows")}
                {this.renderRows(this.state.groupRowsNoData, "groupRowsNoData")}
                {this.renderRows(this.state.groupRowsLoading, "groupRowsLoading")}
                {this.renderRows(this.state.groupRowsError, "groupRowsError")}
                <ConfirmationTextModal
                    isOpen={this.state.isConfirmationOpen}
                    onCloseClick={this.onConfirmationCloseClick}
                    onCancelClick={this.onConfirmationCancelClick}
                    onApproveClick={this.onConfirmationApproveClick}
                    cancelButtonText={this.i18n("workspaces.grouprow.confirmaion.cancel.button")}
                    approveButtonText={this.i18n("workspaces.grouprow.confirmaion.ok.button")}
                    headerText={getConfirmationHeaderText(this.state.confirmationItem)}
                    contentText={getConfirmationContentText(this.state.confirmationItem)}
                />
            </GroupRowsContainer>
        );
    }

    private renderRows(rows, id) {
        return rows.map((row, i) => {
            const { onDropdownClick, onGroupRowClick, groupRowProps } = row;
            const optionalParams = { onClick: () => undefined };
            if (onGroupRowClick) optionalParams.onClick = onGroupRowClick;
            return (
                <StyledBoxWithBorder key={`${id}-${i}`}>
                    <div {...optionalParams}>
                        <GroupRow {...groupRowProps} />
                    </div>
                    {onDropdownClick && (
                        <div className="GroupRowEllipsis">
                            <Dropdown
                                dropdownPopupPlacement="bottom-right"
                                width={220}
                                buttonWidth={37}
                                cssClassContainer="DropdownContent-container"
                                onClick={onDropdownClick}
                            >
                                <IconButton iconName="dots-more" type="flat" />
                                <EllipsisDropdownItem id="group_row_edit" iconName="edit-icon">
                                    <I18n>workspaces.grouprow.ellipsis.edit</I18n>
                                </EllipsisDropdownItem>
                                <EllipsisDropdownItem id="group_row_delete" iconName="delete">
                                    <I18n>workspaces.grouprow.ellipsis.delete</I18n>
                                </EllipsisDropdownItem>
                            </Dropdown>
                        </div>
                    )}
                </StyledBoxWithBorder>
            );
        });
    }
}
