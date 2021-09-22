import { TableWidget } from "components/widget/widget-types/TableWidget";
import { DefaultCellHeaderRightAlign } from "../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";

export class GooglePlayKeywordsTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "GooglePlayKeywordsTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const apiController = "GooglePlayKeywords";
        const widgetConfig = GooglePlayKeywordsTableWidget.getWidgetConfig(params, apiController);
        const metricConfig = GooglePlayKeywordsTableWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController) {
        return {
            type: "GooglePlayKeywordsTable",
            properties: {
                ...params,
                family: "GooglePlayKeyword",
                metric: "GooglePlayKeywordAnalysis",
                apiController,
                apiParams: {
                    metric: "GooglePlayKeywordAnalysis",
                    store: "google",
                },
                type: "GooglePlayKeywordsTable",
                height: "auto",
                width: "12",
                title: "googleplaykeyword.analysis.table.title",
                subtitle: "googleplaykeyword.analysis.table.subtitle",
                enableRowSelection: true,
                tableSelectionProperty: "App",
                maxSelection: 5,
                minSelection: 1,
                initialSelectedRowsCount: 3,
                forcedDuration: "6m",
                options: {
                    cssClass: "widgetTable",
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    stickyHeader: true,
                    tableSelectionTrackingParam: "Title",
                },
            },
            utilityGroups: [
                {
                    properties: {
                        className: "tableBottomLeft",
                    },
                    utilities: [
                        {
                            id: "table-search",
                            properties: {
                                column: "Title",
                            },
                        },
                    ],
                },
                {
                    properties: {
                        className: "tableBottomRight",
                    },
                    utilities: [
                        {
                            id: "table-export",
                            properties: {},
                        },
                        {
                            id: "columns-toggle",
                            properties: {},
                        },
                    ],
                },
                {
                    properties: {
                        className: "tableBottom",
                    },
                    utilities: [
                        {
                            id: "table-pager",
                            properties: {},
                        },
                    ],
                },
            ],
        };
    }

    static getMetricConfig(apiController) {
        return {
            id: "GooglePlayKeywordAnalysis",
            properties: {
                metric: "GooglePlayKeywordAnalysis",
                title: "GooglePlayKeywordAnalysis.analysis.table.title",
                family: "GooglePlayKeywordAnalysis",
                component: "AppKeywordAnalysis",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "apps.instoresearch",
                apiController,
            },
            single: {
                properties: {},
                columns: [
                    {
                        fixed: true,
                        name: "row-selection",
                        cellTemp: "row-selection",
                        sortable: false,
                        width: 33,
                        disableHeaderCellHover: true,
                    },
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 65,
                        title: "#",
                        headTemp: "DefaultCenteredCellHeader",
                        tooltip: "appstorekeywords.analysis.table.checkbox.tooltip",
                        disableHeaderCellHover: true,
                    },
                    {
                        fixed: true,
                        name: "Title",
                        title: "appstorekeywords.analysis.table.apptitle",
                        type: "string",
                        format: "None",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "app-tooltip-cell",
                        headTemp: "",
                        totalCount: "True",
                        tooltip: "",
                        width: 260,
                        ppt: {
                            overrideFormat: "App",
                        },
                    },
                    {
                        name: "Publisher",
                        title: "appstorekeywords.analysis.table.publisher",
                        type: "string",
                        format: "",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        tooltip: "appstorekeywords.analysis.table.publisher.tooltip",
                        minWidth: 195,
                    },
                    {
                        name: "CategoryFormated",
                        title: "appstorekeywords.analysis.table.category",
                        type: "string",
                        format: "",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "google-play-category-cell",
                        headTemp: "",
                        tooltip: "appstorekeywords.analysis.table.category.tooltip",
                        minWidth: 170,
                    },
                    {
                        name: "Position",
                        title: "appstorekeywords.analysis.table.position",
                        type: "string",
                        format: "minusNA",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        tooltip: "appstorekeywords.analysis.table.position.tooltip",
                        width: 90,
                    },
                    {
                        name: "TrafficShare",
                        title: "Traffic Share",
                        type: "string",
                        format: "percentagesign",
                        sortable: "True",
                        isSorted: "True",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "appstorekeywords.analysis.table.trafficshare.tooltip",
                        minWidth: 150,
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "double",
                        format: "percentagesign",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "change-percentage",
                        tooltip: "appstorekeywords.analysis.table.change.tooltip",
                        width: 110,
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "TrafficShare desc",
                            title: "Traffic Share",
                        },
                    ],
                },
            },
            compare: {},
        };
    }
}
