import { swNumberFilter } from "filters/ngFilters";
import { SEARCH_RESULTS_COUNT_FORMAT_MAX } from "../constants/table";
import { FlexTableColumnType, FlexTableSortedColumnType } from "pages/sales-intelligence/types";

const formatNumber = swNumberFilter();

export const createSortedColumn = (field: string, asc: boolean): FlexTableSortedColumnType => {
    return {
        field,
        sortDirection: asc ? "asc" : "desc",
    };
};

export const updateColumnsWithSortValues = (
    columns: readonly FlexTableColumnType[],
    sortedColumn: FlexTableSortedColumnType,
): FlexTableColumnType[] => {
    return columns.map((column) => {
        return {
            ...column,
            sortDirection: sortedColumn.sortDirection,
            isSorted: sortedColumn.field === column.field,
        };
    });
};

export const formatTableSearchResultsCount = (count: number): string => {
    if (count >= SEARCH_RESULTS_COUNT_FORMAT_MAX) {
        return `+${formatNumber(SEARCH_RESULTS_COUNT_FORMAT_MAX)}`;
    }

    if (count === 0) {
        return String(count);
    }

    return formatNumber(count);
};
