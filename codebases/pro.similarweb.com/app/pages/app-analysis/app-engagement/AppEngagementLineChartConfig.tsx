import React from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import dayjs from "dayjs";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips";
import { swSettings } from "common/services/swSettings";
import DurationService from "services/DurationService";
import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import { getTooltipHeaderElement } from "UtilitiesAndConstants/UtilitiesComponents/chartTooltipHeaderWithMTDSupport";
import biDailyIntervalConfig from "components/Chart/src/configs/granularity/biDailyIntervalConfig";
import weeklyIntervalConfig from "components/Chart/src/configs/granularity/weeklyIntervalConfig";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import defaultTooltip from "components/Chart/src/configs/tooltip/defaultTooltip";
import { formatTooltipPointWithConfidence } from "components/Chart/src/data/confidenceProcessor";
import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { tickIntervals } from "components/widget/widget-types/GraphWidget";
import { algoChangeDateConfig } from "components/Chart/src/configs/plotLines/algoChangeDateConfig";
import { colorsPalettes } from "@similarweb/styles";
import {
    addPartialDataZones,
    isPartialDataPoint,
} from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

export const granularityConfigs = {
    Daily: biDailyIntervalConfig,
    Weekly: weeklyIntervalConfig,
    Monthly: monthlyIntervalConfig,
};

const TooltipWrapper = styled.div`
    padding: 10px 15px 5px;
    border-radius: 5px;
`;

// get min and max Y values for the graph range, with addition of 20%
const getYMinMax = (data) => {
    const minMax = [1, 0];

    data.map(({ data: points }) => {
        const datesArr = points.map((p) => p.y);
        const min = Math.min(...datesArr) * 0.8;
        const max = Math.max(...datesArr) * 1.2;
        if (min <= minMax[0]) {
            minMax[0] = min; // found a smaller min
        }
        if (max >= minMax[1]) {
            minMax[1] = max; // found a bigger max
        }
    });

    // making sure that our result is not crossing the boundaries of 0-100%
    return [minMax[0] >= 0 ? minMax[0] : 0, minMax[1] <= 1 ? minMax[1] : 1];
};

export const getChartConfig = (params) => {
    params = Object.assign(
        {
            type: "line",
            timeGranularity: "Monthly",
            isWindow: false,
            showChangeColumn: true,
        },
        params,
    );
    const {
        type,
        filter,
        data,
        metricTitle,
        timeGranularity,
        isWindow,
        yAxisFilter,
        durationObject,
        showChangeColumn,
        algoChangeDate,
        isCompare,
        isPercentage,
    } = params;
    const { from, to } = durationObject.raw;
    const durationInMonths = DurationService.getMonthsFromApiDuration(from, to, isWindow);
    const format = durationInMonths <= 1 && timeGranularity != "Monthly" ? "D MMM." : `MMM'YY`;
    const yAxisFormatter = ({ value }) => (yAxisFilter ?? filter)(value);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);
    const YminMax = isPercentage ? getYMinMax(data) : null;

    return combineConfigs({ ...params, yAxisFormatter, xAxisFormatter }, [
        granularityConfigs[timeGranularity],
        noLegendConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        xAxisLabelsWithTooltips((chart) => chart.xAxis[0].plotLinesAndBands),
        algoChangeDate
            ? algoChangeDateConfig(dateToUTC(algoChangeDate), {
                  showTooltip: true,
                  description: i18nFilter()("custom.tooltip.defaultText"),
              })
            : {},
        data
            ? getChangeTooltip({
                  filter,
                  metricTitle,
                  timeGranularity,
                  durationObject,
                  data,
                  showChangeColumn,
              })
            : defaultTooltip,
        {
            chart: {
                height: null,
                type,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                zoomType: "",
            },
            plotOptions: {
                line: {
                    lineWidth: 2,
                    connectNulls: false,
                    animation: true,
                    marker: {
                        enabled: isMarkerEnabled(data),
                        enabledThreshold: 4,
                        symbol: "circle",
                    },
                    lineColor: isCompare ? "" : colorsPalettes.blue[400],
                },
                series: {
                    marker: {
                        fillColor: isCompare ? "" : colorsPalettes.blue[400],
                    },
                },
            },
            yAxis: {
                gridLineWidth: 0.5,
                showFirstLabel: true,
                showLastLabel: true,
                tickPixelInterval: 50,
                labels: {
                    style: {
                        textTransform: "uppercase",
                        fontSize: "11px",
                        color: "#919191",
                    },
                },
                min: isPercentage ? YminMax[0] : null,
                max: isPercentage ? YminMax[1] : null,
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
                tickInterval: getXAxisTickInterval(durationObject, isWindow, timeGranularity),
            },
        },
    ]);
};

