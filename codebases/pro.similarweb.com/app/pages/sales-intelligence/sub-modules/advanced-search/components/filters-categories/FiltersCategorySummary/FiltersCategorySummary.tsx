import React from "react";
import { AdvancedSearchFilterSummary } from "../../../types/filters";
import FilterSummaryItem from "../../common/FilterSummaryItem/FilterSummaryItem";
import { StyledFiltersSummaryContainer } from "./styles";

type FiltersCategorySummaryProps = {
    summaryItems: AdvancedSearchFilterSummary[];
};

const FiltersCategorySummary = (props: FiltersCategorySummaryProps) => {
    return (
        <StyledFiltersSummaryContainer>
            {props.summaryItems.map((summary) => (
                <FilterSummaryItem key={`summary-${summary.filterKey}`} summary={summary} />
            ))}
        </StyledFiltersSummaryContainer>
    );
};

export default FiltersCategorySummary;
