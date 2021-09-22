import { TrendingKeywordsInsight } from "./TrendingKeywordsInsight";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";

export const PaidTrendingKeywordsInsight = ({ onCtaClickEventName }) => {
    return (
        <TrendingKeywordsInsight
            mainText={"website.performance.insights.paid.trending.keywords.content"}
            onCtaClickEventName={onCtaClickEventName}
            trafficType={ETabsTypes.PAID}
        />
    );
};
