import React, { useState, useEffect } from "react";
import { allConfigs, optionsConfig, trafficTypes } from "./configs/allConfigs";
import { TableTop } from "./TableTop/TableTop";
import IndustryTable from "../IndustryTable/IndustryTable";
import { WithIndustryTableConnect } from "pages/sales-intelligence/sub-modules/industries/hoc/withIndustryTableConnect";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";
import { WithMatchIndustryTablesProps } from "pages/sales-intelligence/hoc/withMatchIndustryTables";
import {
    FilterIndustryTableConfig,
    NavigationParams,
} from "pages/sales-intelligence/sub-modules/industries/types";
import { clearFromEmpty } from "pages/sales-intelligence/helpers/helpers";
import { StyledResultsTable } from "./styles";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import MultiSelector from "pages/sales-intelligence/common-components/MultiSelector/MulltiSelector";
import { IndustryResultContainerProps } from "./IndustryResultContainer";
import {
    industriesParamsService,
    InitialIndustryParamsProps,
} from "pages/sales-intelligence/sub-modules/industries/services/industriesParamsService";
import IndustryResultHeader from "./IndustryResultHeader";
import IndustryModalOutOfLimit from "./IndustryModalOutLimit";
import useGetLeadsLimitQuotaLimit from "pages/sales-intelligence/hooks/useGetLeadsExcelLimits";

type IndustryResultComponentProps = WithIndustryTableConnect &
    WithMatchIndustryTablesProps &
    WithSWNavigatorProps &
    IndustryResultContainerProps;

type FilterConfigState = FilterIndustryTableConfig;

const DEFAULT_WIDTH_CHECKBOX = 48;
const DEFAULT_WIDTH_DOMAIN = 270;

export function IndustryResult({
    navigator,
    table,
    tableData,
    tableFilters,
    fetchingData,
    fetchTableData,
    listUpdating,
    excelDownloading,
    downloadTableExcel,
    updateOpportunitiesList,
    usedLeadsLimit,
    excelQuota,
    activePanel,
    setMultiSelectorPanelByDefault,
}: IndustryResultComponentProps): JSX.Element {
    const { cols, tableMetaData, filters } = allConfigs[table];
    const { sourceType: sourceTypes = [], category: allCategories = [] } = tableFilters;

    const [leadsLimit, quotaLimit] = useGetLeadsLimitQuotaLimit(
        activePanel,
        usedLeadsLimit,
        excelQuota,
    );

    const { getInitialIndustryParams, getExcelUrl, getAccountParams } = industriesParamsService(
        tableMetaData,
    );

    const [isOpenAccountModalLimit, toggleAccountModalLimit] = useState(false);
    const [showCheckBox, toggleCheckBoxColumn] = useState(false);
    const [tableColumns, setTableColumns] = useState(cols.map((col) => ({ ...col })));

    useEffect(() => {
        setTableColumns(cols.map((col) => ({ ...col })));
    }, [table]);

    // close MultiSelectorPanel and set up for active panel default state
    useEffect(
        () => () => {
            setMultiSelectorPanelByDefault();
        },
        [],
    );

    const initIndustryParams = getInitialIndustryParams({
        ...(navigator.getParams() as NavigationParams),
        table,
        searchTypeParam: tableMetaData.searchTypeParam,
    });

    const [filterConfig, setFilterConfig] = React.useState<FilterConfigState>({
        page: 1,
        params: clearFromEmpty(initIndustryParams),
    });

    const onFilterChange = (value: Record<string, string>) => {
        setFilterConfig({
            ...filterConfig,
            params: clearFromEmpty({
                ...filterConfig.params,
                ...value,
            }),
        });
    };

    const onClickToggleColumns = (selectedColumnIndex: number) => {
        setTableColumns(
            tableColumns.map((column, index: number) => {
                if (index === selectedColumnIndex) {
                    column.visible = !column.visible;
                }
                return column;
            }),
        );
    };

    const handleColumnsToggle = (visible: boolean) => toggleCheckBoxColumn(visible);

    const handleSubmitAccount = (
        opportunitiesList: OpportunityListType,
        domains: string[] | number,
    ) => {
        const params = getAccountParams(filterConfig.params, domains);
        updateOpportunitiesList(tableMetaData.tableApi, params, opportunitiesList, domains);
    };

    const handleDownloadExcel = (domains: number | string[]) => {
        downloadTableExcel(getExcelUrl(filterConfig.params, domains), domains);
    };

    const handleClickOutOfMaxSelected = () => toggleAccountModalLimit(true);

    return (
        <div>
            <IndustryResultHeader navigator={navigator} />
            <StyledResultsTable
                showCheckBox={showCheckBox}
                widthCheckbox={cols[0].width || DEFAULT_WIDTH_CHECKBOX}
                widthDomain={cols[1].width || DEFAULT_WIDTH_DOMAIN}
            >
                <TableTop
                    onFilterChange={onFilterChange}
                    onClickToggleColumns={onClickToggleColumns}
                    filtersStateObject={filterConfig.params}
                    tableColumns={tableColumns}
                    allCategories={allCategories}
                    filters={filters}
                    searchTypeFilterPlaceholder={tableMetaData.searchTypeFilterPlaceholder}
                    sourceTypes={sourceTypes}
                    tableTypeOptions={optionsConfig}
                    selectedTableType={table}
                    trafficTypes={trafficTypes}
                    isLoading={fetchingData}
                />
                {!fetchingData && tableData.TotalCount > 0 && (
                    <MultiSelector
                        totalCount={tableData.TotalCount}
                        tableSelectionKey="Metric"
                        tableSelectionProperty="Domain"
                        initialState={[TypeOfSelectors.ACCOUNT, TypeOfSelectors.EXCEL]}
                        handleColumnsToggle={handleColumnsToggle}
                        handleSubmitAccount={handleSubmitAccount}
                        handleDownloadExcel={handleDownloadExcel}
                        excelDownloading={excelDownloading}
                        disableButtonExcel={excelDownloading || listUpdating}
                        disableButtonAccount={listUpdating}
                    />
                )}
                <IndustryTable
                    fetchTableData={fetchTableData}
                    fetchingData={fetchingData || listUpdating}
                    filterConfig={filterConfig}
                    setFilterConfig={setFilterConfig}
                    tableColumns={tableColumns}
                    tableData={tableData}
                    tableMetaData={tableMetaData}
                    maxSelectedRows={quotaLimit}
                    handleClickOutOfMaxSelected={handleClickOutOfMaxSelected}
                />
            </StyledResultsTable>
            <IndustryModalOutOfLimit
                activePanel={activePanel}
                excelQuota={excelQuota.total}
                leadsLimit={leadsLimit}
                isOpen={isOpenAccountModalLimit}
                onClose={() => toggleAccountModalLimit(false)}
            />
        </div>
    );
}
