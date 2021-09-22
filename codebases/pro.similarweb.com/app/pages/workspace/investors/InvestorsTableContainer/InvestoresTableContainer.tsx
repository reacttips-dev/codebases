import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import dayjs from "dayjs";
import queryString from "query-string";
import React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import UnlockModal from "../../../../../.pro-features/components/Modals/src/UnlockModal/UnlockModal";
import UnlockModalConfig from "../../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import AddOpportunitiesButton from "../../../../../.pro-features/pages/workspace/common components/AddOpportunitiesButton/src/AddOpportunitiesButton";
import { RecommendationsIndicator } from "../../../../../.pro-features/pages/workspace/common components/RecommendationsSidebar/RecommendationsIndicator";
import { QuotaAndUtilsContainer } from "../../../../../.pro-features/styled components/Workspace/src/StyledWorkspaceBox";
import { ISwSettings } from "../../../../@types/ISwSettings";
import { getCountries } from "../../../../components/filters-bar/utils";
import { ColumnsPickerModal } from "../../../../components/React/ColumnsPickerModal/ColumnsPickerModal";
import {
    CLEAR_HIGHLIGHT_CLICKED_ROW_EVENT,
    UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT,
} from "../../../../components/React/Table/FlexTable/Big/FlexTable";
import { defaultGetStableKey } from "../../../../components/React/Table/SWReactTable";
import { SWReactTableOptimizedWithSelection } from "../../../../components/React/Table/SWReactTableWrapperSelectionContext";
import { i18nFilter } from "../../../../filters/ngFilters";
import { allTrackers } from "../../../../services/track/track";
import InvestorsWorkspaceApiService from "../../../../services/workspaces/investorsWorkspaceApiService";
import { getTableToggleGroups } from "../../../lead-generator/lead-generator-exist/leadGeneratorExistConfig";
import { commonActionCreators } from "../../common/actions_creators/common_worksapce_action_creators";
import { ListHeader } from "../../common/ListHeader";
import { selectActiveOpportunityList } from "../../common/selectors";
import { TablePager } from "../../common/TablePager";
import { TableSelectionComponent } from "../../common/TableSelectionComponent";
import { IOpportunityListItem } from "../../common/types";
import { shouldLockModule } from "../../common/workspacesUtils";
import { DownloadExcelContainer, SearchContainer, TableWrapper } from "../../StyledComponent";
import { getColumns, getOptions } from "./InvestorsTableConfig";
import { QuotaIndicator } from "pages/workspace/common/QuotaIndicator";
import { DefaultFetchService } from "services/fetchService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { StyledInvestorsBoxTitleContainer } from "./styles";

export interface IInvestorsTableProps {
    isTableLoading: boolean;
    workspaceId: string;
    opportunityListId: string;
    enableFindOpportunities: boolean;
    data: any;
    opportunities: any;
    lastSnapshotDate: any;
    onFilter: (a) => void;
    onDataUpdate: () => void;
    setLoadingTable: () => void;
    onRemoveOpportunities: (a) => void;
    openWebsitesModal: () => void;
    onFindWebsites: () => void;
    goToDashboardTemplate: (a, b, c, d, e?) => void;
    showErrorToast: (text) => void;
    editOpportunityList: (activeWorkspaceId, list) => void;
    activeWorkspaceId: string;
    activeList: IOpportunityListItem;
    isRecommendationsLoading: boolean;
    isRecommendationOpen: boolean;
    isRightBarOpen: boolean;
    recommendationsNumber: number;
    toggleRecommendations: (isOpen?) => void;
    searchTableList: (term: string) => void;
    sortTableList: (orderBy: string) => void;
    tableSearchTerm: string;

    onRowSelected(row);

    changeCountry(
        workspaceId: string,
        opportunityListId: string,
        activeList: IOpportunityListItem,
        country: number,
    );
}

export interface IInvestorsTableState {
    visibleColumns: boolean[];
    sortedColumn: { field: string; sortDirection: string };
    page: number;
    isColumnsPickerOpen: boolean;
    opportunityListId: string;
    countries: any[];
    isUnlockModalOpen?: boolean;
    unlockModalConfig?: string;
    quota: any;
}

