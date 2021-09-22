import { TableWidget } from "../../../../components/widget/widget-types/TableWidget";
const getWidgetConfig = (params) => {
    return {
        type: "Table",
        properties: {
            family: "Industry",
            ...params,
            metric: "TopSearchSourcesAbb",
            apiController: "IndustryAnalysisTopKeywords",
            type: "Table",
            width: "4",
            height: "210px",
            title: "ia.topkeywords.sourcechannel",
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
    family: "Website",
    order: "1",
};
const metricTypeConfig = {
    properties: {},
    columns: [
        {
            name: "Name",
            title: "Source",
            type: "string",
            format: "None",
            sortable: "False",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "item-image-cell",
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

export class IndustryAnalysisSearchBySource extends TableWidget {
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
