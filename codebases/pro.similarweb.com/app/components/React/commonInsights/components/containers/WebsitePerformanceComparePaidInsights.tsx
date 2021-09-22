import { InsightsContainer } from "components/React/commonInsights/components/InsightsContainer";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { PaidKeywordsOpportunitiesInsight } from "../metrics/keywordsGap/PaidKeywordsOpportunitiesInsight";
import { PaidTrendingKeywordsInsight } from "../metrics/keywords/PaidTrendingKeywordsInsight";
import { PaidKeywordsWinsInsight } from "../metrics/keywordsGap/PaidKeywordsWinsInsight";
import { PaidKeywordsLossesInsight } from "../metrics/keywordsGap/PaidKeywordsLossesInsight";
import { shuffle } from "UtilitiesAndConstants/UtilityFunctions/sort";
import { EOnCtaClickEventName } from "components/React/commonInsights/utilities/functions";

export const WebsitePerformanceComparePaidInsights = () => {
    const onCtaClickEventName = EOnCtaClickEventName.WEBSITE_PERFORMANCE_PAID;
    const metrics = [
        <PaidKeywordsOpportunitiesInsight onCtaClickEventName={onCtaClickEventName} />,
        <PaidTrendingKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
        <PaidKeywordsLossesInsight onCtaClickEventName={onCtaClickEventName} />,
        <PaidKeywordsWinsInsight onCtaClickEventName={onCtaClickEventName} />,
    ];
    return <InsightsContainer>{shuffle(metrics)}</InsightsContainer>;
};

SWReactRootComponent(
    WebsitePerformanceComparePaidInsights,
    "WebsitePerformanceComparePaidInsights",
);
