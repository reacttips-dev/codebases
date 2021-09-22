import combineConfigs from "components/Chart/src/combineConfigs";
import dailyIntervalConfig from "components/Chart/src/configs/granularity/dailyIntervalConfig";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import sharedTooltip from "components/Chart/src/configs/tooltip/sharedTooltip";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import dayjs from "dayjs";
import noAnimationConfig from "components/Chart/src/configs/animation/noAnimationConfig";

export const getChartConfig = ({ type, filter, selectedGranularity = "" }) => {
    const format = "MMM YY";
    const isDailyGranularity = selectedGranularity === "Daily";
    const tooltipFormat = isDailyGranularity
        ? "dddd, MMM DD, YYYY"
        : selectedGranularity === "Monthly"
        ? "MMM YYYY"
        : "MMM DD, YYYY";
    const currentGranularity = isDailyGranularity ? dailyIntervalConfig : monthlyIntervalConfig;
    const yAxisFormatter = ({ value }) => filter[0]()(value, filter[1]);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);
    return combineConfigs({ type, yAxisFormatter, xAxisFormatter }, [
        currentGranularity,
        noLegendConfig,
        yAxisLabelsConfig,
        noAnimationConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        sharedTooltip({ filter, xAxisFormat: tooltipFormat }),
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
                    connectNulls: true,
                },
                series: {
                    turboThreshold: selectedGranularity === "Daily" ? 0 : 1000,
                    marker: {
                        enabled: selectedGranularity !== "Daily",
                        symbol: "circle",
                    },
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
