import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { KeywordsGapInsight } from "./KeywordsGapInsight";

export const AllKeywordsOpportunitiesInsight = ({ onCtaClickEventName }) => {
    return (
        <KeywordsGapInsight
            mainTextKey={"search.overview.insights.all.keywords.opportunities.content"}
            gapFilterSelectedTab={ETabsTypes.ALL_TRAFFIC}
            limitType={EFiltersTypes.KEYWORDS_OPPORTUNITIES}
            predefinedFiler={EFiltersTypes.KEYWORDS_OPPORTUNITIES}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
