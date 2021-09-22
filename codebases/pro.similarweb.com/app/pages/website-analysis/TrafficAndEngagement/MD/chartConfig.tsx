import { colorsPalettes } from "@similarweb/styles";
import combineConfigs from "components/Chart/src/combineConfigs";
import dailyIntervalConfig from "components/Chart/src/configs/granularity/dailyIntervalConfig";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import _ from "lodash";
import dayjs from "dayjs";

export const getChartConfig = ({
    metric,
    tooltipFormatter,
    isChartStacking,
    isMarkerEnabled,
    isDailyGranularity,
    isTurboThreshold = false,
}) => {
    const xAxisFormatter = ({ value }) =>
        dayjs.utc(value).format(isDailyGranularity ? "DD MMM" : "MMM YY");
    const currentGranularity = isDailyGranularity ? dailyIntervalConfig : monthlyIntervalConfig;
    const yAxisFormatter = metric.yAxisLabelsFormatter;
    return combineConfigs({ yAxisFormatter, xAxisFormatter }, [
        currentGranularity,
        noLegendConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        metric.tooltipPositioner ? { tooltip: { positioner: metric.tooltipPositioner } } : {},
        {
            tooltip: {
                followPointer: false,
                shared: true,
                outside: true,
                useHTML: true,
                backgroundColor: colorsPalettes.carbon[0],
                borderWidth: 0,
                style: {
                    fontFamily: "Roboto",
                    margin: 0,
                },
                borderRadius: "6px",
                boxShadow: `0 6px 6px 0 ${colorsPalettes.carbon[200]}`,
                formatter: tooltipFormatter,
            },
            chart: {
                height: 295,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                events: {},
                style: {
                    fontFamily: "Roboto",
                },
                animation: false, // no annimation for annotations
            },
            plotOptions: {
                line: {
                    lineWidth: 2,
                    connectNulls: false,
                    animation: false, // no annimation for annotations
                },
                area: {
                    stacking: "normal",
                    animation: false, // no annimation for annotations
                },
                series: {
                    fillOpacity: 1,
                    turboThreshold: isTurboThreshold ? 0 : 1000,
                    marker: {
                        enabled: isMarkerEnabled,
                        symbol: "circle",
                    },
                    stacking: isChartStacking,
                    animation: false, // no annimation for annotations
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
                        fontFamily: "Roboto",
                        color: colorsPalettes.carbon[200],
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
                        fontFamily: "Roboto",
                    },
                },
                minPadding: 0,
                maxPadding: 0,
            },
        },
    ]);
};

const getTallestColumn = (chart) => {
    return _.maxBy(chart.hoverPoints, (point: any) => point.y);
};

export function POPAndCompareTooltipPositioner(width, height, point) {
    const topPoint = getTallestColumn(this.chart);
    const { top } = topPoint.graphic.element.getBoundingClientRect();
    const leftColumn = this.chart.hoverPoints[0];
    const leftColumnElement = leftColumn.graphic.element;
    const tooltipDimension = {
        xGap: 100,
        yGap: 20,
        height: height,
        width: width,
    };

    if (point.plotX + width > this.chart.plotWidth) {
        tooltipDimension.xGap = point.plotX + width - this.chart.plotWidth;
    }

    if (point.plotY + height < this.chart.plotHeight) {
        tooltipDimension.yGap += point.plotY;
    }

    return {
        x: leftColumnElement.getBoundingClientRect().left - tooltipDimension.xGap,
        y: top - (tooltipDimension.height + tooltipDimension.yGap),
    };
}

export function tooltipPositioner(labelWidth, labelHeight, point) {
    const { top, left } = this.chart.clipRect.element.getBoundingClientRect();
    const { plotTop } = this.chart;
    let positionX = left + this.chart.plotLeft + point.plotX;
    if (positionX < 5) {
        positionX = 5;
    } else if (positionX >= window.innerWidth - 5) {
        positionX -= positionX - window.innerWidth + 20;
    }
    return {
        x: Math.min(positionX, this.chart.chartWidth),
        y: top + plotTop,
    };
}
