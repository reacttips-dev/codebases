import { BarChartWidget } from "components/widget/widget-types/BarChartWidget";

export class TrafficSourcesBarChartWidget extends BarChartWidget {
    public static getWidgetMetadataType() {
        return "PieChart";
    }
    public static getWidgetResourceType() {
        return "BarChart";
    }
    public static getAllConfigs(params) {
        const apiController = "IndustryAnalysis";
        const widgetConfig = TrafficSourcesBarChartWidget.getWidgetConfig(params);
        const metricConfig = TrafficSourcesBarChartWidget.getMetricConfig(params);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig,
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    protected static getWidgetConfig(params) {
        return trafficSourcesBarChartWidgetConfig(params);
    }

    protected static getMetricConfig(params) {
        return {
            properties: {
                ...params,
                dashboard: "true",
                options: {
                    showLegend: false,
                    dashboardSubtitleMarginBottom: 45,
                    desktopOnly: true,
                },
            },
        };
    }

    constructor() {
        super();
    }

    public canAddToDashboard() {
        return true;
    }

    public getWidgetModel() {
        const model = super.getWidgetModel();
        model.metric = "TrafficSourcesOverview";
        model.type = "BarChart";
        return model;
    }

    get templateUrl() {
        return "/app/components/widget/widget-templates/barchart.html";
    }
}

const trafficSourcesBarChartWidgetConfig = (params) => {
    return {
        type: "BarChart",
        properties: {
            ...params,
            apiParams: {
                metric: "TrafficSourcesOverview",
            },
            family: "Industry",
            type: "BarChart",
            dashboard: "true",
            width: "12",
            height: "158px",
            loadingHeight: "162px",
            title: "industry.trafficsources.piechart.title",
            excelMetric: "TrafficSourcesOverview",
            options: {
                frameClass: "traffic-sources-bar-chart-frame",
                legendAlign: "left",
                showTopLine: false,
                showFrame: true,
                showLegend: false,
                showSubtitle: false,
                showSettings: false,
                showTitle: false,
                showTitleTooltip: true,
                titleType: "text",
                newColorPalette: true,
                hideCategoriesIcons: true,
                disableLinks: true,
            },
            trackName: "Bar Chart/Traffic Sources Overview",
        },
    };
};
