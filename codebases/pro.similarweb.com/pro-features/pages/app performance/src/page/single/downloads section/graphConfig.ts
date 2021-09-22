import dayjs from "dayjs";
import numeral from "numeral";
import combineConfigs from "../../../../../../components/Chart/src/combineConfigs";
import monthlyIntervalConfig from "../../../../../../components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "../../../../../../components/Chart/src/configs/legend/noLegendConfig";
import noTooltipConfig from "../../../../../../components/Chart/src/configs/tooltip/noTooltipConfig";
import xAxisCrosshair from "../../../../../../components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "../../../../../../components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisGridLineConfig from "../../../../../../components/Chart/src/configs/yAxis/yAxisGridLineConfig";
import yAxisLabelsConfig from "../../../../../../components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import noZoomConfig from "../../../../../../components/Chart/src/configs/zoom/noZoomConfig";

export default ({ type }) => {
    const yAxisFormatter = ({ value }) => numeral(value).format("0[.]0a").toUpperCase();
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format("MMM");

    return combineConfigs({ type, yAxisFormatter, xAxisFormatter }, [
        monthlyIntervalConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        yAxisGridLineConfig,
        noTooltipConfig,
        xAxisCrosshair,
        noLegendConfig,
        noZoomConfig,
        {
            yAxis: {
                min: 0,
                showFirstLabel: true,
                showLastLabel: true,
                reversed: false,
                reversedStacks: true,
                labels: {
                    style: {
                        textTransform: "uppercase",
                        fontSize: "11px",
                        color: "#919191",
                    },
                },
            },
            xAxis: {
                tickLength: 5,
                minPadding: 0,
                maxPadding: 0,
                labels: {
                    style: {
                        textTransform: "capitalize",
                        fontSize: "11px",
                        color: "#919191",
                    },
                },
                endOnTick: true,
            },
            plotOptions: {
                area: {
                    fillColor: "rgba(78, 140, 249, 0.05)",
                    lineWidth: 2,
                    lineColor: "#4e8cf9",
                    connectNulls: true,
                },
                series: {
                    marker: {
                        fillColor: "#4e8cf9",
                    },
                },
            },
            chart: {
                type,
                animation: true,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                spacing: [0, 10, 0, 0],
                events: {},
                marginTop: 20,
            },
        },
    ]);
};