const isMarkerEnabled = (data: any) => {
    return data?.[0]?.data?.length <= 24;
};

const getChangeTooltip = ({
    metricTitle,
    filter,
    timeGranularity = "Monthly",
    durationObject,
    data,
    showChangeColumn,
}) => {
    return {
        tooltip: {
            shared: true,
            outside: false,
            useHTML: true,
            backgroundColor: "#fff",
            borderWidth: 0,
            formatter() {
                const getChange = (previousDataPoint, change) =>
                    previousDataPoint
                        ? change !== 0 && percentageSignFilter()(change, 2)
                        : i18nFilter()("common.tooltip.change.new");

                const changeTooltipProp = () => {
                    return data.map((rowData) => {
                        const pointIndex = rowData.data.findIndex((p) => p.x === this.x);
                        const point = rowData.data[pointIndex];
                        const previousPoint =
                            pointIndex === 0
                                ? rowData.data[pointIndex]
                                : rowData.data[pointIndex - 1];
                        const change = point.y / previousPoint.y - 1;

                        return {
                            displayName: rowData.name,
                            value: formatTooltipPointWithConfidence(point.y, point?.confidence, [
                                () => filter,
                            ]),
                            color: rowData.color,
                            subtitle: rowData?.seriesSubtitle,
                            change:
                                point.y &&
                                previousPoint !== point &&
                                getChange(previousPoint.y, change),
                        };
                    });
                };

                const changeTooltipProps = {
                    header: getTooltipHeaderElement(
                        timeGranularity,
                        this.x,
                        swSettings.current.lastSupportedDailyDate.isAfter(durationObject.raw.to)
                            ? durationObject.raw.to
                            : swSettings.current.lastSupportedDailyDate,
                    ),
                    tableHeaders: [
                        { position: 0, displayName: "App" },
                        { position: 1, displayName: metricTitle },
                        { position: 2, displayName: "Change" },
                    ],
                    tableRows: changeTooltipProp(),
                    showChangeColumn,
                };

                return ReactDOMServer.renderToString(
                    <TooltipWrapper>
                        <ChangeTooltip {...changeTooltipProps} />
                    </TooltipWrapper>,
                );
            },
        },
    };
};

export const getXAxisTickInterval = (durationObject, isWindow, timeGranularity) => {
    let ticks;
    const { from, to } = durationObject.raw;
    const durationInMonths = DurationService.getMonthsFromApiDuration(from, to, isWindow);
    if (durationInMonths > 24) {
        //every 2 months
        ticks = tickIntervals.monthly * 2;
    } else if (durationInMonths > 1) {
        ticks = tickIntervals.monthly;
    } else {
        switch (timeGranularity) {
            case "Daily":
            case "Weekly":
                ticks = tickIntervals.daily * 2;
                break;
            case "Monthly":
            default:
                //every other day
                ticks = tickIntervals.monthly;
                break;
        }
    }
    return ticks;
};

export const xAxisLabelsWithTooltips = (getChartItems) => () => {
    return {
        chart: {
            events: {
                // Note: xAxis labels have overflow hidden, therefore using "render" event to change it to "visible"
                render: function () {
                    getChartItems(this).forEach((plotLn) => {
                        if (plotLn.label) {
                            plotLn.label.element.style.overflow = "visible";
                            plotLn.label.element.style.zIndex = "999";
                        }
                    });
                },
            },
        },
    };
};

export const dateToUTC = (dateString) => {
    const date = dateString.split("-");
    return Date.UTC(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10));
};

export const transformData = (data, timeGranularity, lastSupportedDate, isCompare) => {
    return addPartialDataZones(
        data.map((chartData) => {
            const { points, ...chartConfig } = chartData;

            if (!points) {
                return {
                    ...chartConfig,
                    data: [],
                };
            }

            if (isCompare) {
                return {
                    ...chartConfig,
                    data: points.map((item, index, arr) => ({
                        x: dateToUTC(item.Key),
                        y: item.Value,
                        isPartial: isPartialDataPoint(
                            index,
                            arr,
                            item,
                            timeGranularity,
                            lastSupportedDate,
                        ),
                    })),
                };
            }

            return {
                ...chartConfig,
                data: points.map((item, index, arr) => ({
                    x: dateToUTC(item.Key),
                    y: item.Value,
                    isPartial: isPartialDataPoint(
                        index,
                        arr,
                        item,
                        timeGranularity,
                        lastSupportedDate,
                    ),
                })),
                color: colorsPalettes.blue[400],
            };
        }),
        { chartType: chartTypes.LINE },
    );
};
