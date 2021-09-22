import DurationService from "services/DurationService";
import { DefaultCellRightAlign } from "../../../React/Table/cells/DefaultCellRightAlign";
import { DefaultCellHeaderRightAlign } from "../../../React/Table/headerCells/DefaultCellHeaderRightAlign";
import { TrafficShareWithVisits } from "components/React/Table/cells";
import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";

export const TopNonBrandedKeywords = {
    id: "TopNonBrandedKeywords",
    properties: {
        dashboard: "true",
        component: "TrafficSourceSearchKeyword",
        hasWebSource: true,
        mobileWebComponent: "TrafficSourceSearchKeywordMobileWeb",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        family: "Website",
        order: "1",
        state: "keywordAnalysis-organic",
        titleState: "websites-trafficSearch",
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        apiController: (keys, { webSource, duration }) => {
            const durationData = DurationService.getDurationData(duration);
            // SIM-28142 : different endpoint for mobile web
            if (webSource === "MobileWeb") {
                return "MobileSearchKeywords";
            } else if (durationData.raw.isDaily) {
                return "SearchWeeklyKeywords";
            }
            return "SearchKeywords";
        },
        apiParams: {
            metric: "NewSearchKeywords",
        },
        availabilityComponent: "WsWebSearchKeywords",
    },
    widgets: {
        single: {
            Table: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        dashboardSubtitleClass: "dashboard-table-widget",
                    },
                },
                columns: [
                    {
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "OrganicPaid",
                        title: "Organic VS Paid",
                        type: "double[]",
                        format: "percentagesign",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "organic-paid-dashboard",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "210px",
                        ppt: {
                            // Indicates that we want to replace this column with two other columns
                            // (show the specified columns instead of the current column)
                            // this is done mainly in cases of Vs. columns, where we want to split
                            // the column into two ppt columns (such as: "Organic Vs Paid" >>> "Organic", "Paid")
                            replaceWithColumns: ["Organic", "Paid"],

                            // override the table column format when rendered in ppt
                            overrideFormat: "OrganicPaid",
                        },
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: "False",
                        progressBarTooltip: "Visits",
                        tooltip: "",
                        width: "115px",
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
                        width: "",
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
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
                    IncludeNoneBranded: [
                        {
                            value: "true",
                            title: "Non branded",
                        },
                    ],
                },
            },
        },
        compare: {
            Table: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {},
                },
                columns: [
                    {
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: "False",
                        progressBarTooltip: "Visits",
                        tooltip: "",
                        width: "115px",
                    },
                    {
                        name: "SiteOrigins",
                        title: "Traffic Distribution",
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
                        width: "",
                        ppt: {
                            // Indicates that we want to split this column into sub-columns
                            // where each sub-column will be a table entity (table item - a website/app/category.
                            // such as ynet.co.il, whatsapp, all industries etc.)
                            splitColumnToEntities: true,

                            // override the table column format when rendered in ppt
                            overrideFormat: "smallNumbersPercentage:1",

                            // Override default value when no value is present in a table roe
                            defaultValue: "0%",
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
                    IncludeNoneBranded: [
                        {
                            value: "true",
                            title: "Non branded",
                        },
                    ],
                },
            },
        },
    },
};

export const TopReferrals = {
    id: "TopReferrals",
    properties: {
        dashboard: "true",
        apiController: "WebsiteOverviewDesktop",
        hasWebSource: true,
        title: "metric.topReferrals.title",
        family: "Website",
        component: "WebAnalysis",
        mobileWebComponent: "MobileWebReferrals",
        order: "1",
        state: "websites-worldwideOverview",
        titleState: "websites-trafficReferrals",
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        availabilityComponent: "WsWebReferralIncomingTraffic",
    },
    widgets: {
        single: {
            defaultType: "TopReferralsDashboardTable",
            TopReferralsDashboardTable: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        dashboardSubtitleClass: "dashboard-table-widget",
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
                        width: "",
                    },
                    {
                        name: "Share",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        progressBarTooltip: "Visits",
                        width: "115px",
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
                        width: "",
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
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
        compare: {
            defaultType: "TopReferralsDashboardTable",
            TopReferralsDashboardTable: {
                properties: {
                    showMoreButtonItems: 5,
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
                        width: "",
                    },
                    {
                        name: "Share",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: "False",
                        progressBarTooltip: "Visits",
                        tooltip: "",
                        width: "115px",
                    },
                    {
                        name: "ShareList",
                        title: "Group Traffic Share",
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
                        width: "",
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
                    ],
                },
            },
        },
    },
};

