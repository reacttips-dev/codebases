import { DefaultCellHeaderRightAlign } from "../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";

let allWidgets = () => {
    function createTableConfig(metric, apiController, tableSearchColumn, compare, columnSettings) {
        return {
            metric: metric,
            type: "PopularPagesTable",
            properties: {
                metric: metric,
                apiController: apiController,
                family: "Website",
                type: "PopularPagesTable",
                height: "auto",
                width: "12",
                ignoreCompareMode: compare,
                apiParams: {
                    metric: metric,
                    includeSubDomains: false,
                    pageSize: 100,
                },
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
                    noBoxShadow: true,
                    stickyHeader: true,
                    overrideColumns: true,
                },
                columns: columnSettings,
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
                                column: tableSearchColumn,
                            },
                        },
                        compare
                            ? {
                                  id: "domain-selector",
                                  properties: {},
                              }
                            : {},
                    ],
                },
                {
                    properties: {
                        className: "tableBottomRight u-right-padding-50",
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

    let popularPagesColumns = [
        {
            cellTemp: "index",
            sortable: false,
            width: 65,
            disableHeaderCellHover: true,
        },
        {
            name: "Page",
            title: "URL",
            type: "string",
            format: "None",
            sortable: true,
            isSorted: false,
            sortDirection: "desc",
            groupable: false,
            cellTemp: "CellSite",
            headTemp: "",
            totalCount: true,
            tooltip: "analysis.content.pop.pages.table.columns.domain.title.tooltip",
            minWidth: 500,
        },
        {
            name: "Share",
            title: "analysis.content.pop.pages.table.columns.share.title",
            type: "string",
            format: "percentagesign",
            sortable: true,
            isSorted: true,
            sortDirection: "desc",
            groupable: false,
            cellTemp: "traffic-share",
            headTemp: "",
            totalCount: false,
            tooltip: "analysis.content.pop.pages.table.columns.share.title.tooltip",
            minWidth: 300,
        },
        {
            name: "ChangeInShare",
            title: "global.change",
            type: "double",
            format: "percentagesign",
            sortable: true,
            isSorted: false,
            sortDirection: "desc",
            groupable: false,
            cellTemp: "change-percentage",
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: false,
            tooltip: "widget.table.tooltip.searchkeywordsabb.change",
            width: 110,
        },
    ];

    return {
        single: [
            createTableConfig("PopularPages", "PopularPages", "Page", false, popularPagesColumns),
        ],
        compare: [
            createTableConfig("PopularPages", "PopularPages", "Page", true, popularPagesColumns),
        ],
    };
};

export const PopularPagesWidgets = allWidgets();
