import combineConfigs from "components/Chart/src/combineConfigs";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import sharedTooltip from "components/Chart/src/configs/tooltip/sharedTooltip";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { i18nFilter, percentageSignOnlyFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";

export const getChartConfig = ({
    type,
    filter,
    animation = true,
    selectedGranularity = "Monthly",
}) => {
    const format = "MMM YY";
    const tooltipFormat = selectedGranularity === "Monthly" ? "MMM YYYY" : "MMM DD, YYYY";
    const currentGranularity = monthlyIntervalConfig;
    const yAxisFormatter = ({ value }) => (value ? `${value}%` : "0%");
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);
    return combineConfigs({ type, yAxisFormatter, xAxisFormatter }, [
        currentGranularity,
        noLegendConfig,
        yAxisLabelsConfig,
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
                    marker: {
                        enabled: selectedGranularity !== "Daily",
                        symbol: "circle",
                    },
                    animation,
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

export const getBarChartConfig = ({ filter, tooltipFormatter }) => {
    const yAxisFormatter = ({ value }) => (value ? `${value}%` : "0%");
    return combineConfigs({ yAxisFormatter }, [
        noLegendConfig,
        yAxisLabelsConfig,
        {
            title: {
                text: null,
            },
            chart: {
                zoomType: false,
                height: 250,
                width: null,
                margin: [20, 20, 30, 50],
                spacing: [10, 0, 0, 0],
                type: "column",
                borderColor: "#FFFFFF",
                style: {
                    fontFamily: "Arial",
                    fontSize: "11px",
                },
                animation: true,
                events: {},
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                categories: ["Male", "Female"],
                lineColor: "#e4e4e4",
                gridLineColor: "#e4e4e4",
                tickWidth: 0,
                labels: {
                    align: "center",
                    rotation: 0,
                    useHTML: false,
                    style: {
                        fontSize: window.innerWidth <= 450 ? "11px" : "12px",
                        textAlign: "center",
                        textOverflow: "none",
                        fontFamily: '"Roboto", sans-serif',
                    },
                    formatter() {
                        return this.isLast
                            ? i18nFilter()(
                                  `grow.lead_generator.new.demographic.gender_distribution.female`,
                              )
                            : i18nFilter()(
                                  `grow.lead_generator.new.demographic.gender_distribution.male`,
                              );
                    },
                },
            },
            yAxis: {
                gridLineWidth: 0.5,
                startOnTick: false,
                endOnTick: true,
                showFirstLabel: true,
                showLastLabel: true,
                reversed: false,
                gridZIndex: 2,
                reversedStacks: true,
                tickPixelInterval: 50,
                labels: {
                    align: "right",
                    enabled: true,
                    useHTML: true,
                    x: -5,
                    max: 100,
                    style: {
                        color: "#aaa",
                        fontSize: "12px",
                        textTransform: "uppercase",
                    },
                    formatter() {
                        return yAxisFormatter(this);
                    },
                },
            },
            plotOptions: {
                column: {
                    borderWidth: 0,
                    borderRadius: 3,
                    maxPointWidth: 40,
                    minPointLength: 3,
                    pointPadding: 0.15,
                    pointRange: 1,
                    dataLabels: {
                        enabled: true,
                        color: "#707070",
                        useHTML: false,
                        style: {
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: "12px",
                            fontWeight: "400",
                        },
                        crop: false,
                        overflow: "none",
                        formatter() {
                            return percentageSignOnlyFilter()(this.y, 2);
                        },
                    },
                    states: {
                        hover: {
                            enabled: false,
                        },
                    },
                    grouping: true,
                },
            },
            tooltip: {
                shared: true,
                useHTML: true,
                backgroundColor: "#fff",
                borderWidth: 0,
                padding: 10,
                outside: true,
                formatter() {
                    return tooltipFormatter.bind(this)(filter, true);
                },
            },
        },
    ]);
};

export function multipleDomainsTooltipFormatter(filter, outside) {
    const lines = [];
    if (outside) {
        lines.push(`<div class="sharedTooltip">`);
        lines.push(`<div class="highcharts-tooltip">`);
    }

    lines.push(
        `<div class="date">${i18nFilter()(
            `grow.lead_generator.new.demographic.gender_distribution.${this.x}`,
        )}</div>`,
    );

    lines.push(`
    <div style="display: flex;align-items: baseline; min-width: 200px; max-width: 280px; padding: 2px 6px; justify-content: space-between;">
            <span>App</span>
            <span>Distribution</span>
    </div>
    `);

    _.forEach(this.points, (point: any) => {
        const valueFormatted = percentageSignOnlyFilter()(point.y, 2);
        const isSite = point?.point.isSite;
        const seriesName = point.series.name;
        const seriesSubtitle = point.series.userOptions.seriesSubtitle;
        lines.push(`<div style="display: flex;align-items: baseline; min-width: 200px; max-width: 280px; padding: 2px 6px">
                                <span class="item-marker-large" style="flex-shrink:0; background:${
                                    isSite ? point.color : "#AAB2BA"
                                };"></span>
                                <div style="display: flex;flex-direction: column; width: calc(100% - 30px); ">
                                    ${
                                        seriesName && isSite
                                            ? `<span class="item-name">${seriesName}</span>`
                                            : `<span class="item-name">Category average</span>`
                                    }
                                    ${
                                        seriesSubtitle
                                            ? `<span class="sub-item-name">${seriesSubtitle}</span>`
                                            : ""
                                    }
                                </div>
                                <span class="item-value" style="margin-left:8px;color:'#556575';">${valueFormatted}</span>
                            </div>`);
    });
    if (outside) {
        lines.push(`</div>`);
        lines.push(`</div>`);
    }
    return lines.join("");
}
