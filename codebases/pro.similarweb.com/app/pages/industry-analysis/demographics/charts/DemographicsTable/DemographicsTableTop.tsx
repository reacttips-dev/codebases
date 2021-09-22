import { SearchContainer } from "pages/workspace/StyledComponent";
import { i18nFilter } from "filters/ngFilters";
import React, { useCallback } from "react";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { ExcelDownload } from "UtilitiesAndConstants/UtilitiesComponents/ExcelDownload";
import { DefaultFetchService } from "services/fetchService";
import categoryService from "common/services/categoryService";

export const DemographicsTableTop = ({
    clearAllSelectedRows,
    setDomainFilter,
    queryParams,
    sortedColumn,
    domainFilter,
}) => {
    const handleSearch = useCallback(
        (searchTerm: string) => {
            // In case the user has selected rows on the table,
            // we should clear the selection before filtering the data
            if (clearAllSelectedRows) {
                clearAllSelectedRows();
            }
            setDomainFilter(searchTerm);
        },
        [clearAllSelectedRows, setDomainFilter],
    );

    const EXCEL_ENDPOINT =
        "widgetApi/IndustryAnalysisDemographics/IndustryAnalysisDemographics/Excel";
    const fetcherService = DefaultFetchService.getInstance();
    const { category, ...rest } = queryParams;
    const { sortDirection, field } = sortedColumn;
    const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);
    const excelLink = `${EXCEL_ENDPOINT}?${fetcherService.requestParams({
        ...rest,
        keys: categoryObject?.forApi,
        category: categoryObject?.forDisplayApi,
        includeSubdomains: true,
        orderBy: `${field} ${sortDirection}`,
        ...(domainFilter && { filter: `Domain;contains;"${domainFilter}"` }),
    })}`;
    return (
        <SearchContainer>
            <SearchInput
                defaultValue={""}
                debounce={250}
                onChange={handleSearch}
                placeholder={i18nFilter()("category.conversion.table.search.placeholder")}
            />
            <ExcelDownload excelLink={excelLink} />
        </SearchContainer>
    );
};
