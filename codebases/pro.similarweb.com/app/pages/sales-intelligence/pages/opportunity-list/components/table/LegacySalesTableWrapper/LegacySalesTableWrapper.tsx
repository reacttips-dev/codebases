import React from "react";
import { i18nFilter } from "filters/ngFilters";
import { TranslateFn } from "components/WithTranslation/src/TranslationProvider";
import { getColumnsSalesIntelligence } from "pages/workspace/sales/SalesTableContainer/SalesTableConfig";
import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import {
    ListTableDataResponseDto,
    OpportunityListType,
} from "../../../../../sub-modules/opportunities/types";
import predefinedViews from "pages/workspace/sales/SalesTableContainer/predefinedViews";
import { defaultGetStableKey } from "components/React/Table/SWReactTable";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT } from "components/React/Table/FlexTable/Big/FlexTable";
import ListTableSearch from "../ListTableSearch/ListTableSearch";
import { StaticListTableWrapper, StyledSearchSection, StyledStaticList } from "../styles";
import {
    StyledDropdownsWrapper,
    StyledFilterWrapper,
} from "pages/workspace/sales/components/SalesTableHeader/Styled";
import PredefinedViewsDropdown from "pages/workspace/sales/components/PredefinedViewsDropdown/PredefinedViewsDropdown";
import { allTrackers } from "services/track/track";
import { shouldLockModule } from "pages/workspace/common/workspacesUtils";
import { swSettings } from "common/services/swSettings";
import { CommonModalConfig } from "components/Modals/src/UnlockModal/configs/commonUnlockModalConfig";
import UnlockModal from "components/Modals/src/UnlockModal/UnlockModal";
import { ColumnsPickerModal } from "components/React/ColumnsPickerModal/ColumnsPickerModal";
import { getTableToggleGroups } from "pages/lead-generator/lead-generator-exist/leadGeneratorExistConfig";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import MultiSelector from "pages/sales-intelligence/common-components/MultiSelector/MulltiSelector";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import OutOfLimitModal from "pages/sales-intelligence/common-components/modals/OutOfLimitModal/OutOfModalLimit";
import { ExcelQuota } from "pages/sales-intelligence/sub-modules/common/types";
import { getQuotaModalInfo } from "pages/sales-intelligence/helpers/quotaModal/helpers";
import { sortDirections } from "pages/website-analysis/traffic-sources/ads/availableFilters";
import { setMultiSelectorPanelByDefaultThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";
import { FlexTableSortedColumnType } from "pages/sales-intelligence/types";

// TODO: Copied from SalesTableContainer. Requires rewriting.

type LegacySalesTableWrapperProps = {
    list: OpportunityListType;
    searchTerm: string;
    data: ListTableDataResponseDto;
    workspaceId: string;
    loading: boolean;
    emptyDataMessage: string;
    activeSelectedRow: boolean;
    isSignalsVisible?: boolean;
    onSearch(searchTerm: string): void;
    onRowSelected(a: any, row: any): void;
    onRemoveOpportunities(items: any[]): void;
    onColumnSort(orderBy: string): void;
    initialActiveRow?: number;
    isSideBarClosed: boolean;
    downloadToExcel(
        listId: OpportunityListType["opportunityListId"],
        domains: number | string[],
        orderBy: string,
    ): void;
    excelDownloading: boolean;
    activePanel: TypeOfSelectors;
    excelQuota: ExcelQuota;
    setMultiSelectorPanelByDefault(): void;
};

type LegacySalesTableWrapperState = {
    sortedColumn: FlexTableSortedColumnType;
    visibleColumns: Record<string, { visible: boolean; index: number }>;
    selectedViewId: string;
    isUnlockModalOpen: boolean;
    isColumnsPickerOpen: boolean;
    showCheckBox: boolean;
    isOpenModal: boolean;
};

const predefinedViewOptions = Object.values(predefinedViews.PREDEFINED_VIEW_IDS).filter(
    (option) => option !== predefinedViews.PREDEFINED_VIEW_IDS.CUSTOM,
);

class LegacySalesTableWrapper extends React.PureComponent<
    LegacySalesTableWrapperProps,
    LegacySalesTableWrapperState
> {
    readonly translate: TranslateFn;
    readonly columns: any;
    readonly itemsPerPage: number;
    readonly tableToggleGroups: any;
    readonly isCustomMetricsLocked: boolean;
    readonly leadsLimit: number;

    constructor(props: LegacySalesTableWrapperProps) {
        super(props);

        predefinedViews.init(props.workspaceId);

        this.state = {
            visibleColumns: predefinedViews.getCurrentView(),
            selectedViewId: predefinedViews.currentViewId,
            isUnlockModalOpen: false,
            isColumnsPickerOpen: false,
            sortedColumn: {
                field: "visits",
                sortDirection: "desc",
            },
            showCheckBox: false,
            isOpenModal: false,
        };

        this.translate = i18nFilter();
        this.isCustomMetricsLocked = shouldLockModule(
            swSettings.components.WsCustomMetrics.resources.AvaliabilityMode,
        );
        this.tableToggleGroups = getTableToggleGroups().map((obj) => ({
            ...obj,
            displayName: this.translate(obj.displayName),
        }));
        this.leadsLimit = useSalesSettingsHelper().getQuotaLimit();
        this.columns = getColumnsSalesIntelligence();
        this.onSort = this.onSort.bind(this);
        this.getStableKey = this.getStableKey.bind(this);
        this.closeUnlockModal = this.closeUnlockModal.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.toggleColumnsPicker = this.toggleColumnsPicker.bind(this);
        this.onApplyColumnsPicker = this.onApplyColumnsPicker.bind(this);
        this.onRemoveOpportunities = this.onRemoveOpportunities.bind(this);
        this.handleDownloadExcel = this.handleDownloadExcel.bind(this);
    }

    componentWillUnmount() {
        this.props.setMultiSelectorPanelByDefault();
    }

    onSort(sortedColumn: FlexTableSortedColumnType) {
        const { onColumnSort } = this.props;

        this.setState({ sortedColumn }, () => {
            onColumnSort(`${sortedColumn.field} ${sortedColumn.sortDirection}`);
        });
    }

    getStableKey(index: any, col: any, row: any) {
        if (row) {
            const { site, country } = row;

            return `${site}_${country}`;
        }

        return defaultGetStableKey(index, col);
    }

    closeUnlockModal() {
        this.setState({ isUnlockModalOpen: false });
    }

    async onRemoveOpportunities(itemsToRemove: any) {
        TrackWithGuidService.trackWithGuid(
            "workspace_sales_remove_opportunities_from_table.button",
            "click",
            {
                totalCount: this.props.data.TotalCount,
                itemsToRemove: itemsToRemove?.length ?? 0,
            },
        );

        await this.props.onRemoveOpportunities(itemsToRemove);

        $("body").trigger(UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT);
    }

    toggleColumnsPicker(toVal: boolean, shouldReset?: boolean) {
        if (this.isCustomMetricsLocked) {
            this.setState({
                isUnlockModalOpen: true,
            });

            return;
        }

        allTrackers.trackEvent(
            "Dropdown",
            this.state.isColumnsPickerOpen ? "close" : "open",
            "Sales reports/edit columns",
        );

        if (!this.state.isColumnsPickerOpen) {
            allTrackers.trackEvent("Pop up", "open", "Edit columns");
        }

        this.setState(({ selectedViewId }) => {
            const { workspaceId } = this.props;
            const newState: any = { isColumnsPickerOpen: toVal };

            if (shouldReset) {
                predefinedViews.setPredefinedViewId(workspaceId, selectedViewId);

                newState.visibleColumns = predefinedViews.getCurrentView();
            }

            return newState;
        });
    }

    handleViewChange({ id: selectedViewId }: { id: string }) {
        const { workspaceId } = this.props;
        const isCustomViewSelected = selectedViewId === predefinedViews.PREDEFINED_VIEW_IDS.CUSTOM;

        if (isCustomViewSelected && !predefinedViews.hasCustomView) {
            this.toggleColumnsPicker(true);

            return;
        }

        const eventName =
            selectedViewId === predefinedViews.PREDEFINED_VIEW_IDS.CUSTOM
                ? "Header/custom predefined view"
                : `Header/regular predefined view/${selectedViewId}`;

        allTrackers.trackEvent("Drop down", "Click", eventName);

        predefinedViews.setPredefinedViewId(workspaceId, selectedViewId);

        this.setState({
            selectedViewId,
            visibleColumns: predefinedViews.PREDEFINED_VIEWS[selectedViewId],
        });
    }

    onApplyColumnsPicker(columns: any[]) {
        const config = predefinedViews.saveCustomColumnsConfig(this.props.workspaceId, columns);

        allTrackers.trackEvent("Drop down", "Click", "Header/custom predefined view");

        this.setState(
            {
                isColumnsPickerOpen: false,
                visibleColumns: config,
                selectedViewId: predefinedViews.PREDEFINED_VIEW_IDS.CUSTOM,
            },
            () => {
                $("body").trigger(UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT);
            },
        );
    }

    toggleVisibleColumns = (visible: boolean) => this.setState({ showCheckBox: visible });

    getVisibleColumns = (sortedColumn, visibleColumns): any => {
        return this.columns
            .map((col) => {
                const isVisible =
                    col.field === "number_of_unseen_alerts"
                        ? this.props.isSignalsVisible
                        : !col.field || visibleColumns[col.field]?.visible || col.fixed;

                const sortedProps = col.field === sortedColumn?.field && {
                    isSorted: true,
                    sortDirection: sortedColumn.sortDirection,
                };
                return {
                    ...col,
                    ...sortedProps,
                    visible: isVisible,
                };
            })

            .sort((a, b) => {
                if (a.visible && !b.visible) return -1;
                if (!a.visible && b.visible) return 1;

                if (visibleColumns[a.field]?.index < visibleColumns[b.field]?.index) return -1;
                if (visibleColumns[a.field]?.index > visibleColumns[b.field]?.index) return 1;
                return 0;
            });
    };

    handleDownloadExcel(domains: number | string[]) {
        const { list, downloadToExcel } = this.props;
        const { sortedColumn } = this.state;
        const isDownloadAllowed = useSalesSettingsHelper().isExcelAllowed();

        if (isDownloadAllowed) {
            downloadToExcel(
                list.opportunityListId,
                domains,
                `${sortedColumn.field} ${sortedColumn.sortDirection}`,
            );
        }
    }

    quotaLimit = () => {
        const { activePanel, excelQuota } = this.props;
        return activePanel === TypeOfSelectors.EXCEL ? excelQuota.remaining : Infinity;
    };

    handleClickOutOfMaxSelected = () => this.setState({ isOpenModal: true });

    onCloseModalLimit = () => this.setState({ isOpenModal: false });

    render() {
        const {
            data,
            list,
            loading,
            searchTerm,
            onSearch,
            activePanel,
            excelQuota,
            onRowSelected,
            isSideBarClosed,
            emptyDataMessage,
            activeSelectedRow,
            initialActiveRow,
            excelDownloading,
        } = this.props;

        const {
            sortedColumn,
            visibleColumns,
            selectedViewId,
            isUnlockModalOpen,
            isColumnsPickerOpen,
            showCheckBox,
            isOpenModal,
        } = this.state;

        const { title, contentText } = getQuotaModalInfo(
            activePanel,
            excelQuota.total,
            0,
            this.translate,
        );

        const columns = this.getVisibleColumns(sortedColumn, visibleColumns);

        return (
            <StyledStaticList>
                <ColumnsPickerModal
                    columnsData={columns}
                    isOpen={isColumnsPickerOpen}
                    groupsData={this.tableToggleGroups}
                    onApplyClick={this.onApplyColumnsPicker}
                    onCancelClick={() => this.toggleColumnsPicker(false, true)}
                />
                <UnlockModal
                    isOpen={isUnlockModalOpen}
                    onCloseClick={this.closeUnlockModal}
                    {...CommonModalConfig()["CustomMetrics"]}
                    location="Hook PRO/Sales Intelligence/Add or edit metrics in the table"
                />
                <StyledSearchSection>
                    <ListTableSearch search={searchTerm} onSearch={onSearch} />
                    <StyledDropdownsWrapper>
                        <StyledFilterWrapper>
                            <PredefinedViewsDropdown
                                width={215}
                                height={40}
                                selectedViewId={selectedViewId}
                                options={predefinedViewOptions}
                                onChange={this.handleViewChange}
                                dropdownPopupPlacement="ontop-left"
                                metricsCount={predefinedViews.metricsCount}
                                hasCustomView={predefinedViews.hasCustomView}
                                openColumnPicker={() => this.toggleColumnsPicker(true)}
                            />
                        </StyledFilterWrapper>
                    </StyledDropdownsWrapper>
                </StyledSearchSection>
                {!loading && data.TotalCount > 0 && (
                    <MultiSelector
                        initialState={[TypeOfSelectors.EXCEL, TypeOfSelectors.DELETE]}
                        key="MultiSelectorStatic"
                        tableSelectionKey={`si-opportunity-list-table-${list.opportunityListId}`}
                        tableSelectionProperty="site"
                        handleColumnsToggle={this.toggleVisibleColumns}
                        totalCount={data.TotalCount}
                        handleDownloadExcel={this.handleDownloadExcel}
                        excelDownloading={excelDownloading}
                    />
                )}
                <StaticListTableWrapper loading={loading} showCheckBox={showCheckBox}>
                    <SWReactTableOptimizedWithSelection
                        tableSelectionKey={`si-opportunity-list-table-${list.opportunityListId}`}
                        tableSelectionProperty="site"
                        isLoading={loading}
                        tableData={data}
                        tableColumns={columns}
                        onSort={this.onSort}
                        getStableKey={this.getStableKey}
                        tableOptions={{
                            shouldEnrichRow: () => false,
                            onCellClick: (isOpen, rowIdx, rowData, columnConfig) =>
                                !columnConfig.isCheckBox && onRowSelected(null, rowData),
                            customTableClass: "sales-workspace-table",
                            noDataTitle: emptyDataMessage,
                            addPaddingRightCell: true,
                            highlightClickedRow: true,
                            initialActiveRow: initialActiveRow,
                            activeSelectedRow,
                            isSideBarClosed,
                        }}
                        handleClickOutOfMaxSelected={this.handleClickOutOfMaxSelected}
                        maxSelectedRows={this.quotaLimit()}
                    />
                </StaticListTableWrapper>
                <OutOfLimitModal
                    title={title}
                    contentText={contentText}
                    onClose={this.onCloseModalLimit}
                    isOpen={isOpenModal}
                />
            </StyledStaticList>
        );
    }
}

export default LegacySalesTableWrapper;
