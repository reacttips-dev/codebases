import { colorsSets } from "@similarweb/styles";
import sharedTooltipWithData from "components/Chart/src/configs/tooltip/sharedTooltipWithData";
import _ from "lodash";
import dayjs from "dayjs";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import combineConfigs from "../../../../components/Chart/src/combineConfigs";
import monthlyIntervalConfig from "../../../../components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "../../../../components/Chart/src/configs/legend/noLegendConfig";
import sharedTooltip from "../../../../components/Chart/src/configs/tooltip/sharedTooltip";
import xAxisCrosshair from "../../../../components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "../../../../components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "../../../../components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import markerWithDashedConfig from "../../../../../.pro-features/components/Chart/src/configs/series/markerWithDashedLinePerPointChartConfig";
import { ADDITIONAL_METRICS, INDUSTRY_AVERAGE_KEY } from "./benchmarkOvertime";
import { GraphPointData } from "pages/conversion/components/benchmarkOvertime/chartDataTypes";
import {
    buildGraphPointData,
    buildPOPGraphPointData,
} from "pages/conversion/components/benchmarkOvertime/chartDataProcessor";

export const getChartConfig = ({
    type,
    filter,
    data = null,
    shouldConnectNulls = true,
    yAxisFilter,
}) => {
    const format = "MMM YY";
    const tooltipFormat = "MMMM YYYY";
    const currentGranularity = monthlyIntervalConfig;
    const yAxisFormatter = ({ value }) =>
        yAxisFilter ? yAxisFilter[0]()(value, yAxisFilter[1]) : filter[0]()(value, filter[1]);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);

    const tooltipConfig = data
        ? sharedTooltipWithData({ filter, xAxisFormat: tooltipFormat, data })
        : sharedTooltip({ filter, xAxisFormat: tooltipFormat });

    return combineConfigs({ type, yAxisFormatter, xAxisFormatter }, [
        currentGranularity,
        noLegendConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        tooltipConfig,
        {
            chart: {
                height: null,
                type,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                events: {},
            },
            plotOptions: {
                line: {
                    lineWidth: 2,
                    connectNulls: shouldConnectNulls,
                },
            },
            yAxis: {
                gridLineWidth: 0.5,
                showFirstLabel: true,
                showLastLabel: true,
                reversed: false,
                gridZIndex: 2,
                reversedStacks: true,
                tickPixelInterval: 50,
                labels: {
                    style: {
                        textTransform: "uppercase",
                        fontSize: "11px",
                        color: "#919191",
                    },
                },
            },
            xAxis: {
                gridLineWidth: 0,
                gridLineDashStyle: "dash",
                tickLength: 5,
                labels: {
                    style: {
                        textTransform: "capitalize",
                        fontSize: "11px",
                        color: "#919191",
                    },
                },
                minPadding: 0,
                maxPadding: 0,
            },
        },
    ]);
};

const adaptChartDataPointsForGroup = (data: any, groupName: string): GraphPointData[] => {
    const siteDataPoints = data[groupName]?.data ?? {};
    const siteConfidencePoints = data[groupName]?.confidence ?? {};

    let graphPoint: GraphPointData = null;
    const res = Object.keys(siteDataPoints).map((dateKey) => {
        const valueForDate = siteDataPoints[dateKey];
        const confidenceForDate = siteConfidencePoints[dateKey];

        const prevPoint = graphPoint;
        graphPoint = buildGraphPointData(dateKey, valueForDate, confidenceForDate, prevPoint);
        return graphPoint;
    });

    return res;
};

const adaptChartDataForSingleWebsite = (
    data: any,
    chartDomain: string,
    color: string,
    isPOP = false,
) => {
    const baseChartConfig = {
        name: chartDomain,
        color: color,
        marker: { symbol: "circle" },
        isDataSingleSeries: true,
    };

    const chartData = TransformChartData(data, chartDomain, isPOP);

    return combineConfigs({ ...baseChartConfig, data: chartData }, [
        baseChartConfig,
        markerWithDashedConfig,
    ]);
};

export const TransformChartData = (data, chartDomain, isPOP) => {
    let graphPoint: any = null;
    return data[chartDomain].map((item) => {
        const xValue: string = item.Values[0].Key;
        const yValue: string = item.Values[0].Value;
        const confidenceValue: string = item.Values[0].Confidence;

        const prevPoint = graphPoint;
        graphPoint = isPOP
            ? buildPOPGraphPointData(item)
            : buildGraphPointData(xValue, yValue, confidenceValue, prevPoint);
        return graphPoint;
    });
};

export const transformData = (
    data,
    selectedRows,
    rowSelectionProp,
    segmentsData: ISegmentsData,
) => {
    const { segments } = segmentsData || { segments: {} };
    return _.map(Object.keys(data), (chartKey: string, index) => {
        const isIndustryAverage = chartKey === INDUSTRY_AVERAGE_KEY;

        const color = selectedRows
            ? _.result(
                  _.find(
                      selectedRows,
                      (row: any) => String(row[rowSelectionProp]) === String(chartKey),
                  ),
                  "selectionColor",
              )
            : colorsSets.c.toArray()[index];

        const baseChartConfig = {
            name: segments[chartKey] ? segments[chartKey].domain : chartKey,
            seriesSubtitle: segments[chartKey] ? segments[chartKey].segmentName : "",
            color: isIndustryAverage ? ADDITIONAL_METRICS[INDUSTRY_AVERAGE_KEY].color : color,
            tooltipIndex: _.findIndex(
                selectedRows,
                (row: any) => String(row[rowSelectionProp]) === String(chartKey),
            ),
            marker: { symbol: "circle" },
            isDataSingleSeries: true,
        };

        const chartData = adaptChartDataPointsForGroup(data, chartKey);
        return combineConfigs({ ...baseChartConfig, data: chartData }, [
            baseChartConfig,
            markerWithDashedConfig,
        ]);
    });
};

export const websiteConversionSingleTransformData = (data) => {
    const res = _.map(Object.keys(data), (chartDomain: string, index) => {
        return adaptChartDataForSingleWebsite(data, chartDomain, colorsSets.c.toArray()[index]);
    });
    return res;
};
