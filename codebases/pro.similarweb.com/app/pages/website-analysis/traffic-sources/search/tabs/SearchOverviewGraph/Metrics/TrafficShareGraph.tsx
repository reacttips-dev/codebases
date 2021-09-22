import {
    abbrNumberFilter,
    i18nFilter,
    minVisits,
    minVisitsAbbrFilter,
    percentageSignFilter,
    tinyFractionApproximationFilter,
} from "filters/ngFilters";
import React, { useContext } from "react";
import { BaseMetricGraph } from "../Components/BaseMetricGraph";
import { getBaseChartConfig } from "../Helpers/SearchOverviewGraphConfig";
import { searchOverviewContext } from "../SearchOverviewGraph";

export const TrafficShareGraph = () => {
    const { dataType, selectedMetricTab, category } = useContext(searchOverviewContext);
    const chartType = dataType[selectedMetricTab.name][category.id] === "numbers" ? "line" : "area";
    const yAxisLabelsFormatter = ({ value }) => {
        return chartType === "line" ? abbrNumberFilter()(value) : percentageSignFilter()(value, 0);
    };
    const tooltipFormatter = chartType === "line" ? minVisitsAbbrFilter : percentageSignFilter;
    const yTooltipFormatter = ({ value }) =>
        chartType === "line" ? minVisitsAbbrFilter()(value) : percentageSignFilter()(value, 2);
    const legendsLabelsFormatter = ({ value }) => {
        return chartType === "line"
            ? minVisits(value, 5000, abbrNumberFilter())
            : tinyFractionApproximationFilter()(percentageSignFilter()(value, 2), 2);
    };
    const rawDataMetricName = "TrafficShare";
    const isPercents = chartType !== "line";
    const baseChartConfig = getBaseChartConfig(
        [tooltipFormatter, 2],
        i18nFilter()("search.trafficandengagement.searchtraffic"),
        yTooltipFormatter,
        isPercents,
        useContext(searchOverviewContext),
    );
    const getCurrentChartConfig = () => {
        baseChartConfig.yAxis.labels.formatter = yAxisLabelsFormatter;

        if (chartType === "line") {
            baseChartConfig.stacked = false;
        } else if (chartType === "area") {
            baseChartConfig.stacked = true;
            baseChartConfig.yAxis.max = 1;
        }
        return baseChartConfig;
    };
    const metricConfig = {
        getCurrentChartConfig,
        legendsLabelsFormatter,
        rawDataMetricName,
        chartType,
        showAllChannel: true,
    };
    return <BaseMetricGraph metricConfig={metricConfig} />;
};
