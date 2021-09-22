import { colorsPalettes } from "@similarweb/styles";
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
    popCompareEndPoint,
    popCompareExcelEndPoint,
    popSingleChartType,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { percentageSignFilter } from "filters/ngFilters";
import React from "react";
import {
    tooltipPositioner,
    POPAndCompareTooltipPositioner,
} from "pages/website-analysis/TrafficAndEngagement/MD/chartConfig";
import { ChartIds } from "components/Chart/src/components/annotations/Helpers/ChartIdsHelper";

export const getChangeColor = (isDecrease: boolean, isNan: boolean): string =>
    !isNan
        ? !isDecrease
            ? colorsPalettes.red.s100
            : colorsPalettes.green.s100
        : colorsPalettes.carbon[500];

export const BounceRate = (props) => {
    const {
        name,
        meta: { isSingleMode, isPOP },
    } = props;
    let metricData;
    const percentageFormatter = ({ value }) => percentageSignFilter()(value, 2);
    if (!isPOP) {
        const addToDashboardName = "EngagementBounceRate";
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementBounceRate/Graph";
        const getChartType = () => "line";
        const getExcelLink = getGetExcel(defaultExcelEndPoint);
        const getGraphData = parseData;
        const chartTooltip = (props) => (
            <CompareModeTooltip
                {...props}
                xFormatter={dateFormatter}
                yFormatter={percentageFormatter}
                name={name}
                getChangeColor={getChangeColor}
            />
        );
        metricData = {
            endPoint,
            isTimeGranularityDisabled,
            getChartType,
            yAxisLabelsFormatter: percentageFormatter,
            getExcelLink,
            addToDashboardName,
            getGraphData,
            chartTooltip,
            tooltipPositioner,
        };
    } else if (isSingleMode) {
        const addToDashboardName = "EngagementBounceRate";
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementBounceRate/GraphPOP";
        const getGraphData = parsePOPSingleModeDataWithMTD;
        const isStacking = () => false;
        const yAxisLabelsFormatter = ({ value }) => percentageSignFilter()(value, 0);
        const getExcelLink = getGetExcel(defaultExcelEndPoint);
        const getChartType = () => "line";
        const chartType = popSingleChartType;
        const getWebSourceForApi = ({ webSource }) => webSource;
        const getSites = (props) => getrInitPOPItemsSingleModeWebSources(props);
        const legends = (props) => <PopSingleModeLegends {...props} />;
        const chartTooltip = (props) => (
            <PopTooltipSingle
                pointsData={props.points}
                xFormatter={dateFormatter}
                yFormatter={percentageFormatter}
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
        const endPoint = popCompareEndPoint;
        const yAxisLabelsFormatter = ({ value }) => percentageSignFilter()(value, 0);
        const getExcelLink = getGetExcel(popCompareExcelEndPoint);
        const getGraphData = parsePOPCompareModeDataWithMTD;
        const chartTooltip = (props) => (
            <PopTooltip
                pointsData={props.points}
                xFormatter={dateFormatter}
                yFormatter={percentageFormatter}
            />
        );
        const popApiResponseName = "BounceRate";
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
            chartIdForAnnotations={`${ChartIds["TrafficAndEngagementBounceRate"]}`}
        />
    );
};
