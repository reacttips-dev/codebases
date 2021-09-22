import { numberFilter, percentageSignFilter, timeFilter } from "filters/ngFilters";
import { Dayjs } from "dayjs";
import { singleModeLegends } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Helpers/SearchOverviewGraphConfig";
import { colorsPalettes } from "@similarweb/styles";

export enum EInsightsTypes {
    ORGANIC_CHANNEL, // search traffic - organic and paid -> organic
    PAID_CHANNEL, // search traffic - organic and paid -> paid
    BRANDED_TRAFFIC, // search traffic - branded and non branded -> branded
    VISIT_DURATION_ORGANIC,
    VISIT_DURATION_PAID,
    PAGE_PER_VISIT_ORGANIC,
    PAGE_PER_VISIT_PAID,
    BOUNCE_RATE_ORGANIC,
    BOUNCE_RATE_PAID,
}

export enum EPriorities {
    NOT_AT_ALL_IMPORTANT,
    NOT_VERY_IMPORTANT,
    SOMEWHAT_UNIMPORTANT,
    SOMEWHAT_IMPORTANT,
    VERY_IMPORTANT,
    EXTREMELY_IMPORTANT,
}

export enum EInsightTypes {
    NEW_CHANNEL,
    TRENDING_UP,
    TRENDING_DOWN,
    INCREASING,
    DECREASING,
}

export interface IInsightProps {
    headerColor: string;
    headerKey: string;
    bodyKey: (duration: string) => string;
    headerIcon: string;
}

export interface IInsightsProps {
    [key: number]: IInsightProps;
}

interface IBasicInsight {
    priority: EPriorities;
    formatter: (value: number) => string | number;
    selectedTabOnClick?: number;
    selectedCategoryOnClick?: string;
    getInsightProps?: (insightType: number) => IInsightProps;
    unSelectedLegend?: string;
    selectedLegend?: string;
    displayName: string;
    getValue?: (changeValue, lastDataPointValue) => number;
}

export interface IInsight extends IBasicInsight {
    value: number;
    id: EInsightsTypes;
    isNewChannel?: boolean;
    isPeriodOverPeriodAboveThreshold?: boolean;
    isPeriodOverPeriodOverPeriodAboveThreshold?: boolean;
    lastDataPoint?: { x: Dayjs };
    granularity: string;
}

interface ILegend {
    rawName: string;
    visible: boolean;
}

export interface IInsightLayout extends IInsight {
    setTab?: (tabIndex: number) => void;
    setCategory?: (tabId: string) => void;
    setLegends?: (legends: ILegend) => void;
    insightId: number;
    selectedInsightId: number;
    isVisited: boolean;
    setSelectedInsightId: (insightId: number) => void;
    setGranularity: (granularity: string) => void;
}

export interface IFilters {
    from: string;
    to: string;
    granularity: string;
    trafficThreshold: number;
    lastSupportedDate: Dayjs;
}

export interface IInsightMetaData extends IBasicInsight {
    getInsight: (rawData: any, insightId: EInsightsTypes, filters: IFilters) => IInsight;
    apiEntry?: string;
    channelType?: string;
    weeklyJumpThreshold?: number;
    monthlyJumpThreshold?: number;
    weeklyTrendingThreshold?: number;
    monthlyTrendingThreshold?: number;
    dataParser?: any;
    isJumpAboveThreshold?: (
        average: number,
        standardDeviation: number,
        lastDataPointValue: number,
    ) => boolean;
    supportNewChannel?: boolean;
}

export interface IInsightsMetaData {
    [key: number]: IInsightMetaData;
}

export const channels = {
    ORGANIC: "Organic Search",
    PAID: "Paid Search",
    ALL: "All Channels",
    BRANDED: "Branded",
};

export const legends = {
    PAID: singleModeLegends.organicPaid[1],
    ORGANIC: singleModeLegends.organicPaid[0],
    NON_BRANDED: singleModeLegends.brandedNonBranded[1],
    BRANDED: singleModeLegends.brandedNonBranded[0],
};

export const formatters = {
    TIME: (val) => timeFilter()(val, null),
    PERCENTAGE: (val) => percentageSignFilter()(val, 0),
    NUMBERS: (val) => numberFilter()(val, 2),
};

export const RED = colorsPalettes.red["s100"];
export const GREEN = colorsPalettes.green["s100"];
