import { PieChartWidget } from "../../../../components/widget/widget-types/PieChartWidget";
const getWidgetConfig = (params) => {
    return {
        type: "PieChart",
        properties: {
            ...params,
            family: "Industry",
            metric: "SearchKeywordsAbb",
            apiController: "IndustryAnalysisTopKeywords",
            type: "PieChart",
            title: "ia.topkeywords.organicpaid",
            width: "4",
            height: "210px",
            options: {
                showTitle: true,
                titleType: "text",
                showSubtitle: false,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                twoColorMode: true,
                noBottomPadding: true,
                titlePaddingBottom: "8px",
            },
        },
    };
};
const metricConfig = {
    component: "WebAnalysis",
    title: "metric.TopSearchKeywordsExcludedBranded.title",
    group: "WebsiteAudienceOverview",
    noCompare: true,
    order: "1",
    modules: {
        Industry: {
            dashboard: "true",
            family: "Industry",
            state: "industryAnalysis-topKeywords",
            title: "ia.topkeywords.organicpaid",
            apiController: "IndustryAnalysisTopKeywords",
            component: "IndustryAnalysisTopKeywords",
        },
    },
};
const metricTypeConfig = {
    properties: {
        options: {
            showLegend: false,
            showFrame: true,
            twoColorMode: true,
            dashboardSubtitleMarginBottom: 15,
        },
    },
    objects: {
        Organic: {
            name: "Organic",
            title: "Organic",
            type: "double",
            format: "None",
            cellTemp: "",
        },
        Paid: {
            name: "Paid",
            title: "Paid",
            type: "double",
            format: "None",
            cellTemp: "",
        },
    },
};

export class IndustryAnalysisTopKeywordsOrganicVsPaid extends PieChartWidget {
    static getWidgetMetadataType() {
        return "PieChart";
    }

    static getWidgetResourceType() {
        return "PieChart";
    }

    static getAllConfigs(params, context) {
        const widgetConfig: any = getWidgetConfig(params);
        return {
            widgetConfig,
            metricConfig,
            metricTypeConfig,
            apiController: widgetConfig.properties.apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    canAddToDashboard() {
        return true;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/piechart.html`;
    }

    getWidgetModel() {
        const model = super.getWidgetModel();
        model.type = "PieChart";
        return model;
    }
}
