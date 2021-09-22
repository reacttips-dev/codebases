import { InsightsContainer } from "components/React/commonInsights/components/InsightsContainer";
import { shuffle } from "UtilitiesAndConstants/UtilityFunctions/sort";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { OrganicKeywordsOpportunitiesInsight } from "../metrics/keywordsGap/OrganicKeywordsOpportunitiesInsight";
import { OrganicTrendingKeywordsInsight } from "../metrics/keywords/OrganicTrendingKeywordsInsight";
import { OrganicKeywordsWinsInsight } from "../metrics/keywordsGap/OrganicKeywordsWinsInsight";
import { OrganicKeywordsLossesInsight } from "../metrics/keywordsGap/OrganicKeywordsLossesInsight";
import { EOnCtaClickEventName } from "components/React/commonInsights/utilities/functions";

export const WebsitePerformanceCompareOrganicInsights = () => {
    const onCtaClickEventName = EOnCtaClickEventName.WEBSITE_PERFORMANCE_ORGANIC;
    const metrics = [
        <OrganicKeywordsOpportunitiesInsight onCtaClickEventName={onCtaClickEventName} />,
        <OrganicTrendingKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
        <OrganicKeywordsLossesInsight onCtaClickEventName={onCtaClickEventName} />,
        <OrganicKeywordsWinsInsight onCtaClickEventName={onCtaClickEventName} />,
    ];
    return <InsightsContainer>{shuffle(metrics)}</InsightsContainer>;
};

SWReactRootComponent(
    WebsitePerformanceCompareOrganicInsights,
    "WebsitePerformanceCompareOrganicInsights",
);
