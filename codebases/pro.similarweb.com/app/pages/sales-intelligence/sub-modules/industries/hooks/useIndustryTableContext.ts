import React from "react";
import { useTrack } from "components/WithTrack/src/useTrack";
import { Injector } from "common/ioc/Injector";
import { ITableContext } from "pages/sales-intelligence/pages/find-leads/components/IndustryLeads/IndustyResult/TableContextProvider";
import { searchType } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Helpers/SearchOverviewGraphConfig";
import { getParamsByTable } from "pages/sales-intelligence/pages/find-leads/components/IndustryLeads/utils";
import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";

export const useIndustryTableContext = ({
    filtersStateObject,
    onFilterChange,
    allCategories,
    sourceTypes,
    isLoading,
    selectedTableType,
    searchTypeFilterPlaceholder,
    tableTypeOptions,
    trafficTypes,
}): ITableContext => {
    const [track, trackWithGuid] = useTrack();
    const swNavigator = Injector.get("swNavigator");

    const industryContext = React.useMemo(() => {
        const context: ITableContext = {
            selectedSite: filtersStateObject.selectedSite,
            onSelectSite: (selectedSite) => {
                const value = { selectedSite: selectedSite.text };
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
            onSelectWebsiteType: (type) => {
                const value = { websiteType: type?.id };
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
            selectedWebsiteType: filtersStateObject.websiteType,
            allCategories: allCategories,
            selectedCategory: filtersStateObject.categoryItem,
            onSelectCategory: (categoryItem) => {
                const value = { categoryItem: categoryItem?.id };
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
            // search types

            searchTypes: [],
            selectedSearchType: filtersStateObject.searchType,
            onSelectSearchType: (type) => {
                const value = { [searchType]: type?.id };
                swNavigator.applyUpdateParams(value);
                onFilterChange({ searchType: type?.id });
            },
            searchTypeFilterPlaceholder: searchTypeFilterPlaceholder,
            search: filtersStateObject.search,
            onSearch: (term) => {
                const value = { search: term || null };
                swNavigator.applyUpdateParams(value);
                onFilterChange(value);
            },
            // Source types
            searchSelectValue: filtersStateObject.searchTypeParam,
            searchSelectOptions: sourceTypes,
            onSearchSelect: (selected) => {
                const value = selected ? selected.id : "";
                swNavigator.applyUpdateParams({ searchTypeParam: value });
                onFilterChange({ searchTypeParam: value });
            },
            selectedTableType: selectedTableType,
            setTableType: (tableType) => {
                const { country, category } = swNavigator.getParams();
                const { duration, webSource } = getParamsByTable(tableType.id);

                swNavigator.go(`${LEAD_ROUTES.INDUSTRY_RESULT}-${tableType.id}`, {
                    country,
                    category,
                    duration,
                    webSource,
                });
                trackWithGuid("", "click", {
                    category: category?.id ?? "clear",
                });
            },
            tableTypes: tableTypeOptions,
            // Select table Traffic type
            trafficTypeValue: filtersStateObject.trafficType,
            trafficTypes: trafficTypes,
            onTrafficTypeSelect: (selected) => {
                const value = selected ? selected.text : "";
                onFilterChange({ trafficType: value });
            },
            isLoading,
        };

        return context;
    }, [
        filtersStateObject,
        onFilterChange,
        allCategories,
        sourceTypes,
        isLoading,
        selectedTableType,
        searchTypeFilterPlaceholder,
        tableTypeOptions,
        trafficTypes,
    ]);

    return industryContext;
};
