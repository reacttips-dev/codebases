import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import "components/Chart/styles/sharedTooltip.scss";
import { abbrNumberFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { DisplayAdsGraphTooltip } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/DisplayAdsGraphTooltip";
import { timeGranularityObjects } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/helpers/DisplayAdsGraphConstants";
import { getIntervalConfig } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/helpers/DisplayAdsGraphDataParsers";

export const getDisplayAdsGraphConfig = ({
    metricName,
    rawDataMetricName,
    yAxisLabelsFormatter,
    yTooltipFormatter,
    isPercents = false,
    isWindow,
    duration,
    granularity,
    webSource,
    to,
    from,
    showChangeColumn = true,
}) => {
    const isSingleMonth = duration === "1m";
    const timeGranularity = granularity.name;
    const format = timeGranularity === timeGranularityObjects.monthly.name ? "MMM YY" : "DD MMM";
    const lastSupportedDate = to.replace(/\|/g, "/");
    const currentGranularity = getIntervalConfig(timeGranularity);
    const yAxisFormatter = ({ value }) => abbrNumberFilter()(value);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).format(format);

    return combineConfigs(
        {
            yAxisFormatter,
            xAxisFormatter,
        },
        [
            currentGranularity,
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
                    formatter: function () {
                        return DisplayAdsGraphTooltip({
                            metricName,
                            points: this.points,
                            rawDataMetricName,
                            showChangeColumn,
                            timeGranularityName: granularity.name,
                            lastSupportedDate,
                            yTooltipFormatter,
                        });
                    },
                },
                plotOptions: {
                    line: {
                        marker: {
                            enabled: timeGranularity !== timeGranularityObjects.daily,
                            symbol: "circle",
                        },
                        lineWidth: 2,
                        connectNulls: true,
                    },
                    area: {
                        stacking: "normal",
                        marker: {
                            enabled: isSingleMonth,
                            symbol: "circle",
                        },
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
        ],
    );
};
