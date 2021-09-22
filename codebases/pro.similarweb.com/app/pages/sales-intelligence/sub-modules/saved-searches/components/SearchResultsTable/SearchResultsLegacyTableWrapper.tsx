// TODO: Minimal copy of ReportResults.tsx. Requires rewriting.
import React from "react";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import {
    getTableColumns,
    getTableToggleGroups,
} from "pages/lead-generator/lead-generator-exist/leadGeneratorExistConfig";
import {
    NotSavedSearchType,
    QueryFilters,
    SavedSearchType,
    SearchTableDataParams,
    SearchTableExcelDownloadParams,
} from "pages/sales-intelligence/sub-modules/saved-searches/types";
import { swSettings } from "common/services/swSettings";
import { getSearchId } from "pages/sales-intelligence/sub-modules/saved-searches/helpers";
import ReportTableTop from "pages/lead-generator/lead-generator-wizard/components/ReportTableTop";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import {
    categoryIconFilter,
    i18nFilter,
    parentCategoryFilter,
    subCategoryFilter,
} from "filters/ngFilters";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { AddWebsitesBubble } from "pages/lead-generator/lead-generator-wizard/components/AddWebsitesBubble";
import { StyledSearchResults } from "./styles";
import MultiSelector from "pages/sales-intelligence/common-components/MultiSelector/MulltiSelector";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

enum dataStates {
    VALID,
    ERROR,
    NO_DATA,
}

type SearchResultsLegacyTableWrapperProps = {
    withExcelExport?: boolean;
    opportunityLists: OpportunityListType[];
    searchObject: NotSavedSearchType | SavedSearchType;
    filters: any;
    showErrorToast(...args: any[]): void;
    renderExcelExportButton?(filters: {
        search: string;
        newLeadsOnly: boolean;
        excludeUserLeads: boolean;
    }): React.ReactFragment;
    onTableDataFetchCallback(data: { filteredResultCount: number }): void;
    downloadingTableExcel: boolean;
    downloadTableExcel(params: SearchTableExcelDownloadParams, domains: string[] | number): void;
    updateOpportunitiesList(
        queryId: string,
        runId: string,
        params: SearchTableDataParams,
        list: OpportunityListType,
        opportunities: string[] | number,
    ): void;
    opportunitiesListUpdating: boolean;
    maxSelectedRows: number;
    handleClickOutOfMaxSelected(): void;
    setMultiSelectorPanelByDefault(): void;
};

type SearchResultsLegacyTableWrapperState = {
    dataState: number;
    totalResultCount: number;
    isTableLoading: boolean;
    filters: QueryFilters;
    isOpenModalLimit: boolean;
    showCheckBoxColumn: boolean;
    excludeUserLeads: boolean;
    newLeadsOnly: boolean;
    sorting: null | {
        sort: string;
        asc: boolean;
        orderBy: string;
    };
};

const PAGE_SIZE = 50;
class SearchResultsLegacyTableWrapper extends React.Component<
    SearchResultsLegacyTableWrapperProps,
    SearchResultsLegacyTableWrapperState
