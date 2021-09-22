import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { KeywordsGapInsight } from "./KeywordsGapInsight";

export const OrganicKeywordsOpportunitiesInsight = ({ onCtaClickEventName }) => {
    return (
        <KeywordsGapInsight
            mainTextKey={"website.performance.insights.organic.keywords.opportunities.content"}
            gapFilterSelectedTab={ETabsTypes.ORGANIC}
            limitType={EFiltersTypes.KEYWORDS_OPPORTUNITIES}
            predefinedFiler={EFiltersTypes.KEYWORDS_OPPORTUNITIES}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
