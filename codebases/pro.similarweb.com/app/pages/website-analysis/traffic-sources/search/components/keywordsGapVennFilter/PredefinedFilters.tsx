import { i18nFilter } from "filters/ngFilters";
import {
    FilterContainer,
    FiltersContainer,
    FilterSectionTitle,
    FilterSubTitle,
    FilterTitle,
} from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/StyledComponents";
import React from "react";

const i18n = i18nFilter();

const getCreateFilterContent = (
    selectedFilter,
    onClickCallback,
    selectedTabIndex,
    filterData,
    chosenItems,
) => ({ titleKey, subtitleKey, id }) => (
    <FilterContent
        title={i18n(titleKey)}
        subtitle={i18n(subtitleKey, { mainSite: chosenItems[0].name })}
        selectedFilter={selectedFilter}
        onClickCallback={onClickCallback}
        id={id}
    />
);

const FilterContent = (props) => {
    const { title, subtitle, selectedFilter, id, onClickCallback } = props;
    return (
        <FilterContainer withLeftBorder={id === selectedFilter} onClick={() => onClickCallback(id)}>
            <FilterTitle>{title} </FilterTitle>
            <FilterSubTitle>{subtitle}</FilterSubTitle>
        </FilterContainer>
    );
};

export const PredefinedFilters = (props) => {
    const {
        selectedFilter,
        onPredefinedFilersClick,
        selectedTabIndex,
        filterData,
        chosenItems,
        filtersConfig,
    } = props;
    const { marketCoreFilters, recommendationsFilters, headers: filterHeaders } = filtersConfig;
    const createFilterContent = getCreateFilterContent(
        selectedFilter,
        onPredefinedFilersClick,
        selectedTabIndex,
        filterData,
        chosenItems,
    );
    return (
        <FiltersContainer>
            <FilterSectionTitle>{i18n(filterHeaders.MARKET_CORE_KEY)}</FilterSectionTitle>
            {marketCoreFilters.map(createFilterContent)}
            <FilterSectionTitle>{i18n(filterHeaders.RECOMMENDATIONS_KEY)}</FilterSectionTitle>
            {recommendationsFilters.map(createFilterContent)}
        </FiltersContainer>
    );
};
