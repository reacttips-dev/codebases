import { PopTooltipSingleDefault } from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/ChartTooltips";
import React from "react";
import { formatDate } from "utils";

export const PeriodOverPeriodChartTooltip = ({
    points,
    industryAnalysisOverviewHighLevelMetricsContext,
}) => {
    const { selectedMetric } = industryAnalysisOverviewHighLevelMetricsContext;
    const { formatter } = selectedMetric;
    const date = formatDate(points[0].point.values[1].Key);
    const compareToDate = formatDate(points[0].point.values[0].Key);
    const yFormatter = ({ value }) => formatter(value);
    const pointsData = points;
    return <PopTooltipSingleDefault {...{ pointsData, yFormatter, date, compareToDate }} />;
};
