import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { KeywordsGapInsight } from "./KeywordsGapInsight";

export const OrganicKeywordsLossesInsight = ({ onCtaClickEventName }) => {
    return (
        <KeywordsGapInsight
            mainTextKey={"website.performance.insights.organic.keywords.losses.content"}
            gapFilterSelectedTab={ETabsTypes.ORGANIC}
            limitType={EFiltersTypes.KEYWORD_LOSSES}
            predefinedFiler={EFiltersTypes.KEYWORD_LOSSES}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
