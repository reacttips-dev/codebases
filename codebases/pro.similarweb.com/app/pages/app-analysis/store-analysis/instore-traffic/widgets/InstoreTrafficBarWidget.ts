import { BarChartWidget } from "components/widget/widget-types/BarChartWidget";
import { WidgetState } from "components/widget/widget-types/Widget";
import * as _ from "lodash";

export class InstoreTrafficBarWidget extends BarChartWidget {
    public static $inject = ["InstoreTrafficBar"];
    private _InstoreTrafficBar;

    public static getWidgetMetadataType() {
        return "InstoreTrafficBar";
    }

    constructor() {
        super();
    }
    public callbackOnGetData(response: any) {
        if (!response || !response.Data) {
            this.widgetState = WidgetState.ERROR;
        }
        super.callbackOnGetData(response);
    }
    public getChartSeries(unorderedData): any[] {
        return _.map(unorderedData, (v, k) => {
            return {
                data: v,
                name: k,
                legendIndex: this.legendItems.indexOf(_.find(this.legendItems, { id: k })),
            };
        });
    }
    public buildBar() {
        const formattedData = this.getChartSeries(this.originalData);
        const bar = new this._InstoreTrafficBar(
            this.metadata.chartOptions,
            formattedData,
            this._params.keys.split(","),
        );
        this.chartConfig = bar.getChartConfig();
    }

    get templateUrl() {
        return "/app/components/widget/widget-templates/barchart.html";
    }

    public static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const apiController = "StorePage";
        const widgetConfig = InstoreTrafficBarWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = InstoreTrafficBarWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public static getWidgetConfig(params, apiController, isCompare) {
        return {
            type: "InstoreTrafficBar",
            properties: {
                ...params,
                family: "Mobile",
                metric: "InStoreTrafficOverview",
                type: "InstoreTrafficBar",
                apiController,
                apiParams: {
                    metric: "InStoreTrafficOverview",
                },
                title: "mobileAppsAnalysis.storePage.instoretraffic.chart.title",
                tooltip: "mobileAppsAnalysis.storePage.instoretraffic.chart.title.tooltip",
                subtitle: "appanalysis.instore.keywords.table.subtitle",
                width: "12",
                height: "160px",
                options: {
                    frameClass: "traffic-sources-bar-chart-frame",
                    showTopLine: false,
                    showFrame: true,
                    showLegend: isCompare ? true : false,
                    showSubtitle: false,
                    showTitle: true,
                    showTitleTooltip: true,
                    showSettings: false,
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
            id: "InStoreTrafficOverview",
            properties: {
                metric: "InStoreTrafficOverview",
                title: "mobileAppsAnalysis.storePage.instoretraffic.chart.title",
                family: "StoreKeywords",
                component: "StorePage",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "apps.instoresearch",
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
