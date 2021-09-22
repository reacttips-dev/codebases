/**
 * Created by Daniel.Danieli on 8/6/2017.
 */
import { GraphWidget } from "components/widget/widget-types/GraphWidget";
import { i18nFilter, categoryPrettyFilter } from "filters/ngFilters";
import dayjs from "dayjs";

export class RankingHistoryGraphWidget extends GraphWidget {
    static getWidgetMetadataType() {
        return "RankingHistoryGraph";
    }

    static getWidgetResourceType() {
        return "Graph";
    }

    static xAxisFormater = (val, dateRange) => {
        const { from, to } = dateRange,
            diffInMonth = to.diff(from, "month"),
            dateFormat = diffInMonth >= 11 ? "MMM. YYYY" : "MMM. DD";

        return `${dayjs(val).utc().format(dateFormat)}`;
    };

    static yAxisTickPositioner() {
        const that = this as any;
        const positions = [],
            incrementor = Math.ceil((that.dataMax - that.dataMin) / 5);
        let currentPoint = that.dataMin + incrementor;

        positions.push(that.dataMin);
        if (that.dataMin - incrementor > 1) {
            positions.push(that.dataMin - incrementor);
        }

        while (currentPoint < that.dataMax) {
            positions.push(currentPoint);
            currentPoint = currentPoint + incrementor;
        }
        positions.push(that.dataMax);
        positions.push(that.dataMax + incrementor);

        return positions.sort((a, b) => a - b);
    }

    static xAxisLabelsFormater = (val, dateRange) => {
        const { from, to } = dateRange,
            diffInMonth = to.diff(from, "month"),
            dateFormat = diffInMonth >= 11 ? "MMM. YYYY" : "MMM. DD";

        return `<span class="x-axis-label">${dayjs(val).utc().format(dateFormat)}</span>`;
    };

    static getChartOptions = (isCompare, params) => {
        return {
            events: {},
            plotOptions: {
                line: {
                    marker: {
                        states: {
                            hover: {
                                enabled: true,
                            },
                        },
                        enabled: false,
                    },
                },
            },
            tooltip: {
                borderWidth: 0,
                style: {
                    opacity: 1,
                },
                shadow: true,
            },
            legend: {
                enabled: !isCompare,
                useHTML: true,
                itemDistance: 20,
                labelFormatter: function () {
                    const name = categoryPrettyFilter()(
                        !isCompare ? this.options.seriesName : this.name,
                        null,
                    );
                    return `<div class="legend-container">
                                          <span class="item-marker--flat" style="background-color:${this.color};"></span>
                                          <span class="legend-name-text" title="${name}">${name}</span>
                                        </div>`;
                },
            },
            xAxis: {
                tickInterval: params.xAxisTickInterval,
                endOnTick: false,
                startOnTick: false,
                showLastLabel: true,
                showFirstLabel: true,
                labels: {
                    useHTML: true,
                    align: "center",
                    formatter: function () {
                        return RankingHistoryGraphWidget.xAxisLabelsFormater(
                            this.value,
                            params.dateRange,
                        );
                    },
                },
                crosshair: {
                    color: "#bbb",
                },
            },
            yAxis: {
                reversed: true,
                showLastLabel: true,
                showFirstLabel: true,
                tickPositioner: RankingHistoryGraphWidget.yAxisTickPositioner,
                min: null,
            },
            lang: {
                noData: i18nFilter()("mobileapps.overview.ranking.chart.filter.nodata"),
            },
            exporting: {
                chartOptions: {
                    xAxis: [
                        {
                            tickInterval: params.xAxisTickInterval,
                            labels: {
                                style: {
                                    textTransform: "uppercase",
                                    fontSize: "11px",
                                    color: "#919191",
                                },
                                formatter: function () {
                                    return RankingHistoryGraphWidget.xAxisFormater(
                                        this.value,
                                        params.dateRange,
                                    );
                                },
                            },
                        },
                    ],
                    yAxis: [
                        {
                            showLastLabel: true,
                            showFirstLabel: true,
                            tickPositioner: RankingHistoryGraphWidget.yAxisTickPositioner,
                            min: null,
                        },
                    ],
                    legend: {
                        enabled: true,
                    },
                },
            },
        };
    };

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const apiController = "AppRanks";
        const widgetConfig = RankingHistoryGraphWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = RankingHistoryGraphWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController, isCompare) {
        return {
            type: "RankingHistoryGraph",
            properties: {
                ...params,
                apiParams: {
                    metric: "AppRanksHistory",
                },
                type: "RankingHistoryGraph",
                family: "Mobile",
                apiController,
                width: "12",
                height: "340px",
                excelMetric: "AppRanksHistory",
                options: {
                    showTitle: false,
                    showTitleTooltip: false,
                    showSubtitle: false,
                    showOverflow: true,
                    showLegend: true,
                    legendAlign: "left",
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    noTopPadding: true,
                    floatingLegend: true,
                    legendData: false,
                    sumTooltipValues: true,
                    alignWithLegend: true,
                    audienceOverviewColors: isCompare,
                    forceSetupColors: !isCompare,
                    widgetColorsFrom: isCompare ? null : "compareMainColors",
                    titleClass: "page-widget-title",
                    hideMarkersOnDaily: true,
                    sortAsc: true,
                    sortColors: true,
                    useNewLegends: isCompare,
                },
                trackName: "Ranking and Rating/Graph/History",
                cachedParams: ["timeGranularity", "metric"],
                chartOptions: this.getChartOptions(isCompare, params),
            },
            processResponse: params.processResponse,
        };
    }

    static getMetricConfigProperties() {
        return {
            properties: { hideMarkersOnDaily: true },
            // eslint-disable-next-line @typescript-eslint/camelcase
            x_axis: {
                title: "Date",
                type: "date",
                format: "None",
                name: "Date",
                reversed: "False",
            },
            // eslint-disable-next-line @typescript-eslint/camelcase
            y_axis: {
                title: "Ranks",
                type: "long",
                format: "number",
                name: "Rank",
                reversed: "True",
            },
            filters: {},
        };
    }

    static getMetricConfig(apiController) {
        return {
            id: "AppRanksHistory",
            properties: {
                title: "metric.appRanks.title",
                family: "Mobile",
                metric: "AppRanksHistory",
                apiController,
                component: "AppRanks",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "apps-ranking",
                timeGranularity: "Daily",
            },
            single: this.getMetricConfigProperties(),
            compare: this.getMetricConfigProperties(),
        };
    }

    public initWidgetWithConfigs(config, context) {
        super.initWidgetWithConfigs(config, context);
        this.apiParams.isDaily = false;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
    }
}
