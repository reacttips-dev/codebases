import React, { useMemo } from "react";
import { dataParamsAdapter } from "pages/sales-intelligence/pages/find-leads/components/utils";
import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { Pagination, PaginationInput } from "@similarweb/ui-components/dist/pagination";
import { StyledIndustriesTablePagination } from "../IndustyResult/styles";
import { COMPETITOR_CUSTOMERS_DEFAULT_PAGE_SIZE } from "pages/sales-intelligence/sub-modules/competitor-customers/constants/pagination";
import {
    FilterIndustryTableConfig,
    IndustryTableData,
} from "pages/sales-intelligence/sub-modules/industries/types";
import { TableColumnType, TableMetaDataConfig } from "../IndustyResult/types";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";

type IndustryTableProps = {
    tableMetaData: TableMetaDataConfig;
    tableColumns: TableColumnType[];
    fetchingData: boolean;
    maxSelectedRows: number;
    tableData: IndustryTableData;
    fetchTableData(
        url: string,
        params: Pick<FilterIndustryTableConfig, "params">,
        page: number,
    ): void;
    handleClickOutOfMaxSelected(): void;
    filterConfig: FilterIndustryTableConfig;
    setFilterConfig(params: FilterIndustryTableConfig): void;
};

const IndustryTable = (props: IndustryTableProps) => {
    const {
        tableMetaData,
        tableColumns,
        tableData,
        fetchTableData,
        fetchingData,
        filterConfig,
        setFilterConfig,
        maxSelectedRows,
        handleClickOutOfMaxSelected,
    } = props;

    React.useEffect(() => {
        const { page, params } = filterConfig;
        fetchTableData(tableMetaData.tableApi, dataParamsAdapter(params), page);
    }, [filterConfig]);

    const handlePageChange = (page: number): void => {
        if (page <= Math.ceil(tableData.TotalCount / COMPETITOR_CUSTOMERS_DEFAULT_PAGE_SIZE)) {
            setFilterConfig({ ...filterConfig, page });
        }
    };

    const handleOnSort = ({ field, sortDirection }): void => {
        setFilterConfig({
            ...filterConfig,
            params: {
                ...filterConfig.params,
                orderby: `${field} ${sortDirection}`,
                sort: field,
                asc: sortDirection === "asc",
            },
        });
    };

    const tableColumnsSettings = useMemo(() => {
        const [field, sortDirection] = filterConfig.params.orderby.split(" ");

        return tableColumns.map((column) => {
            if (column.field === field) {
                return {
                    ...column,
                    isSorted: true,
                    sortDirection,
                };
            }
            return {
                ...column,
                isSorted: false,
            };
        });
    }, [filterConfig.params, tableColumns]);

    return (
        <>
            <SWReactTableOptimizedWithSelection
                type="sticky"
                cleanOnUnMount
                tableSelectionKey="Metric"
                tableSelectionProperty="Domain"
                tableOptions={{
                    metric: "tabMetaData.metric",
                    tableSelectionTrackingParam: "Domain",
                }}
                tableData={tableData}
                tableColumns={tableColumnsSettings}
                isLoading={fetchingData}
                onSort={handleOnSort}
                handleClickOutOfMaxSelected={handleClickOutOfMaxSelected}
                maxSelectedRows={maxSelectedRows}
            />
            {!fetchingData && tableData.TotalCount > COMPETITOR_CUSTOMERS_DEFAULT_PAGE_SIZE && (
                <StyledIndustriesTablePagination>
                    <Pagination
                        page={filterConfig.page}
                        itemsPerPage={COMPETITOR_CUSTOMERS_DEFAULT_PAGE_SIZE}
                        itemsCount={tableData.TotalCount}
                        handlePageChange={handlePageChange}
                        captionElement={PaginationInput}
                        captionPosition="center"
                        hasItemsPerPageSelect={false}
                    />
                </StyledIndustriesTablePagination>
            )}
        </>
    );
};

export default IndustryTable;