> {
    translate: Function;
    _tableColumns: any[];
    _tableToggleGroups: any[];
    _isDesktopOnly: boolean;
    _LeadGenResults: number;
    _isLeadGenResultLimited: boolean;
    dropdownRef: { close: () => any };
    _isSavedSearchesFeatureEnabled = true;
    tableRef = React.createRef<SWReactTableWrapper>();
    swNavigator: SwNavigator;

    constructor(props: SearchResultsLegacyTableWrapperProps) {
        super(props);

        const swSettingsSalesWorkspace = swSettings?.components?.SalesWorkspace?.resources;
        const newResultsCount = (props.searchObject as SavedSearchType).lastRun.newSinceLastRun;
        const newLeadsOnly = newResultsCount > 0 ? (props.filters as any).newLeadsOnly : false;

        this.state = {
            dataState: dataStates.VALID,
            totalResultCount: 0,
            isTableLoading: true,
            filters: props.filters,
            isOpenModalLimit: false,
            showCheckBoxColumn: false,
            excludeUserLeads: true,
            newLeadsOnly,
            sorting: null,
        };

        this.translate = i18nFilter();
        this.swNavigator = Injector.get<any>("swNavigator");
        this._isDesktopOnly = props.filters.device === "Desktop";
        this._tableColumns = getTableColumns(this._isDesktopOnly).map((column) => ({
            ...column,
            visible: column.fixed || column.visible,
        }));
        this._tableColumns[0] = {
            fixed: true,
            cellComponent: (props) => (
                <div className="u-alignCenter">
                    <RowSelectionConsumer {...props} />
                    {props.row.index === 0 && <AddWebsitesBubble />}
                </div>
            ),
            sortable: false,
            width: 48,
            headerComponent: () => null,
            visible: true,
        };
        this._tableColumns[1] = {
            ...this._tableColumns[1],
            displayName: "Websites",
        };
        this._tableColumns[3].cellComponent = ({ value }) => {
            return (
                <div className="swTable-categoryCell">
                    <i
                        className={`sprite-category u-right-padding-6 ${categoryIconFilter()(
                            parentCategoryFilter()(value),
                        )}`}
                    />
                    <span>{subCategoryFilter()(value)}</span>
                </div>
            );
        };

        this._tableToggleGroups = getTableToggleGroups(this._isDesktopOnly).map((group) => ({
            ...group,
            displayName: this.translate(group.displayName),
        }));

        this._LeadGenResults = swSettingsSalesWorkspace?.LeadGeneratorResults;
        this._isLeadGenResultLimited = !(
            !this._LeadGenResults ||
            (this._LeadGenResults && this._LeadGenResults === 2147483647) || // "unlimited"
            (this._LeadGenResults && this._LeadGenResults === 50000)
        );
    }

    componentWillUnmount() {
        this.props.setMultiSelectorPanelByDefault();
    }

    getServerApi() {
        return `/api/sales-leads-generator/report/query/${getSearchId(
            this.props.searchObject,
        )}/run/${this.props.searchObject.lastRun.id}/table`;
    }

    setRef = (ref) => (this.dropdownRef = ref);

    private onDataError = () => this.setState({ dataState: dataStates.ERROR });

    private getDataCallback = (data) => {
        this.setState({
            totalResultCount: data.totalResultCount,
            isTableLoading: false,
        });

        this.props.onTableDataFetchCallback(data);
    };

    handleColumnsToggle = (visible: boolean) => this.setState({ showCheckBoxColumn: visible });

    handleSubmitAccount = (
        opportunitiesList: OpportunityListType,
        domains: string[] | number,
        search = "",
    ) => {
        const { searchObject, updateOpportunitiesList } = this.props;

        const params = {
            excludeUserLeads: this.isExcludeUserLeads(),
            newLeadsOnly: this.isNewLeadsOnly(),
            search,
        };

        updateOpportunitiesList(
            getSearchId(searchObject),
            searchObject.lastRun.id,
            params,
            opportunitiesList,
            domains,
        );
    };

    onSort = ({ field, sortDirection }: { field: string; sortDirection: string }) => {
        this.setState({
            sorting: {
                sort: field,
                asc: sortDirection === "asc",
                orderBy: field + " " + sortDirection,
            },
        });
    };

    handleDownloadExcel = (domains: number | string[], search: string) => {
        const { searchObject, downloadTableExcel } = this.props;
        const sorting = this.state.sorting === null ? {} : this.state.sorting;

        downloadTableExcel(
            {
                queryId: getSearchId(searchObject),
                runId: searchObject.lastRun.id,
                excludeUserLeads: this.isExcludeUserLeads(),
                newLeadsOnly: this.isNewLeadsOnly(),
                search,
                ...sorting,
            },
            domains,
        );
    };

    onChangeExcludeLeads = (excludeUserLeads: boolean): void => this.setState({ excludeUserLeads });

    onChangeNewLeadsOnly = (newLeadsOnly: boolean): void => this.setState({ newLeadsOnly });

    isExcludeUserLeads = () => {
        const { excludeUserLeads } = this.swNavigator.getParams();

        return typeof excludeUserLeads === "undefined"
            ? this.state.excludeUserLeads
            : excludeUserLeads === "true";
    };

    hasNewResults = (): boolean => {
        const newResultsCount = (this.props.searchObject as SavedSearchType).lastRun
            .newSinceLastRun;

        return newResultsCount > 0;
    };

    isNewLeadsOnly = (): boolean => {
        const { newLeadsOnly } = this.swNavigator.getParams();

        if (this.hasNewResults()) {
            return typeof newLeadsOnly === "undefined"
                ? (this.props.filters as any).newLeadsOnly
                : newLeadsOnly === "true";
        }

        return false;
    };

    render() {
        const {
            withExcelExport,
            renderExcelExportButton,
            downloadingTableExcel,
            opportunitiesListUpdating,
            handleClickOutOfMaxSelected,
            maxSelectedRows,
        } = this.props;

        const isExcludeUserLeads = this.isExcludeUserLeads();

        return (
            <StyledSearchResults showCheckBox={this.state.showCheckBoxColumn}>
                <SWReactTableWrapperWithSelection
                    dataParamsAdapter={(params) => ({
                        ...params,
                        pageSize: PAGE_SIZE,
                    })}
                    tableRef={this.tableRef}
                    tableSelectionKey="LeadGeneratorReportResult"
                    tableSelectionProperty="site"
                    serverApi={this.getServerApi()}
                    tableColumns={this._tableColumns}
                    totalRecordsField="filteredResultCount"
                    onDataError={this.onDataError}
                    rowsPerPage={PAGE_SIZE}
                    getDataCallback={this.getDataCallback}
                    handleClickOutOfMaxSelected={handleClickOutOfMaxSelected}
                    maxSelectedRows={maxSelectedRows}
                    onSort={this.onSort}
                    tableOptions={{
                        metric: "LeadGeneratorWizardTable",
                        loading: opportunitiesListUpdating,
                    }}
                    paginationProps={{
                        showPagination: !this._isLeadGenResultLimited,
                        hasItemsPerPageSelect: false,
                    }}
                    initialFilters={{
                        excludeUserLeads: isExcludeUserLeads,
                        newLeadsOnly: this.isNewLeadsOnly(),
                    }}
                >
                    {(topComponentProps) => (
                        <>
                            <ReportTableTop
                                {...topComponentProps}
                                isExcludeUserLeadsCheckboxVisible
                                isSelectedExcludeUserLeads={isExcludeUserLeads}
                                withExcelExport={withExcelExport}
                                isNewResultsCheckboxVisible={this.hasNewResults()}
                                defaultTableColumns={this._tableColumns}
                                tableToggleGroups={this._tableToggleGroups}
                                renderExcelExportButton={renderExcelExportButton}
                                onChangeExcludeLeads={this.onChangeExcludeLeads}
                                onChangeNewLeadsOnly={this.onChangeNewLeadsOnly}
                            />
                            {!topComponentProps.isLoadingData &&
                                topComponentProps.totalCount > 0 && (
                                    <MultiSelector
                                        key="table-header-component"
                                        tableSelectionKey="LeadGeneratorReportResult"
                                        tableSelectionProperty="site"
                                        initialState={[
                                            TypeOfSelectors.ACCOUNT,
                                            TypeOfSelectors.EXCEL,
                                        ]}
                                        handleColumnsToggle={this.handleColumnsToggle}
                                        handleSubmitAccount={this.handleSubmitAccount}
                                        handleDownloadExcel={this.handleDownloadExcel}
                                        excelDownloading={downloadingTableExcel}
                                        disableButtonExcel={
                                            downloadingTableExcel || opportunitiesListUpdating
                                        }
                                        disableButtonAccount={opportunitiesListUpdating}
                                    />
                                )}
                        </>
                    )}
                </SWReactTableWrapperWithSelection>
            </StyledSearchResults>
        );
    }
}

export default SearchResultsLegacyTableWrapper;
