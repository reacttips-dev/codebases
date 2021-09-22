import { GraphWidget } from "components/widget/widget-types/GraphWidget";

export class TrafficSourcesOverviewGraphWidget extends GraphWidget {
    public static getWidgetResourceType() {
        return "Graph";
    }

    public static getWidgetMetadataType() {
        return "Graph";
    }

    public static getAllConfigs(params) {
        const apiController = "IndustryAnalysis";
        const widgetConfig = TrafficSourcesOverviewGraphWidget.getWidgetConfig(params);
        const metricConfig = TrafficSourcesOverviewGraphWidget.getMetricConfig(params);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig,
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public static getWidgetConfig(params) {
        return trafficSourcesOverviewGraphConfig(params);
    }

    protected static getMetricConfig(params) {
        return {
            properties: {
                ...params,
                dashboard: "true",
                showMoreButton: true,
                options: {
                    legendAlign: "left",
                    sortByTrafficSources: true,
                    showLegend: false,
                    legendTop: -20,
                    desktopOnly: true,
                    dashboardSubtitleMarginBottom: 15,
                    newColorPalette: true,
                },
            },
            x_axis: {
                title: "Date",
                type: "date",
                format: "None",
                name: "Date",
                reversed: false,
            },
            y_axis: {
                title: "Visits",
                type: "double",
                format: "number",
                formatParameter: 0,
                name: "Visits",
                reversed: false,
            },
        };
    }

    public canAddToDashboard() {
        return true;
    }

    public getWidgetModel() {
        const model = super.getWidgetModel();
        model.metric = "TrafficSourcesOverview";
        model.type = "Graph";
        return model;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/engagementoverviewgraph.html`;
    }
}

const trafficSourcesOverviewGraphConfig = (params) => {
    return {
        type: "Graph",
        properties: {
            ...params,
            apiParams: {
                metric: "TrafficSourcesOverview",
            },
            family: "Industry",
            state: "industryAnalysis-trafficSources",
            component: "IndustryAnalysis",
            title: "industry.trafficsources.graph.title",
            type: "Graph",
            width: "12",
            height: "370px",
            dashboard: "true",
            order: "1",
            keyPrefix: "$",
            timeGranularity: "Monthly",
            options: {
                noTopPadding: true,
                sortBy: "value",
                sortAsc: false,
                showTitle: false,
                titleType: "text",
                showSubtitle: false,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                legendAlign: "left",
                legendTop: -20,
                legendWrap: true,
                newColorPalette: true,
                sortByTrafficSources: true,
            },
        },
        utilityGroups: [
            {
                properties: {
                    className:
                        "titleRow align-with-legend ia-trafficsources-graph-export-pull-right",
                },
                utilities: [
                    {
                        id: "chart-export",
                        properties: {
                            hideExcel: true,
                            wkhtmltoimage: true,
                        },
                    },
                ],
            },
        ],
    };
};
