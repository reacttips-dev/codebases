import { colorsPalettes } from "@similarweb/styles";
import numeral from "numeral";
import dayjs from "dayjs";
import { watermarkService } from "../../../../scripts/common/services/watermarkService";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import combineConfigs from "components/Chart/src/combineConfigs";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import { Injector } from "common/ioc/Injector";
import { PngExportService } from "services/PngExportService";

/**
 * Formats the given date to a human-readable string for displaying on the chart's x-axis.
 * the date is provided as a unix timestamp.
 */
const formatDateAxis = ({ value }: { value: number }) => dayjs(value).utc().format("MMM`YY");

/**
 * Formats the given number as a human-readable string for displaying on the chart's y-axis.
 */
const formatTrafficAxis = ({ value }: { value: number }) => numeral(value).format("0,0");

/**
 * Formats the given date to a human-readable string.
 * The date is provided as a unix timestamp
 */
const formatDateTooltip = (value: number) => dayjs(value).utc().format("MMMM YYYY");

/**
 * Formats the given traffic value to a human-readable string.
 */
const formatTrafficTooltip = (value: number) => numeral(value).format("0,0");

/**
 * Custom tooltip for the chart. shows the current traffic on the active date.
 */
const buildTooltipConfig = () => {
    return {
        useHTML: true,
        backgroundColor: colorsPalettes.carbon[0],
        borderColor: colorsPalettes.bluegrey[600],
        borderWidth: 1,
        formatter: function () {
            return `<div style='display: flex; flex-direction: column; align-items: center; font-size: 12px'>
                <span style="font-weight: bold" class="date">
                    ${formatDateTooltip(this.point.x)}
                </span>  
                <div style="display: flex; flex-direction: row;">
                    <span class="item-name">
                        ${this.point.series.name}
                    </span>
                    <span class="item-value" style="margin-left:4px; color:${this.series.color};">
                        ${formatTrafficTooltip(this.point.y)}
                    </span>
                </div>
            </div>`;
        },
    };
};

/**
 * Builds the base configuartion object for the paid-outgoing traffic chart
 */
const buildBaseChartConfig = (isCompareMode: boolean) => {
    const chartConfig = {
        chart: {
            events: {
                load: function () {
                    watermarkService.add.call(this);
                },
            },
        },
        legend: {
            // Enable legend only if there's more than one site shown
            // in the chart (compare mode)
            enabled: isCompareMode,
        },
        yAxis: {
            showFirstLabel: false,
            showLastLabel: true,
        },
        tooltip: buildTooltipConfig(),
        exporting: Injector.get<PngExportService>("pngExportService").getSettings({
            chartOptions: {
                chart: {
                    marginLeft: 200,
                },
                yAxis: {
                    labels: {
                        formatter: function () {
                            return formatTrafficAxis(this);
                        },
                    },
                },
                title: {
                    text: null,
                    style: {
                        display: "block",
                    },
                },
                legend: {
                    enabled: true,
                },
            },
        }),
    };

    return chartConfig;
};

export const getChartConfig = (isCompareMode: boolean) => {
    const baseConfig = buildBaseChartConfig(isCompareMode);

    const axisFormatters = {
        xAxisFormatter: formatDateAxis,
        yAxisFormatter: formatTrafficAxis,
    };

    const externalConfigs = [
        baseConfig,
        xAxisLabelsConfig, // Used in combination with our custom xAxisFormatter
        yAxisLabelsConfig, // Used in combination with our custom yAxisFormatter
        monthlyIntervalConfig, // Used to properly format the date labels on the xAxis
    ];

    const chartConfig = combineConfigs(axisFormatters, externalConfigs);
    return chartConfig;
};
