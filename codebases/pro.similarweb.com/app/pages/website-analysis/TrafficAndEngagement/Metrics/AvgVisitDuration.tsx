import {
    PopTooltip,
    PopTooltipSingle,
} from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/ChartTooltips";
import { CompareModeTooltip } from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/CommonChartTooltip";
import { GenericGraph } from "pages/website-analysis/TrafficAndEngagement/Components/GenericGraph";
import { PopSingleModeLegends } from "pages/website-analysis/TrafficAndEngagement/Legends/PopSingleModeLegends";
import {
    parseData,
    parsePOPCompareModeDataWithMTD,
    parsePOPSingleModeDataWithMTD,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/ParseServerData";
import {
    dateFormatter,
    defaultExcelEndPoint,
    getChartType,
    getGetExcel,
    getrInitPOPItemsSingleModeWebSources,
    isTimeGranularityDisabled,
    isTimeGranularityDisabledOnlyMonth,
    neverStacking,
    popCompareExcelEndPoint,
    popSingleChartType,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { percentageSignFilter, timeFilter } from "filters/ngFilters";
import React from "react";
import {
    tooltipPositioner,
    POPAndCompareTooltipPositioner,
} from "pages/website-analysis/TrafficAndEngagement/MD/chartConfig";
import { ChartIds } from "components/Chart/src/components/annotations/Helpers/ChartIdsHelper";

export const AvgVisitDuration = (props) => {
    const {
        name,
        meta: { isSingleMode, isPOP },
    } = props;
    let metricData;
    const timeFormatter = ({ value }) => timeFilter()(value, null);
    if (!isPOP) {
        const addToDashboardName = "EngagementAvgVisitDuration";
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementAvgVisitDuration/Graph";
        const getChartType = () => "line";
        const getExcelLink = getGetExcel(defaultExcelEndPoint);
        const getGraphData = parseData;
        const chartTooltip = (props) => (
            <CompareModeTooltip
                {...props}
                xFormatter={dateFormatter}
                yFormatter={timeFormatter}
                name={name}
            />
        );
        metricData = {
            endPoint,
            isTimeGranularityDisabled,
            getChartType,
            yAxisLabelsFormatter: timeFormatter,
            getExcelLink,
            addToDashboardName,
            getGraphData,
            chartTooltip,
            tooltipPositioner,
        };
    } else if (isSingleMode) {
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementAvgVisitDuration/GraphPOP";
        const addToDashboardName = "EngagementAvgVisitDuration";
        const getGraphData = parsePOPSingleModeDataWithMTD;
        const yAxisLabelsFormatter = timeFormatter;
        const getExcelLink = getGetExcel(defaultExcelEndPoint);
        const getChartType = () => "line";
        const chartType = popSingleChartType;
        const isStacking = () => false;
        const getWebSourceForApi = ({ webSource }) => webSource;
        const getSites = (props) => getrInitPOPItemsSingleModeWebSources(props);
        const legends = (props) => <PopSingleModeLegends {...props} />;
        const chartTooltip = (props) => (
            <PopTooltipSingle
                pointsData={props.points}
                xFormatter={dateFormatter}
                yFormatter={timeFormatter}
            />
        );
        metricData = {
            endPoint,
            isTimeGranularityDisabled: isTimeGranularityDisabledOnlyMonth,
            getChartType,
            yAxisLabelsFormatter,
            getExcelLink,
            getGraphData,
            getWebSourceForApi,
            hideLegendsData: true,
            getSites,
            legends,
            chartTooltip,
            isStacking,
            addToDashboardName,
            chartType,
            tooltipPositioner,
        };
    } else {
        const endPoint = "widgetApi/TrafficGrowthComparison/EngagementVisits/Graph";
        const yAxisLabelsFormatter = ({ value }) => percentageSignFilter()(value, 0);
        const getExcelLink = getGetExcel(popCompareExcelEndPoint);
        const getGraphData = parsePOPCompareModeDataWithMTD;
        const chartTooltip = (props) => (
            <PopTooltip
                pointsData={props.points}
                xFormatter={dateFormatter}
                yFormatter={timeFormatter}
            />
        );
        const popApiResponseName = "AvgVisitDuration";
        metricData = {
            endPoint,
            isTimeGranularityDisabled: isTimeGranularityDisabledOnlyMonth,
            getChartType,
            yAxisLabelsFormatter,
            getExcelLink,
            getGraphData,
            name,
            chartTooltip,
            popApiResponseName,
            isStacking: neverStacking,
            hideLegendsData: true,
            tooltipPositioner: POPAndCompareTooltipPositioner,
        };
    }
    return (
        <GenericGraph
            metric={metricData}
            {...props}
            chartIdForAnnotations={`${ChartIds["TrafficAndEngagementAvgVisitDuration"]}`}
        />
    );
};
