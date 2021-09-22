import {
    categoryToNavigationQueryParam,
    EDestination,
    getChosenSiteCategory,
    getMainTextComponent,
    getOnCtaClick,
    getReplacementObjectForCategories,
} from "components/React/commonInsights/utilities/functions";
import {
    CATEGORY_API_SEPARATOR,
    CATEGORY_DISPLAY_SEPARATOR,
} from "components/React/commonInsights/utilities/constants";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { InsightWrapper } from "components/React/commonInsights/components/InsightWrapper";
import { CATEGORY_PREFIX } from "common/services/categoryService";

export const KeywordsInsight = ({
    mainTextKey,
    innerLinkKey,
    filter = null,
    tab,
    onCtaClickEventName,
}) => {
    const category = getChosenSiteCategory();
    const baseParams = {
        includeBranded: false,
        includeNoneBranded: true,
        category: category?.replaceAll(CATEGORY_DISPLAY_SEPARATOR, CATEGORY_API_SEPARATOR),
        webSource: devicesTypes.DESKTOP,
    };
    const shouldRender = (rawData) => rawData.TotalCount > 0 && category;
    return (
        <InsightWrapper
            endpoint={"widgetApi/IndustryAnalysisTopKeywords/SearchKeywordsAbb/Table"}
            mainTextComponent={getMainTextComponent(
                getReplacementObjectForCategories(),
                mainTextKey,
            )}
            innerLinkKey={innerLinkKey}
            innerLinkPage={"findkeywords_byindustry_TopKeywords"}
            apiParams={{
                ...baseParams,
                keys: CATEGORY_PREFIX + baseParams.category,
                filter,
                pageSize: 0,
            }}
            customNavigationParams={{
                tab,
                ...baseParams,
                category: categoryToNavigationQueryParam(category),
            }}
            shouldRender={shouldRender}
            onCtaClick={getOnCtaClick(onCtaClickEventName, EDestination.Industry)}
        />
    );
};
