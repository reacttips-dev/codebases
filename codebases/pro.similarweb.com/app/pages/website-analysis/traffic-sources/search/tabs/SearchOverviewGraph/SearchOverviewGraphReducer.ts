import _ from "lodash";
import React, { RefObject } from "react";
import DurationService, { IDurationData } from "services/DurationService";
import {
    allChannels,
    brandedNonBranded,
    brandedNonBrandedCategory,
    mobileSearchTraffic,
    mobileSearchTrafficCategory,
    numbers,
    organicPaid,
    organicPaidCategory,
    percents,
    searchTrafficGraphTabsConfig,
    searchType,
    searchTypeCategory,
    timeGranularityList,
} from "./Helpers/SearchOverviewGraphConfig";
import {
    CHANGE_CATEGORY,
    CHANGE_DATA_TYPE,
    CHANGE_METRIC,
    ERROR,
    IS_LOADING,
    NEW_DATA,
    RESET_CHANNEL_AND_CATEGORY,
    SELECT_CHANNEL,
    SET_IS_MONTH_TO_DATE_ACTIVE,
    SET_TIME_GRANULARITY,
    TOGGLE_LEGEND_ITEM,
} from "./SearchOverviewGraphActions";

type ITabType = typeof searchTrafficGraphTabsConfig[0] & { value?: number };
type IGranularityType = typeof timeGranularityList.daily;
type IDataType = "numbers" | "percents";

export interface ICategory {
    id: string;
    title: string;
}

export interface ILegendItemState {
    rawName: string;
    visible: boolean;
}

enum Metrics {
    TrafficShare = "TrafficShare",
    AverageDuration = "AverageDuration",
    PagesPerVisit = "PagesPerVisit",
    BounceRate = "BounceRate",
}

export type IMetricDataType = {
    [key in Metrics]: {
        brandedNonBranded?: IDataType | null;
        organicPaid?: IDataType | null;
        searchType?: IDataType | null;
    };
};

export interface ISearchOverviewState {
    selectedMetricTab: ITabType;
    category: ICategory;
    channel: string;
    dataType: IMetricDataType;
    durationObj: IDurationData;
    duration: string;
    country: string;
    webSource: string;
    breakdownFilter?: string;
    granularity?: IGranularityType;
    includeSubDomains: boolean;
    keys: string | string[];
    rawData: any;
    isLoading: boolean;
    isError: boolean;
    from: string;
    to: string;
    isWindow: boolean;
    chartRef: RefObject<HTMLDivElement>;
    isSingle: boolean;
    isMobileWeb: boolean;
    legendItemsState: ILegendItemState[];
    totals: any;
    isMonthsToDateActive: boolean;
}

const defaultDataType = {
    TrafficShare: {
        brandedNonBranded: "percents",
        organicPaid: "numbers",
        searchType: "percents",
        mobileSearchTraffic: "numbers",
    },
    AverageDuration: {
        organicPaid: "numbers",
    },
    PagesPerVisit: {
        organicPaid: "numbers",
    },
    BounceRate: {
        organicPaid: "percents",
    },
};

const gertDefaultGranularity = (duration) =>
    DurationService.isGreaterThanThreeMonths(duration)
        ? timeGranularityList.monthly.name
        : timeGranularityList.weekly.name;

export const initState = ({
    key,
    country,
    webSource,
    duration,
    isWWW,
    selectedMetricTab,
    category,
    dataType,
    breakdownFilter = null,
    granularity,
    rawData = null,
    isLoading = true,
    isError = false,
    isSingle,
    isMobileWeb,
    totals = null,
    channel = null,
}): ISearchOverviewState => {
    const durationObj = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObj.forAPI;
    const defaultCategory =
        isMobileWeb && isSingle ? mobileSearchTrafficCategory : organicPaidCategory;
    return validateAndApplyChanges({
        selectedMetricTab: selectedMetricTab ?? searchTrafficGraphTabsConfig[0],
        category: category ?? defaultCategory,
        dataType: dataType ?? defaultDataType,
        channel: channel ?? allChannels,
        durationObj,
        duration,
        country,
        webSource,
        keys: key,
        breakdownFilter,
        isError,
        granularity: granularity ?? gertDefaultGranularity(duration),
        includeSubDomains: isWWW === "*",
        rawData,
        isLoading,
        isWindow,
        from,
        to,
        isSingle,
        isMobileWeb,
        legendItemsState: [],
        chartRef: React.createRef<HTMLDivElement>(),
        totals,
        isMonthsToDateActive: true,
    });
};

