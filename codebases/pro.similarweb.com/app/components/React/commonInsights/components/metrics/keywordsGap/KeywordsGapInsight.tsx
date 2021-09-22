import {
    EDestination,
    getMainTextComponent,
    getOnCtaClick,
    getOrganicPaidParams,
    getReplacementObjectKeywordsAmount,
    shouldRenderAmountBased,
} from "components/React/commonInsights/utilities/functions";
import { keywordsIntersectionFiltersMD } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { InsightWrapper } from "components/React/commonInsights/components/InsightWrapper";

export const KeywordsGapInsight = ({
    mainTextKey,
    limitType,
    predefinedFiler,
    gapFilterSelectedTab,
    onCtaClickEventName,
}) => {
    const getReplacementObject = getReplacementObjectKeywordsAmount();

    const limits = keywordsIntersectionFiltersMD[limitType].apiValue;

    const baseParams = {
        webSource: devicesTypes.DESKTOP,
        IncludeBranded: false,
        IncludeNoneBranded: true,
        ...getOrganicPaidParams(gapFilterSelectedTab),
    };
    return (
        <InsightWrapper
            endpoint={"widgetApi/SearchKeywords/NewSearchKeywords/Table"}
            mainTextComponent={getMainTextComponent(getReplacementObject, mainTextKey)}
            innerLinkKey={"website.performance.insights.organic.keywords.cta"}
            innerLinkPage={"findkeywords_bycompetition"}
            apiParams={{
                ...baseParams,
                pageSize: 0,
                limits,
            }}
            customNavigationParams={{
                ...baseParams,
                predefinedFiler,
                gapFilterSelectedTab,
                limitsUsingAndOperator: limits,
            }}
            shouldRender={shouldRenderAmountBased()}
            onCtaClick={getOnCtaClick(onCtaClickEventName, EDestination.Gap, predefinedFiler)}
        />
    );
};
