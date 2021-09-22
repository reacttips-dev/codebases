import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { KeywordsGapInsight } from "./KeywordsGapInsight";

export const PaidKeywordsOpportunitiesInsight = ({ onCtaClickEventName }) => {
    return (
        <KeywordsGapInsight
            mainTextKey={"website.performance.insights.paid.keywords.opportunities.content"}
            gapFilterSelectedTab={ETabsTypes.PAID}
            limitType={EFiltersTypes.KEYWORDS_OPPORTUNITIES}
            predefinedFiler={EFiltersTypes.KEYWORDS_OPPORTUNITIES}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