export const TopReferralsSI = {
    ...TopReferrals,
    properties: {
        ...TopReferrals.properties,
        state: "accountreview_website",
        titleState: "accountreview_website_referrals_incomingtraffic",
    },
};

export const TopReferringCategories = {
    id: "TopReferringCategories",
    properties: {
        hasWebSource: false,
        title: "wa.wwo.topreferringcategories.title",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        dashboard: "true",
        noCompare: true,
        state: "websites-trafficReferrals",
        apiController: "WebsiteOverviewDesktop",
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        availabilityComponent: "WsWebReferralIncomingTraffic",
    },
    widgets: {
        single: {
            WWOTopRefCategories: {
                properties: {
                    showMoreButton: false,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        dashboardSubtitleClass: "dashboard-table-widget",
                    },
                },
                columns: [
                    {
                        name: "Category",
                        title: "Category",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "referring-category-dashboard-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            overrideFormat: "Category",
                        },
                    },
                    {
                        name: "Share",
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
                        width: "",
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

export const TopSearchChannels = {
    id: "TopSearchChannels",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        order: "1",
    },
    widgets: {
        single: {
            Table: {
                properties: {},
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
            },
        },
        compare: {},
    },
};

export const TopSearchChannelsAbb = {
    id: "TopSearchChannelsAbb",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        order: "1",
        modules: {
            Industry: {
                dashboard: "true",
                family: "Industry",
                state: "industryAnalysis-topKeywords",
                title: "ia.topkeywords.searchchannel",
                apiController: "IndustryAnalysisTopKeywords",
                component: "IndustryAnalysisOverview",
                availabilityComponent: "WsTopKeywords",
            },
        },
    },
    widgets: {
        single: {
            Table: {
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
            },
        },
        compare: {},
    },
};

export const TopSearchSources = {
    id: "TopSearchSources",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        order: "1",
    },
    widgets: {
        single: {
            Table: {
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
            },
        },
        compare: {},
    },
};

export const TopSearchSourcesAbb = {
    id: "TopSearchSourcesAbb",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        order: "1",
        modules: {
            Industry: {
                dashboard: "true",
                family: "Industry",
                state: "industryAnalysis-topKeywords",
                title: "ia.topkeywords.sourcechannel",
                apiController: "IndustryAnalysisTopKeywords",
                component: "IndustryAnalysisOverview",
                availabilityComponent: "WsTopKeywords",
            },
        },
    },
    widgets: {
        single: {
            Table: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
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
            },
        },
        compare: {},
    },
};

