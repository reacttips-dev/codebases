import { TableWidget } from "components/widget/widget-types/TableWidget";
import { DefaultCellHeaderRightAlign } from "../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { DefaultCellRightAlign } from "../../../../components/React/Table/cells/DefaultCellRightAlign";

export class CategoryShareTableWidget extends TableWidget {
    public static getWidgetMetadataType() {
        return "Table";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getAllConfigs(params) {
        const widgetConfig: any = CategoryShareTableWidget.getWidgetConfig(params);
        const metricConfig = CategoryShareTableWidget.getMetricConfig();
        const metricTypeConfig = CategoryShareTableWidget.getMetricTypeConfig();
        const apiController = widgetConfig.properties.apiController;

        return {
            widgetConfig,
            metricConfig,
            metricTypeConfig,
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public static getWidgetConfig(params) {
        return {
            type: "CategoryShareTable",
            properties: {
                ...params,
                metric: "CategoryShareIndex",
                apiController: "CategoryShare",
                type: "CategoryShareTable",
                height: "auto",
                width: "12",
                family: "Industry",
                enableRowSelection: true,
                tableSelectionProperty: "Domain",
                maxSelection: 10,
                minSelection: 1,
                initialSelectedRowsCount: 10,
                overrideIndexColumnWidth: "55px",
                options: {
                    cssClass: "widgetTable",
                    showIndex: true,
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    showCompanySidebar: true,
                    stickyHeader: true,
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
                            properties: {},
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

    public static getMetricConfig() {
        return metricConfig;
    }

    public static getMetricTypeConfig() {
        return metricTypeConfig;
    }

    protected clearSelectionOnWidgetRemoval: boolean = false;

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}

const metricConfig = {
    component: "IndustryAnalysis",
    title: "metric.CategoryShare.title",
    family: "Industry",
    keyPrefix: "$",
    state: "websites-worldwideOverview",
};

const metricTypeConfig = {
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
            disableHeaderCellHover: true,
        },
        {
            name: "Domain",
            fixed: true,
            title: "Domain",
            type: "string",
            format: "None",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "website-tooltip-top-cell",
            headTemp: "",
            totalCount: "True",
            tooltip: "widget.table.tooltip.topsites.domain",
            width: 185,
        },
        {
            name: "Share",
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
            tooltip: "widget.table.tooltip.topsites.share",
            minWidth: 150,
        },
        {
            name: "Change",
            title: "Change",
            type: "double",
            format: "number",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "change-percentage",
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: "False",
            tooltip: "widget.table.tooltip.topsites.change",
            width: 110,
            visible: false,
        },
        {
            name: "Rank",
            title: "Rank",
            type: "long",
            format: "swRank",
            sortable: "True",
            isSorted: "False",
            sortDirection: "asc",
            groupable: "False",
            cellTemp: "rank-cell",
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: "False",
            tooltip: "widget.table.tooltip.topsites.rank",
            width: 90,
            visible: true,
            inverted: true,
        },
        {
            name: "AvgMonthVisits",
            title: "Monthly Visits",
            type: "double",
            format: "minVisitsAbbr",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: "False",
            tooltip: "widget.table.tooltip.monthlyvisits",
            width: 130,
        },
        {
            name: "DesktopMobileShare",
            title: "Desktop vs Mobile",
            type: "double",
            format: "abbrNumber",
            sortable: "False",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "percentage-bar-cell-rounded",
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: "False",
            tooltip: "wa.ao.desktopvsmobile.tooltip",
            minWidth: 190,
            webSources: ["Total"],
        },
        {
            name: "AvgVisitDuration",
            title: "Visit Duration",
            type: "double",
            format: "number",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "time-cell",
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: "False",
            tooltip: "widget.table.tooltip.topsites.avgvisitduration",
            width: 130,
        },
        {
            name: "PagesPerVisit",
            title: "Pages/Visit",
            type: "double",
            format: "number",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "pages-per-visit",
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: "False",
            tooltip: "widget.table.tooltip.topsites.ppv",
            width: 110,
        },
        {
            name: "BounceRate",
            title: "Bounce Rate",
            type: "double",
            format: "number",
            sortable: "True",
            isSorted: "False",
            sortDirection: "asc",
            groupable: "False",
            cellTemp: "bounce-rate",
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: "False",
            tooltip: "widget.table.tooltip.topsites.bouncerate",
            width: 125,
            inverted: true,
        },
        {
            name: "HasAdsense",
            title: "Adsense",
            type: "bool",
            format: "None",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "adsense-cell",
            headTemp: "",
            totalCount: "False",
            tooltip: true,
            width: 95,
        },
    ],
    filters: {},
};
