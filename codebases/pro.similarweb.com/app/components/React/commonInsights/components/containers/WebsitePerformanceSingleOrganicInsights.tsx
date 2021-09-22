import { ProTip } from "components/React/commonInsights/components/ProTip";
import { InsightsContainer } from "components/React/commonInsights/components/InsightsContainer";
import { shuffle } from "UtilitiesAndConstants/UtilityFunctions/sort";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { OrganicKeywordsInsight } from "../metrics/topKeywords/OrganicKeywordsInsight";
import { SeasonalKeywordsInsight } from "../metrics/seasonalKeywords/SeasonalKeywordsInsight";
import { ProTipGap } from "components/React/commonInsights/components/metrics/keywordsGap/ProTipGap";
import {
    EDestination,
    EOnCtaClickEventName,
} from "components/React/commonInsights/utilities/functions";

export const WebsitePerformanceSingleOrganicInsights = () => {
    const onCtaClickEventName = EOnCtaClickEventName.WEBSITE_PERFORMANCE_ORGANIC;
    const metrics = [
        <OrganicKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
        <ProTip
            mainTextKey={"website.performance.insights.prod.tip.keywords"}
            innerLinkPage={"findkeywords_KeywordGenerator_home"}
            innerLinkKey={"website.performance.insights.pro.tip.related.keywords.cta"}
            onCtaClickEventName={onCtaClickEventName}
            ctaDestination={EDestination.Generator}
        />,
        <SeasonalKeywordsInsight onCtaClickEventName={onCtaClickEventName} />,
        <ProTipGap
            onCtaClickEventName={onCtaClickEventName}
            mainTextKey={"website.performance.insights.prod.tip.win.lose"}
        />,
    ];
    return <InsightsContainer>{shuffle(metrics)}</InsightsContainer>;
};

SWReactRootComponent(
    WebsitePerformanceSingleOrganicInsights,
    "WebsitePerformanceSingleOrganicInsights",
);
