import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { GraphWidget } from "components/widget/widget-types/GraphWidget";
import { IWidgetConfig } from "components/widget/widget-types/Widget";
import * as _ from "lodash";
import widgetSettings from "components/dashboard/WidgetSettings";
export class IndustryAnalysisEngagementGraph extends GraphWidget {
    public static getWidgetMetadataType() {
        return "Graph";
    }

    public static getWidgetResourceType() {
        return "Graph";
    }

    public static getWidgetDashboardType() {
        return "Graph";
    }

    public static getAllConfigs(params) {
        const widgetConfig: IWidgetConfig = IndustryAnalysisEngagementGraph.getWidgetConfig(params);
        const metricConfig = IndustryAnalysisEngagementGraph.getMetricConfig();
        const metricTypeConfig = IndustryAnalysisEngagementGraph.getMetricTypeConfig();
        const apiController = widgetConfig.properties.apiController;
        widgetConfig.properties.filters = IndustryAnalysisEngagementGraph.setFilters();
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig,
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public static getWidgetConfig(params) {
        return widgetConfig(params);
    }

    public static getMetricConfig() {
        return metricConfig;
    }

    public static getMetricTypeConfig() {
        return metricConfig;
    }

    private static setFilters() {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const isWebSourceTotal =
            (Injector.get("swNavigator") as any).getParams().webSource === "Total";
        if (isWebSourceTotal && hasMobileWebPermission) {
            return {
                webSource: "Combined",
            };
        } else {
            return {};
        }
    }

    public callbackOnGetData(response: any, comparedItemKeys?: any[]): void {
        this._metricTypeConfig = widgetSettings.getMetricWidgetMetadata(
            this.apiParams.metric,
            this._widgetConfig.properties.type,
            this._widgetConfig.properties.key.length > 1,
        );
        super.callbackOnGetData(response, comparedItemKeys);
        this.syncSeriesVisibility();
    }

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.webSource =
            this._params.webSource === "Combined" ? "Total" : this._params.webSource;
        widgetModel.type = "Graph";
        return widgetModel;
    }

    public canAddToDashboard() {
        return true;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
    }

    private syncSeriesVisibility() {
        this.chartConfig.series.forEach((serie) => {
            const legend: any = _.find(this.legendItems, { name: serie.name });
            if (legend) {
                serie.visible = !legend.hidden;
            }
        });
    }
}

const widgetConfig = (params) => {
    return {
        type: "EngagementMetricsChart",
        properties: {
            ...params,
            metric: "EngagementVisits",
            family: "Industry",
            apiController: "IndustryAnalysisOverview",
            type: "EngagementMetricsChart",
            width: "12",
            height: "340px",
            excelMetric: "EngagementOverview",
            apiParams: {
                metric: "EngagementVisits",
                timeGranularity: "Daily",
            },
            trackName: "Over Time Graph/Engagement Overview",
            cachedParams: ["timeGranularity", "metric"],
            options: {
                showTitle: false,
                showTitleTooltip: false,
                showSubtitle: false,
                showLegend: false,
                legendAlign: "left",
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                noTopPadding: true,
                floatingLegend: true,
                legendData: true,
                sumTooltipValues: true,
                alignWithLegend: true,
                widgetColors: "mobileWebColors",
                titleClass: "page-widget-title",
                dailyDataSince: "2015-10-01",
                hideMarkersOnDaily: true,
                legendTop: -20,
                addToDashboardIconClass: "scorable-tabs-add-to-dashboard",
            },
        },
        utilityGroups: [
            {
                properties: {
                    className: "ScorableTabs",
                },
                utilities: [
                    {
                        id: "graph-tabs",
                        properties: {
                            tabs: [
                                {
                                    title: {
                                        snapshot: "wa.ao.graph.avgvisits",
                                        window: "wa.ao.graph.avgvisitsdaily",
                                    },
                                    iconName: "visits",
                                    format: "minVisitsAbbr",
                                    id: "AvgMonthVisits",
                                    metric: "EngagementVisits",
                                    apiController: "IndustryAnalysisOverview",
                                    tooltip: "wa.ao.graph.avgvisits.tooltip",
                                },
                                {
                                    title: {
                                        snapshot: "wa.ao.graph.avgduration",
                                        window: "wa.ao.graph.avgduration",
                                    },
                                    iconName: "avg-visit-duration",
                                    format: "time",
                                    id: "AvgVisitDuration",
                                    metric: "EngagementAvgVisitDuration",
                                    apiController: "IndustryAnalysisOverview",
                                    tooltip: "wa.ao.graph.avgduration.tooltip",
                                },
                                {
                                    title: {
                                        snapshot: "wa.ao.graph.pages",
                                        window: "wa.ao.graph.pages",
                                    },
                                    iconName: "pages-per-visit",
                                    format: "decimalNumber",
                                    id: "PagesPerVisit",
                                    metric: "EngagementPagesPerVisit",
                                    apiController: "IndustryAnalysisOverview",
                                    tooltip: "wa.ao.graph.pages.tooltip",
                                },
                                {
                                    title: {
                                        snapshot: "wa.ao.graph.bounce",
                                        window: "wa.ao.graph.bounce",
                                    },
                                    iconName: "bounce-rate-2",
                                    format: "percentagesign:2",
                                    id: "BounceRate",
                                    metric: "EngagementBounceRate",
                                    apiController: "IndustryAnalysisOverview",
                                    tooltip: "wa.ao.graph.bounce.tooltip",
                                },
                            ],
                            param: "metric",
                            default: "EngagementOverview",
                            resource: "Table",
                            apiController: "TrafficAndEngagement",
                        },
                    },
                ],
            },
            {
                properties: {
                    className: "titleRow align-with-legend no-padding-right margin-right__large",
                },
                utilities: [
                    {
                        id: "time-granularity",
                        properties: {},
                    },
                    {
                        id: "chart-export",
                        properties: {
                            utilitiesData: ["graph-tabs"],
                            wkhtmltoimage: true,
                            hideExcel: function () {
                                return !swSettings.components.Home.resources.IsExcelAllowed;
                            },
                        },
                    },
                ],
            },
        ],
    };
};

const metricConfig = {
    properties: {
        periodOverPeriodSupport: true,
        hideMarkersOnDaily: true,
        stacked: true,
        options: {
            showLegend: false,
            mobileWebAlgoChangeDate: true,
        },
        modules: {
            Industry: {
                title: "wa.ao.totalvisits",
            },
        },
    },
    x_axis: {
        title: "Date",
        type: "date",
        format: "None",
        name: "Date",
        reversed: "False",
    },
    y_axis: {
        title: "Visits",
        type: "long",
        format: "minVisitsAbbr",
        formatParameter: 0,
        name: "Visits",
        reversed: "False",
    },
    filters: {
        timeGranularity: [
            {
                value: "Daily",
                title: "Daily",
            },
            {
                value: "Weekly",
                title: "Weekly",
            },
            {
                value: "Monthly",
                title: "Monthly",
            },
        ],
        ShouldGetVerifiedData: [
            {
                value: "true",
                title: "Yes",
            },
            {
                value: "false",
                title: "No",
            },
        ],
    },
};
