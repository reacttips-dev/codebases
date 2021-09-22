import { i18nFilter, timeFilter } from "filters/ngFilters";
import React from "react";
import { BaseMetricGraph } from "../Components/BaseMetricGraph";
import { getBaseChartConfig } from "../Helpers/SearchOverviewGraphConfig";
import { searchOverviewContext } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchOverviewGraph";

export const AvgVisitDurationGraph = () => {
    const timeFormatter = ({ value }) => timeFilter()(value, null);
    const baseChartConfig = getBaseChartConfig(
        [timeFilter, 2],
        i18nFilter()("wa.ao.graph.avgduration"),
        timeFormatter,
        false,
        React.useContext(searchOverviewContext),
    );
    const rawDataMetricName = "AverageDuration";
    const legendsLabelsFormatter = timeFormatter;
    const chartType = "line";
    const getCurrentChartConfig = () => {
        baseChartConfig.stacked = false;
        return baseChartConfig;
    };
    const metricConfig = {
        getCurrentChartConfig,
        legendsLabelsFormatter,
        rawDataMetricName,
        chartType,
        showAllChannel: true,
        showTooltip: true,
        tooltipKey: "organic.search.overview.graph.duration.tooltip",
    };
    return <BaseMetricGraph metricConfig={metricConfig} />;
};
