import { TrendingKeywordsInsight } from "./TrendingKeywordsInsight";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";

export const AllTrendingKeywordsInsight = ({ onCtaClickEventName }) => {
    return (
        <TrendingKeywordsInsight
            mainText={"search.overview.insights.all.trending.keywords.content"}
            onCtaClickEventName={onCtaClickEventName}
            trafficType={ETabsTypes.ALL_TRAFFIC}
        />
    );
};
