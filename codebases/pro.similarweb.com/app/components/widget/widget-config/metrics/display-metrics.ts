import { DefaultCellHeaderRightAlign } from "../../../React/Table/headerCells/DefaultCellHeaderRightAlign";

export const TrafficSourcesAds = {
    id: "TrafficSourcesAds",
    properties: {
        component: "WebAnalysis",
        apiController: "TrafficSourcesDisplayAds",
        title: "dashboard.metrics.titles.total.display.traffic",
        family: "Website",
        dashboard: "true",
        webSource: "Desktop",
        state: "websites-trafficDisplay-overview",
        availabilityComponent: "WsWebDisplayTrafficOverview",
    },
    widgets: {
        single: {
            SingleMetric: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                objects: {
                    Total: {
                        name: "Total",
                        title: "Total Visits",
                        type: "double",
                        format: "bigNumberComma",
                        headTemp: "none",
                        cellTemp: "large-single-number",
                    },
                },
            },
            Graph: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "Visits",
                    type: "long",
                    format: "number",
                    formatParameter: 0,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {
                    timeGranularity: [
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                    ],
                },
            },
        },
        compare: {
            PieChart: {
                properties: {
                    options: {
                        showLegend: false,
                        preserveLegendSpace: true,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                objects: {
                    TotalVisits: {
                        name: "TotalVisits",
                        title: "Traffic Share",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showMarkersOnSingle: true,
                    },
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "Visits",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {
                    timeGranularity: [
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                    ],
                },
            },
        },
    },
};

export const DashboardAdNetworks = {
    id: "DashboardAdNetworks",
    properties: {
        dashboard: "true",
        title: "dashboard.metrics.titles.top.ad.networks",
        family: "Website",
        component: "WebAnalysis",
        state: "websites-trafficDisplay-adNetworks",
        apiController: "WebsiteOverviewDesktop",
        availabilityComponent: "WsWebDisplayTrafficAdNetworks",
    },
    widgets: {
        single: {
            Table: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        desktopOnly: true,
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                columns: [
                    {
                        name: "Domain",
                        title: "Ad Network",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "traffic-share",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        progressBarTooltip: "Visits",
                        minWidth: 150,
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "TotalShare desc",
                            title: "Traffic Share",
                        },
                    ],
                },
            },
            PieChart: {
                properties: {
                    options: {
                        showLegend: false,
                        preserveLegendSpace: true,
                        dashboardSubtitleMarginBottom: 15,
                        desktopOnly: true,
                    },
                },
                objects: {
                    TotalVisits: {
                        name: "TotalVisits",
                        title: "Traffic Share",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
                filters: {
                    orderBy: [
                        {
                            value: "TotalShare desc",
                            title: "Traffic Share",
                        },
                    ],
                },
            },
        },
        compare: {
            Table: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        desktopOnly: true,
                    },
                },
                columns: [
                    {
                        name: "Domain",
                        title: "Ad Network",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "200px",
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: false,
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "115px",
                    },
                    {
                        name: "SiteOrigins",
                        title: "Traffic Share Split",
                        type: "double[]",
                        format: "percentagesign",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "group-traffic-share-dashboard",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        ppt: {
                            // Indicates that we want to split this column into sub-columns
                            // where each sub-column will be a table entity (table item - a website/app/category.
                            // such as ynet.co.il, whatsapp, all industries etc.)
                            splitColumnToEntities: true,

                            // override the table column format when rendered in ppt
                            overrideFormat: "smallNumbersPercentage:1",

                            // Override default value when no value is present in a table roe
                            defaultValue: "0",
                        },
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "TotalShare desc",
                            title: "Traffic Share",
                        },
                    ],
                },
            },
        },
    },
};

export const DashboardIncomingAds = {
    id: "DashboardIncomingAds",
    properties: {
        dashboard: "true",
        title: "dashboard.metrics.titles.top.publishers",
        family: "Website",
        component: "WebAnalysis",
        state: "websites-trafficDisplay",
        stateParams: {
            selectedTab: "websites",
        },
        apiController: "TrafficSourcesDisplayAds",
        availabilityComponent: "WsWebDisplayTrafficPublishers",
    },
    widgets: {
        single: {
            Table: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        desktopOnly: true,
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                columns: [
                    {
                        name: "Domain",
                        title: "Domain",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        progressBarTooltip: "Visits",
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
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: 85,
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "Share desc",
                            title: "Traffic Share",
                        },
                    ],
                },
            },
        },
        compare: {
            Table: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        desktopOnly: true,
                    },
                },
                columns: [
                    {
                        name: "Domain",
                        title: "Domain",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: false,
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "115px",
                    },
                    {
                        name: "SiteOrigins",
                        title: "Group Traffic Share Split",
                        type: "double[]",
                        format: "percentagesign",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "group-traffic-share-dashboard",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        ppt: {
                            // Indicates that we want to split this column into sub-columns
                            // where each sub-column will be a table entity (table item - a website/app/category.
                            // such as ynet.co.il, whatsapp, all industries etc.)
                            splitColumnToEntities: true,

                            // override the table column format when rendered in ppt
                            overrideFormat: "smallNumbersPercentage:1",

                            // Override default value when no value is present in a table row
                            defaultValue: "0",
                        },
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "TotalShare desc",
                            title: "Traffic Share",
                        },
                        {
                            value: "Change desc",
                            title: "Change",
                        },
                    ],
                },
            },
        },
    },
};
