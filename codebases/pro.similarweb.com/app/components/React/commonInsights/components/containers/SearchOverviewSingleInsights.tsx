import { InsightsContainer } from "components/React/commonInsights/components/InsightsContainer";
import { shuffle } from "UtilitiesAndConstants/UtilityFunctions/sort";
import {
    EDestination,
    EOnCtaClickEventName,
} from "components/React/commonInsights/utilities/functions";
import { AllKeywordsInsight } from "../metrics/topKeywords/AllKeywordsInsight";
import { ProTip } from "components/React/commonInsights/components/ProTip";
import { SeasonalKeywordsInsight } from "components/React/commonInsights/components/metrics/seasonalKeywords/SeasonalKeywordsInsight";
import { ProTipGap } from "components/React/commonInsights/components/metrics/keywordsGap/ProTipGap";
import { SearchOverviewInsightsHeader } from "../styledComponents";
import { i18nFilter } from "filters/ngFilters";

export const SearchOverviewSingleInsights = () => {
    const onCtaClickEventName = EOnCtaClickEventName.SEARCH_OVERVIEW;
    const metrics = [
        <AllKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
        <ProTip
            mainTextKey={"search.overview.insights.pro.tip.related.keywords"}
            innerLinkPage={"findkeywords_KeywordGenerator_home"}
            innerLinkKey={"search.overview.insights.pro.tip.related.keywords.cta"}
            onCtaClickEventName={onCtaClickEventName}
            ctaDestination={EDestination.Generator}
        />,
        <SeasonalKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
        <ProTipGap
            onCtaClickEventName={onCtaClickEventName}
            mainTextKey={"search.overview.insights.pro.tip.gap.home"}
        />,
    ];
    return (
        <>
            <SearchOverviewInsightsHeader>
                {i18nFilter()("search.overview.insights.single.header")}
            </SearchOverviewInsightsHeader>
            <InsightsContainer>{shuffle(metrics)}</InsightsContainer>
        </>
    );
};
