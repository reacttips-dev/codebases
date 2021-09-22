import { TableWidget } from "../../../../components/widget/widget-types/TableWidget";
const getWidgetConfig = (params) => {
    return {
        type: "Table",
        properties: {
            family: "Industry",
            ...params,
            metric: "TopSearchChannelsAbb",
            apiController: "IndustryAnalysisTopKeywords",
            type: "Table",
            title: "ia.topkeywords.searchchannel",
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
                cssClass: "swTable--simple",
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
    family: "Industry",
    order: "1",
    modules: {
        Industry: {
            dashboard: "true",
            family: "Industry",
            state: "industryAnalysis-topKeywords",
            title: "ia.topkeywords.searchchannel",
            apiController: "IndustryAnalysisTopKeywords",
            component: "IndustryAnalysis",
        },
    },
};
const metricTypeConfig = {
    properties: {
        options: {
            showLegend: false,
            dashboardSubtitleMarginBottom: 15,
        },
    },
    columns: [
        {
            name: "Name",
            title: "Channel",
            type: "string",
            format: "None",
            sortable: "False",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "item-icon-cell",
            headTemp: "",
            totalCount: "False",
            tooltip: "",
            width: "",
        },
        {
            name: "Value",
            title: "Share",
            type: "double",
            format: "percentagesign",
            sortable: "False",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "traffic-share",
            headTemp: "",
            totalCount: "False",
            tooltip: "",
            width: "",
        },
    ],
    filters: {},
};

export class IndustryAnalysisSearchByChannel extends TableWidget {
    static getWidgetMetadataType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getAllConfigs(params) {
        const widgetConfig = getWidgetConfig(params);
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
        return `/app/components/widget/widget-templates/table.html`;
    }

    getWidgetModel() {
        const model = super.getWidgetModel();
        model.type = "Table";
        return model;
    }
}
