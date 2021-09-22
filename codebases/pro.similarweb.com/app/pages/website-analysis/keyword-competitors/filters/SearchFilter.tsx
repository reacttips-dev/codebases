import React from "react";
import { useKeywordCompetitorsPageContext } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsPageContext";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { i18nFilter } from "filters/ngFilters";

const i18n = i18nFilter();

export const SearchFilter = () => {
    const { search, onSearch } = useKeywordCompetitorsPageContext();
    return (
        <SearchInput
            disableClear={true}
            defaultValue={search}
            debounce={400}
            onChange={onSearch}
            placeholder={i18n("forms.search.placeholder")}
        />
    );
};
