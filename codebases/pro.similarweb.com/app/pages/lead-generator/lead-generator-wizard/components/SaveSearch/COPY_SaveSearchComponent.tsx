// [InvestorsSeparation] Copy of the original file. Will be removed soon.
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    deleteSearchList,
    ISaveSalesReportQuery,
    runAutoRerun,
    saveSearchList,
    updateSearchList,
} from "actions/COPY_leadGeneratorActions";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { ProModal } from "components/Modals/src/ProModal";
import {
    WorkspaceContext,
    workspaceContextType,
} from "pages/workspace/common components/WorkspaceContext";
import { commonActionCreators } from "pages/workspace/common/actions_creators/COPY_common_worksapce_action_creators";
import { ISavedSearchesItem } from "pages/workspace/common/types";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import SalesWorkspaceApiService from "services/workspaces/salesWorkspaceApiService";
import { SaveSearchPopUp } from "./popup/SaveSearchPopUp";
import { COPYselectSavedSearchesList } from "./selectors";
import {
    StyledSaveSearchActionsWrapper,
    StyledSaveSearchSettingIconWrapper,
} from "./StyledSaveSearchComponent";
import SaveNewSearchButton from "pages/workspace/sales/saved-searches/SaveNewSearchButton/SaveNewSearchButton";
import {
    selectSearchesWithAutoReRunEnabled,
    selectSearchesAutoReRunLimitCount,
} from "pages/workspace/sales/selectors";
import { RootState, ThunkDispatchCommon } from "store/types";

const ProModalCustomStyles = {
    content: {
        width: "600px",
        padding: "20px 16px 16px 24px",
    },
};
const MODAL_CLOSE_TIMEOUT = 0;

interface ISaveSearchProps {
    onSaveSearchList: (params: ISaveSalesReportQuery, queryId: string) => {};
    onUpdateSearchList: (params: ISaveSalesReportQuery, queryId: string) => {};
    onRunAutoRerun: (params: ISaveSalesReportQuery, queryId: string) => {};
    onDeleteSearchList: (nameSearchList: string, queryId: string) => {};
    activeSavedSearchListData: ISavedSearchesItem;
    queryId: string;
    totalResultCount: number;
    filters: any;
    isTableLoading: boolean;
    searchesReRunLimitCount: number;
    searchesWithEnabledAutoReRun: ISavedSearchesItem[];
    unSelectActiveSearchList(): VoidFunction;
}

interface ISaveSearchState {
    isShowPopup: boolean;
    isLoading: boolean;
    isShowDeleteBtn: boolean;
    isShowSaveBtn: boolean;
}

class SaveSearch extends PureComponent<ISaveSearchProps, ISaveSearchState> {
    public static contextType = WorkspaceContext;

    private swNavigator = Injector.get<any>("swNavigator");
    private workspaceIdInUrl = "";

    constructor(props, context: workspaceContextType) {
        super(props, context);

        this.state = {
            isShowPopup: false,
            isLoading: false,
            isShowDeleteBtn: false,
            isShowSaveBtn:
                context.isFeatureEnabled("saved-searches") &&
                !this.swNavigator.getParams().searchId,
        };

        this.workspaceIdInUrl = this.swNavigator.getParams().workspaceId;
    }

    public onClickSaveSearchBtn = () => {
        if (this.props.isTableLoading) {
            return;
        }

        this.setState({ isShowPopup: true });

        const { filters, totalResultCount } = this.props;
        const filtersLen = Object.keys(filters).length;
        TrackWithGuidService.trackWithGuid("workspaces.sales.saved_searches.pop_up.open", "open", {
            results: totalResultCount || "0",
            filters: filtersLen >= 2 ? "" + (filtersLen - 2) : "0",
        });
    };

    public onCloseSaveSearchModal = (checked) => {
        if (this.state.isShowDeleteBtn) {
            TrackWithGuidService.trackWithGuid(
                "workspaces.sales.saved_searches.edit.pop_up.close",
                "click",
                {},
            );
        } else {
            TrackWithGuidService.trackWithGuid(
                "workspaces.sales.saved_searches.pop_up.create.mode.cancel",
                "click",
                {
                    isAutoRerunActivated: "" + checked,
                },
            );
        }

        this.setState({
            isShowPopup: false,
            isShowDeleteBtn: false,
        });
    };

    public onRunSaveSearchResult = async (inputValue, checked) => {
        this.setState({ isShowPopup: false });

        if (this.state.isLoading) {
            return;
        }

        this.setState({ isLoading: true });

        const { queryId } = this.props;

        if (this.state.isShowDeleteBtn) {
            await this.props.onUpdateSearchList(
                {
                    name: inputValue,
                    autoRerunActivated: this.props?.activeSavedSearchListData?.queryDefinition
                        ?.auto_rerun_activated,
                    workspaceId: this.workspaceIdInUrl,
                },
                queryId,
            );

            TrackWithGuidService.trackWithGuid(
                "workspaces.sales.saved_searches.edit.pop_up.update",
                "click",
                {
                    value: inputValue,
                },
            );
        } else {
            await this.props.onSaveSearchList(
                {
                    name: inputValue,
                    autoRerunActivated: checked,
                    workspaceId: this.workspaceIdInUrl,
                },
                queryId,
            );

            TrackWithGuidService.trackWithGuid(
                "workspaces.sales.saved_searches.pop_up.create.mode.save",
                "click",
                {
                    isAutoRerunActivated: "" + checked,
                },
            );

            this.swNavigator.$state.go(this.swNavigator.$state.current, {}, { reload: true });
        }

        this.setState({
            isLoading: false,
            isShowSaveBtn: false,
        });
    };

