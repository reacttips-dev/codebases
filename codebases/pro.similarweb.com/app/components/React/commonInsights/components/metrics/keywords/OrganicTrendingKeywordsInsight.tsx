import { TrendingKeywordsInsight } from "./TrendingKeywordsInsight";

export const OrganicTrendingKeywordsInsight = ({ onCtaClickEventName }) => {
    return (
        <TrendingKeywordsInsight
            mainText={"website.performance.insights.organic.trending.keywords.content"}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
