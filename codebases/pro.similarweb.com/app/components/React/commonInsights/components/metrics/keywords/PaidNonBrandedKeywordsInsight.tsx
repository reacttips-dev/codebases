import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import {
    EDestination,
    getMainTextComponent,
    getOnCtaClick,
    getReplacementObjectKeywordsAmount,
    shouldRenderAmountBased,
} from "components/React/commonInsights/utilities/functions";
import { InsightWrapper } from "../../InsightWrapper";

export const PaidNonBrandedKeywordsInsight = ({ onCtaClickEventName }) => {
    const MAIN_TEXT_KEY = "website.performance.insights.paid.non.branded.content";
    const getReplacementObject = getReplacementObjectKeywordsAmount();

    const baseParams = {
        webSource: devicesTypes.DESKTOP,
        IncludeOrganic: false,
        IncludePaid: true,
        IncludeBranded: false,
        IncludeNoneBranded: true,
    };
    return (
        <InsightWrapper
            endpoint={"widgetApi/SearchKeywords/NewSearchKeywords/Table"}
            mainTextComponent={getMainTextComponent(getReplacementObject, MAIN_TEXT_KEY)}
            innerLinkKey={"website.performance.insights.organic.keywords.cta"}
            innerLinkPage={"competitiveanalysis_website_search_keyword"}
            apiParams={{
                ...baseParams,
                pageSize: 0,
            }}
            customNavigationParams={{
                ...baseParams,
            }}
            shouldRender={shouldRenderAmountBased()}
            onCtaClick={getOnCtaClick(onCtaClickEventName, EDestination.Keywords)}
        />
    );
};
