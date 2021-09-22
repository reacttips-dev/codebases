import { PopTooltip } from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/ChartTooltips";
import { CompareModeTooltip } from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/CommonChartTooltip";
import { GenericGraph } from "pages/website-analysis/TrafficAndEngagement/Components/GenericGraph";
import {
    parseData,
    parsePOPCompareModeDataWithMTD,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/ParseServerData";
import {
    chartGranularityItemClickArea,
    dateFormatter,
    defaultExcelEndPoint,
    getChartType,
    getGetExcel,
    isTimeGranularityDisabledOnlyMonth,
    minVisitsAbbrFormatter,
    neverStacking,
    popCompareEndPoint,
    popCompareExcelEndPoint,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { minVisitsAbbrFilter, percentageSignFilter } from "filters/ngFilters";
import React from "react";
import {
    tooltipPositioner,
    POPAndCompareTooltipPositioner,
} from "pages/website-analysis/TrafficAndEngagement/MD/chartConfig";
import { ChartIds } from "components/Chart/src/components/annotations/Helpers/ChartIdsHelper";

export const UniqueUsers = (props) => {
    const {
        name,
        meta: { isSingleMode, isPOP, isOneWebSource },
    } = props;
    let metricData;
    if (!isPOP) {
        const addToDashboardName = "UniqueUsers";
        const endPoint = "widgetApi/UniqueUsers/UniqueUsers/Graph";
        const yAxisLabelsFormatter = ({ value }) => minVisitsAbbrFilter()(value);
        const getExcelLink = getGetExcel(defaultExcelEndPoint);
        const isTimeGranularityDisabledUnique = ({ duration, title, isGa }) =>
            (duration === "28d" && title === "M") || (isGa && title === "D") || title === "W";
        const chartTooltip = (props) => (
            <CompareModeTooltip
                {...props}
                xFormatter={dateFormatter}
                yFormatter={minVisitsAbbrFormatter}
                name={name}
                totalAggregate={(...values) => values.reduce((acc, v) => acc + v, 0)}
            />
        );
        const getGraphData = parseData;
        metricData = {
            endPoint,
            isTimeGranularityDisabled: isTimeGranularityDisabledUnique,
            getChartType,
            yAxisLabelsFormatter,
            getExcelLink,
            addToDashboardName,
            chartTooltip,
            getGraphData,
            chartGranularityItemClick:
                isSingleMode && !isOneWebSource ? chartGranularityItemClickArea : undefined,
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
                yFormatter={minVisitsAbbrFormatter}
            />
        );
        const popApiResponseName = "UniqueUsers";
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
            chartIdForAnnotations={`${ChartIds["TrafficAndEngagementUniqueUsers"]}`}
        />
    );
};
