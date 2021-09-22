import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { KeywordsGapInsight } from "./KeywordsGapInsight";

export const AllKeywordsWinsInsight = ({ onCtaClickEventName }) => {
    return (
        <KeywordsGapInsight
            mainTextKey={"search.overview.insights.all.keywords.wins.content"}
            gapFilterSelectedTab={ETabsTypes.ALL_TRAFFIC}
            limitType={EFiltersTypes.KEYWORD_WINS}
            predefinedFiler={EFiltersTypes.KEYWORD_WINS}
            onCtaClickEventName={onCtaClickEventName}
        />
    );
};
