import { ProTip } from "components/React/commonInsights/components/ProTip";
import {
    bold,
    categoryToNavigationQueryParam,
    EDestination,
    getCategoryDisplayValue,
    getChosenSiteCategory,
} from "components/React/commonInsights/utilities/functions";
import { getMonthDetails } from "UtilitiesAndConstants/UtilityFunctions/timeAndDate";

export const SeasonalKeywordsInsight = ({ onCtaClickEventName }) => {
    const { monthName, monthNumber } = getMonthDetails();
    const category = getChosenSiteCategory();

    const replacementObject = {
        category: bold(getCategoryDisplayValue(category)),
        month: bold(monthName),
    };
    return (
        category && (
            <ProTip
                mainTextKey={"website.performance.insights.seasonal.keywords.content"}
                innerLinkPage={"findkeywords_byindustry_SeasonalKeywords"}
                innerLinkKey={"website.performance.insights.seasonal.keywords.cta"}
                replacementObject={replacementObject}
                onCtaClickEventName={onCtaClickEventName}
                ctaDestination={EDestination.Seasonal}
                navigationParams={{
                    category: categoryToNavigationQueryParam(category),
                    months: monthNumber,
                    duration: "12m",
                }}
            />
        )
    );
};
