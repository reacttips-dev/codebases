import { InsightsContainer } from "components/React/commonInsights/components/InsightsContainer";
import { shuffle } from "UtilitiesAndConstants/UtilityFunctions/sort";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { PaidKeywordsInsight } from "../metrics/topKeywords/PaidKeywordsInsight";
import { PaidNonBrandedKeywordsInsight } from "../metrics/keywords/PaidNonBrandedKeywordsInsight";
import { TopPaidNonBrandedKeywordsInsight } from "../metrics/keywordsGeneratorTool/TopPaidNonBrandedKeywordsInsight";
import { EOnCtaClickEventName } from "components/React/commonInsights/utilities/functions";
import { ProTipGap } from "components/React/commonInsights/components/metrics/keywordsGap/ProTipGap";

export const WebsitePerformanceSinglePaidInsights = () => {
    const onCtaClickEventName = EOnCtaClickEventName.WEBSITE_PERFORMANCE_PAID;
    const metrics = [
        <PaidKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
        <ProTipGap
            onCtaClickEventName={onCtaClickEventName}
            mainTextKey={"website.performance.insights.prod.tip.win"}
        />,
        <PaidNonBrandedKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
        <TopPaidNonBrandedKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
    ];
    return <InsightsContainer>{shuffle(metrics)}</InsightsContainer>;
};

SWReactRootComponent(WebsitePerformanceSinglePaidInsights, "WebsitePerformanceSinglePaidInsights");
