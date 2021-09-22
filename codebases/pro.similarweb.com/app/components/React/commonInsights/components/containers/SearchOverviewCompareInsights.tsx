import { InsightsContainer } from "components/React/commonInsights/components/InsightsContainer";
import { shuffle } from "UtilitiesAndConstants/UtilityFunctions/sort";
import { EOnCtaClickEventName } from "components/React/commonInsights/utilities/functions";
import { AllKeywordsOpportunitiesInsight } from "components/React/commonInsights/components/metrics/keywordsGap/AllKeywordsOpportunitiesInsight";
import { AllTrendingKeywordsInsight } from "../metrics/keywords/AllTrendingKeywordsInsight";
import { AllKeywordsLossesInsight } from "../metrics/keywordsGap/AllKeywordsLossesInsight";
import { AllKeywordsWinsInsight } from "../metrics/keywordsGap/AllKeywordsWinsInsight";
import { SearchOverviewInsightsHeader } from "../styledComponents";
import { i18nFilter } from "filters/ngFilters";

export const SearchOverviewCompareInsights = () => {
    const onCtaClickEventName = EOnCtaClickEventName.SEARCH_OVERVIEW;
    const metrics = [
        <AllKeywordsOpportunitiesInsight onCtaClickEventName={onCtaClickEventName} />,
        <AllTrendingKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
        <AllKeywordsLossesInsight onCtaClickEventName={onCtaClickEventName} />,
        <AllKeywordsWinsInsight onCtaClickEventName={onCtaClickEventName} />,
    ];
    return (
        <>
            <SearchOverviewInsightsHeader>
                {i18nFilter()("search.overview.insights.compare.header")}
            </SearchOverviewInsightsHeader>
            <InsightsContainer>{shuffle(metrics)}</InsightsContainer>
        </>
    );
};
