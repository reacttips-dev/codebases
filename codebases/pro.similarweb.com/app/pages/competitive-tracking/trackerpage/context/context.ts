import React from "react";
import { toggleItems } from "components/widget/widget-utilities/time-granularity";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { ETabsState } from "../tabs/types";
import { getTabsMD } from "../tabs/tabsMD";
import { EMetrics, IMetric } from "../metrics/types";
import { EChartTypes, EChartViewType, ICompetitiveTrackerHighLevelMetricsContext } from "./types";

export const clientWidthThreshold = 1600;

const CompetitiveTrackerHighLevelMetricsContext = React.createContext<
    ICompetitiveTrackerHighLevelMetricsContext
>(null);

export const CompetitiveTrackerHighLevelMetricsContextProvider =
    CompetitiveTrackerHighLevelMetricsContext.Provider;

export const useCompetitiveTrackerHighLevelMetricsContext = (): ICompetitiveTrackerHighLevelMetricsContext =>
    React.useContext(CompetitiveTrackerHighLevelMetricsContext);

export const getContextValue = (routing, segmentsModule) => {
    const { params } = routing;
    const {
        selectedMetric: selectedMetricParam = EMetrics[EMetrics.AvgMonthVisits],
        trackerId,
    } = params;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const legendItems = [];
    const selectedMetric = getTabsMD().find(({ id }) => EMetrics[id] === selectedMetricParam);
    const initialState = {
        timeGranularity: toggleItems.Monthly,
        selectedMetric,
        endpoint: "api/Tracker/TrafficAndEngagement/Graph",
        queryParams: { trackerId },
        data: { headerData: {}, chartData: {}, duration: null },
        chartType: EChartTypes.AREA,
        legendItems,
        chartViewType: EChartViewType.PERCENTAGE,
        trackerState: ETabsState.LOADING,
    };
    const [state, setState] = React.useState(initialState);
    const actions = {
        setSelectedMetric: (metric: IMetric) => {
            swNavigator.applyUpdateParams({ selectedMetric: EMetrics[metric.id] });
            setState({
                ...state,
                selectedMetric: metric,
            });
        },
        setLegendItems: (legendItems) => {
            setState({
                ...state,
                legendItems,
            });
        },
        setData: (data) => {
            setState({
                ...state,
                data,
            });
        },
        setChartType: (chartType: EChartTypes) => {
            setState({
                ...state,
                chartType,
            });
        },
        setChartViewType: (chartViewType: EChartViewType) => {
            setState({
                ...state,
                chartViewType,
            });
        },
        setTrackerState: (trackerState: ETabsState) => {
            setState({
                ...state,
                trackerState,
            });
        },
    };
    const context = { ...actions, ...state, segmentsModule };
    return context;
};