export const TopSites = {
    id: "TopSites",
    properties: {
        component: "IndustryAnalysis",
        title: "metric.TopSites.title",
        family: "Website",
        order: "1",
        keyPrefix: "$",
        state: "websites-worldwideOverview",
        apiController: "TopSitesNew",
    },
    widgets: {
        single: {
            Table: {
                properties: {},
                columns: [
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 65,
                        disableHeaderCellHover: true,
                    },
                    {
                        fixed: true,
                        name: "Domain",
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
                        tooltip: true,
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
                        tooltip: true,
                        minWidth: 150,
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
                        tooltip: true,
                        width: 110,
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
        compare: {},
    },
};

export const TopSitesExtended = {
    id: "TopSitesExtended",
    properties: {
        component: "IATopWebsites",
        title: "ia.overview.topsites",
        family: "Industry",
        order: "1",
        keyPrefix: "$",
        state: "websites-worldwideOverview",
        hasWebSource: true,
        dashboard: "true",
        disableDatepicker: true,
        defaultDuration: "1m",
        apiController: "TopSitesExtended",
        titleState: "industryAnalysis-topSites",
        availabilityComponent: "WsWebCategoryTopSites",
    },
    widgets: {
        single: {
            defaultType: "TopSitesTable",
            TopSitesTable: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showFrame: true,
                        showLegend: false,
                        showOverflow: true,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                columns: [
                    {
                        name: "Domain",
                        title: "Domain",
                        type: "string",
                        fixed: true,
                        format: "None",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "website-tooltip-top-no-expand-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "widget.table.tooltip.topsites.domain",
                        width: 185,
                    },
                    {
                        name: "Share",
                        title: "Traffic Share",
                        type: "string",
                        format: "percentagesign",
                        sortable: "False",
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
                        minWidth: 85,
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
                        name: "UniqueUsers",
                        title: "Unique Visitors",
                        type: "double",
                        format: "minVisitsAbbr",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "metric.uniquevisitors.tab.tooltip",
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
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "wa.ao.desktopvsmobile.tooltip",
                        minWidth: 190,
                        webSources: ["Total"],
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
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
                ],
            },
        },
        compare: {},
    },
};

export const CategoryShareIndex = {
    id: "CategoryShareIndex",
    properties: {
        component: "IndustryAnalysis",
        title: "metric.CategoryShare.title",
        family: "Website",
        order: "1",
        keyPrefix: "$",
        state: "websites-worldwideOverview",
    },
    widgets: {
        single: {
            Table: {
                properties: {},
                columns: [
                    {
                        fixed: true,
                        name: "row-selection",
                        cellTemp: "row-selection",
                        sortable: false,
                        width: 33,
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
                        minWidth: 85,
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
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "wa.ao.desktopvsmobile.tooltip",
                        minWidth: 190,
                        webSources: ["Total"],
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
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
            },
        },
        compare: {},
    },
};

export const TopCategoryShare = {
    id: "TopCategoryShare",
    properties: {
        component: "CategoryShare",
        title: "metric.CategoryShare.title",
        family: "Industry",
        order: "1",
        keyPrefix: "$",
        dashboard: "true",
        apiController: "CategoryShare",
        state: "industryAnalysis-categoryShare",
        hasWebSource: true,
        availabilityComponent: "WsWebCategoryShare",
    },
    widgets: {
        single: {
            CategoryShareGraphDashboard: {
                properties: {
                    showMoreButton: true,
                    hideMarkersOnDaily: true,
                    stacked: "true",
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "Share",
                    type: "double",
                    format: "percentagesign",
                    formatParameter: 0,
                    name: "Share",
                    reversed: "False",
                },
                filters: {
                    timeGranularity: [
                        {
                            value: "Daily",
                            title: "Daily",
                        },
                        {
                            value: "Weekly",
                            title: "Weekly",
                        },
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                    ],
                },
            },
        },
        compare: {},
    },
};

export const CategoryShare = {
    id: "CategoryShare",
    properties: {
        component: "IndustryAnalysis",
        title: "metric.CategoryShare.title",
        family: "Industry",
        order: "1",
        keyPrefix: "$",
        apiController: "CategoryShare",
        state: "websites-worldwideOverview",
        hasWebSource: true,
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    showMoreButton: true,
                    hideMarkersOnDaily: true,
                    stacked: "true",
                    options: {
                        canAddToDashboard: true,
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
                    title: "Share",
                    type: "double",
                    format: "percentagesign",
                    formatParameter: 0,
                    name: "Share",
                    reversed: "False",
                },
                filters: {
                    timeGranularity: [
                        {
                            value: "Daily",
                            title: "Daily",
                        },
                        {
                            value: "Weekly",
                            title: "Weekly",
                        },
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                    ],
                },
            },
        },
        compare: {},
    },
};

export const TopIncomingAds = {
    id: "TopIncomingAds",
    properties: {
        dashboard: "false",
        hasWebSource: true,
        title: "wa.wwo.displayadnetwork.title",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        state: "websites-worldwideOverview",
    },
    widgets: {
        single: {
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
                        groupable: "True",
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: 220,
                    },
                    {
                        name: "Share",
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
        compare: {
            Table: {
                properties: {},
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
                        cellTemp: "website-tooltip-top-cell",
                        totalCount: false,
                        width: 220,
                    },
                    {
                        name: "TotalShare",
                        title: "Total Group Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        totalCount: false,
                        minWidth: 150,
                    },
                    {
                        name: "SiteOrigins",
                        title: "Total Group Traffic Share Split",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "group-traffic-share",
                        totalCount: false,
                        minWidth: 250,
                        ppt: {
                            // Indicates that we want to split this column into sub-columns
                            // where each sub-column will be a table entity (table item - a website/app/category.
                            // such as ynet.co.il, whatsapp, all industries etc.)
                            splitColumnToEntities: true,

                            // override the table column format when rendered in ppt
                            overrideFormat: "smallNumbersPercentage:1",

                            // Override default value when no value is present in a table roe
                            defaultValue: "0%",
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

export const TopIncomingAdsSI = {
    ...TopIncomingAds,
    properties: {
        ...TopIncomingAds.properties,
        state: "accountreview_website_overview_websiteperformance",
    },
};

export const TopAdNetworks = {
    id: "TopAdNetworks",
    properties: {
        dashboard: "false",
        hasWebSource: true,
        title: "wa.wwo.displayadnetwork.title",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        state: "websites-worldwideOverview",
    },
    widgets: {
        single: {
            WWOTopAdNetwork: {
                properties: {
                    // hasWebSource: false
                },
                objects: {},
            },
        },
        compare: {
            WWOTopAdNetworksTable: {
                properties: {},
                columns: [
                    {
                        name: "Domain",
                        title: "Ad Network",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        totalCount: false,
                        width: 220,
                    },
                    {
                        name: "TotalShare",
                        title: "Total Group Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        totalCount: false,
                        minWidth: 150,
                    },
                    {
                        name: "SiteOrigins",
                        title: "Total Group Traffic Share Split",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "group-traffic-share",
                        totalCount: false,
                        minWidth: 250,
                        ppt: {
                            // Indicates that we want to split this column into sub-columns
                            // where each sub-column will be a table entity (table item - a website/app/category.
                            // such as ynet.co.il, whatsapp, all industries etc.)
                            splitColumnToEntities: true,

                            // override the table column format when rendered in ppt
                            overrideFormat: "smallNumbersPercentage:1",

                            // Override default value when no value is present in a table roe
                            defaultValue: "0%",
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

export const TopOrganicKeywords = {
    id: "TopOrganicKeywords",
    properties: {
        dashboard: "true",
        component: "TrafficSourceSearchKeyword",
        hasWebSource: true,
        mobileWebComponent: "TrafficSourceSearchKeywordMobileWeb",
        title: "dashboard.metrics.titles.top.organic.keywords",
        family: "Website",
        order: "1",
        state: "keywordAnalysis-organic",
        titleState: "websites-trafficSearch",
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        apiController: (keys, { webSource, duration }) => {
            const durationData = DurationService.getDurationData(duration);
            // SIM-28142 : different endpoint for mobile web
            if (webSource === "MobileWeb") {
                return "MobileSearchKeywords";
            } else if (durationData.raw.isDaily) {
                return "SearchWeeklyKeywords";
            }
            return "SearchKeywords";
        },
        apiParams: {
            metric: "NewSearchKeywords",
        },
        webSource: "Desktop",
        availabilityComponent: "WsWebSearchKeywords",
    },
    widgets: {
        single: {
            defaultType: "WebsiteKeywordsDashboardTable",
            WebsiteKeywordsDashboardTable: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        dashboardSubtitleClass: "dashboard-table-widget",
                    },
                },
                columns: [
                    {
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        width: 220,
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: false,
                        minWidth: 150,
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: true,
                        width: 85,
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
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
                    IncludeOrganic: [
                        {
                            value: "true",
                            title: "Non branded",
                        },
                    ],
                },
            },
        },
        compare: {
            defaultType: "WebsiteKeywordsDashboardTable",
            WebsiteKeywordsDashboardTable: {
                properties: {
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        width: 220,
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
                        cellTemp: "dfault-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: false,
                        width: "115px",
                    },
                    {
                        name: "SiteOrigins",
                        title: "Group Share Split",
                        type: "string",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "group-traffic-share-dashboard",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        minWidth: 250,
                        ppt: {
                            // Indicates that we want to split this column into sub-columns
                            // where each sub-column will be a table entity (table item - a website/app/category.
                            // such as ynet.co.il, whatsapp, all industries etc.)
                            splitColumnToEntities: true,

                            // override the table column format when rendered in ppt
                            overrideFormat: "smallNumbersPercentage:1",

                            // Override default value when no value is present in a table roe
                            defaultValue: "0%",
                        },
                    },
                    // {
                    //     name: "Organic",
                    //     title: "Organic vs. Paid",
                    //     type: "double",
                    //     format: "percentagesign",
                    //     sortable: false,
                    //     isSorted: "False",
                    //     sortDirection: "desc",
                    //     groupable: "False",
                    //     cellTemp: "organic-paid",
                    //     headTemp: "",
                    //     totalCount: "False",
                    //     tooltip: false,
                    //     minWidth: 150
                    // },
                    {
                        name: "KwVolume",
                        title: "Volume",
                        type: "double",
                        format: "swPosition",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: false,
                        width: 85,
                    },
                    {
                        name: "CPC",
                        title: "CPC",
                        type: "double",
                        format: "CPC",
                        sortable: false,
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: false,
                        width: 85,
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "TotalShare desc",
                            title: "Traffic Share",
                        },
                    ],
                    IncludeOrganic: [
                        {
                            value: "true",
                            title: "Non branded",
                        },
                    ],
                },
            },
        },
    },
};

export const TopPaidKeywords = {
    id: "TopPaidKeywords",
    properties: {
        dashboard: "true",
        component: "TrafficSourceSearchKeyword",
        hasWebSource: true,
        mobileWebComponent: "TrafficSourceSearchKeywordMobileWeb",
        title: "dashboard.metrics.titles.top.paid.keywords",
        family: "Website",
        order: "1",
        state: "keywordAnalysis-paid",
        titleState: "websites-trafficSearch",
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        apiController: (keys, { webSource, duration }) => {
            const durationData = DurationService.getDurationData(duration);
            // SIM-28142 : different endpoint for mobile web
            if (webSource === "MobileWeb") {
                return "MobileSearchKeywords";
            } else if (durationData.raw.isDaily) {
                return "SearchWeeklyKeywords";
            }
            return "SearchKeywords";
        },
        apiParams: {
            metric: "NewSearchKeywords",
        },
        webSource: "Desktop",
        availabilityComponent: "WsWebSearchKeywords",
    },
    widgets: {
        single: {
            defaultType: "WebsiteKeywordsDashboardTable",
            WebsiteKeywordsDashboardTable: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        dashboardSubtitleClass: "dashboard-table-widget",
                    },
                },
                columns: [
                    {
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        width: 220,
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        minWidth: 150,
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: true,
                        width: 85,
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
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
                    IncludePaid: [
                        {
                            value: "true",
                            title: "Non branded",
                        },
                    ],
                },
            },
        },
        compare: {
            defaultType: "WebsiteKeywordsDashboardTable",
            WebsiteKeywordsDashboardTable: {
                properties: {
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        width: 220,
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
                        cellTemp: "dfault-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: false,
                        width: "115px",
                    },
                    {
                        name: "SiteOrigins",
                        title: "Group Share Split",
                        type: "string",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "group-traffic-share-dashboard",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        minWidth: 250,
                        ppt: {
                            // Indicates that we want to split this column into sub-columns
                            // where each sub-column will be a table entity (table item - a website/app/category.
                            // such as ynet.co.il, whatsapp, all industries etc.)
                            splitColumnToEntities: true,

                            // override the table column format when rendered in ppt
                            overrideFormat: "smallNumbersPercentage:1",

                            // Override default value when no value is present in a table roe
                            defaultValue: "0%",
                        },
                    },
                    // {
                    //     name: "Organic",
                    //     title: "Organic vs. Paid",
                    //     type: "double",
                    //     format: "percentagesign",
                    //     sortable: false,
                    //     isSorted: "False",
                    //     sortDirection: "desc",
                    //     groupable: "False",
                    //     cellTemp: "organic-paid",
                    //     headTemp: "",
                    //     totalCount: "False",
                    //     tooltip: false,
                    //     minWidth: 150
                    // },
                    {
                        name: "KwVolume",
                        title: "Volume",
                        type: "double",
                        format: "swPosition",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: false,
                        width: 85,
                    },
                    {
                        name: "CPC",
                        title: "CPC",
                        type: "double",
                        format: "CPC",
                        sortable: false,
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: false,
                        width: 85,
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "TotalShare desc",
                            title: "Traffic Share",
                        },
                    ],
                    IncludePaid: [
                        {
                            value: "true",
                            title: "Non branded",
                        },
                    ],
                },
            },
        },
    },
};

////////////////////////////// Industry Top Keyword Metrics //////////////////////////

// Top Organic vs Paid (Pie chart only)
export const SearchKeywordsAbb = {
    id: "SearchKeywordsAbb",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        noCompare: true,
        order: "1",
        modules: {
            Industry: {
                dashboard: "true",
                family: "Industry",
                state: "keywordAnalysis-organic",
                title: "ia.topkeywords.organicpaid",
                apiController: "IndustryAnalysisTopKeywords",
                component: "IndustryAnalysisTopKeywords",
                availabilityComponent: "WsTopKeywords",
            },
        },
    },
    widgets: {
        single: {
            defaultType: "PieChart",
            PieChart: {
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
            },
        },
    },
};

// Top Organic & Paid
export const SearchKeywordsAbbAll = {
    id: "SearchKeywordsAbbAll",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        noCompare: true,
        order: "1",
        modules: {
            Industry: {
                dashboard: "true",
                family: "Industry",
                state: "industryAnalysis-topKeywords",
                title: "ia.topkeywords.organicpaid.all",
                apiController: "IndustryAnalysisTopKeywords",
                component: "IndustryAnalysisTopKeywords",
                availabilityComponent: "WsTopKeywords",
            },
        },
        apiParams: {
            metric: "SearchKeywordsAbb",
        },
    },
    widgets: {
        single: {
            defaultType: "IndustryKeywordsDashboardTable",
            IndustryKeywordsDashboardTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        fixed: true,
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.searchterm",
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: false,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellComponent: TrafficShareWithVisits,
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.totalshare",
                        width: "145px",
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "double",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.change",
                        width: "145px",
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                    {
                        name: "Cpc",
                        title: "Cpc",
                        type: "string",
                        format: "CPC",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        width: "70px",
                    },
                    {
                        name: "Volume",
                        title: "Volume",
                        type: "string",
                        format: "abbrNumber",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        width: "100px",
                    },
                ],
                filters: {},
            },
        },
    },
};

// Top Organic & Paid
export const SearchTrends = {
    id: "SearchTrends",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        noCompare: true,
        order: "1",
        modules: {
            Industry: {
                dashboard: "true",
                family: "Industry",
                state: "industryAnalysis-topKeywords",
                title: "ia.topkeywords.searchtrends",
                apiController: "IndustryAnalysisTopKeywords",
                component: "IndustryAnalysisTopKeywords",
                availabilityComponent: "WsTopKeywords",
            },
        },
        apiParams: {
            metric: "SearchKeywordsAbb",
        },
    },
    widgets: {
        single: {
            defaultType: "IndustryKeywordsDashboardTable",
            IndustryKeywordsDashboardTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        fixed: true,
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.searchterm",
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: false,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellComponent: TrafficShareWithVisits,
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.totalshare",
                        width: "145px",
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "double",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.change",
                        width: "145px",
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                    {
                        name: "Volume",
                        title: "Volume",
                        type: "string",
                        format: "abbrNumber",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        width: "100px",
                    },
                ],
                filters: {},
            },
        },
    },
};

// Top Organic & Paid (non-branded) {backward compatibility only}
export const SearchKeywordsAbbExcludeBranded = {
    id: "SearchKeywordsAbbExcludeBranded",
    properties: {
        component: "IndustryAnalysisTopKeywords",
        group: "WebsiteAudienceOverview",
        family: "Industry",
        order: "1",
        state: "industryAnalysis-topKeywords",
        title: "ia.topkeyword.organicpaid.exclude.branded",
        apiController: "IndustryAnalysisTopKeywords",
    },
    widgets: {
        single: {
            defaultType: "IndustryKeywordsDashboardTable",
            IndustryKeywordsDashboardTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        fixed: true,
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.searchterm",
                        width: 230,
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.totalshare",
                        minWidth: 150,
                    },
                    {
                        name: "Change",
                        title: "Change",
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
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                ],
                filters: {},
            },
        },
    },
};

