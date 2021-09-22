import { swSettings } from "common/services/swSettings";
import { IndustryAnalysisEngagementGraph } from "./IndustryAnalysisEngagementGraph";

export class IndustryAnalysisEngagementGraphPeriodOverPeriod extends IndustryAnalysisEngagementGraph {
    public static getWidgetResourceType() {
        return "GraphPOP";
    }

    public static getAllConfigs(params) {
        return { ...super.getAllConfigs(params), widgetConfig: this.getWidgetConfig(params) };
    }

    public static getWidgetConfig(params) {
        return widgetConfig(params);
    }

    public granularities;
    constructor() {
        super();
    }

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        this.apiParams.timeGranularity = "Monthly";
        this.granularities = { Daily: false, Weekly: false };
        widgetModel.webSource =
            this._params.webSource === "Combined" ? "Total" : this._params.webSource;
        if (this.apiParams.webSource === "Combined") {
            this.apiParams.webSource = "Total";
        }
        widgetModel.type = "ComparedLine"; // for dashboards
        return widgetModel;
    }

    public canAddToDashboard() {
        return true;
    }

    public formatSeries(series) {
        // override unnecessary logic
        return series;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/ia-performance-graph-pop.html`;
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
                    className: "titleRow align-with-legend margin-right__small",
                },
                utilities: [
                    {
                        id: "chart-export",
                        properties: {
                            utilitiesData: ["graph-tabs"],
                            wkhtmltoimage: true,
                            hideExcel() {
                                return !swSettings.components.Home.resources.IsExcelAllowed;
                            },
                        },
                    },
                ],
            },
        ],
    };
};

IndustryAnalysisEngagementGraphPeriodOverPeriod.register();
