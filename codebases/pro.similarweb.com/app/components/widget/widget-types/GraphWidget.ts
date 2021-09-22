/* eslint-disable @typescript-eslint/no-this-alias */
import angular from "angular";
import _ from "lodash";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DurationService from "services/DurationService";
import {
    IPptSlideExportRequest,
    IPptSeriesData,
} from "services/PptExportService/PptExportServiceTypes";
/**
 * Created by vlads on 26/1/2016.
 */
import { ChartWidget } from "./ChartWidget";
import { IPptLineChartRequest } from "services/PptExportService/PptExportServiceTypes";
import {
    fixLinesWithMissingData,
    formatLineChartLegendName,
} from "components/widget/widget-utilities/widgetPpt/PptGraphWidgetUtils";
import { augmentNameWithGAMark } from "components/widget/widget-utilities/widgetPpt/PptWidgetUtils";
import {
    getYAxisFormat,
    getWidgetTitle,
    getWidgetSubtitle,
} from "components/widget/widget-utilities/widgetPpt/PptWidgetUtils";
import {
    getGraphWidgetCategoryAxisLabelFormat,
    getGraphWidgetPptOptions,
} from "../widget-utilities/widgetPpt/PptGraphWidgetUtils";

declare const similarweb;
export const tickIntervals = {
    daily: 24 * 3600 * 1000,
    weekly: 24 * 3600 * 1000 * 7,
    monthly: 24 * 3600 * 1000 * 30,
};

type ChartSeries = { name: string; color: string; isGAVerified?: boolean; data: number[][] };

export function topMiddleTooltipPositioner(labelWidth, labelHeight, point) {
    const { top, left } = this.chart.clipRect.element.getBoundingClientRect();
    const { plotTop } = this.chart;
    const halfLabelWidth = labelWidth / 2;
    let positionX = left + this.chart.plotLeft + point.plotX - halfLabelWidth;
    if (positionX < 5) {
        positionX = 5;
    } else if (positionX + labelWidth >= window.innerWidth - 5) {
        positionX -= positionX + labelWidth - window.innerWidth + 20;
    }
    return {
        x: positionX,
        y: top + plotTop - labelHeight,
    };
}

export class GraphWidget extends ChartWidget {
    protected _ngHighchartsConfig;
    protected _pngExportService;
    protected _$filter;
    protected chartInstance;
    static $inject = ["ngHighchartsConfig", "pngExportService", "$filter"];

    public isPptSupported = () => {
        const hasData = this.chartConfig.series && this.chartConfig.series.length > 0;
        const hasOptions = !!this.metadata.chartOptions;
        return hasData && hasOptions;
    };

