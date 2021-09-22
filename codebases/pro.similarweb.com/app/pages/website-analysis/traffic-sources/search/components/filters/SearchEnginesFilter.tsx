import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import MultiChipDown from "components/MultiChipDown/src/MultiChipDown";
import allSearchEngines from "pages/website-analysis/constants/searchEngines";
import { FILTER_DEFAULT_SEPARATOR } from "pages/website-analysis/constants/constants";

// This is the representational component
const SearchEnginesFilter = ({ searchEngines, tableFilters, onSearchChannelChange }) => {
    const translate = useTranslation();
    const { family } = tableFilters;
    const items = allSearchEngines
        .map((engine) => {
            const searchTypeCount = (searchEngines || []).find((s) => s.id === engine.id)?.count;
            return {
                ...engine,
                count: searchTypeCount || 0,
            };
        })
        .sort((a, b) => b.count - a.count);

    // Convert family to string in case query params return different type
    const selectedItems = Object.fromEntries(
        items
            .filter((item) =>
                `${family}`
                    .split(FILTER_DEFAULT_SEPARATOR)
                    .map((i) => i.replace(/"/g, ""))
                    .includes(item?.id),
            )
            .map((item) => [item?.id, true]),
    );

    return (
        <MultiChipDown
            initialSelectedItems={selectedItems}
            buttonText={translate("analysis.source.search.keywords.filters.all-sources")}
            options={items}
            onDone={onSearchChannelChange}
            hasSearch={true}
        />
    );
};
// This are the "connectors" that connect the certain context to the representational component

export const SearchEnginesFilterForWebsiteKeywords = () => {
    const {
        searchEngines,
        tableFilters,
        onSearchChannelChange,
    } = useWebsiteKeywordsPageTableTopContext();
    return (
        <SearchEnginesFilter
            tableFilters={tableFilters}
            onSearchChannelChange={onSearchChannelChange}
            searchEngines={searchEngines}
        />
    );
};
