import React from "react";
import { Pagination } from "@similarweb/ui-components/dist/pagination";
import { SEARCH_RESULTS_TABLE_INITIAL_PAGE } from "../../../constants/table";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";
import { FlexTableColumnType, FlexTableSortedColumnType } from "pages/sales-intelligence/types";
import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { StyledTablePagination } from "pages/sales-intelligence/pages/opportunity-list/components/table/styles";
import { StyledTableContainer, TABLE_LOADING_ROWS_NUMBER } from "./styles";
import {
    SearchResultEntryType,
    SearchResultsResponseDto,
    SearchTableFiltersType,
} from "../../../types/common";

type SearchResultsTableProps = {
    isLoading: boolean;
    isSelectionColumnVisible: boolean;
    shouldHighlightSelectedRow: boolean;
    tableData: SearchResultsResponseDto;
    tableFilters: SearchTableFiltersType;
    tableColumns: ReadonlyArray<FlexTableColumnType>;
    onRowClick(website: BaseWebsiteType): void;
    onFiltersChange(filters: Partial<SearchTableFiltersType>): void;
};

const SearchResultsTable = (props: SearchResultsTableProps) => {
    const {
        isLoading,
        tableData,
        tableColumns,
        tableFilters,
        shouldHighlightSelectedRow,
        isSelectionColumnVisible,
        onFiltersChange,
        onRowClick,
    } = props;
    /**
     * Handle changing of the table page
     * @param page
     */
    const handlePageChange = (page: number) => {
        onFiltersChange({ page });
    };
    /**
     * Handle table column sorting
     * @param sortedColumn
     */
    const handleColumnSort = ({ field, sortDirection }: FlexTableSortedColumnType) => {
        onFiltersChange({
            orderBy: field,
            asc: sortDirection === "asc",
            page: SEARCH_RESULTS_TABLE_INITIAL_PAGE,
        });
    };
    /**
     * Handle table cell click
     * @param _
     * @param index
     * @param favicon
     * @param site
     * @param column
     */
    const handleCellClick = (
        _: unknown,
        index: number,
        { favicon, site }: SearchResultEntryType,
        column: { isCheckBox?: boolean },
    ) => {
        if (!column.isCheckBox) {
            onRowClick({ favicon, domain: site });
        }
    };

    return (
        <StyledTableContainer
            isLoading={isLoading}
            domainColumnWidth={tableColumns[1].width}
            selectionColumnWidth={tableColumns[0].width}
            isSelectionColumnVisible={isSelectionColumnVisible}
        >
            <SWReactTableOptimizedWithSelection
                type="sticky"
                isLoading={isLoading}
                tableData={{
                    Data: tableData.rows,
                    TotalCount: tableData.totalCount,
                }}
                tableOptions={{
                    activeSelectedRow: true,
                    highlightClickedRow: true,
                    onCellClick: handleCellClick,
                    isSideBarClosed: !shouldHighlightSelectedRow,
                }}
                onSort={handleColumnSort}
                tableColumns={tableColumns}
                tableSelectionProperty="site"
                loaderRowsNumber={TABLE_LOADING_ROWS_NUMBER}
                tableSelectionKey="advanced-search-results-table"
            />
            {!isLoading && tableData.totalCount > tableFilters.pageSize && (
                <StyledTablePagination>
                    <Pagination
                        captionPosition="center"
                        page={tableFilters.page}
                        hasItemsPerPageSelect={false}
                        itemsCount={tableData.totalCount}
                        handlePageChange={handlePageChange}
                        itemsPerPage={tableFilters.pageSize}
                    />
                </StyledTablePagination>
            )}
        </StyledTableContainer>
    );
};

export default SearchResultsTable;
