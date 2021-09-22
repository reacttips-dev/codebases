import React, { MutableRefObject } from "react";
import { granularityItem, toggleItems } from "components/widget/widget-utilities/time-granularity";
import { EMetrics, ITabMd, tabs } from "pages/industry-analysis/overview/highLevelMetrics/tabsMD";
import { ILegendItems } from "components/React/Legends/styledComponents";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import {
    getrInitPOPItemsSingleModeWebSources,
    webSources,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { IDurationData } from "services/DurationService";

export type IParams = Record<string, string | boolean | number>;

export interface IIndustryAnalysisOverviewHighLevelMetricsContext {
    timeGranularity: granularityItem;
    setTimeGranularity: (timeGranularity: granularityItem) => void;
    selectedMetric: ITabMd;
    setSelectedMetric: (metric: ITabMd) => void;
    queryParams: IParams;
    params: IParams;
    chartRef: MutableRefObject<HTMLDivElement>;
    setChartRef: (chartRef: MutableRefObject<HTMLDivElement>) => void;
    legendItems: ILegendItems;
    setLegendItems: (legendItems: ILegendItems) => void;
    shouldRenderLegends: boolean;
    isPeriodOverPeriod: boolean;
    durations: IDurationData;
}

const IndustryAnalysisOverviewHighLevelMetricsContext = React.createContext<
    IIndustryAnalysisOverviewHighLevelMetricsContext
>(null);

export const IndustryAnalysisOverviewHighLevelMetricsContextProvider =
    IndustryAnalysisOverviewHighLevelMetricsContext.Provider;

export const useIndustryAnalysisOverviewHighLevelMetricsContext = (): IIndustryAnalysisOverviewHighLevelMetricsContext =>
    React.useContext(IndustryAnalysisOverviewHighLevelMetricsContext);

export const getContextValue = (queryParams, params, durations) => {
    const { selectedMetric: selectedMetricParam, webSource, comparedDuration } = params;
    const selectedMetric = selectedMetricParam
        ? tabs.find(({ id }) => EMetrics[id] === selectedMetricParam)
        : tabs[0];
    const isPeriodOverPeriod = comparedDuration !== "";
    const shouldRenderLegends = webSource === devicesTypes.TOTAL || isPeriodOverPeriod;

    const baseLegendItems = webSources
        .filter(({ name }) => name !== devicesTypes.TOTAL)
        .map(({ name, color, alias }) => {
            const visible = webSource === devicesTypes.TOTAL ? true : webSource === name;
            return { name, color, visible, metric: alias };
        });
    const periodOverPeriodLegendItems = getrInitPOPItemsSingleModeWebSources({
        durations: durations.forWidget,
    }).map((legend) => ({ ...legend, visible: true }));
    const legendItems = isPeriodOverPeriod ? periodOverPeriodLegendItems : baseLegendItems;

    const defaultTimeGranularity = isPeriodOverPeriod ? toggleItems.Monthly : toggleItems.Daily;

    const initialState = {
        durations,
        timeGranularity: defaultTimeGranularity,
        selectedMetric,
        queryParams: { ...queryParams, timeGranularity: defaultTimeGranularity.value },
        params,
        chartRef: undefined,
        legendItems,
        shouldRenderLegends,
        isPeriodOverPeriod,
    };
    const [state, setState] = React.useState(initialState);
    const swNavigator = Injector.get<SwNavigator>("swNavigator");

    return {
        ...state,
        setTimeGranularity: (timeGranularity) => {
            setState({
                ...state,
                queryParams: { ...queryParams, timeGranularity: timeGranularity.value },
                timeGranularity,
            });
        },
        setSelectedMetric: (metric: ITabMd) => {
            swNavigator.applyUpdateParams({ selectedMetric: EMetrics[metric.id] });
            setState({
                ...state,
                selectedMetric: metric,
            });
        },
        setChartRef: (chartRef) => {
            setState({
                ...state,
                chartRef,
            });
        },
        setLegendItems: (legendItems) => {
            setState({
                ...state,
                legendItems,
            });
        },
    };
};
