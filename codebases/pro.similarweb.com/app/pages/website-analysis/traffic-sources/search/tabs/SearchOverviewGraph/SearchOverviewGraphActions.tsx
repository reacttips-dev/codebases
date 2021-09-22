import { useMemo } from "react";
import { bindActionCreators } from "redux";

export const IS_LOADING = "IS_LOADING";
export const NEW_DATA = "NEW_DATA";
export const CHANGE_METRIC = "CHANGE_METRIC";
export const CHANGE_CATEGORY = "CHANGE_CATEGORY";
export const CHANGE_DATA_TYPE = "CHANGE_DATA_TYPE";
export const ERROR = "ERROR";
export const TOGGLE_LEGEND_ITEM = "TOGGLE_LEGEND_ITEM";
export const SELECT_CHANNEL = "SELECT_CHANNEL";
export const RESET_CHANNEL_AND_CATEGORY = "RESET_CHANNEL_AND_CATEGORY";
export const SET_TIME_GRANULARITY = "SET_TIME_GRANULARITY";
export const SET_IS_MONTH_TO_DATE_ACTIVE = "SET_IS_MONTH_TO_DATE_ACTIVE";

export const actionCreators = {
    saveData: (rawData, totals) => ({
        type: NEW_DATA,
        rawData,
        totals,
    }),
    fetchDataStart: () => ({
        type: IS_LOADING,
        isLoading: true,
    }),
    fetchDataEnd: () => ({
        type: IS_LOADING,
        isLoading: false,
    }),
    setActiveTab: (selectedMetricTab) => ({
        type: CHANGE_METRIC,
        selectedMetricTab,
    }),
    setError: () => ({
        type: ERROR,
    }),
    setCategory: (index) => ({
        type: CHANGE_CATEGORY,
        index,
    }),
    setDataType: (dataType) => ({
        type: CHANGE_DATA_TYPE,
        dataType,
    }),
    toggleLegendItem: (item) => ({
        type: TOGGLE_LEGEND_ITEM,
        item,
    }),
    selectChannel: ({ category, channel }) => ({
        type: SELECT_CHANNEL,
        category,
        channel,
    }),
    resetChannelAndCategory: () => ({
        type: RESET_CHANNEL_AND_CATEGORY,
    }),
    setTimeGranularity: (timeGranularity) => ({
        type: SET_TIME_GRANULARITY,
        timeGranularity,
    }),
    setIsMonthsToDateActive: (isMonthsToDateActive) => ({
        type: SET_IS_MONTH_TO_DATE_ACTIVE,
        isMonthsToDateActive,
    }),
};

export function useActionCreators(dispatch) {
    return useMemo(
        () => bindActionCreators(actionCreators, dispatch),

        [dispatch],
    );
}
