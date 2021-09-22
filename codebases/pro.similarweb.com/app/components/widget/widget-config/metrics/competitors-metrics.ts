import { DefaultCellHeaderRightAlign } from "../../../React/Table/headerCells/DefaultCellHeaderRightAlign";

export const TopOrganicSearchCompetitors = {
    id: "TopOrganicSearchCompetitors",
    properties: {
        component: "WebAnalysis",
        title: "dashboard.metrics.titles.top.keywords.competitors.organic",
        family: "Website",
        state: "websites-competitorsOrganicKeywords",
        dashboard: "true",
        noCompare: true,
        apiController: "KeywordCompetitors",
        availabilityComponent: "WsOverviewKeywords",
    },
    widgets: {
        single: {
            Table: {
                properties: {
                    options: {
                        desktopOnly: true,
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        name: "Domain",
                        title: "Domain",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        cellTemp: "website-tooltip-top-cell",
                    },
                    {
                        name: "Value",
                        title: "Affinity",
                        type: "string",
                        format: "smallNumbersPercentage:2",
                        sortable: false,
                        isSorted: false,
                        isLink: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: false,
                        minWidth: "",
                        width: "115px",
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
            },
        },
    },
};

export const SearchCompetitorsPaid = {
    id: "SearchCompetitorsPaid",
    properties: {
        component: "SearchCompetitors",
        title: "dashboard.metrics.titles.top.paid.competitors",
        family: "Website",
        state: "websites-competitorsPaidKeywords",
        noCompare: true,
        dashboard: "true",
        apiController: "SearchCompetitors",
        availabilityComponent: "WsPaidKeywords",
        disableDatepicker: true,
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        apiParams: {
            endpoint: "widgetApi/SearchCompetitors/SearchCompetitorsPaid/Table",
            pageSize: "400",
        },
    },
    widgets: {
        single: {
            defaultType: "SearchCompetitorsPaid",
            SearchCompetitorsPaid: {
                properties: {
                    options: {
                        desktopOnly: false,
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [],
            },
        },
    },
};
