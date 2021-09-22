import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { KeywordsGapInsight } from "./KeywordsGapInsight";

export const PaidKeywordsLossesInsight = ({ onCtaClickEventName }) => {
    return (
        <KeywordsGapInsight
            mainTextKey={"website.performance.insights.paid.keywords.losses.content"}
            gapFilterSelectedTab={ETabsTypes.PAID}
            limitType={EFiltersTypes.KEYWORD_LOSSES}
            predefinedFiler={EFiltersTypes.KEYWORD_LOSSES}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
