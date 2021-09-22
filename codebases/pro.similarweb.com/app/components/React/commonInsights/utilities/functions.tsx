import { MainText } from "../components/MainText";
import ReactDOMServer from "react-dom/server";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { abbrNumberFilter } from "filters/ngFilters";
import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    CATEGORY_API_SEPARATOR,
    CATEGORY_DISPLAY_SEPARATOR,
    CATEGORY_GROUP_SEPARATOR,
    CATEGORY_NAVIGATION_SEPARATOR,
    DEFAULT_TOTAL_COUNT_FIELD,
    MAX_CATEGORY_LENGTH,
} from "components/React/commonInsights/utilities/constants";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";

export const getMainTextComponent = (
    getReplacementObject: (rawData: any) => Record<string, string>,
    mainTextKey,
) => ({ rawData }) => {
    const replacementObject = getReplacementObject(rawData);
    return <MainText mainTextKey={mainTextKey} replacementObject={replacementObject} />;
};

export const bold = (text) => ReactDOMServer.renderToString(<b>{text}</b>);

export const mapStateToProps = (state) => {
    const {
        routing: { params, chosenItems },
    } = state;
    return {
        params,
        chosenItems,
    };
};

export const navigate = (innerLinkPage: string, navigationParams = {}) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    swNavigator.go(innerLinkPage, navigationParams);
};

export const getChosenSiteCategory = () =>
    Injector.get<any>("chosenSites").getPrimarySite().category;

export const categoryToNavigationQueryParam = (category) =>
    category
        ?.replace(CATEGORY_GROUP_SEPARATOR, CATEGORY_NAVIGATION_SEPARATOR)
        .replaceAll(CATEGORY_DISPLAY_SEPARATOR, CATEGORY_API_SEPARATOR);

export const getReplacementObjectForCategories = (totalCountField = DEFAULT_TOTAL_COUNT_FIELD) => (
    rawData,
) => ({
    keywordsAmount: bold(abbrNumberFilter()(rawData[totalCountField])),
    category: bold(getCategoryDisplayValue(getChosenSiteCategory())),
});

export const getCategoryDisplayValue = (category) =>
    category?.includes(CATEGORY_GROUP_SEPARATOR)
        ? category?.split(CATEGORY_GROUP_SEPARATOR)[1]?.substring(0, MAX_CATEGORY_LENGTH)
        : category;

export const getReplacementObjectKeywordsAmount = (totalCountField = DEFAULT_TOTAL_COUNT_FIELD) => (
    rawData,
) => ({
    keywordsAmount: bold(abbrNumberFilter()(rawData[totalCountField])),
});

export const shouldRenderAmountBased = (totalCountField = DEFAULT_TOTAL_COUNT_FIELD) => (rawData) =>
    rawData[totalCountField] > 0;

export enum EOnCtaClickEventName {
    WEBSITE_PERFORMANCE_ORGANIC = "WP organic",
    WEBSITE_PERFORMANCE_PAID = "WP paid",
    SEARCH_OVERVIEW = "Search Overview",
}

export enum EDestination {
    Gap,
    Generator,
    Industry,
    Seasonal,
    Keywords,
}
export const getOnCtaClick = (
    eventName: EOnCtaClickEventName,
    destination: EDestination,
    keywordsGapPredefinedFiler?: EFiltersTypes,
    guid = "website.performance.insights.cta.click",
    action = "click",
) => () => {
    TrackWithGuidService.trackWithGuid(guid, action, {
        eventName,
        destination: EDestination[destination],
        gapType: keywordsGapPredefinedFiler ? EFiltersTypes[keywordsGapPredefinedFiler] : String(),
    });
};

export const getOrganicPaidParams = (gapFilterSelectedTab) => {
    if (gapFilterSelectedTab === ETabsTypes.ORGANIC)
        return { IncludeOrganic: true, IncludePaid: false };
    if (gapFilterSelectedTab === ETabsTypes.PAID)
        return { IncludeOrganic: false, IncludePaid: true };
    return { IncludeOrganic: false, IncludePaid: false };
};
