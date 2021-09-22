import {
    EDestination,
    getMainTextComponent,
    getOnCtaClick,
    getOrganicPaidParams,
    getReplacementObjectKeywordsAmount,
    shouldRenderAmountBased,
} from "components/React/commonInsights/utilities/functions";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { InsightWrapper } from "components/React/commonInsights/components/InsightWrapper";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";

export const TrendingKeywordsInsight = ({
    mainText,
    trafficType = ETabsTypes.ORGANIC,
    onCtaClickEventName,
}) => {
    const totalCountField = "TotalCount";
    const getReplacementObject = getReplacementObjectKeywordsAmount(totalCountField);
    const baseParams = {
        webSource: devicesTypes.DESKTOP,
        IncludeTrendingKeywords: true,
        IncludeBranded: false,
        IncludeNoneBranded: true,
        ...getOrganicPaidParams(trafficType),
    };
    return (
        <InsightWrapper
            endpoint={"widgetApi/SearchKeywords/NewSearchKeywords/Table"}
            mainTextComponent={getMainTextComponent(getReplacementObject, mainText)}
            innerLinkKey={"website.performance.insights.organic.keywords.cta"}
            innerLinkPage={"competitiveanalysis_website_search_keyword"}
            apiParams={{
                ...baseParams,
                pageSize: 0,
            }}
            customNavigationParams={{
                ...baseParams,
            }}
            shouldRender={shouldRenderAmountBased(totalCountField)}
            onCtaClick={getOnCtaClick(onCtaClickEventName, EDestination.Keywords)}
        />
    );
};
