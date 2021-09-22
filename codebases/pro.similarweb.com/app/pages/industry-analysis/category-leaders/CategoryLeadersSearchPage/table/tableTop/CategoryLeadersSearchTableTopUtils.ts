import { IColumnsPickerLiteProps } from "@similarweb/ui-components/dist/columns-picker";
import { ITableApiQueryParams } from "./CategoryLeadersSearchTableTop.types";
import {
    ICategoryLeadersNavParams,
    ICategoryLeadersServices,
    ITableColumnSort,
} from "pages/industry-analysis/category-leaders/CategoryLeaders.types";
import { ICategory } from "common/services/categoryService.types";

export const createTableSearchFilter = (filterKey: string, filterTerm) => {
    return filterTerm ? `${filterKey};contains;"${filterTerm.trim()}"` : "";
};

export const createTableDataFilter = (filterKey: string, filterValue: number) => {
    const hasValue = typeof filterValue !== "undefined" && filterValue !== null;
    return hasValue ? `${filterKey};==;${filterValue}` : "";
};

export const combineTableFilters = (searchFilter: string, dataFilter: string) => {
    return [searchFilter, dataFilter].filter((filter) => filter.length > 0).join(",");
};

export const getTableQueryParamsForExcel = (
    tableQueryParams: ITableApiQueryParams,
    filterValue: string,
    category: ICategory,
    sort: ITableColumnSort,
) => {
    const filterParam = filterValue ? { filter: filterValue } : {};

    return {
        ...tableQueryParams,
        ...filterParam,
        category: category?.forDisplayApi,
        orderBy: `${sort.field} ${sort.sortDirection}`,
    };
};

export const getColumnsPickerLiteProps = (
    tableColumns: any[],
    onClickToggleColumns: (index: any) => void,
): IColumnsPickerLiteProps => {
    const columns = tableColumns.reduce((res, col, index) => {
        if (!col.fixed) {
            return [
                ...res,
                {
                    key: index.toString(),
                    displayName: col.displayName,
                    visible: col.visible,
                },
            ];
        }
        return res;
    }, []);
    return {
        columns,
        onColumnToggle: (key) => {
            // tslint:disable-next-line:radix
            onClickToggleColumns(parseInt(key));
        },
        onPickerToggle: () => null,
    };
};
