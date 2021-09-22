import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import {
    bold,
    EDestination,
    getMainTextComponent,
    getOnCtaClick,
} from "components/React/commonInsights/utilities/functions";
import { ETableTabDefaultIndex } from "pages/keyword-analysis/keyword-generator-tool/types";
import { InsightWrapper } from "../../InsightWrapper";
import { Insight } from "components/React/commonInsights/components/Insight";
import { ProTip } from "components/React/commonInsights/components/ProTip";

const TopPaidNonBrandedKeywordsInsightPropTip = ({ onCtaClickEventName }) => (
    <ProTip
        mainTextKey={"website.performance.insights.pro.tip.paid.generator"}
        innerLinkPage={"findkeywords_KeywordGenerator_home"}
        innerLinkKey={"website.performance.insights.pro.tip.related.keywords.cta"}
        onCtaClickEventNam={onCtaClickEventName}
        ctaDestination={EDestination.Generator}
    />
);

export const TopPaidNonBrandedKeywordsInsight = ({ onCtaClickEventName }) => {
    const MAIN_TEXT_KEY = "website.performance.insights.top.paid.non.branded.content";
    const getReplacementObject = (rawData) => {
        return {
            keyword: bold(rawDataToKeyword(rawData)),
        };
    };

    const rawDataToKeyword = (rawData) => rawData.Data[0]?.SearchTerm;

    const baseParams = {
        webSource: devicesTypes.DESKTOP,
        IncludeTrendingKeywords: true,
        IncludeOrganic: true,
        IncludePaid: false,
        IncludeBranded: false,
        IncludeNoneBranded: true,
    };
    const getNavigationParams = (rawData) => ({
        ...baseParams,
        selectedWidgetTab: ETableTabDefaultIndex.relatedKeywords,
        keyword: rawDataToKeyword(rawData),
    });

    const renderComponent = (props) => {
        const render = rawDataToKeyword(props.rawData);

        return render ? (
            <Insight {...props} />
        ) : (
            <TopPaidNonBrandedKeywordsInsightPropTip onCtaClickEventName={onCtaClickEventName} />
        );
    };
    return (
        <InsightWrapper
            endpoint={"widgetApi/SearchKeywords/NewSearchKeywords/Table"}
            mainTextComponent={getMainTextComponent(getReplacementObject, MAIN_TEXT_KEY)}
            innerLinkKey={"website.performance.insights.pro.tip.related.keywords.cta"}
            innerLinkPage={"findkeywords_keywordGeneratorTool"}
            apiParams={{
                ...baseParams,
                pageSize: 1,
            }}
            customNavigationParams={getNavigationParams}
            renderComponent={renderComponent}
            onCtaClick={getOnCtaClick(onCtaClickEventName, EDestination.Generator)}
        />
    );
};
