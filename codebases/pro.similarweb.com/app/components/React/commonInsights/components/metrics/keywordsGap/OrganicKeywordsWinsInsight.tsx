import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { KeywordsGapInsight } from "./KeywordsGapInsight";

export const OrganicKeywordsWinsInsight = ({ onCtaClickEventName }) => {
    return (
        <KeywordsGapInsight
            mainTextKey={"website.performance.insights.organic.keywords.wins.content"}
            gapFilterSelectedTab={ETabsTypes.ORGANIC}
            limitType={EFiltersTypes.KEYWORD_WINS}
            predefinedFiler={EFiltersTypes.KEYWORD_WINS}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
