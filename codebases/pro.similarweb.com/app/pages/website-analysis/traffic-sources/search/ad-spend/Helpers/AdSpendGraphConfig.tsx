import combineConfigs from "components/Chart/src/combineConfigs";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import "components/Chart/styles/sharedTooltip.scss";
import { abbrNumberFilter, abbrNumberWithPrefixFilter } from "filters/ngFilters";
import dayjs from "dayjs";

export const getBaseChartConfig = (metricName, duration, isWindow, changeTooltipFormatter) => {
    const format = "MMM YY";
    const yAxisLabelsFormatter = ({ value }) => {
        return abbrNumberWithPrefixFilter()(value, "$");
    };
    const yTooltipFormatter = ({ value }) => {
        return abbrNumberWithPrefixFilter()(value, "$");
    };
    const yAxisFormatter = ({ value }) => abbrNumberFilter()(value);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).format(format);
    return combineConfigs({ yAxisFormatter, xAxisFormatter }, [
        monthlyIntervalConfig,
        noLegendConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        {
            chart: {
                height: 295,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                events: {},
                style: {
                    fontFamily: "Roboto",
                },
            },
            tooltip: {
                followPointer: false,
                shared: true,
                useHTML: true,
                backgroundColor: undefined,
                borderWidth: 0,
                style: {
                    fontFamily: "Roboto",
                    margin: 0,
                },
                formatter: changeTooltipFormatter(
                    metricName,
                    yTooltipFormatter,
                    isWindow,
                    duration,
                ),
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: true,
                        symbol: "circle",
                    },
                    lineWidth: 2,
                    connectNulls: true,
                },
                series: {
                    fillOpacity: 1,
                    animation: false,
                },
            },
            yAxis: {
                min: 0,
                gridLineWidth: 0.5,
                showFirstLabel: true,
                showLastLabel: true,
                reversed: false,
                gridZIndex: 2,
                reversedStacks: true,
                tickPixelInterval: 50,
                plotLines: [
                    {
                        color: "#656565",
                        width: 2,
                        value: 0,
                    },
                ],
                labels: {
                    style: {
                        textTransform: "uppercase",
                        fontSize: "11px",
                        fontFamily: "Roboto",
                        color: "#919191",
                    },
                    formatter: yAxisLabelsFormatter,
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
