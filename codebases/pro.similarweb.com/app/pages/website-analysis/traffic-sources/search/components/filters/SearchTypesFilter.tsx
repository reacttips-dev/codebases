import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import MultiChipDown from "components/MultiChipDown/src/MultiChipDown";
import allSearchTypes from "pages/website-analysis/constants/searchTypes";
import { FILTER_DEFAULT_SEPARATOR } from "pages/website-analysis/constants/constants";

// This is the representational component
const SearchTypesFilter = ({ tableFilters, searchTypes, onSearchTypeChange }) => {
    const translate = useTranslation();
    const { source } = tableFilters;
    const items = allSearchTypes
        .map((type) => {
            const searchTypeCount = (searchTypes || []).find((s) => s.id.toString() === type.id)
                ?.count;
            return {
                ...type,
                count: searchTypeCount || 0,
            };
        })
        .sort((a, b) => b.count - a.count);

    // Convert source to string in case query params return different type
    const selectedItems = Object.fromEntries(
        items
            .filter((item) =>
                `${source}`
                    .split(FILTER_DEFAULT_SEPARATOR)
                    .map((i) => i.replace(/"/g, "")) // Replace all "" marks from items
                    .includes(`${item?.id}`),
            )
            .map((item) => [item?.id, true]),
    );

    return (
        <MultiChipDown
            initialSelectedItems={selectedItems}
            buttonText={translate("analysis.source.search.keywords.filters.all-channels")}
            options={items}
            onDone={onSearchTypeChange}
        />
    );
};

// This are the "connectors" that connect the certain context to the representational component
export const SearchTypesFilterForWebsiteKeywords = () => {
    const {
        tableFilters,
        searchTypes,
        onSearchTypeChange,
    } = useWebsiteKeywordsPageTableTopContext();
    return (
        <SearchTypesFilter
            tableFilters={tableFilters}
            searchTypes={searchTypes}
            onSearchTypeChange={onSearchTypeChange}
        />
    );
};
