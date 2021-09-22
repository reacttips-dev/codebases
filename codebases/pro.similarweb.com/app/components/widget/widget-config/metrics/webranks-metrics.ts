import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";
import { RankCell } from "../../../React/Table/cells";
import { DefaultCellHeaderRightAlign } from "../../../React/Table/headerCells/DefaultCellHeaderRightAlign";

export const WebRanks = {
    id: "WebRanks",
    properties: {
        title: "metric.webRanks.title",
        family: "Website",
        component: "WebAnalysis",
        state: "websites-worldwideOverview",
    },
    widgets: {
        single: {
            SingleMetric: {
                properties: {
                    width: "4",
                    headTemp: "web-rank-header",
                },
                objects: {
                    GlobalRank: {
                        name: "GlobalRank",
                        title: "wa.ao.ranks.global",
                        type: "long",
                        format: "swRankNumber",
                        cellTemp: "value-and-trend",
                        rowClass: "web-rank-row",
                    },
                    CountryRank: {
                        name: "CountryRank",
                        title: "wa.ao.ranks.country",
                        type: "long",
                        format: "swRankNumber",
                        cellTemp: "value-and-trend",
                        rowClass: "web-rank-row",
                    },
                    CategoryRank: {
                        name: "CategoryRank",
                        title: "wa.ao.ranks.category",
                        type: "long",
                        format: "swRankNumber",
                        cellTemp: "value-and-trend",
                        rowClass: "web-rank-row",
                    },
                },
            },
        },
        compare: {},
    },
};

export const WebRanksCategory = {
    id: "WebRanksCategory",
    properties: {
        group: "WebsiteAudienceOverview",
        title: "metric.webRanksCategory.title",
        family: "Website",
        component: "WebAnalysis",
        state: "websites-worldwideOverview",
        titleState: "industryAnalysis-topSites",
    },
    widgets: {
        single: {},
        compare: {
            Table: {
                properties: {},
                columns: [
                    {
                        name: "Domain",
                        title: "Domain",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "Rank",
                        title: "Rank",
                        type: "number",
                        format: "swRankNumber",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: RankCell,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        dangerouslySetInnerHTML: true,
                    },
                ],
                filters: {},
            },
        },
    },
};

export const WebRanksCategorySI = {
    ...WebRanksCategory,
    properties: {
        ...WebRanksCategory.properties,
        state: "accountreview_website_overview_websiteperformance",
        titleState: `${LEAD_ROUTES.INDUSTRY_RESULT}-TopWebsites`,
    },
};

export const WebRanksCountry = {
    id: "WebRanksCountry",
    properties: {
        group: "WebsiteAudienceOverview",
        title: "metric.webRanksCountry.title",
        family: "Website",
        component: "WebAnalysis",
        state: "websites-worldwideOverview",
        titleState: "industryAnalysis-topSites",
        apiController: "WebsiteOverview",
    },
    widgets: {
        single: {},
        compare: {
            Table: {
                properties: {},
                columns: [
                    {
                        name: "Domain",
                        title: "Domain",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "Rank",
                        title: "Rank",
                        type: "number",
                        format: "swRankNumber",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: RankCell,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        dangerouslySetInnerHTML: true,
                    },
                ],
                filters: {},
            },
        },
    },
};

export const WebRanksCountrySI = {
    ...WebRanksCountry,
    properties: {
        ...WebRanksCountry.properties,
        state: "accountreview_website_overview_websiteperformance",
    },
};

export const WebRanksGlobal = {
    id: "WebRanksGlobal",
    properties: {
        group: "WebsiteAudienceOverview",
        title: "metric.webRanks.title",
        family: "Website",
        component: "WebAnalysis",
        state: "websites-worldwideOverview",
        titleState: "industryAnalysis-topSites",
        apiController: "WebsiteOverview",
    },
    widgets: {
        single: {},
        compare: {
            Table: {
                properties: {},
                columns: [
                    {
                        name: "Domain",
                        title: "Domain",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "Rank",
                        title: "Rank",
                        type: "number",
                        format: "swRank",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: RankCell,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        dangerouslySetInnerHTML: true,
                    },
                ],
                filters: {},
            },
        },
    },
};

export const WebRanksGlobalSI = {
    ...WebRanksGlobal,
    properties: {
        ...WebRanksGlobal.properties,
        state: "accountreview_website_overview_websiteperformance",
    },
};
