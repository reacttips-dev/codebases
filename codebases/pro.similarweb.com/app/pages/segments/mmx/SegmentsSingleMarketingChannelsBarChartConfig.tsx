import combineConfigs from "../../../../.pro-features/components/Chart/src/combineConfigs";
import {
    abbrNumberFilter,
    i18nFilter,
    minAbbrNumberFilter,
    percentageFilter,
} from "filters/ngFilters";
import {
    barChartConfig,
    barChartGraphDashed,
} from "components/Chart/src/configs/barChat/barChartConfig";

const minAbbrNumberWithNASupportFilter = (val) => minAbbrNumberFilter()(val === 0 ? null : val);

export const segmentsMarketingChannelsBarChartConfig = ({ valueType = "numeric", categories }) => {
    const valueFormatter = {
        numeric: (val) => abbrNumberFilter()(val),
        percentage: (val) => `${percentageFilter()(val, 1)}%`,
    }[valueType];
    const plotValueFormatter =
        valueType === "numeric" ? minAbbrNumberWithNASupportFilter : valueFormatter;

    return combineConfigs({ valueType, valueFormatter, categories }, [
        barChartConfig,
        () => {
            return {
                chart: {
                    zoomType: "",
                    height: 260,
                    events: {
                        // Note: xAxis labels have overflow hidden, therefore using "render" event to change it to "visible"
                        render: function () {
                            const xAxis = this.xAxis[0];
                            const tooltipTickIndexes = xAxis.categories
                                .map(({ tooltip }, idx) => (tooltip ? idx : null))
                                .filter((x) => x !== null);
                            tooltipTickIndexes.forEach((tickIdx) => {
                                xAxis.ticks[tickIdx].label.element.style.overflow = "visible";
                                xAxis.ticks[tickIdx].label.element.style.zIndex = "999";
                            });
                        },
                    },
                },
                title: { text: null },
                exporting: {
                    enabled: false,
                    chartOptions: {
                        chart: {
                            spacingLeft: 50,
                            spacingRight: 50,
                            spacingTop: 10,
                            spacingBottom: 50,
                            width: 1100,
                            height: 220,
                            marginLeft: 50,
                            marginRight: 50,
                            marginBottom: 100,
                            marginTop: 60,
                        },
                        legend: { itemMarginTop: 15, itemMarginBottom: 10 },
                    },
                },
                xAxis: {
                    labels: {
                        formatter: function () {
                            if (this.value.tooltip) {
                                return `<div class="chart-label-value-container">
                                    <div class="chart-label-value">
                                        ${this.value.display}
                                    </div>
                                    <div class="PlainTooltip-container chart-disclaimer-circle">
                                        <div id="custom-tooltip" class="PlainTooltip-element top chart-tooltip">
                                            <div class="Popup-content PlainTooltip-content">
                                                ${i18nFilter()(this.value.tooltip)}
                                            </div>
                                        </div>
                                    <div>
                                </div>`;
                            }
                            return this.value.display;
                        },
                        useHTML: true,
                    },
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            formatter: function () {
                                const displayValue = plotValueFormatter(this.y);
                                const prefixValue = this.y < 5000 ? "" : "~";
                                return this.point.isLowConfidence
                                    ? `<div class="chart-plot-point-value-container">
                                        <div class="chart-plot-point-value">
                                            ${prefixValue}${displayValue}
                                        </div>
                                        <div class="PlainTooltip-container chart-disclaimer-circle">
                                            <div id="custom-tooltip" class="PlainTooltip-element top chart-tooltip">
                                                <div class="Popup-content PlainTooltip-content">
                                                    ${i18nFilter()(
                                                        "segments.analysis.mmx.single.chart.low.confidence.tooltip",
                                                    )}
                                                </div>
                                            </div>
                                        <div>
                                    </div>`
                                    : displayValue;
                            },
                        },
                    },
                },
            };
        },
    ]);
};

export { barChartGraphDashed };