// Top organic
export const TopKeywordsOrganic = {
    id: "TopKeywordsOrganic",
    properties: {
        component: "IndustryAnalysisTopKeywords",
        group: "WebsiteAudienceOverview",
        family: "Industry",
        order: "1",
        state: "industryAnalysis-topKeywords",
        title: "ia.topkeyword.organic",
        apiController: "IndustryAnalysisTopKeywords",
        dashboard: "true",
        apiParams: {
            metric: "SearchKeywordsAbb",
            filter: "OP;==;0",
        },
        availabilityComponent: "WsTopKeywords",
    },
    widgets: {
        single: {
            defaultType: "IndustryKeywordsDashboardTable",
            IndustryKeywordsDashboardTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        desktopOnly: true,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        fixed: true,
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.searchterm",
                        width: 230,
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellComponent: TrafficShareWithVisits,
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.totalshare",
                        minWidth: 150,
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "double",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.change",
                        width: 110,
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                    {
                        name: "Cpc",
                        title: "Cpc",
                        type: "string",
                        format: "CPC",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        width: "70px",
                    },
                    {
                        name: "Volume",
                        title: "Volume",
                        type: "string",
                        format: "abbrNumber",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        width: "100px",
                    },
                ],
                filters: {},
            },
        },
    },
};

