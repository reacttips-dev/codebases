import { KeywordsInsight } from "./KeywordsInsight";

export const OrganicKeywordsInsight = ({ onCtaClickEventName }) => {
    const MAIN_TEXT_KEY = "website.performance.insights.organic.keywords.content";
    const INNER_LINK_KEY = "website.performance.insights.organic.keywords.cta";
    return (
        <KeywordsInsight
            innerLinkKey={INNER_LINK_KEY}
            mainTextKey={MAIN_TEXT_KEY}
            filter={"OP;==;0"}
            tab={"organic"}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
