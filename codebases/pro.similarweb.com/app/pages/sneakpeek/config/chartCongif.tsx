import dayjs from "dayjs";
import { abbrNumberFilter, percentageSignFilter } from "filters/ngFilters";
import combineConfigs from "components/Chart/src/combineConfigs";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import noAnimationConfig from "components/Chart/src/configs/animation/noAnimationConfig";
import { CHART_COLORS } from "constants/ChartColors";
import { colorsPalettes } from "@similarweb/styles";
import ReactDOMServer from "react-dom/server";
import { SneakpeekTooltip } from "../components/Tooltip";

export const getChartConfig = (type) => {
    switch (type) {
        case "graph":
            return graphConfig;
        default:
            return () => undefined;
    }
};

const graphConfig = (timeGranularity, yAxisTitle, isPercent) => {
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format("D MMM.");
    const yAxisFormatter = ({ value }) =>
        isPercent ? percentageSignFilter()(value, 0) : abbrNumberFilter()(value);
    // const format = timeGranularity === EGraphGranularities.MONTHLY ? "MMM YY" : "DD MMM";
    return combineConfigs({ yAxisFormatter, xAxisFormatter }, [
        xAxisLabelsConfig,
        yAxisLabelsConfig,
        xAxisCrosshair,
        noLegendConfig,
        noAnimationConfig,
        {
            chart: {
                height: 300,
                marginTop: 10,
                plotBackgroundColor: "transparent",
                style: {
                    fontFamily: "Roboto",
                },
            },
            plotOptions: {
                line: {
                    lineWidth: 2,
                    connectNulls: true,
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true,
                            },
                        },
                    },
                },
            },
            yAxis: {
                labels: {
                    style: {
                        color: colorsPalettes.carbon[200],
                        fontFamily: "Roboto",
                        fontSize: "12px",
                        textTransform: "uppercase",
                    },
                },
                // returning "undefined" causes the y axis to use the values
                // passed in to dynamically determine the labels (false does not)
                max: isPercent ? 1 : undefined,
                min: 0,
            },
            xAxis: {
                type: "datetime",
                crosshair: {
                    color: colorsPalettes.blue[200],
                    dashStyle: "dash",
                    width: 1,
                    zIndex: 2,
                },
                labels: {
                    style: {
                        textTransform: "capitalize",
                        fontSize: "12px",
                        color: colorsPalettes.carbon[200],
                        fontFamily: "Roboto",
                    },
                },
            },
            tooltip: {
                shared: true,
                useHTML: true,
                backgroundColor: colorsPalettes.carbon[0],
                borderColor: CHART_COLORS.chartMainColors[0],
                style: {
                    color: colorsPalettes.carbon[500],
                    fontSize: "12px",
                },
                formatter() {
                    return ReactDOMServer.renderToString(
                        <SneakpeekTooltip pointsData={this} isPercent={isPercent} />,
                    );
                },
            },
        },
    ]);
};