    public onToggle = async (isSelected: boolean) => {
        if (this.state.isLoading) {
            return;
        }

        this.setState({ isLoading: true });

        await this.props.onRunAutoRerun(
            {
                name: this.props.activeSavedSearchListData?.queryDefinition?.name,
                autoRerunActivated: isSelected,
                workspaceId: this.workspaceIdInUrl,
            },
            this.props.queryId,
        );

        TrackWithGuidService.trackWithGuid(
            "workspaces.sales.saved_searches.toggle.auto-rerun",
            "click",
            {
                value: isSelected ? "on" : "off",
            },
        );

        this.setState({ isLoading: false });
    };

    public onClickSettingsIcon = () => {
        this.setState({
            isShowPopup: true,
            isShowDeleteBtn: true,
        });

        TrackWithGuidService.trackWithGuid("workspaces.sales.saved_searches.edit.pop_up", "click", {
            value: this.props?.activeSavedSearchListData?.queryDefinition?.name,
        });
    };

    public onDeleteSaveSearchResult = async (nameSearchList) => {
        if (this.state.isLoading) {
            return;
        }

        this.setState({ isLoading: true });

        this.setState({
            isShowPopup: false,
            isShowDeleteBtn: false,
        });

        const { lastRun } = this.props?.activeSavedSearchListData;

        TrackWithGuidService.trackWithGuid(
            "workspaces.sales.saved_searches.edit.pop_up.delete",
            "click",
            {
                oldResult: lastRun?.resultCount || "0", // TODO must use the string "0" if you have an int 0 value
                newResult: lastRun?.newSinceLastRun || "0", // TODO must use the string "0" if you have an int 0 value
            },
        );

        await this.props.onDeleteSearchList(nameSearchList, this.props.queryId);

        this.props.unSelectActiveSearchList();
        this.setState({ isLoading: false });

        this.swNavigator.$state.go(this.swNavigator.$state.current, {}, { reload: true });
    };

    render() {
        const {
            isTableLoading,
            activeSavedSearchListData,
            searchesReRunLimitCount,
            searchesWithEnabledAutoReRun,
        } = this.props;
        const savedSearchListName = activeSavedSearchListData?.queryDefinition?.name ?? "";
        const saveSearchCreateDate = activeSavedSearchListData?.queryDefinition?.created_date;
        const saveSearchUsedDomains = activeSavedSearchListData?.queryDefinition?.used_result_count;
        const lastRunResultCount = activeSavedSearchListData?.lastRun.resultCount;

        return (
            <>
                {this.state.isShowSaveBtn ? (
                    <SaveNewSearchButton
                        disabled={isTableLoading}
                        onClick={this.onClickSaveSearchBtn}
                    />
                ) : (
                    <StyledSaveSearchActionsWrapper>
                        <StyledSaveSearchSettingIconWrapper>
                            <IconButton
                                onClick={this.onClickSettingsIcon}
                                type="flat"
                                iconName="settings"
                                dataAutomation="save-search-settings-button"
                            />
                        </StyledSaveSearchSettingIconWrapper>
                    </StyledSaveSearchActionsWrapper>
                )}
                <ProModal
                    customStyles={ProModalCustomStyles}
                    showCloseIcon={false}
                    isOpen={this.state.isShowPopup}
                    closeTimeoutMS={MODAL_CLOSE_TIMEOUT}
                >
                    <SaveSearchPopUp
                        showRerunCheckbox={false}
                        onClickCancel={this.onCloseSaveSearchModal}
                        onClickDone={this.onRunSaveSearchResult}
                        searchName={savedSearchListName}
                        resultCount={lastRunResultCount}
                        createdDate={saveSearchCreateDate}
                        usedDomains={saveSearchUsedDomains}
                        onClickDelete={this.onDeleteSaveSearchResult}
                        isShowDeleteBtn={this.state.isShowDeleteBtn}
                        reRunDisabled={
                            searchesWithEnabledAutoReRun.length >= searchesReRunLimitCount
                        }
                    />
                </ProModal>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    activeSavedSearchListData: COPYselectSavedSearchesList(),
    searchesReRunLimitCount: selectSearchesAutoReRunLimitCount(),
    searchesWithEnabledAutoReRun: selectSearchesWithAutoReRunEnabled(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    const api = new SalesWorkspaceApiService();
    const actionsObject = commonActionCreators({
        api,
        component: swSettings.components.SalesWorkspace,
    });
    const {
        unSelectActiveSearchList,
        saveSearchList: onSaveSearchList,
        updateSearchList: onUpdateSearchList,
        deleteSearchList: onDeleteSearchList,
        runAutoRerun: onRunAutoRerun,
    } = bindActionCreators(
        { ...actionsObject, saveSearchList, updateSearchList, deleteSearchList, runAutoRerun },
        dispatch,
    );

    return {
        onSaveSearchList,
        onUpdateSearchList,
        onDeleteSearchList,
        onRunAutoRerun,
        unSelectActiveSearchList,
    };
};

export const SaveSearchComponent = connect(mapStateToProps, mapDispatchToProps)(SaveSearch);