class TableContainer extends PureComponent<IInvestorsTableProps, IInvestorsTableState> {
    public swNavigator: any;
    public swSettings: ISwSettings;
    private tableToggleGroups: any;
    private columns = getColumns();
    private itemsPerPage = 100;
    private isCustomMetricsLocked: boolean;
    private isExcelAllowed: boolean;

    constructor(props, context) {
        super(props, context);
        this.swNavigator = Injector.get<any>("swNavigator");
        this.swSettings = swSettings;
        this.tableToggleGroups = getTableToggleGroups().map((obj) => ({
            ...obj,
            displayName: i18nFilter()(obj.displayName),
        }));
        this.isCustomMetricsLocked = shouldLockModule(
            this.swSettings.components.WsCustomMetrics.resources.AvaliabilityMode,
        );
        this.isExcelAllowed = this.swSettings.components.Home.resources.IsExcelAllowed as boolean;

        this.state = {
            visibleColumns: this.getVisibleIndexes(this.columns),
            sortedColumn: {
                field: "visits",
                sortDirection: "desc",
            },
            page: 1,
            isColumnsPickerOpen: false,
            countries: getCountries(),
            opportunityListId: props.opportunityListId,
            isUnlockModalOpen: false,
            unlockModalConfig: "",
            quota: null,
        };
    }

    public componentDidMount = async () => {
        this.getQuota();
    };

    public componentDidUpdate = async (prevProps) => {
        if (this.props.opportunities !== prevProps.opportunities) {
            this.getQuota();
        }
    };

    public getQuota = async () => {
        const fetchService = DefaultFetchService.getInstance();
        const { activeWorkspaceId } = this.props;
        const response = await fetchService.get(
            `api/userdata/workspaces/investors/${activeWorkspaceId}/quota`,
        );
        this.setState({ quota: response });
    };

    public editOpportunityList = () => {
        const { activeWorkspaceId, activeList } = this.props;
        this.props.editOpportunityList(activeWorkspaceId, activeList);
    };

    public changeCountry = ({ id: country }) => {
        const { workspaceId, opportunityListId, activeList } = this.props;
        this.props.changeCountry(workspaceId, opportunityListId, activeList, country);
    };

    public onClickRecommendationsIndicator = (isOpen?) => {
        this.props.toggleRecommendations(isOpen);
        $("body").trigger(CLEAR_HIGHLIGHT_CLICKED_ROW_EVENT);
    };

