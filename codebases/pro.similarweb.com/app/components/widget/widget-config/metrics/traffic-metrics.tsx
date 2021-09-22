import * as React from "react";
import DurationService from "services/DurationService";
import { RankCell } from "../../../React/Table/cells";
import { DefaultCellRightAlign } from "../../../React/Table/cells/DefaultCellRightAlign";
import { DefaultCellHeaderRightAlign } from "../../../React/Table/headerCells/DefaultCellHeaderRightAlign";
import { TwoColumnsHeaderCell } from "../../../React/Table/headerCells/TwoColumnsHeaderCell";

const topSearchTermCompareCommonConfig = {
    defaultType: "Table",
    Table: {
        properties: {
            width: 3,
            showMoreButtonItems: 5,
            options: {
                desktopOnly: true,
                dashboardSubtitleMarginBottom: 15,
            },
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
                cellTemp: "default-cell",
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
        },
    },
};

export const Geography = {
    id: "Geography",
    properties: {
        component: "Geography",
        apiController: "WebsiteGeography",
        title: "metric.Geography.title",
        family: "Website",
        order: "1",
        keyPrefix: "$",
        async: true,
        dashboard: "true",
        hideCountriesHook: true,
        state: "websites-audienceGeography",
        hasWebSource: false,
        availabilityComponent: "WsWebGeography",
        modules: {
            Industry: {
                dashboard: "true",
                family: "Industry",
                state: "industryAnalysis-overview",
                apiController: "IndustryAnalysisGeography",
                component: "IndustryAnalysisOverview",
                availabilityComponent: "WsWebCategoryGeo",
            },
        },
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
                        name: "Country",
                        title: "analysis.audience.geo.table.columns.country.title",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "country-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        width: "230px",
                        ppt: {
                            // override the table column format when rendered in ppt
                            overrideFormat: "Country",
                        },
                    },
                    {
                        name: "Share",
                        title: "analysis.audience.geo.table.columns.share.title",
                        type: "string",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        isLink: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        minWidth: "150px",
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
        compare: {
            Table: {
                properties: {
                    options: {
                        desktopOnly: true,
                        tableCompareLegend: false,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        name: "Country",
                        title: "analysis.audience.geo.table.columns.country.title",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "country-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        width: "230px",
                        ppt: {
                            // override the table column format when rendered in ppt
                            overrideFormat: "Country",
                        },
                    },
                    {
                        name: "Share",
                        title: "analysis.audience.geo.table.columns.share.title",
                        type: "string",
                        format: "smallNumbersPercentage:2",
                        sortable: false,
                        isSorted: false,
                        isLink: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        minWidth: "115px",
                    },
                    {
                        name: "ShareList",
                        title: "analysis.source.search.all.table.columns.shareCompare.title",
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

export const GeographyExtended = {
    id: "GeographyExtended",
    properties: {
        component: "GeographyExtended",
        title: "metric.Geography.title",
        family: "Website",
        order: "1",
        keyPrefix: "$",
        async: true,
        hideCountriesHook: true,
        state: "websites-audienceGeography",
    },
    widgets: {
        single: {
            Table: {
                properties: {
                    options: {
                        desktopOnly: true,
                        showLegend: false,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 40,
                        disableHeaderCellHover: true,
                    },
                    {
                        fixed: true,
                        name: "Country",
                        title: "analysis.audience.geo.table.columns.country.title",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "country-cell",
                        headTemp: "",
                        totalCount: true,
                        tooltip: "analysis.audience.geo.table.columns.country.title.tooltip",
                        width: "198px",
                        ppt: {
                            // override the table column format when rendered in ppt
                            overrideFormat: "Country",
                        },
                    },
                    {
                        name: "Share",
                        title: "analysis.audience.geo.table.columns.share.title",
                        type: "string",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: true,
                        isLink: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "analysis.audience.geo.table.columns.share.title.tooltip",
                        isResizable: true,
                        minWidth: 116,
                    },
                    {
                        name: "Change",
                        title: "analysis.audience.geo.table.columns.change.title",
                        type: "double",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: "widget.table.tooltip.topsites.change",
                        isResizable: true,
                        minWidth: 108,
                    },
                    {
                        name: "Rank",
                        title: "wa.ao.ranks.country",
                        type: "long",
                        format: "swRank",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "asc",
                        groupable: false,
                        cellTemp: "rank-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: "widget.table.tooltip.topsites.rank",
                        isResizable: true,
                        minWidth: 108,
                        inverted: true,
                    },
                    {
                        name: "AvgVisitDuration",
                        title: "analysis.audience.geo.table.columns.AvgTime.title",
                        type: "double",
                        format: "number",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "time-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: "widget.table.tooltip.topsites.avgvisitduration",
                        isResizable: true,
                        minWidth: 108,
                    },
                    {
                        name: "PagePerVisit",
                        title: "analysis.audience.geo.table.columns.PPV.title",
                        type: "double",
                        format: "number",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "pages-per-visit",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: "widget.table.tooltip.topsites.ppv",
                        isResizable: true,
                        minWidth: 108,
                    },
                    {
                        name: "BounceRate",
                        title: "analysis.audience.geo.table.columns.BounceRate.title",
                        type: "double",
                        format: "number",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "asc",
                        groupable: false,
                        cellTemp: "bounce-rate",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: "widget.table.tooltip.topsites.bouncerate",
                        minWidth: 108,
                        inverted: true,
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
        compare: {
            Table: {
                properties: {
                    options: {
                        desktopOnly: true,
                        tableCompareLegend: false,
                    },
                    showMoreButtonItems: 5,
                },
                columns: [
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 65,
                        disableHeaderCellHover: true,
                    },
                    {
                        name: "Country",
                        title: "analysis.audience.geo.table.columns.country.title",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "country-cell",
                        headTemp: "",
                        totalCount: true,
                        tooltip: "analysis.audience.geo.table.columns.country.title.tooltip",
                        width: "",
                        ppt: {
                            // override the table column format when rendered in ppt
                            overrideFormat: "Country",
                        },
                    },
                    {
                        name: "Share",
                        title: "analysis.source.search.all.table.columns.totalShareCompare.title",
                        type: "string",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: true,
                        isLink: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "analysis.audience.geo.table.columns.share.title.tooltip",
                        width: "",
                    },
                    {
                        name: "ShareList",
                        title: "analysis.source.search.all.table.columns.shareCompare.title",
                        type: "double[]",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "group-traffic-share",
                        headTemp: "",
                        totalCount: false,
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

export const SearchKeywords = {
    id: "SearchKeywords",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        order: "1",
        state: "keywordAnalysis-organic",
    },
    widgets: {
        single: {
            PieChart: {
                properties: {},
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
                        name: "SearchTerm",
                        title: "Search Term",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: true,
                        isLink: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "cell-keyword",
                        headTemp: "",
                        totalCount: true,
                        tooltip: true,
                        width: 230,
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: true,
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
                        tooltip: true,
                        width: 110,
                    },
                ],
                filters: {},
            },
        },
        compare: {},
    },
};

export const SearchVisitsOverview = {
    id: "SearchVisitsOverview",
    properties: {
        hasWebSource: true,
        component: "TrafficSourcesSearch",
        mobileWebComponent: "MobileWebSearch",
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        title: "dashboard.metrics.titles.search.total.visits",
        group: "WebsiteAudienceOverview",
        family: "Website",
        dashboard: "true",
        order: "1",
        state: "websites-trafficSearch",
        apiController: "TrafficSourcesSearch",
        webSource: "Desktop",
        availabilityComponent: "WsWebSearchOverview",
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
                        name: "SearchTotal",
                        title: "Total Visits",
                        type: "double",
                        format: "abbrNumberVisits",
                        headTemp: "none",
                        cellTemp: "large-single-number",
                    },
                },
            },
        },
        compare: {
            Table: {
                properties: {
                    options: {
                        showLegend: false,
                        preserveLegendSpace: true,
                    },
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
                        columnClass: "column-pad-left",
                        groupable: true,
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "SearchTotal",
                        title: "Total Visits",
                        type: "double",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: true,
                        cellTemp: "number-comma-cell",
                        headerCellClass: "header-cell-right-align",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                        ppt: {
                            overrideFormat: "abbrNumber",
                        },
                    },
                ],
                filters: {},
            },
        },
    },
};

export const SearchOrganicPaidOverview = {
    id: "SearchOrganicPaidOverview",
    properties: {
        component: "TrafficSourcesSearch",
        title: "dashboard.metrics.titles.search.organic.vs.paid",
        group: "WebsiteAudienceOverview",
        family: "Website",
        dashboard: "true",
        order: "1",
        state: "websites-trafficSearch",
        apiController: "TrafficSourcesSearch",
        webSource: "Desktop",
        availabilityComponent: "WsWebSearchOverview",
    },
    widgets: {
        single: {
            PieChart: {
                properties: {
                    hasWebSource: false,
                    options: {
                        twoColorMode: true,
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                objects: {
                    Desktop: {
                        name: "Organic",
                        title: "Organic",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    MobileWeb: {
                        name: "Paid",
                        title: "Paid",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
        },
        compare: {
            Table: {
                properties: {
                    options: {
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
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: true,
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "OrganicPaidVisits",
                        type: "double[]",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "percentage-bar-cell-rounded",
                        headerComponent: (props) => {
                            props = {
                                ...props,
                                leftCol: "titleTag.organic.analysis",
                                rightCol: "KeywordAnalysis.nav.paid.title2",
                            };
                            return <TwoColumnsHeaderCell {...props} />;
                        },
                        headerCellClass: "u-no-pointer-events",
                        totalCount: false,
                        tooltip: "",
                        minWidth: 170,
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                            overrideName: "Organic Vs. Paid",
                        },
                    },
                ],
                filters: {},
            },
        },
    },
};

export const SearchDeviceShareOverview = {
    id: "SearchDeviceShareOverview",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        order: "1",
        state: "websites-trafficSearch",
        apiController: "TrafficSourcesSearch",
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
                        share: "Total",
                        title: "Total Visits",
                        type: "int?",
                        format: "percentagesign:2",
                        cellTemp: "large-number",
                    },
                    Desktop: {
                        name: "Desktop",
                        share: "Desktop",
                        title: "Total Visits",
                        type: "int?",
                        format: "percentagesign:2",
                        cellTemp: "large-number",
                    },
                    MobileWeb: {
                        name: "MobileWeb",
                        share: "MobileWeb",
                        title: "Total Visits",
                        type: "int?",
                        format: "percentagesign:2",
                        cellTemp: "large-number",
                    },
                },
            },
        },
        compare: {
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
                        share: "Total",
                        title: "Total Visits",
                        type: "int?",
                        format: "percentagesign:2",
                        cellTemp: "large-number",
                    },
                    Desktop: {
                        name: "Desktop",
                        share: "Desktop",
                        title: "Total Visits",
                        type: "int?",
                        format: "percentagesign:2",
                        cellTemp: "large-number",
                    },
                    MobileWeb: {
                        name: "MobileWeb",
                        share: "MobileWeb",
                        title: "Total Visits",
                        type: "int?",
                        format: "percentagesign:2",
                        cellTemp: "large-number",
                    },
                },
            },
            Table: {
                properties: { width: "4" },
                columns: [
                    {
                        name: "Domain",
                        title: "Domain",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: true,
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "OrganicPaidVisits",
                        type: "double[]",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "percentage-bar-cell-rounded",
                        headerComponent: (props) => {
                            props = {
                                ...props,
                                leftCol: "titleTag.organic.analysis",
                                rightCol: "KeywordAnalysis.nav.paid.title2",
                            };
                            return <TwoColumnsHeaderCell {...props} />;
                        },
                        totalCount: false,
                        tooltip: "",
                        width: "",
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

export const SearchBrandedKeywords = {
    id: "SearchBrandedKeywords",
    properties: {
        hasWebSource: true,
        component: "TrafficSourcesSearch",
        mobileWebComponent: "MobileWebSearch",
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        title: "dashboard.metrics.titles.search.branded.traffic",
        group: "WebsiteAudienceOverview",
        family: "Website",
        dashboard: "true",
        order: "1",
        state: "websites-trafficSearch",
        apiController: "TrafficSourcesSearch",
        webSource: "Desktop",
        availabilityComponent: "WsWebSearchOverview",
    },
    widgets: {
        single: {
            PieChart: {
                properties: {
                    options: {
                        twoColorMode: true,
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                objects: {
                    Branded: {
                        name: "Branded",
                        title: "Branded",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    NoneBranded: {
                        name: "NoneBranded",
                        title: "Non-Branded",
                        displayName: "Non-Branded",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
        },
        compare: {
            Table: {
                properties: {
                    options: {
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
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: true,
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "BrandedNotBranded",
                        type: "double[]",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "percentage-bar-cell-rounded",
                        headerComponent: (props) => {
                            props = {
                                ...props,
                                leftCol: "analysis.source.search.keywords.filters.branded",
                                rightCol: "analysis.source.search.keywords.filters.nonbranded",
                            };
                            return <TwoColumnsHeaderCell {...props} />;
                        },
                        totalCount: false,
                        tooltip: "",
                        minWidth: 170,
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                            overrideName: "Branded Vs. Non-Branded",
                        },
                    },
                ],
                filters: {},
            },
        },
    },
};

export const SearchPageCompareEngagements = {
    id: "SearchPageCompareEngagements",
    properties: {
        component: "WebAnalysis",
        title: "metric.TopSearchKeywordsExcludedBranded.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        order: "1",
        state: "websites-trafficSearch",
    },
    widgets: {
        compare: {
            Table: {
                properties: {
                    options: {
                        showLegend: false,
                        preserveLegendSpace: true,
                    },
                    apiParams: {
                        includeLeaders: true,
                    },
                },
                columns: [
                    {
                        name: "Domain",
                        title: "wa.ao.engagement.domain",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: true,
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "AvgMonthVisits",
                        title: {
                            snapshot: "wa.ao.graph.avgvisits",
                            window: "wa.ao.graph.avgvisitsdaily",
                        },
                        type: "double",
                        format: "minVisitsAbbr",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIcon: "widget-tab-visits",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "AvgVisitDuration",
                        title: "wa.ao.graph.avgduration",
                        type: "double",
                        format: "time",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIcon: "widget-tab-duration",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "PagesPerVisit",
                        title: "wa.ao.engagement.pagesvisit",
                        type: "double",
                        format: "number:2",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIconName: "pages-per-visit",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "BounceRate",
                        title: "wa.ao.graph.bounce",
                        type: "double",
                        format: "percentagesign:2",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "asc",
                        groupable: false,
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIconName: "bounce-rate-2",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                ],
                filters: {},
            },
        },
    },
};

export const SearchTrafficByEngines = {
    id: "SearchTrafficByEngines",
    properties: {
        component: "TrafficSourcesSearch",
        title: "dashboard.metrics.titles.search.traffic.by.engine",
        group: "WebsiteAudienceOverview",
        family: "Website",
        dashboard: "true",
        order: "1",
        state: "websites-trafficSearch",
        apiController: "TrafficSourcesSearch",
        availabilityComponent: "WsWebSearchOverview",
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
                        name: "Name",
                        title: "Domain",
                        type: "string",
                        format: "CapitalizeFirstLetter",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        cellTemp: "item-image-cell",
                    },
                    {
                        name: "Value",
                        title: "Value",
                        type: "string",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        isLink: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                    },
                ],
            },
        },
        compare: {
            TableDynamicColumnsLeader: {
                properties: {
                    options: {
                        desktopOnly: true,
                        showLegend: false,
                        preserveLegendSpace: true,
                        headTemp: "leader-domain-header-cell",
                    },
                    apiParams: {
                        includeLeaders: true,
                    },
                },
                columns: [],
                filters: {},
            },
        },
    },
};

export const KeywordCompetitorsAffinity = {
    id: "KeywordCompetitorsAffinity",
    properties: {
        component: "TrafficSourcesSearch",
        title: "dashboard.metrics.titles.search.competitive.overlap",
        group: "WebsiteAudienceOverview",
        family: "Website",
        dashboard: "true",
        noCompare: true,
        order: "1",
        state: "websites-trafficSearch",
        titleState: "websites-competitorsOrganicKeywords",
        apiController: "Search",
        availabilityComponent: "WsWebSearchOverview",
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
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        isLink: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        minWidth: "",
                    },
                ],
            },
        },
    },
};

export const SearchCompetitorsOrganic = {
    id: "SearchCompetitorsOrganic",
    properties: {
        component: "SearchCompetitors",
        title: "search.overview.top.organic.competitors",
        group: "WebsiteAudienceOverview",
        family: "Website",
        dashboard: "true",
        noCompare: true,
        order: "1",
        state: "websites-competitorsOrganicKeywords",
        titleState: "websites-competitorsOrganicKeywords",
        apiController: "SearchCompetitors",
        availabilityComponent: "WsWebSearchOverview",
        disableDatepicker: true,
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        apiParams: {
            endpoint: "widgetApi/SearchCompetitors/SearchCompetitorsOrganic/Table",
            pageSize: "400",
        },
    },
    widgets: {
        single: {
            defaultType: "SearchCompetitorsOrganic",
            SearchCompetitorsOrganic: {
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

export const SearchTrafficByChannel = {
    id: "SearchTrafficByChannel",
    properties: {
        component: "TrafficSourcesSearch",
        title: "dashboard.metrics.titles.search.traffic.by.channel",
        group: "WebsiteAudienceOverview",
        family: "Website",
        dashboard: "true",
        order: "1",
        state: "websites-trafficSearch",
        apiController: "TrafficSourcesSearch",
        availabilityComponent: "WsWebSearchOverview",
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
                },
                columns: [
                    {
                        name: "Name",
                        title: "Channel",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "item-icon-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                    },
                    {
                        name: "Value",
                        title: "Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                ],
                filters: {},
            },
        },
        compare: {
            TableDynamicColumnsLeader: {
                properties: {
                    options: {
                        desktopOnly: true,
                        showLegend: false,
                        preserveLegendSpace: true,
                        headTemp: "leader-default-header-cell",
                    },
                    apiParams: {
                        includeLeaders: true,
                    },
                },
                columns: [],
                filters: {},
            },
        },
    },
};

export const TrafficSourcesOverview = {
    id: "TrafficSourcesOverview",
    properties: {
        dashboard: "true",
        apiController: "WebsiteOverviewDesktop",
        title: "metric.engagementTrafficSourcesOverview.title",
        family: "Website",
        component: "WebAnalysis",
        mobileWebComponent: "MobileMarketingMix",
        order: "1",
        keyPrefix: "$",
        state: "websites-trafficOverview",
        timeGranularity: "Monthly",
        hasWebSource: true,
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        modules: {
            Industry: {
                title: "metric.engagementTrafficSourcesOverview.title",
                family: "Industry",
                state: "industryAnalysis-trafficSources",
                apiController: "IndustryAnalysis",
                dashboard: "true",
                component: "IndustryAnalysisOverview",
                hasWebSource: false,
                viewPermissions: {
                    trafficSources: ["Desktop"],
                },
            },
        },
    },
    widgets: {
        single: {
            defaultType: "MmxChannelsGraphDashboard",
            MmxChannelsGraphDashboard: {
                properties: {
                    showMoreButton: true,
                    periodOverPeriodSupport: false,
                    options: {
                        legendAlign: "left",
                        sortByTrafficSources: true,
                        showLegend: false,
                        legendTop: -20,
                        dashboardSubtitleMarginBottom: 15,
                        newColorPalette: true,
                    },
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: false,
                },
                y_axis: {
                    title: "Visits",
                    type: "double",
                    format: "number",
                    formatParameter: 0,
                    name: "Visits",
                    reversed: false,
                },
            },
            // PieChart: {
            //     properties: {
            //         options: {
            //             height: 240,
            //             marginTop: -20,
            //             legendVerticalAlign: "top",
            //             alignTrafficSourcesColors: true,
            //             showLegend: false,
            //             // desktopOnly: true, // Mobile web is enabled in mmxPage
            //             dashboardSubtitleMarginBottom: 15,
            //             legendConfig: {
            //                 margin: 14,
            //             },
            //         },
            //     },
            //     objects: {
            //         Visits: {
            //             name: "Visits",
            //             title: "Visits",
            //             type: "double",
            //             format: "None",
            //             cellTemp: "",
            //         },
            //     },
            // },
            PieChartMMXDashboard: {
                properties: {
                    periodOverPeriodSupport: false,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 45,
                    },
                },
                objects: {
                    Visits: {
                        name: "Visits",
                        title: "Visits",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
            BarChart: {
                properties: {
                    periodOverPeriodSupport: false,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 45,
                        // desktopOnly: true, // Mobile web is enabled in mmxPage
                    },
                },
                objects: {
                    Visits: {
                        name: "Visits",
                        title: "Visits",
                        type: "double",
                        format: "abbrNumber",
                        cellTemp: "",
                    },
                },
            },
            BarChartMMXDashboard: {
                properties: {
                    periodOverPeriodSupport: false,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 45,
                    },
                },
                objects: {
                    Visits: {
                        name: "Visits",
                        title: "Visits",
                        type: "double",
                        format: "abbrNumber",
                        cellTemp: "",
                    },
                },
            },
        },
        compare: {
            BarChart: {
                properties: {
                    options: {
                        // desktopOnly: true
                    },
                },
                objects: {
                    Visits: {
                        name: "Visits",
                        title: "Visits",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
        },
    },
    getDashboardWidgetTypes: function (wizardParams: any, isCompare?: boolean) {
        if (wizardParams.widget.webSource === "MobileWeb") {
            return ["BarChartMMXDashboard"];
        } else {
            return isCompare
                ? ["BarChartMMXDashboard"]
                : ["MmxChannelsGraphDashboard", "PieChartMMXDashboard", "BarChartMMXDashboard"];
        }
    },
};

export const TrafficSourcesSocial = {
    id: "TrafficSourcesSocial",
    properties: {
        dashboard: "true",
        title: "wa.wwo.social.title",
        apiController: "WebsiteOverviewDesktop",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        keyPrefix: "$",
        state: "websites-trafficSocial",
        timeGranularity: "Monthly",
        availabilityComponent: "WsWebSocialTrafficOverview",
    },
    widgets: {
        single: {
            WWOSocialBar: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 40,
                        desktopOnly: true,
                    },
                },
                objects: {
                    Visits: {
                        name: "Visits",
                        title: "Visits",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
            SingleMetric: {
                properties: {
                    options: {
                        showTitleTooltip: false,
                        showOverflow: true,
                        showLegend: false,
                        showTopLine: false,
                        titleIcon: false,
                        desktopOnly: true,
                    },
                },
                objects: {
                    Total: {
                        name: "Total",
                        title: "Total Visits",
                        type: "double",
                        format: "abbrNumberVisits",
                        headTemp: "none",
                        cellTemp: "large-single-number",
                    },
                },
            },
            /*            PieChart: {
             properties: {
             options: {
             showLegend: false,
             dashboardSubtitleMarginBottom: 20
             }
             },
             objects: {
             Data: {
             name: "Share",
             title: "Share",
             type: "double",
             format: "None",
             cellTemp: ""
             }
             }
             },*/
            Graph: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        desktopOnly: true,
                    },
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: false,
                },
                y_axis: {
                    title: "Visits",
                    type: "double",
                    format: "number",
                    formatParameter: 0,
                    name: "Visits",
                    reversed: false,
                },
            },
            Table: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        desktopOnly: true,
                    },
                },
                columns: [
                    {
                        fixed: false,
                        name: "Page",
                        title: "Referring Pages",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: true,
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                    },
                    {
                        name: "Share",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: false,
                        progressBarTooltip: "Visits",
                        tooltip: "",
                        width: "145px",
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "long",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "asc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: true,
                        dangerouslySetInnerHTML: true,
                        inverted: true,
                        width: "145px",
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
                    ],
                },
            },
        },
        compare: {
            /*            PieChart: {
             properties: {
             options: {
             showLegend: false,
             dashboardSubtitleMarginBottom: 20
             }
             },
             objects: {
             Data: {
             name: "Share",
             title: "Share",
             type: "double",
             format: "None",
             cellTemp: ""
             }
             }
             },*/
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        desktopOnly: true,
                    },
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: false,
                },
                y_axis: {
                    title: "Visits",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "Visits",
                    reversed: false,
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
            Table: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        desktopOnly: true,
                    },
                },
                columns: [
                    {
                        fixed: true,
                        name: "Page",
                        title: "Referring Pages",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: true,
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "double",
                        format: "smallNumbersPercentage:2",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: false,
                        progressBarTooltip: "Visits",
                        tooltip: "",
                        width: "115px",
                    },
                    {
                        name: "SiteOrigins",
                        title: "Traffic Share Split",
                        type: "double[]",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "group-traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "200px",
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
                },
            },
            WWOSocialBar: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 40,
                        desktopOnly: true,
                    },
                },
                objects: {
                    Visits: {
                        name: "Visits",
                        title: "Visits",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
        },
    },
};

export const TrafficSourcesOverviewDataKpiWidget = {
    id: "TrafficSourcesOverviewDataKpiWidget",
    properties: {
        title: "category.overview.source",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        keyPrefix: "$",
        state: "websites-worldwideOverview",
        modules: {
            Industry: {
                titleState: "industryAnalysis-trafficSources",
                state: "websites-trafficReferrals",
                dashboard: "true",
                family: "Industry",
                title: "category.overview.source",
                apiController: "IndustryAnalysis",
                component: "IndustryAnalysisOverview",
            },
        },
        apiParams: {
            metric: "TrafficSourcesOverviewData",
        },
    },
    widgets: {
        single: {
            defaultType: "IndustryReferralsDashboardTable",
            IndustryReferralsDashboardTable: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 25,
                        showOverflow: true,
                    },
                },
                columns: [
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 40,
                        dashboardHide: true,
                        disableHeaderCellHover: true,
                    },
                    {
                        fixed: true,
                        name: "Domain",
                        title: "Traffic Source",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "industry-traffic-source",
                        headTemp: "",
                        totalCount: false,
                        tooltip: true,
                        isResizable: true,
                        width: 253,
                    },
                    {
                        name: "TotalShare",
                        title: "Traffic Share",
                        type: "string",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellComponent: DefaultCellRightAlign,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: true,
                        width: "115px",
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
                        tooltip: true,
                        width: 110,
                    },
                    {
                        name: "SourceType",
                        title: "Source Type",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: true,
                        width: 160,
                    },
                    {
                        name: "Rank",
                        title: "Global Rank",
                        type: "long",
                        format: "swRank",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "asc",
                        groupable: false,
                        cellComponent: RankCell,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
                        tooltip: true,
                        width: 140,
                        dangerouslySetInnerHTML: true,
                        inverted: true,
                    },
                    {
                        name: "Category",
                        title: "Category",
                        type: "string",
                        format: "prettifyCategory",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: true,
                        minWidth: 220,
                    },
                ],
                filters: {},
            },
        },
        compare: {
            defaultType: "IndustryReferralsDashboardTable",
            IndustryReferralsDashboardTable: {
                properties: {},
                columns: [
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 40,
                        disableHeaderCellHover: true,
                    },
                    {
                        fixed: true,
                        name: "Domain",
                        title: "Traffic Source",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: true,
                        cellTemp: "industry-traffic-source",
                        headTemp: "",
                        totalCount: true,
                        tooltip: true,
                        width: 253,
                    },
                    {
                        name: "SourceType",
                        title: "Source Type",
                        type: "string",
                        format: "None",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: true,
                        isResizable: true,
                        minWidth: 140,
                    },
                    {
                        name: "TotalShare",
                        title: "Group Traffic Share",
                        type: "string",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: true,
                        isResizable: true,
                        minWidth: 148,
                    },
                    {
                        name: "SiteOrigins",
                        title: "Group Share Split",
                        type: "string",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: true,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "group-traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: false,
                        isResizable: true,
                        minWidth: 192,
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
                    {
                        name: "Category",
                        title: "Category",
                        type: "string",
                        format: "prettifyCategory",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: true,
                        minWidth: 281,
                    },
                ],
                filters: {},
            },
        },
    },
};

export const TrafficSourcesSearch = {
    id: "TrafficSourcesSearch",
    properties: {
        component: "WebAnalysis",
        title: "wa.wwo.trafficsourcessearch.title",
        group: "WebsiteAudienceOverview",
        family: "Website",
        order: "1",
        state: "keywordAnalysis-organic",
        titleState: "websites-trafficSearch",
        dashboard: "true",
        apiController: "WebsiteOverviewDesktop",
        hasWebSource: true,
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        availabilityComponent: "WsWebSearchOverview",
    },
    widgets: {
        single: {
            Table: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        desktopOnly: true,
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 25,
                        showOverflow: true,
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
            WWOTopKeywordsTable: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 25,
                        showOverflow: true,
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
                        cellTemp: "wwo-keyword-cell",
                        headTemp: "",
                        minWidth: 130,
                        maxWidth: 220,
                    },
                    {
                        name: "Share",
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
                        minWidth: 130,
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
            WWOSearchTraffic: {
                properties: {},
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
            PieChart: {
                properties: {
                    options: {
                        showLegend: false,
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
        compare: topSearchTermCompareCommonConfig,
    },
};

export const TrafficDestinationReferrals = {
    id: "TrafficDestinationReferrals",
    properties: {
        hasWebSource: true,
        title: "metric.topReferrals.title",
        family: "Website",
        component: "WebAnalysis",
        mobileWebComponent: "MobileWebReferrals",
        order: "1",
        state: "websites-worldwideOverview",
        noCompare: true,
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
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: true,
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "Share",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        progressBarTooltip: "Visits",
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
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
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
    },
};

export const TrafficDestinationReferralsSI = {
    ...TrafficDestinationReferrals,
    properties: {
        ...TrafficDestinationReferrals.properties,
        state: "accountreview_website_overview_websiteperformance",
    },
};

export const TrafficDestinationAds = {
    id: "TrafficDestinationAds",
    properties: {
        hasWebSource: true,
        title: "metric.topReferrals.title",
        family: "Website",
        component: "WebAnalysis",
        mobileWebComponent: "MobileWebReferrals",
        order: "1",
        state: "websites-worldwideOverview",
    },
    widgets: {
        single: {
            WWOOutgoingAdsTable: {
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
                        groupable: true,
                        cellTemp: "website-tooltip-top-cell",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        width: 220,
                    },
                    {
                        name: "Share",
                        title: "Traffic Share",
                        type: "double",
                        format: "percentagesign",
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "traffic-share",
                        headTemp: "",
                        totalCount: false,
                        tooltip: "",
                        progressBarTooltip: "Visits",
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
                        sortable: true,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: false,
                        cellTemp: "change-percentage",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: false,
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
            WWOOutgoingAdsTable: {
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
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
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

export const TrafficDestinationAdsSI = {
    ...TrafficDestinationAds,
    properties: {
        ...TrafficDestinationAds.properties,
        state: "accountreview_website_overview_websiteperformance",
    },
};

export const OutgoingReferrals = {
    id: "OutgoingReferrals",
    properties: {
        dashboard: "true",
        title: "analysis.destination.out.title",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        state: "websites-outgoing",
        apiController: "OutgoingLinks",
        availabilityComponent: "WsWebReferralOutgoingTraffic",
    },
    widgets: {
        single: {
            defaultType: "OutgoingReferralsDashboardTable",
            SingleMetric: {
                properties: {
                    options: {
                        showTitleTooltip: false,
                        showOverflow: true,
                        showLegend: false,
                        showTopLine: false,
                        titleIcon: false,
                        desktopOnly: true,
                    },
                },
                objects: {
                    Total: {
                        name: "Total",
                        title: "Total Visits",
                        type: "double",
                        format: "abbrNumberVisits",
                        headTemp: "none",
                        cellTemp: "large-single-number",
                    },
                },
            },
            OutgoingReferralsDashboardTable: {
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
                        cellTemp: "website-tooltip-top-no-expand-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
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
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
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
            defaultType: "OutgoingReferralsDashboardTable",
            OutgoingReferralsDashboardTable: {
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
                        title: "Traffic Share Split",
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

export const DashboardTrafficSourcesAds = {
    id: "DashboardTrafficSourcesAds",
    properties: {
        dashboard: "true",
        title: "dashboard.metrics.titles.total.outgoing.ads.visits",
        family: "Website",
        component: "WebAnalysis",
        state: "websites-paidoutgoing",
        apiController: "OutgoingAds",
        webSource: "Desktop",
        apiParams: {
            metric: "TopOutgoingAds",
        },
        availabilityComponent: "WsWebMonetizationAdvertisers",
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: false,
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
                    type: "double",
                    format: "number",
                    formatParameter: 0,
                    name: "Visits",
                    reversed: false,
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
            SingleMetric: {
                properties: {
                    options: {
                        showTitleTooltip: false,
                        showOverflow: true,
                        showLegend: false,
                        showTopLine: false,
                        titleIcon: false,
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
        },
        compare: {
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
                    type: "double",
                    format: "number",
                    formatParameter: 0,
                    name: "Visits",
                    reversed: false,
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
            PieChart: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                objects: {
                    TotalVisits: {
                        name: "TotalVisits",
                        title: "TotalVisits",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
        },
    },
};

export const DashboardTopOutgoingAds = {
    id: "DashboardTopOutgoingAds",
    properties: {
        dashboard: "true",
        title: "dashboard.metrics.titles.top.advertisers",
        family: "Website",
        component: "WebAnalysis",
        state: "websites-paidoutgoing",
        apiController: "OutgoingAds",
        apiParams: {
            metric: "TopOutgoingAds",
        },
        availabilityComponent: "WsWebMonetizationAdvertisers",
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
                        cellTemp: "website-tooltip-top-no-expand-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
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
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
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
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                        },
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
                },
            },
        },
    },
};

export const DashboardTopOutgoingAdNetworks = {
    id: "DashboardTopOutgoingAdNetworks",
    properties: {
        dashboard: "true",
        title: "dashboard.metrics.titles.top.og.ad.networks",
        family: "Website",
        component: "WebAnalysis",
        state: "websites-paidoutgoing",
        apiController: "OutgoingAds",
        apiParams: {
            metric: "TopOutgoingAdNetworks",
        },
        availabilityComponent: "WsWebMonetizationAdvertisers",
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
                        name: "Name",
                        title: "Ad Netwrok",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "default",
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
                },
                columns: [
                    {
                        name: "Name",
                        title: "Ad Netwrok",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "default",
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
                        title: "Traffic Share Split",
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
                },
            },
        },
    },
};

export const NewSearchKeywords = {
    id: "NewSearchKeywords",
    properties: {
        dashboard: "true",
        hasWebSource: true,
        title: "dashboard.metricGallery.Website.NewSearchKeywords.title",
        family: "Website",
        component: "TrafficSourceSearchKeyword",
        mobileWebComponent: "TrafficSourceSearchKeywordMobileWeb",
        order: "1",
        state: "keywordAnalysis-organic",
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
            pageSize: "400", // this one overrides the page size on the page, but we need to set it here for Dashboard.
        },
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        availabilityComponent: "WsWebSearchKeywords",
    },
    widgets: {
        single: {
            defaultType: "TableSearchKeywordsDashboard",
            TableSearchKeywordsDashboard: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        dashboardSubtitleClass: "dashboard-table-widget",
                    },
                },
                columns: [],
            },
        },
        compare: {
            defaultType: "TableSearchKeywordsDashboard",
            TableSearchKeywordsDashboard: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {},
                },
                columns: [],
            },
        },
    },
};

export const OrganicLandingPage = {
    id: "OrganicLandingPage",
    properties: {
        dashboard: "true",
        hasWebSource: true,
        title: "dashboard.metric.Website.organic.landing.page.title",
        family: "Website",
        component: "WebsiteOrganicLandingPages",
        order: "1",
        state: "competitiveanalysis_website_organiclandingpages",
        apiParams: {
            metric: "OrganicLandingPage",
            endpoint: "api/websiteOrganicLandingPages",
            pageSize: "400",
        },
        viewPermissions: {
            trafficSources: ["Desktop"],
        },
        availabilityComponent: "WsWebSearchKeywords",
        disableDatepicker: true,
    },
    widgets: {
        single: {
            defaultType: "OrganicLandingPagesDashboard",
            OrganicLandingPagesDashboard: {
                properties: {
                    showMoreButtonItems: 5,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                        dashboardSubtitleClass: "dashboard-table-widget",
                    },
                },
                columns: [],
            },
        },
    },
};

export const NewSearchKeywordsWebsiteOverview = {
    id: "NewSearchKeywordsWebsiteOverview",
    properties: {
        dashboard: "true",
        hasWebSource: true,
        title: "dashboard.metricGallery.Website.NewSearchKeywords.title",
        family: "Website",
        component: "TrafficSourceSearchKeyword",
        mobileWebComponent: "TrafficSourceSearchKeywordMobileWeb",
        order: "1",
        state: "keywordAnalysis-overview",
        apiController: "SearchKeywords",
        apiParams: {
            metric: "NewSearchKeywords",
            pageSize: "5",
            IncludeOrganic: true,
            IncludePaid: false,
        },
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
    },
    widgets: {
        single: {
            defaultType: "TableSearchKeywordsDashboard",
            TableSearchKeywordsDashboard: {
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
                        cellTemp: "wwo-keyword-cell",
                        headTemp: String(),
                        minWidth: 130,
                        maxWidth: 220,
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
                        headTemp: String(),
                        totalCount: false,
                        tooltip: false,
                        minWidth: 130,
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
            },
        },
        compare: topSearchTermCompareCommonConfig,
    },
};

export const NewSearchKeywordsWebsiteOverviewSI = {
    ...NewSearchKeywordsWebsiteOverview,
    properties: {
        ...NewSearchKeywordsWebsiteOverview.properties,
        state: "accountreview_website_search_organic_competitors",
    },
};