export const isCategoryAvailableForState = _.curry((state, category) => {
    switch (category.id) {
        case organicPaid:
            return !state.isMobileWeb;
        case mobileSearchTraffic:
            return state.isMobileWeb;
        case brandedNonBranded:
            return state.selectedMetricTab.name === "TrafficShare" && !state.isWindow;
        case searchType:
            return (
                !state.isMobileWeb &&
                state.selectedMetricTab.name === "TrafficShare" &&
                !state.isWindow
            );
    }
});

export const isDataTypeAvailableForState = _.curry((state, dataType) => {
    switch (state.selectedMetricTab.name) {
        case Metrics.TrafficShare:
            if (
                state.category.id === brandedNonBrandedCategory.id ||
                state.category.id === searchTypeCategory.id
            ) {
                return dataType === percents;
            }
            if (state.category.id === mobileSearchTraffic) {
                return dataType === numbers;
            }
            return true;
        case Metrics.BounceRate:
            return dataType === percents;
        default:
            return dataType === numbers;
    }
});

function validateAndApplyChanges(nextState) {
    if (!isCategoryAvailableForState(nextState, nextState.category)) {
        nextState = {
            ...nextState,
            legendItemsState: [],
            category:
                nextState.webSource === "MobileWeb"
                    ? brandedNonBrandedCategory
                    : organicPaidCategory,
            channel: allChannels,
        };
    }

    return nextState;
}

function toggleLegendItem(legendItemsState, legendItem) {
    const { rawName, visible } = legendItem;
    const itemInState = legendItemsState.find(({ rawName: n }) => n === rawName);
    if (itemInState) {
        return legendItemsState.map((item) => {
            if (item === itemInState) {
                return {
                    ...item,
                    visible: !visible,
                };
            }
            return item;
        });
    }
    return [...legendItemsState, { rawName, visible: !visible }];
}

function recurseAllChannels(obj) {
    return Object.entries(obj).reduce((previous, [key, value]) => {
        if (_.isPlainObject(value)) {
            previous[key] = recurseAllChannels(value);
        } else {
            previous[key] = value;
            if (key === "All Channels") {
                previous["Search Traffic"] = value;
            }
        }
        return previous;
    }, {} as any);
}

function processDataForNextState(nextState) {
    if (
        nextState.isMobileWeb &&
        nextState.isSingle &&
        nextState.category?.id === mobileSearchTraffic &&
        nextState.rawData
    ) {
        return {
            ...nextState,
            rawData: recurseAllChannels(nextState.rawData),
        };
    }
    return nextState;
}

export function searchOverviewGraphReducer(
    state: ISearchOverviewState,
    action,
): ISearchOverviewState {
    switch (action.type) {
        case NEW_DATA:
            return processDataForNextState({
                ...state,
                isError: false,
                rawData: action.rawData,
                totals: action.totals,
            });
        case IS_LOADING:
            return {
                ...state,
                isError: false,
                isLoading: action.isLoading,
            };
        case ERROR:
            return { ...state, isError: true };
        case CHANGE_METRIC:
            return validateAndApplyChanges({
                ...state,
                selectedMetricTab: action.selectedMetricTab,
            });
        case CHANGE_CATEGORY:
            return validateAndApplyChanges({
                ...state,
                category: action.index,
                legendItemsState: [],
            });
        case CHANGE_DATA_TYPE:
            return validateAndApplyChanges({
                ...state,
                dataType: action.dataType,
            });
        case SET_TIME_GRANULARITY:
            return {
                ...state,
                granularity: action.timeGranularity,
            };
        case SET_IS_MONTH_TO_DATE_ACTIVE:
            return {
                ...state,
                isMonthsToDateActive: action.isMonthsToDateActive,
            };
        case TOGGLE_LEGEND_ITEM:
            return {
                ...state,
                legendItemsState: toggleLegendItem(state.legendItemsState, action.item),
            };
        case SELECT_CHANNEL:
            return validateAndApplyChanges({
                ...state,
                channel: action.channel,
                category: action.category,
            });
        case RESET_CHANNEL_AND_CATEGORY:
            return validateAndApplyChanges({
                ...state,
                channel: allChannels,
                category: organicPaidCategory,
                dataType: defaultDataType,
            });
        default:
            return state;
    }
}
