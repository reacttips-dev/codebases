import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { KeywordsGapInsight } from "./KeywordsGapInsight";

export const PaidKeywordsWinsInsight = ({ onCtaClickEventName }) => {
    return (
        <KeywordsGapInsight
            mainTextKey={"website.performance.insights.paid.keywords.wins.content"}
            gapFilterSelectedTab={ETabsTypes.PAID}
            limitType={EFiltersTypes.KEYWORD_WINS}
            predefinedFiler={EFiltersTypes.KEYWORD_WINS}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
