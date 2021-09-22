import { KeywordsInsight } from "./KeywordsInsight";

export const PaidKeywordsInsight = ({ onCtaClickEventName }) => {
    const MAIN_TEXT_KEY = "website.performance.insights.paid.keywords.content";
    const INNER_LINK_KEY = "website.performance.insights.organic.keywords.cta";
    return (
        <KeywordsInsight
            innerLinkKey={INNER_LINK_KEY}
            mainTextKey={MAIN_TEXT_KEY}
            filter={"OP;==;1"}
            tab={"paid"}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
