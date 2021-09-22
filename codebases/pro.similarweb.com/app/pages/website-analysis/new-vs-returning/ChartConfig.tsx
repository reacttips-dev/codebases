import { granularities } from "utils";
import { granularityConfigs } from "pages/website-analysis/website-content/leading-folders/FolderAnalysisDefaults";
import dayjs from "dayjs";
import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import { tickIntervals } from "components/widget/widget-types/GraphWidget";
import { colorsPalettes } from "@similarweb/styles";
import {
    getTableHeaders,
    getTooltipHeader,
    TooltipFormatter,
} from "pages/website-analysis/new-vs-returning/ChangeTooltipWrapper";

export const getChartConfig = ({
    type,
    filter,
    data,
    timeGranularity = "Monthly",
    applyBiDailyTickInterval = false,
    isWindow = false,
    toDateMoment = undefined,
    isPercentage,
}) => {
    const format = timeGranularity === granularities[1] ? "DD MMM" : "MMM YY";
    const currentGranularity = granularityConfigs[timeGranularity];
    const yAxisFormatter = ({ value }) => filter[0]()(value, filter[1]);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);
    return combineConfigs({ type, yAxisFormatter, xAxisFormatter, granularity: timeGranularity }, [
        currentGranularity,
        noLegendConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
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
                    connectNulls: false,
                },
                area: {
                    stacking: "normal",
                    marker: {
                        enabled: isMarkerEnabled(data),
                        states: {
                            hover: {
                                enabled: true,
                                lineWidth: 2,
                                lineColor: "#fff",
                                radius: 6,
                            },
                        },
                    },
                },
                series: {
                    fillOpacity: 1,
                    states: {
                        hover: {
                            halo: {
                                size: 8,
                                attributes: {
                                    fill: "rgba(0,0,0,0.05)",
                                    "stroke-width": 4,
                                    stroke: "rgba(0,0,0,0.05)",
                                },
                            },
                        },
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
                max: isPercentage ? 1 : null,
            },
            xAxis: {
                gridLineWidth: 0,
                gridLineDashStyle: "dash",
                tickLength: 5,
                labels: {
                    style: {
                        textTransform: "capitalize",
                        fontSize: "11px",
                        fontFamily: "Roboto",
                        color: "#919191",
                    },
                },
                tickInterval: applyBiDailyTickInterval ? tickIntervals.daily * 2 : undefined,
                minPadding: 0,
                maxPadding: 0,
            },
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
                formatter: TooltipFormatter({
                    props: {
                        granularity: timeGranularity,
                        valueFilter: filter,
                        data,
                        isWindow,
                        showChange: !isPercentage,
                        periodDuration: 3,
                    },
                    getTooltipHeader,
                    getTableHeaders: () => getTableHeaders(!isPercentage),
                }),
            },
        },
    ]);
};

export const isMarkerEnabled = (data: any) => {
    return data?.[0]?.data?.length === 1;
};