    public render() {
        const {
            isTableLoading,
            workspaceId,
            opportunityListId,
            enableFindOpportunities,
            data,
            openWebsitesModal,
            showErrorToast,
            goToDashboardTemplate,
            lastSnapshotDate,
            onFindWebsites,
            onDataUpdate,
            activeList,
            isRecommendationsLoading,
            isRecommendationOpen,
            isRightBarOpen,
            recommendationsNumber,
            onRowSelected,
            tableSearchTerm,
        } = this.props;
        const addOpportunitiesButtonOptions = [
            {
                label: i18nFilter()("workspace.investors.add.addNew"),
                action: openWebsitesModal,
                key: "workspace.investors.add.addNew",
            },
        ];
        if (enableFindOpportunities) {
            addOpportunitiesButtonOptions.push({
                label: i18nFilter()("workspace.investors.add.find"),
                action: onFindWebsites,
                key: "workspace.investors.add.find",
            });
        }
        const params = queryString.stringify({
            opportunitiesListId: opportunityListId,
            workspaceId,
            date: dayjs(lastSnapshotDate).format("YYYY-MM"),
        });
        const link = this.isExcelAllowed
            ? `/widgetApi/InvestorsWorkspace/OpportunitiesList/Excel?${params}`
            : "";
        const metric = `Investors_Workspace_${workspaceId}`;

        const isFroUser = this.swSettings.user.isFro;

        return (
            <TableWrapper loading={isTableLoading}>
                <StyledInvestorsBoxTitleContainer>
                    <ListHeader
                        activeList={activeList}
                        lastSnapshotDate={lastSnapshotDate}
                        countries={this.state.countries}
                        onClick={this.editOpportunityList}
                        onCountryChange={this.changeCountry}
                    />
                    <QuotaAndUtilsContainer>
                        <QuotaIndicator workspaceType={"investors"} quota={this.state.quota} />
                        <FlexRow>
                            <PlainTooltip
                                tooltipContent={i18nFilter()("workspace.investors.download.excel")}
                            >
                                <DownloadExcelContainer
                                    href={link}
                                    onClick={this.onExcelDownloadClick}
                                >
                                    <IconButton
                                        iconName={this.isExcelAllowed ? "excel" : "excel-locked"}
                                        type="flat"
                                        dataAutomation="list-header-download-excel-button"
                                    />
                                </DownloadExcelContainer>
                            </PlainTooltip>
                            <PlainTooltip
                                tooltipContent={i18nFilter()("workspace.investors.column.picker")}
                            >
                                <div>
                                    <IconButton
                                        iconName="columns"
                                        type="flat"
                                        dataAutomation="list-header-columns-configure-button"
                                        onClick={() => this.toggleColumnsPicker(true)}
                                    />
                                </div>
                            </PlainTooltip>
                        </FlexRow>
                    </QuotaAndUtilsContainer>
                </StyledInvestorsBoxTitleContainer>
                <SearchContainer>
                    <SearchInput
                        debounce={1000}
                        onChange={this.onSearch}
                        defaultValue={tableSearchTerm}
                        placeholder={i18nFilter()("workspaces.investors.table.search.placeholder")}
                    />
                    <RecommendationsIndicator
                        isLoading={isRecommendationsLoading}
                        onClick={this.onClickRecommendationsIndicator}
                        isOpen={isRecommendationOpen && isRightBarOpen}
                        total={recommendationsNumber}
                        hideNotification={isFroUser}
                    />
                    <AddOpportunitiesButton
                        options={addOpportunitiesButtonOptions}
                        buttonLabel={i18nFilter()("workspace.investors.add.websites")}
                    />
                </SearchContainer>
                <SWReactTableOptimizedWithSelection
                    tableSelectionKey={`InvestorsWorkspaceTable${opportunityListId}`}
                    tableSelectionProperty="site"
                    isLoading={isTableLoading}
                    tableData={data}
                    tableColumns={this.getVisibleColumns()}
                    onSort={this.onSort}
                    getStableKey={this.getStableKey}
                    tableOptions={{
                        ...getOptions(
                            workspaceId,
                            opportunityListId,
                            this.updateParams,
                            onDataUpdate,
                            goToDashboardTemplate,
                            metric,
                            showErrorToast,
                            onRowSelected,
                        ),
                        aboveHeaderComponents: [
                            <TableSelectionComponent
                                onRemoveOpportunities={this.onRemoveOpportunities}
                                key={"TableSelectionComponent"}
                            />,
                        ],
                    }}
                />
                <TablePager
                    isTableLoading={isTableLoading}
                    handlePageChange={this.onPaging}
                    page={this.state.page}
                    table={data}
                    itemsPerPage={this.itemsPerPage}
                />
                {!isTableLoading && (
                    <ColumnsPickerModal
                        isOpen={this.state.isColumnsPickerOpen}
                        onCancelClick={() => this.toggleColumnsPicker(false)}
                        onApplyClick={this.onApplyColumnsPicker}
                        groupsData={this.tableToggleGroups}
                        columnsData={this.getVisibleColumns()}
                        showRestore={true}
                        defaultColumnsData={this.columns}
                        storageKey={metric}
                    />
                )}
                {this.isCustomMetricsLocked && (
                    <UnlockModal
                        isOpen={this.state.isUnlockModalOpen}
                        onCloseClick={() => {
                            this.setState({
                                isUnlockModalOpen: false,
                                unlockModalConfig: "",
                            });
                        }}
                        location={"Hook PRO/Investors Workspace/Add or edit metrics in the table"}
                        {...UnlockModalConfig()[this.state.unlockModalConfig]}
                    />
                )}
            </TableWrapper>
        );
    }

    public onRemoveOpportunities = async (itemsToRemove) => {
        const shouldFetchData = this.props.data.TotalCount > this.itemsPerPage;
        if (shouldFetchData) {
            this.props.setLoadingTable();
            await this.props.onRemoveOpportunities(itemsToRemove);
            this.onPaging(1);
        } else {
            await this.props.onRemoveOpportunities(itemsToRemove);
        }
        $("body").trigger(UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT);
        this.getQuota();
    };

    public getStableKey(index, col, row) {
        if (row) {
            const { site, country } = row;
            return `${site}_${country}`;
        }
        return defaultGetStableKey(index, col);
    }

