import { GraphWidget } from "components/widget/widget-types/GraphWidget";
import { IWidgetModel } from "components/widget/widget-types/Widget";
import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import * as _ from "lodash";

export class RetentionGraphWidget extends GraphWidget {
    public legendClass: string;

    static getWidgetMetadataType() {
        return "RetentionGraph";
    }

    static getWidgetResourceType() {
        return "Data";
    }

    static getWidgetDashboardType() {
        return "Graph";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
    }

    getHighChartsConfig(chartOptions, formattedData) {
        return this._ngHighchartsConfig.lineGraphWidget(
            _.merge({}, chartOptions, {
                chart: {
                    zoomType: "x",
                },
                tooltip: {
                    formatter: function () {
                        let lines = [];
                        lines.push(
                            `<div class="date">${i18nFilter()("apps.retention.graph.day")} ${
                                this.x
                            }</div><div class="line-seperator"></div>`,
                        );

                        _.forEach(this.points, function (point) {
                            var seriesName =
                                point.series.name.indexOf("$") != -1
                                    ? point.series.name
                                          .replace("*", "")
                                          .replace("$", "")
                                          .replace(/_/g, " ")
                                          .replace("~", " > ")
                                    : point.series.name;

                            lines.push(
                                "<div>" +
                                    '<span class="item-marker" style="background: ' +
                                    point.series.color +
                                    '"></span>' +
                                    '<span class="item-name">' +
                                    seriesName +
                                    '<span class="item-value" style="margin-left:4px;color: ' +
                                    point.series.color +
                                    ';">' +
                                    percentageSignFilter()(point.point.y, "%") +
                                    "</span></span></div>",
                            );
                        });
                        return lines.join("");
                    },
                },
                format: "percentagesign",
                tooltipFormat: "percentagesign",
                plotOptions: {
                    line: {
                        marker: {
                            enabled: false,
                        },
                    },
                },
                yAxis: {
                    max: 1,
                    min: 0,
                },
                xAxis: {
                    tickPositions: [0, 7, 14, 21, 30],
                    labels: {
                        formatter: function () {
                            return `${i18nFilter()("apps.retention.graph.day")} ${this.value}`;
                        },
                    },
                },
            }),
            formattedData,
        );
    }

    callbackOnGetData(response: any, comparedItemKeys?: any[]) {
        const day0Mode = this._widgetConfig.properties.isDay0FirstUsage ? "Usage" : "Install";
        const keys = Object.keys(response.Data);

        _.map(keys, (key) => {
            response.Data[key] = {
                data: response.Data[key][day0Mode],
            };
        });

        super.callbackOnGetData(response, comparedItemKeys);
        this.setExcelUrl(this["_apiController"], this._params);
    }

    private setExcelUrl(apiController, params) {
        // basically same behaviour only the metric has been switched.
        let newParams = { ...params };
        delete newParams.metric;
        const urlParams = _.trimEnd(
            _.reduce(
                newParams,
                (paramString, paramVal: any, paramKey) =>
                    `${paramString}${paramKey}=${encodeURIComponent(paramVal)}&`,
                "",
            ),
            "&",
        );
        const metric = this._widgetConfig.properties.excelMetric;

        this["chartConfig"] = {
            ...this["chartConfig"],
            export: {
                csvUrl: `/widgetApi/${apiController}/${metric}/Excel?${urlParams}`,
            },
        };
    }

    protected setMetadata(response = [{ data: [] }]) {
        const widgetProp = this._widgetConfig.properties;
        const chartOptions: any = Object.assign(
            {
                type: "Line",
                markerEnabled: false,
                height: widgetProp.height,
                stacked: false,
                format: "number",
                reversed: false,
                lang: { noData: i18nFilter()("apps.engagementoverview.nodata") },
            },
            widgetProp.chartOptions || {},
        );
        this.metadata = { chartOptions };
        if (!this.dashboardId) {
            //Legend class should not take affect in dashboard widgets.
            this.legendClass = "demographics-legend";
        }
    }

    protected formatSeries(obj) {
        return _.map(obj, (item: { Key: any; Value: any }) => {
            return [item.Key, item.Value];
        });
    }

    public canAddToDashboard() {
        return false;
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const apiController =
            params.store !== "Google" ? "AppEngagementOverviewIos" : "AppEngagementOverviewAndroid";
        const metric = "AppRetention";
        const widgetConfig = RetentionGraphWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
            metric,
        );
        const metricConfig = RetentionGraphWidget.getMetricConfig(apiController, metric);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController, isCompare, metric) {
        return {
            type: "RetentionGraph",
            properties: {
                ...params,
                family: "Mobile",
                metric,
                apiController,
                type: "RetentionGraph",
                trackName: "Retention Graph",
                height: "300px",
                loadingHeight: "300px",
                width: "12",
                excelMetric: params.isDay0FirstUsage ? "AppRetentionUsage" : "AppRetention",
                apiParams: {
                    metric,
                },
                title: "apps.retention.graph.title",
                tooltip: params.isDay0FirstUsage
                    ? "apps.retention.graph.tooltip2"
                    : "apps.retention.graph.tooltip",
                options: {
                    showTitle: true,
                    titleType: "text",
                    showTitleTooltip: true,
                    showSubtitle: false,
                    showFrame: true,
                    showSettings: false,
                    showLegend: true,
                    legendAlign: "left",
                    legendContainerClass: "demographics-legend",
                    useNewLegends: true,
                },
            },
            utilityGroups: [
                {
                    properties: {
                        className: "titleRow",
                    },
                    utilities: [
                        {
                            id: "ellipsis",
                            properties: {
                                items: [
                                    { id: "png", disabled: false },
                                    { id: "excel" },
                                    { id: "dashboard", disabled: params.isDay0FirstUsage },
                                ],
                                wkhtmltoimage: true,
                            },
                        },
                    ],
                },
            ],
        };
    }

    static getMetricConfig(apiController, metric) {
        return {
            id: metric,
            properties: {
                metric,
                title: "apps.retention.graph.title",
                tooltip: "apps.retention.graph.tooltip",
                family: "Mobile",
                component: "AppEngagementRetention",
                order: "1",
                state: "apps-engagementretention",
                dashboard: "true",
                apiController,
            },
            single: {
                properties: {
                    options: {
                        showLegend: false,
                    },
                },
            },
            compare: {
                properties: {},
            },
        };
    }
}

RetentionGraphWidget.register();
