import { swSettings } from "common/services/swSettings";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
    ButtonsContainer,
    DownloadExcelContainer,
    SearchContainer,
    TableInputContainer,
    TableTopContainer,
} from "./CategoryLeadersSearchTableTop.styles";
import {
    ICategoryLeadersSearchTableTopProps,
    PaidOrganicFilterEnum,
} from "./CategoryLeadersSearchTableTop.types";
import {
    createTableSearchFilter,
    getColumnsPickerLiteProps,
    getTableQueryParamsForExcel,
} from "./CategoryLeadersSearchTableTopUtils";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import { CategoryLeadersSearchAddToDashboard } from "./AddToDashboard";
import { PaidOrganicFilter } from "./PaidOrganicFilter";
import { TableFilterContainer } from "pages/industry-analysis/category-leaders/CategoryLeadersSearchPage/table/tableTop/CategoryLeadersSearchTableTop.styles";
import { ITableColumnSort } from "pages/industry-analysis/category-leaders/CategoryLeaders.types";
import {
    createTableDataFilter,
    combineTableFilters,
} from "pages/industry-analysis/category-leaders/CategoryLeadersSearchPage/table/tableTop/CategoryLeadersSearchTableTopUtils";

const SEARCH_FILTER_KEY = "Domain";
const DATA_FILTER_KEY = "OP";
const TABLE_EXCEL_API = "/widgetApi/CategoryLeaders/CategoryLeadersSearch/Excel";

export const CategoryLeadersSearchTableTop: FC<ICategoryLeadersSearchTableTopProps> = (props) => {
    const {
        onFilterChange,
        tableColumns,
        onClickToggleColumns,
        services,
        tableApiQueryParams,
        filtersStateObject,
        navParams,
        sort,
    } = props;

    const [searchTerm, setSearchTerm] = useState(null);
    const [selectedDataFilterId, setSelectedDataFilterId] = useState<PaidOrganicFilterEnum>(null);

    const tableCategory = useMemo(() => {
        return services.categoryService.categoryQueryParamToCategoryObject(navParams.category);
    }, [navParams]);

    /**
     * Build table filters: these are the search filter, and the
     * OrganicPaid filter (paid/organic filter value from the dropdown select)
     */
    const tableFilters = useMemo(() => {
        const searchFilter = createTableSearchFilter(SEARCH_FILTER_KEY, searchTerm);
        const dataFilter = createTableDataFilter(DATA_FILTER_KEY, selectedDataFilterId);
        return combineTableFilters(searchFilter, dataFilter);
    }, [searchTerm, selectedDataFilterId, onFilterChange]);

    /**
     * In case the table filters have changed, we want to update table with the new filters
     * (so that it'll execute a new API call)
     */
    useEffect(() => {
        onFilterChange(
            {
                filter: `${tableFilters}`,
            },
            false,
        );
    }, [tableFilters]);

    const onDataFilterSelect = useCallback(
        (selectedId) => {
            setSelectedDataFilterId(selectedId);
        },
        [setSelectedDataFilterId],
    );

    const onSearch = useCallback(
        (search: string) => {
            setSearchTerm(search);
        },
        [setSearchTerm],
    );

    const columnPickerProps = useMemo(() => {
        return getColumnsPickerLiteProps(tableColumns, onClickToggleColumns);
    }, [tableColumns, onClickToggleColumns]);

    const excelApiParams = services.fetchService.requestParams(
        // Sadly, I had to cast sort prop to "any", since it's type is incorrect
        getTableQueryParamsForExcel(tableApiQueryParams, tableFilters, tableCategory, sort as any),
    );
    const excelApiURL = `${TABLE_EXCEL_API}?${excelApiParams}`;
    const isExcelEnabled = swSettings.current.resources.IsExcelAllowed;

    return (
        <TableTopContainer>
            <TableFilterContainer>
                <PaidOrganicFilter
                    selectedId={selectedDataFilterId}
                    onSelectId={onDataFilterSelect}
                    services={services}
                />
            </TableFilterContainer>
            <TableInputContainer>
                <SearchContainer>
                    <SearchInput
                        defaultValue={""}
                        debounce={250}
                        onChange={onSearch}
                        placeholder={services.translate("table.search.placeholder.default")}
                    />
                </SearchContainer>
                <ButtonsContainer>
                    <DownloadExcelContainer href={excelApiURL}>
                        <DownloadButtonMenu
                            Excel={true}
                            downloadUrl={excelApiURL}
                            exportFunction={() => {
                                services.tracker.trackEvent("Download", "submit-ok", "Table/Excel");
                            }}
                            excelLocked={!isExcelEnabled}
                        />
                    </DownloadExcelContainer>
                    <div>
                        <ColumnsPickerLite {...columnPickerProps} withTooltip={true} />
                    </div>
                    <div>
                        <CategoryLeadersSearchAddToDashboard
                            filtersStateObject={filtersStateObject}
                            navParams={navParams}
                            tableFilters={tableFilters}
                        />
                    </div>
                </ButtonsContainer>
            </TableInputContainer>
        </TableTopContainer>
    );
};
