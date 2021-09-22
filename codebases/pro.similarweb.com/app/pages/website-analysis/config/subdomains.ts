const subDomainsWidgetConfig = {
    single: [
        {
            metric: "SubDomains",
            type: "Table",
            properties: {
                metric: "SubDomains",
                apiController: "SubDomains",
                type: "Table",
                height: "auto",
                width: "12",
                options: {
                    cssClass: "widgetTable",
                    showIndex: true,
                    showTitle: true,
                    showTitleTooltip: true,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    showCompanySidebar: true,
                    stickyHeader: true,
                    titleTemplate:
                        "/app/components/widget/widget-templates/table-compare-title.html",
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
                                column: "Domain",
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
        },
    ],
    compare: [
        {
            metric: "SubDomains",
            type: "Table",
            properties: {
                metric: "SubDomains",
                apiController: "SubDomains",
                type: "Table",
                height: "auto",
                width: "12",
                ignoreCompareMode: true,
                options: {
                    cssClass: "widgetTable",
                    showIndex: true,
                    showTitle: true,
                    showTitleTooltip: true,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    showCompanySidebar: true,
                    stickyHeader: true,
                    titleTemplate:
                        "/app/components/widget/widget-templates/table-compare-title.html",
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
                                column: "Domain",
                            },
                        },
                        {
                            id: "domain-selector",
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
        },
    ],
};
export default subDomainsWidgetConfig;