// Top organic (non-branded) {backward compatibility only}
export const TopKeywordsOrganicExcludeBranded = {
    id: "TopKeywordsOrganicExcludeBranded",
    properties: {
        component: "IndustryAnalysisTopKeywords",
        group: "WebsiteAudienceOverview",
        family: "Industry",
        order: "1",
        state: "industryAnalysis-topKeywords",
        title: "ia.topkeyword.organic.exclude.branded",
        apiController: "IndustryAnalysisTopKeywords",
    },
    widgets: {
        single: {
            defaultType: "IndustryKeywordsDashboardTable",
            IndustryKeywordsDashboardTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        fixed: true,
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.searchterm",
                        width: 230,
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.totalshare",
                        minWidth: 150,
                    },
                    {
                        name: "Change",
                        title: "Change",
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
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                ],
                filters: {},
            },
        },
    },
};

// Top paid
export const TopKeywordsPaid = {
    id: "TopKeywordsPaid",
    properties: {
        component: "IndustryAnalysisTopKeywords",
        group: "WebsiteAudienceOverview",
        family: "Industry",
        order: "1",
        state: "industryAnalysis-topKeywords",
        title: "ia.topkeyword.paid",
        apiController: "IndustryAnalysisTopKeywords",
        dashboard: "true",
        apiParams: {
            metric: "SearchKeywordsAbb",
            filter: "OP;==;1",
        },
        availabilityComponent: "WsTopKeywords",
    },
    widgets: {
        single: {
            defaultType: "IndustryKeywordsDashboardTable",
            IndustryKeywordsDashboardTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        desktopOnly: true,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        fixed: true,
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.searchterm",
                        width: 230,
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellComponent: TrafficShareWithVisits,
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.totalshare",
                        minWidth: 150,
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "double",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.change",
                        width: 110,
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                    {
                        name: "Cpc",
                        title: "Cpc",
                        type: "string",
                        format: "CPC",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        width: "70px",
                    },
                    {
                        name: "Volume",
                        title: "Volume",
                        type: "string",
                        format: "abbrNumber",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        width: "100px",
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

// Top paid (non-branded) {backward compatibility only}
export const TopKeywordsPaidExcludeBranded = {
    id: "TopKeywordsPaidExcludeBranded",
    properties: {
        component: "IndustryAnalysisTopKeywords",
        group: "WebsiteAudienceOverview",
        family: "Industry",
        order: "1",
        state: "industryAnalysis-topKeywords",
        title: "ia.topkeyword.paid.exclude.branded",
        apiController: "IndustryAnalysisTopKeywords",
    },
    widgets: {
        single: {
            defaultType: "IndustryKeywordsDashboardTable",
            IndustryKeywordsDashboardTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        fixed: true,
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword-dashboard",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.searchterm",
                        width: 230,
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "widget.table.tooltip.searchkeywordsabb.totalshare",
                        minWidth: 150,
                    },
                    {
                        name: "Change",
                        title: "Change",
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
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                ],
                filters: {},
            },
        },
    },
};
