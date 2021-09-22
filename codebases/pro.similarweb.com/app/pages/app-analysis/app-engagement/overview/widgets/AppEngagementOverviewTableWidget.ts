import { swSettings } from "common/services/swSettings";
import { TableWidget } from "components/widget/widget-types/TableWidget";

export class AppEngagementOverviewTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "AppEngagementOverviewTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getWidgetDashboardType() {
        return "Table";
    }

    constructor() {
        super();
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    static getAllConfigs(params) {
        const hasAEORealNumbers = swSettings.components.Home.resources.HasAppEngRealNumbers;
        const mode = params.key.length > 1 ? "compare" : "single";
        const apiController = "AppEngagementOverviewAndroid";
        const metric = hasAEORealNumbers
            ? "AppEngagementOverviewRealNumbers"
            : "AppEngagementOverview";
        const widgetConfig = AppEngagementOverviewTableWidget.getWidgetConfig(
            params,
            apiController,
            metric,
        );
        const metricConfig = AppEngagementOverviewTableWidget.getMetricConfig(
            apiController,
            metric,
            hasAEORealNumbers,
        );
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController, metric) {
        return {
            type: "AppEngagementOverviewTable",
            properties: {
                ...params,
                family: "Mobile",
                metric,
                apiController,
                apiParams: {
                    metric,
                },
                type: "AppEngagementOverviewTable",
                width: "12",
                height: "auto",
                loadingHeight: "140px",
                title: "wa.ao.engagement",
                tooltip: "wa.ao.engagement.tooltip",
                options: {
                    cssClass: "swTable--simple",
                    showTitle: true,
                    showTitleTooltip: true,
                    titleType: "text",
                    showSubtitle: true,
                    showLegend: false,
                    preserveLegendSpace: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: true,
                    titleClass: "page-widget-title",
                },
            },
        };
    }

    static getMetricConfig(apiController, metric, hasAEORealNumbers) {
        return {
            id: metric,
            properties: {
                metric,
                family: "Mobile",
                component: "AppEngagementOverview",
                order: "1",
                state: "apps-engagementoverview",
                apiController,
            },
            compare: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                columns: [
                    {
                        name: "App",
                        title: "appanalysis.engagement.overview.table.compare.app",
                        cellTemp: "app-tooltip-cell",
                        sortable: false,
                        minWidth: 150,
                        ppt: {
                            overrideFormat: "App",
                        },
                    },
                    {
                        name: "CurrentInstalls",
                        title: "apps.engagementoverview.tabs.currentinstalls.title",
                        cellTemp: "leader-default-cell",
                        format: "percentagesign:2",
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.currentinstalls.tooltip",
                    },
                    {
                        name: "Downloads",
                        title: "appanalysis.engagement.overview.table.compare.downloads",
                        cellTemp: "leader-default-cell",
                        format: "abbrNumberVisits",
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        inverted: true,
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.downloads.tooltip",
                    },
                    {
                        name: "DailyActiveUsers",
                        title: "apps.engagementoverview.table.dau.title",
                        cellTemp: "leader-default-cell",
                        format: "abbrNumberVisits",
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.table.dau.tooltip.ud",
                        minWidth: 80,
                    },
                    {
                        name: "MonthlyActiveUsers",
                        title: "apps.engagementoverview.table.mau.title",
                        cellTemp: "leader-default-cell",
                        format: "abbrNumberVisits",
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.table.mau.tooltip.ud",
                        minWidth: 80,
                    },
                    {
                        name: "UniqueInstalls",
                        title: "apps.engagementoverview.table.unique.installs.title",
                        cellTemp: "leader-default-cell",
                        format: "abbrNumberVisits",
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.table.unique.installs.tooltip",
                        minWidth: 80,
                    },
                ],
            },
        };
    }
}

AppEngagementOverviewTableWidget.register();
