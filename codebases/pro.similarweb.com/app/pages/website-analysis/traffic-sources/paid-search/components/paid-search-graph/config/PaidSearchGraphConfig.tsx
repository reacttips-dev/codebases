import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import "components/Chart/styles/sharedTooltip.scss";
import { abbrNumberFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { swSettings } from "common/services/swSettings";
import { PaidSearchGraphTooltip } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/components/PaidSearchGraphTooltip";
import { timeGranularityObjects } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/helpers/PaidSearchGraphConstants";
import { getIntervalConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/helpers/PaidSearchGraphDataParsers";
import ChangeBellWithoutTooltip from "components/Chart/src/configs/plotLines/ChangeBellWithoutTooltip";

export const getPaidSearchChartConfig = (
    filter,
    metricName,
    rawDataMetricName,
    yAxisLabelsFormatter,
    yTooltipFormatter,
    isPercents = false,
    isWindow,
    duration,
    granularity,
    isMonthsToDateActive,
    webSource,
    rawData,
    getChangeColor = null,
    to,
    from,
    showChangeColumn,
    showBell = false,
    bellStartDate = null,
) => {
    const timeGranularity = granularity.name;
    const format = timeGranularity === timeGranularityObjects.monthly.name ? "MMM YY" : "DD MMM";
    const lastSupportedDate = isMonthsToDateActive
        ? swSettings.current.lastSupportedDailyDate
        : to.replace(/\|/g, "/");
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
            showBell && ChangeBellWithoutTooltip(dayjs(bellStartDate)),
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
                        return PaidSearchGraphTooltip({
                            metricName,
                            points: this.points,
                            rawDataMetricName,
                            showChangeColumn,
                            timeGranularityName: granularity.name,
                            lastSupportedDate,
                            yTooltipFormatter,
                            showBell,
                            bellStartDate,
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
                        marker: {
                            enabled: false,
                            symbol: "circle",
                        },
                        stacking: "normal",
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
