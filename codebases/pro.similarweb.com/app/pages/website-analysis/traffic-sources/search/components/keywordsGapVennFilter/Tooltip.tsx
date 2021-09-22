import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import { filtersConfig } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/constants";
import {
    TooltipContainer,
    TooltipHeader,
    TooltipHeaderWithSites,
    TooltipRow,
} from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/StyledComponents";
import React from "react";

export const VennDiagramBaseTooltip = (props) => {
    const i18n = i18nFilter();
    const numbersFilter = abbrNumberFilter();
    const { hoverPoint } = props;
    const { sets, intersectionValue: keywordsAmount, searchVisits, chosenItemsAmount } = hoverPoint;
    const { tooltipKeys } = filtersConfig;
    const { SHARED_BY_ALL, SEARCH_VISITS, KEYWORDS } = tooltipKeys;
    const STRING_ARRAY_TO_STRING_SEPARATOR = ", ";
    return (
        <TooltipContainer>
            {chosenItemsAmount === sets.length ? (
                <TooltipHeader>{i18n(SHARED_BY_ALL)}</TooltipHeader>
            ) : (
                <TooltipHeaderWithSites>
                    {sets.join(STRING_ARRAY_TO_STRING_SEPARATOR)}
                </TooltipHeaderWithSites>
            )}
            <TooltipRow>{`${numbersFilter(keywordsAmount)} ${i18n(KEYWORDS)}`}</TooltipRow>
            <TooltipRow>{`${numbersFilter(searchVisits)} ${i18n(SEARCH_VISITS)}`}</TooltipRow>
        </TooltipContainer>
    );
};
