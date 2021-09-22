import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { KeywordsGapInsight } from "./KeywordsGapInsight";

export const AllKeywordsLossesInsight = ({ onCtaClickEventName }) => {
    return (
        <KeywordsGapInsight
            mainTextKey={"search.overview.insights.all.keywords.losses.content"}
            gapFilterSelectedTab={ETabsTypes.ALL_TRAFFIC}
            limitType={EFiltersTypes.KEYWORD_LOSSES}
            predefinedFiler={EFiltersTypes.KEYWORD_LOSSES}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
