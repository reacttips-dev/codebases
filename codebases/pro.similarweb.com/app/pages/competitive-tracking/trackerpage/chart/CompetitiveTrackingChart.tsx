import ChartView from "components/Chart/src/Chart";
import React from "react";
import { useCompetitiveTrackerHighLevelMetricsContext } from "../context/context";
import { getCompetitiveTrackingChartConfig } from "./CompetitiveTrackingChartConfig";

export const CompetitiveTrackingChart = () => {
    const competitiveTrackerHighLevelMetricsContext = useCompetitiveTrackerHighLevelMetricsContext();
    const {
        data: { chartData },
        chartType,
        selectedMetric,
        legendItems,
    } = competitiveTrackerHighLevelMetricsContext;
    const { metric } = selectedMetric;
    const data = chartData[metric]?.filter((_item, index) => legendItems[index]?.visible);
    const chartConfig = getCompetitiveTrackingChartConfig(
        competitiveTrackerHighLevelMetricsContext,
    );
    return <ChartView type={chartType} data={data} config={chartConfig} />;
};
