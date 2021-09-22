/**
 * Created by saharr on 07-Jun-17.
 */

import { BarChartWidget } from "components/widget/widget-types/BarChartWidget";
import { WidgetState } from "components/widget/widget-types/Widget";
import * as _ from "lodash";

export class ExternalTrafficBarChartWidget extends BarChartWidget {
    protected _ExternalTrafficBar: any;
    public static $inject = ["ExternalTrafficBar"];

    constructor() {
        super();
    }
    public callbackOnGetData(response: any) {
        if (!response || !response.Data) {
            this.widgetState = WidgetState.ERROR;
        }
        super.callbackOnGetData(response);
    }
    get templateUrl() {
        return `/app/components/widget/widget-templates/barchart.html`;
    }

    public buildBar() {
        const formattedData = this.getChartSeries(this.originalData);
        const bar = new this._ExternalTrafficBar(
            this.metadata.chartOptions,
            formattedData,
            this._params.keys.split(","),
        );
        this.chartConfig = bar.getChartConfig();
    }

    public getChartSeries(unorderedData): any[] {
        return _.map(unorderedData, (v, k) => {
            return {
                data: v,
                name: k,
                legendIndex: this.legendItems.indexOf(_.find(this.legendItems, { id: k })),
            };
        }).sort((a, b) => a.legendIndex - b.legendIndex);
    }

    public static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const isAppStore = params.appId[0] === "1" ? true : false;
        const apiController = "StorePage";
        const widgetConfig = ExternalTrafficBarChartWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
            isAppStore,
        );
        const metricConfig = ExternalTrafficBarChartWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public static getWidgetConfig(params, apiController, isCompare, isAppStore) {
        return {
            type: "ExternalTrafficBarChart",
            properties: {
                ...params,
                family: "Mobile",
                metric: "StorePageExternalTrafficOverview",
                apiController,
                apiParams: {
                    metric: "StorePageExternalTrafficOverview",
                },
                type: "ExternalTrafficBarChart",
                width: "12",
                height: "158px",
                title: "appanalysis.external.traffic.bar.title",
                subtitle: "appanalysis.external.traffic.bar.subtitle",
                tooltip: isAppStore
                    ? "appanalysis.external.traffic.bar.title.tooltip2"
                    : "appanalysis.external.traffic.bar.title.tooltip",
                options: {
                    frameClass: "traffic-sources-bar-chart-frame",
                    showTopLine: false,
                    showFrame: true,
                    showLegend: isCompare ? true : false,
                    showSubtitle: false,
                    showSettings: false,
                    showTitle: false,
                    showTitleTooltip: true,
                    titleType: "text",
                    disableLinks: true,
                    titleTemplate:
                        "/app/pages/app-analysis/store-analysis/store-analysis-graph-title.html",
                    useNewLegends: true,
                },
            },
        };
    }

    public static getMetricConfig(apiController) {
        return {
            id: "StorePageExternalTrafficOverview",
            properties: {
                metric: "StorePageExternalTrafficOverview",
                title: "appanalysis.external.traffic.bar.title",
                family: "Mobile",
                component: "StorePage",
                order: "1",
                keyPrefix: "$",
                state: "websites-worldwideOverview",
                timeGranularity: "Monthly",
                apiController,
            },
            single: {
                properties: {},
                objects: {},
            },
            compare: {
                properties: {},
                objects: {},
            },
        };
    }
}
