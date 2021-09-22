import React from "react";
import { i18nFilter } from "filters/ngFilters";
import { CheckboxFilter } from "pages/website-analysis/traffic-sources/search/components/filters/CheckboxFilter";
import { useKeywordCompetitorsPageContext } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsPageContext";

export const RisingCompetitorsFilter: React.FC = () => {
    const context = useKeywordCompetitorsPageContext();
    return (
        <CheckboxFilter
            isDisabled={context.newCompetitors}
            isSelected={context.risingCompetitors}
            onChange={context.onSelectRisingCompetitors}
            text={i18nFilter()("analysis.competitors.search.organic.filter.risingcompetitors")}
            tooltip={i18nFilter()(
                "analysis.competitors.search.organic.filter.risingcompetitors.tooltip",
            )}
        />
    );
};

export const NewCompetitorsFilter: React.FC = () => {
    const context = useKeywordCompetitorsPageContext();
    return (
        <CheckboxFilter
            isDisabled={context.risingCompetitors}
            isSelected={context.newCompetitors}
            onChange={context.onSelectNewCompetitors}
            text={i18nFilter()("analysis.competitors.search.organic.filter.newcompetitors")}
            tooltip={i18nFilter()(
                "analysis.competitors.search.organic.filter.newcompetitors.tooltip",
            )}
        />
    );
};
