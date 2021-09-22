import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import { searchOverviewContext } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchOverviewGraph";
import React, { useContext } from "react";
import { BaseMetricGraph } from "../Components/BaseMetricGraph";
import { getBaseChartConfig } from "../Helpers/SearchOverviewGraphConfig";
import { colorsPalettes } from "@similarweb/styles";

export const BounceRateGraph = () => {
    const percentageFormatter = ({ value }) => percentageSignFilter()(value, 2);
    const getChangeColor = (isDecrease, isNan) =>
        !isNan
            ? !isDecrease
                ? colorsPalettes.red.s100
                : colorsPalettes.green.s100
            : colorsPalettes.carbon[500];
    const baseChartConfig = getBaseChartConfig(
        [percentageSignFilter, 2],
        i18nFilter()("wa.ao.graph.bounce"),
        percentageFormatter,
        true,
        useContext(searchOverviewContext),
        getChangeColor,
    );
    const rawDataMetricName = "BounceRate";
    const legendsLabelsFormatter = percentageFormatter;
    const chartType = "line";
    const getCurrentChartConfig = () => {
        return {
            ...baseChartConfig,
            yAxis: {
                ...baseChartConfig.yAxis,
                max: 1,
            },
        };
    };
    const metricConfig = {
        getCurrentChartConfig,
        legendsLabelsFormatter,
        rawDataMetricName,
        chartType,
    };
    return <BaseMetricGraph metricConfig={metricConfig} />;
};
