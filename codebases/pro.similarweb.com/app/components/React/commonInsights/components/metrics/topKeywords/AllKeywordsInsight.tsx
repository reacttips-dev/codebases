import { KeywordsInsight } from "components/React/commonInsights/components/metrics/topKeywords/KeywordsInsight";

export const AllKeywordsInsight = ({ onCtaClickEventName }) => {
    const MAIN_TEXT_KEY = "search.overview.insights.all.keywords.content";
    const INNER_LINK_KEY = "search.overview.insights.all.keywords.cta";
    return (
        <KeywordsInsight
            innerLinkKey={INNER_LINK_KEY}
            mainTextKey={MAIN_TEXT_KEY}
            tab={"all"}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