    public getVisibleColumns = () => {
        const sortedColumn = this.state.sortedColumn;
        return this.columns.map((col, idx) => {
            if (sortedColumn && col.field === sortedColumn.field) {
                return {
                    ...col,
                    visible: this.state.visibleColumns[idx],
                    isSorted: true,
                    sortDirection: sortedColumn.sortDirection,
                };
            } else {
                return {
                    ...col,
                    visible: this.state.visibleColumns[idx],
                };
            }
        });
    };

    public getVisibleIndexes = (columns) => {
        return columns.map((col) => col.visible);
    };

    public toggleColumnsPicker = (toVal: boolean) => {
        if (this.isCustomMetricsLocked) {
            this.setState({
                isUnlockModalOpen: true,
                unlockModalConfig: "CustomMetrics",
            });

            return;
        }

        allTrackers.trackEvent(
            "Dropdown",
            this.state.isColumnsPickerOpen ? "close" : "open",
            "investors reports/edit columns",
        );
        this.setState({ isColumnsPickerOpen: toVal });
    };

    public onApplyColumnsPicker = (columns) => {
        this.setState(
            {
                isColumnsPickerOpen: false,
                visibleColumns: this.getVisibleIndexes(columns),
            },
            () => {
                $("body").trigger(UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT);
            },
        );
    };

    public parseFilter = (key, value) => {
        if (key === "filter") {
            return `Site;contains;"${value}"`;
        } else if (key === "orderBy") {
            return `${value.field} ${value.sortDirection}`;
        }
    };

    public updateParams = (key?, value?) => {
        const { page, sortedColumn } = this.state;
        const filters: any = { page };
        if (this.state.sortedColumn) {
            filters.orderBy = this.parseFilter("orderBy", sortedColumn);
        }
        if (key && value) {
            filters[key] = value;
            if (key === "filter") {
                delete filters.page;
            }
        }
        this.props.onFilter(filters);
    };

    public onSort = (sortedColumn) => {
        this.setState({ sortedColumn }, () => {
            const orderBy = this.parseFilter("orderBy", sortedColumn);
            this.props.sortTableList(orderBy);
            this.updateParams("orderBy", orderBy);
        });
    };

    public onSearch = (searchString) => {
        this.setState(
            {
                page: 1,
            },
            () => {
                this.props.searchTableList(searchString);
                this.updateParams();
            },
        );
    };

    public onPaging = (page) => {
        this.setState({ page }, () => this.updateParams("page", page));
    };

    public onExcelDownloadClick = (event) => {
        if (event && !this.isExcelAllowed) {
            event.preventDefault();

            this.setState({
                isUnlockModalOpen: true,
                unlockModalConfig: "DownloadTable",
            });
        }
        allTrackers.trackEvent("Download", "submit-ok", "Table/Download Excel");
    };
}

const mapStateToProps = ({ commonWorkspace }) => ({
    activeList: selectActiveOpportunityList(commonWorkspace),
    activeWorkspaceId: commonWorkspace.activeWorkspaceId,
    isRecommendationsLoading: commonWorkspace.isRecommendationsLoading,
    isRecommendationOpen: commonWorkspace.isRecommendationOpen,
    isRightBarOpen: commonWorkspace.isRightBarOpen,
    tableSearchTerm: commonWorkspace.tableSearchTerm,
    recommendationsNumber: commonWorkspace.recommendations.filter((crr) => !crr.Removed).length,
});

const mapDispatchToProps = (dispatch) => {
    const actionsObject = commonActionCreators({
        api: new InvestorsWorkspaceApiService(),
        component: swSettings.components.InvestorsWorkspace,
    });
    const {
        editOpportunityList,
        updateOpportunityList,
        fetchListOpportunities,
        toggleRecommendations,
        onRowSelected,
        fetchRecommendations,
        searchTableList,
        sortTableList,
        setLoadingTable,
    } = bindActionCreators(actionsObject, dispatch);

    return {
        editOpportunityList,
        toggleRecommendations,
        onRowSelected,
        searchTableList,
        sortTableList,
        setLoadingTable,
        changeCountry: async (workspaceId, listId, list, country) => {
            await updateOpportunityList(workspaceId, listId, {
                ...list,
                country,
            });
            fetchListOpportunities(workspaceId, listId);
            fetchRecommendations(workspaceId, listId);
        },
    };
};

export const InvestorsTableContainer = connect(mapStateToProps, mapDispatchToProps)(TableContainer);