    public getDataForPpt = (): IPptSlideExportRequest => {
        const isCompareMode = this.isCompare();

        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this, { showEntities: !isCompareMode }),
            type: "line",
            details: {
                format: getYAxisFormat(this),
                options: getGraphWidgetPptOptions(this),
                data: this.getSeriesDataForPpt(),
            } as IPptLineChartRequest,
        };
    };

    protected getSeriesDataForPpt(): IPptSeriesData[] {
        const labelFormat = getGraphWidgetCategoryAxisLabelFormat(
            this.metadata.chartOptions.timeGranularity,
        );

        const chartSeries = this.chartConfig.series as ChartSeries[];
        const fixedChartSeries = fixLinesWithMissingData(chartSeries) as ChartSeries[];

        return fixedChartSeries.map((line: ChartSeries) => {
            const { name, color, data, isGAVerified } = line;
            const legendName = formatLineChartLegendName(this, name);
            const legendNameWithGA = augmentNameWithGAMark(legendName, isGAVerified) as string;

            const labels = data.map((point) => dayjs(point[0]).format(labelFormat));
            const values = data.map((point) => `${point[1]}`);

            return {
                seriesName: legendNameWithGA,
                seriesColor: color,
                labels,
                values,
            };
        });
    }

    static getWidgetMetadataType() {
        return "Graph";
    }

    static getWidgetResourceType() {
        return "Graph";
    }

    constructor() {
        super();
    }

    afterRender = (chartInstance) => {
        this.chartInstance = chartInstance;
        if (typeof this.chartConfig.getHighcharts !== "function") {
            this.chartConfig.getHighcharts = () => this.chartInstance;
        }
    };

    protected getXAxisTickInterval() {
        let ticks;
        const durationInMonths = DurationService.getMonthsFromApiDuration(
            this._params.from,
            this._params.to,
            this._params.isWindow,
        );
        if (durationInMonths > 24) {
            //every 2 months
            ticks = tickIntervals.monthly * 2;
        } else if (durationInMonths > 1) {
            ticks = tickIntervals.monthly;
        } else {
            switch (this._params.timeGranularity) {
                case "Daily":
                case "Weekly":
                    //every other day
                    ticks = tickIntervals.daily * 2;
                    break;
                case "Monthly":
                default:
                    //every other day
                    ticks = tickIntervals.monthly;
                    break;
            }
        }
        return ticks;
    }

    protected getXAxisLabelFormatter() {
        const durationInMonths = DurationService.getMonthsFromApiDuration(
            this._params.from,
            this._params.to,
            this._params.isWindow,
        );
        const format =
            durationInMonths <= 1 && this._params.timeGranularity != "Monthly"
                ? "D MMM."
                : `MMM'YY`;
        // here the returned function is called by Highcharts object,
        return function () {
            return dayjs.utc(this.value).utc().format(format);
        };
    }

    private getYAxisPrecision(series: Array<number[]> = []) {
        let yAxisMax = Math.max.apply(
                null,
                series.map((xAndY) => xAndY[1]),
            ),
            precision = 2;
        while (yAxisMax < 1 && yAxisMax > 0) {
            precision++;
            yAxisMax *= 10;
        }
        return precision;
    }

    private getExportingObj(options, data) {
        const self = this;
        return _.merge(
            {
                chartOptions: {
                    xAxis: [
                        {
                            id: options.metric,
                            minPadding: 0,
                            maxPadding: 0,
                            plotLines: this.getPlotLinesExportConfig(
                                this.getPlotLineIndicators(),
                                data,
                            ),
                        },
                    ],
                    yAxis: [
                        {
                            showFirstLabel: options.reversed,
                            showLastLabel: !options.reversed,
                            reversed: options.reversed,
                            max: options.yAxisMax,
                            tickInterval: options.yAxisTickInterval,
                            gridZIndex: options.stacked ? 4 : 1,
                            reversedStacks: !(
                                options.stacked &&
                                data.length > 1 &&
                                options.showStacked
                            ), // For area stacked graph to show mobileweb above desktop series
                            // forcing refresh on yAxis label due to a bug in highcharts-ng
                            // https://github.com/pablojim/highcharts-ng/issues/335
                            id: options.metric,
                            tickPositioner: options.reversed
                                ? this._ngHighchartsConfig.linearTickPositioner
                                : null,
                            labels: {
                                formatter: function () {
                                    return self._$filter(
                                        options.format == "number" ? "abbrNumber" : options.format,
                                    )(this.value);
                                },
                            },
                        },
                    ],
                    legend: {
                        enabled: !options.hasCompareLegend,
                    },
                },
            },
            options.exporting,
        );
    }

    protected setMetadata(response = [{ data: [] }]) {
        const widgetProp = this._widgetConfig.properties;
        const chartOptions: any = Object.assign(
            {
                type: "Line",
                markerEnabled: this._params.timeGranularity === "Daily" ? true : null,
                //(this._params.timeGranularity === 'Daily' && this._metricTypeConfig.properties.markerEnabled !== false) ?
                //        true :
                //        (angular.isDefined(this._metricTypeConfig.properties.markerEnabled) ? this._metricTypeConfig.properties.markerEnabled : null),
                format: this._metricTypeConfig["y_axis"].format,
                formatParameter: this._metricTypeConfig["y_axis"].formatParameter,
                reversed: this._metricTypeConfig["y_axis"].reversed === "True",
                height: widgetProp.graphHeight ? widgetProp.graphHeight : widgetProp.height,
                stacked: this._metricTypeConfig.properties.stacked === true,
                legendAlign: this._viewOptions.legendAlign,
                hideMarkersOnDaily: this._metricTypeConfig.properties.hideMarkersOnDaily || null,
                yAxisMax: this._metricTypeConfig["y_axis"].yAxisMax,
            },
            widgetProp.chartOptions || {},
        );
        if (["change", "percentagesign"].indexOf(this._metricTypeConfig["y_axis"].format) > -1) {
            const flatData = response.reduce(
                (acc, series) => [...acc, ...series.data.filter((x) => !!x)],
                [],
            );
            chartOptions.yPercentPrecision = this.getYAxisPrecision(flatData);
        }
        this.metadata = { chartOptions };
    }

    protected getChartOptions(formattedData) {
        const chartOptions = this.metadata.chartOptions;
        let compare = false;
        if (this._params.keys[0] !== "$") {
            compare = this._params.keys.split(",").length > 1;
        }
        const showStacked = this._params.webSource === "Combined";
        const showChartLegend =
            this._params.metric !== "EngagementDedup"
                ? (!compare && formattedData.length > 1) ||
                  (compare && !this._viewOptions.showLegend)
                : false;
        chartOptions.showStacked = showStacked;
        chartOptions.showLegend = showChartLegend;
        chartOptions.hasCompareLegend = compare;
        chartOptions.legendAlign =
            chartOptions.legendAlign || (this._params.webSource === "Combined" ? "left" : "right");
        chartOptions.timeGranularity = this._params.timeGranularity;
        chartOptions.xAxisTickInterval = this.getXAxisTickInterval();
        chartOptions.xAxisLabelFormatter = this.getXAxisLabelFormatter();
        chartOptions.params = this._params;
        this._viewOptions.plotLines = [];
        chartOptions.viewOptions = this._viewOptions;

        // issue in highCharts-ng https://github.com/pablojim/highcharts-ng/issues/335
        chartOptions.iconInfoCtrl = (styleObj) => {
            this._viewOptions.plotLines.push({
                chartInfotipPos: styleObj.position,
                infoClass: styleObj.infoClass,
                infoTemplate: styleObj.infoTemplate,
                infoText: styleObj.infoText,
                showPlotlineInfotip: styleObj.isShown,
            });
        };
        chartOptions.exporting = this.getExportingObj(chartOptions, formattedData);
        return chartOptions;
    }

    callbackOnGetData(response: any, comparedItemKeys?: any[]) {
        this.runProfiling();
        //Merge response.Data with response.KeysDataVerification for isGAVerified flag per property.
        this.mergeGAVerifiedFlag(response);

        const that = this;
        const formattedData = this.getChartSeries(response.Data, comparedItemKeys);

        this.setMetadata(formattedData);
        const chartOptions = this.getChartOptions(formattedData);
        const oldExportingSettings = chartOptions.exporting || {};

        this.chartConfig = this.getHighChartsConfig(chartOptions, formattedData, response.Data);
        angular.merge(this.chartConfig.options.exporting, oldExportingSettings);
        this.chartConfig["export"] = {
            title: this.getViewData().title,
            csvUrl: this.excelUrl,
        };
        const chartConfig = this.chartConfig;
        //update according to received data
        this.legendItems = this.getLegendItems(formattedData);
        this.chartConfig.exportPng = (chartTitle, utilityData) => {
            that._pngExportService.export(chartConfig, chartTitle, this._params, utilityData);
        };
    }

    onResize() {
        if (this.chartConfig.options && this.chartConfig.options.chart) {
            if (this.pos.sizeY === 2) {
                this.chartConfig.options.chart.height = 540;
            } else {
                this.chartConfig.options.chart.height = 180;
            }
        }
        if (
            this.chartInstance &&
            Object.keys(this.chartInstance).length > 0 &&
            typeof this.chartInstance.reflow === "function"
        ) {
            this.chartInstance.reflow();
        }
    }

    getHighChartsConfig(chartOptions, formattedData, data) {
        const tooltips = this.getPlotLineIndicators();
        const extendedChartOptions = Object.assign({}, chartOptions, {
            plotLines: this.getPlotLinesConfig(tooltips, formattedData),
        });
        const config = this._ngHighchartsConfig.lineGraphWidget(
            extendedChartOptions,
            formattedData,
        );
        let compare;
        if (this._params.keys[0] !== "$") {
            compare = this._params.keys.split(",").length > 1;
        }
        return config;
    }

    /**
     * Validates GraphWidget.Data
     * Schema: Dictionary<string, Dictionary<string, DatedValue<object>[][]>>
     * @param val GraphWidget.Data
     * @returns {boolean}
     */
    private isAllNulls(val: any) {
        const that = this;
        const isArray = _.isArray(val);
        if (!isArray || (isArray && _.isArray(val[0]))) {
            return _.every(val, (value) => {
                return that.isAllNulls(value);
            });
        } else {
            return (
                isArray &&
                (_.every(val, { Value: null }) ||
                    _.every(val, function (item) {
                        return item == null;
                    }))
            );
        }
    }

    protected validateData(response: any) {
        const allNulls = this.isAllNulls(response);
        return !allNulls;
    }

    protected handleDataError(statusCode: number) {
        switch (statusCode) {
            case 400:
                this.errorConfig.messageTop = "home.dashboards.widget.graph.error1";
                this.errorConfig.messageBottom = "home.dashboards.widget.graph.error2";
                this.errorConfig.icon = "no-daily-data";
                break;
            case 401:
                this.errorConfig.messageTop = "tae.dedup.graph.outofrange.text1";
                this.errorConfig.messageBottom = "tae.dedup.graph.outofrange.text2";
                this.errorConfig.icon = "no-data";
                break;
            case 404:
                this.errorConfig.messageTop = "home.dashboards.widget.table.error1";
                this.errorConfig.icon = "no-data";
            case 500:
            default:
                break;
        }
        // remove bottom message on non-dashboard widgets
        if (!this.dashboardId && statusCode !== 401) {
            delete this.errorConfig.messageBottom;
        }
    }
}

GraphWidget.register();
