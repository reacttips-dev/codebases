import { RankCell } from "../../../React/Table/cells";
import { DefaultCellHeaderRightAlign } from "../../../React/Table/headerCells/DefaultCellHeaderRightAlign";

export const AppEngagementCurrentInstalls = {
    id: "AppEngagementCurrentInstalls",
    properties: {
        dashboard: "true",
        title: "metric.AppEngagementCurrentInstalls.title",
        family: "Mobile",
        component: "AppEngagementOverview",
        order: "1",
        androidOnly: "true",
        state: "apps-engagementoverview",
        apiController: (key) =>
            key[0].store === "google" ? "AppEngagementOverviewAndroid" : "AppEngagementOverviewIos",
        apiParams: {
            metric: "AppEngagementOverview",
        },
        availabilityComponent: "WsAppEngagement",
    },
    widgets: {
        single: {
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: false,
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
                    title: "Current Installs",
                    type: "double?",
                    format: "smallNumbersPercentage",
                    formatParameter: 3,
                    name: "CurrentInstalls",
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
        compare: {
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "Current Installs",
                    type: "double?",
                    format: "smallNumbersPercentage",
                    formatParameter: 3,
                    name: "CurrentInstalls",
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
    },
};

export const AppEngagementDownloads = {
    id: "AppEngagementDownloads",
    properties: {
        dashboard: "true",
        title: "apps.engagementoverview.tabs.downloads.title",
        family: "Mobile",
        component: "AppEngagementOverview",
        order: "1",
        componentFunction: <IAutoCompleteAppItem>({ key }) =>
            key && key.length > 0 && key[0].store !== "google"
                ? "AppEngagementOverviewIOS"
                : "AppEngagementOverviewAndroid",
        state: "apps-engagementoverview",
        apiController: (key) =>
            key[0].store === "google" ? "AppEngagementOverviewAndroid" : "AppEngagementOverviewIos",
        apiParams: {
            metric: "AppEngagementOverview",
        },
        availabilityComponent: "WsAppEngagement",
    },
    widgets: {
        single: {
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: false,
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
                    title: "apps.engagementoverview.tabs.downloads.title",
                    type: "double?",
                    format: "abbrNumberVisits",
                    name: "Downloads",
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
        compare: {
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "apps.engagementoverview.tabs.downloads.title",
                    type: "double?",
                    format: "abbrNumber",
                    name: "Downloads",
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
    },
};

export const AppEngagementUniqueInstalls = {
    id: "AppEngagementUniqueInstalls",
    properties: {
        dashboard: "true",
        title: "apps.engagementoverview.tabs.unique.installs.title",
        family: "Mobile",
        component: "AppEngagementOverview",
        order: "4",
        componentFunction: <IAutoCompleteAppItem>({ key }) => "AppEngagementOverviewAndroid",
        state: "apps-engagementoverview",
        apiController: (key) => "AppEngagementOverviewAndroid",
        apiParams: {
            metric: "AppEngagementOverview",
        },
        availabilityComponent: "WsAppEngagement",
    },
    widgets: {
        single: {
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: false,
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
                    title: "apps.engagementoverview.tabs.unique.installs.title",
                    type: "double?",
                    format: "abbrNumberVisits",
                    name: "New devices",
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
        compare: {
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "apps.engagementoverview.tabs.unique.installs.title",
                    type: "double?",
                    format: "abbrNumber",
                    name: "New Devices",
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
    },
};

export const AppEngagementDailyActiveUsers = {
    id: "AppEngagementDailyActiveUsers",
    properties: {
        dashboard: "true",
        title: "metric.AppEngagementDailyActiveUsers.title",
        family: "Mobile",
        component: "AppEngagementOverview",
        androidOnly: "true",
        state: "apps-engagementoverview",
        apiController: (key) =>
            key[0].store === "google" ? "AppEngagementOverviewAndroid" : "AppEngagementOverviewIos",
        apiParams: {
            metric: "AppEngagementOverview",
        },
        availabilityComponent: "WsAppEngagement",
    },
    widgets: {
        single: {
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: false,
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
                    title: "apps.engagementoverview.tabs.activeusers.title",
                    type: "double?",
                    format: "abbrNumberVisits",
                    name: "DailyActiveUsers",
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
        compare: {
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "apps.engagementoverview.tabs.activeusers.title",
                    type: "double?",
                    format: "abbrNumberVisits",
                    name: "DailyActiveUsers",
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
    },
};

export const AppEngagementMonthlyActiveUsers = {
    id: "AppEngagementMonthlyActiveUsers",
    properties: {
        dashboard: "true",
        title: "metric.AppEngagementMonthlyActiveUsers.title",
        family: "Mobile",
        component: "AppEngagementOverview",
        componentFunction: <IAutoCompleteAppItem>({ key }) =>
            key && key.length > 0 && key[0].store !== "google"
                ? "AppEngagementOverviewIOS"
                : "AppEngagementOverviewAndroid",
        state: "apps-engagementoverview",
        apiController: (key) =>
            key[0].store === "google" ? "AppEngagementOverviewAndroid" : "AppEngagementOverviewIos",
        apiParams: {
            metric: "AppEngagementOverview",
        },
        availabilityComponent: "WsAppEngagement",
    },
    widgets: {
        single: {
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: false,
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
                    title: "apps.engagementoverview.tabs.activeusers.title",
                    type: "double?",
                    format: "abbrNumberVisits",
                    name: "MonthlyActiveUsers",
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
            defaultType: "AppEngagementMetricsDashboardGraph",
            AppEngagementMetricsDashboardGraph: {
                properties: {
                    hideMarkersOnDaily: true,
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "apps.engagementoverview.tabs.activeusers.title",
                    type: "double?",
                    format: "abbrNumberVisits",
                    name: "MonthlyActiveUsers",
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

export const AppRanks = {
    id: "AppRanks",
    properties: {
        dashboard: "true",
        title: "metric.appRanks.title",
        family: "Mobile",
        component: "AppRanksDashboard",
        order: "1",
        dynamicSettings: "true",
        state: "apps-ranking",
        timeGranularity: "Daily",
        apiController: "AppRanks",
        availabilityComponent: "WsAppRanking",
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: false,
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
                    title: "Ranks",
                    type: "long",
                    format: "number",
                    name: "Rank",
                    reversed: "True",
                },
                filters: {},
            },
            SingleMetric: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                objects: {
                    Rank: {
                        name: "Rank",
                        title: "App Rank",
                        type: "int?",
                        format: "None",
                        cellTemp: "large-number",
                    },
                    Change: {
                        name: "Change",
                        title: "Rank Change",
                        type: "double?",
                        format: "None",
                        cellTemp: "change",
                    },
                    Trend: {
                        name: "Trend",
                        title: "Trend",
                        type: "long[]",
                        format: "None",
                        cellTemp: "trend-line",
                    },
                },
            },
        },
        compare: {
            Graph: {
                properties: { hideMarkersOnDaily: true },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "Ranks",
                    type: "long",
                    format: "number",
                    name: "Rank",
                    reversed: "True",
                },
                filters: {},
            },
            Table: {
                properties: {
                    options: {
                        showLegend: false,
                    },
                },
                columns: [
                    {
                        name: "App",
                        title: "Mobile App",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "app-tooltip-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            overrideFormat: "App",
                        },
                    },
                    {
                        name: "Rank",
                        title: "Rank",
                        type: "long",
                        format: "swRank",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: RankCell,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "int?",
                        format: "appRankChange",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "change",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                ],
                filters: {},
            },
        },
    },
};

export const AppDemographics = {
    id: "AppDemographics",
    properties: {
        title: "metric.demographics.title",
        family: "Mobile",
        component: "AppAudienceDemographics",
        order: "1",
        dynamicSettings: "true",
        disableDatepicker: true,
        state: "apps-demographics",
    },
    widgets: {
        single: {
            PieChart: {
                properties: {
                    hasWebSource: false,
                },
                objects: {
                    Male: {
                        name: "Male",
                        title: "Male",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    Female: {
                        name: "Female",
                        title: "Female",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
        },
    },
};

export const AppEngagementOverview = {
    id: "AppEngagementOverview",
    properties: {
        family: "Mobile",
        component: "AppEngagementOverview",
        order: "1",
        state: "apps-engagementoverview",
    },
    widgets: {
        single: {
            AppEngagementOverviewGraphIos: {
                properties: {},
            },
            AppEngagementOverviewGraphAndroid: {
                properties: {},
            },
        },
        compare: {
            AppEngagementOverviewTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                columns: [],
            },
            AppEngagementOverviewGraphIos: {
                properties: {},
            },
            AppEngagementOverviewGraphAndroid: {
                properties: {},
            },
        },
    },
};

export const AppEngagementOverviewRealNumbers = {
    id: "AppEngagementOverviewRealNumbers",
    properties: {
        family: "Mobile",
        component: "AppEngagementOverview",
        order: "1",
        state: "apps-engagementoverview",
        dashboard: "true",
        title: "apps.engagementoverview.pageTitle",
        apiController: "AppEngagementOverviewAndroid",
        androidOnly: "true",
        availabilityComponent: "WsAppEngagement",
    },
    widgets: {
        single: {
            AppEngagementOverviewTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                columns: [
                    {
                        name: "CurrentInstalls",
                        title: "apps.engagementoverview.tabs.currentinstalls.title",
                        cellTemp: "leader-no-icon-cell",
                        format: "percentagesign:2", //hasAEORealNumbers ? 'abbrNumberVisits' : 'percentagesign:2',
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        // headerCellIcon: 'reach',
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.currentinstalls.tooltip",
                        // minWidth: 108
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "Downloads",
                        title: "appanalysis.engagement.overview.table.compare.downloads",
                        cellTemp: "leader-no-icon-cell",
                        format: "abbrNumberVisits",
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        // headerCellIcon: 'app-eng-download',
                        inverted: true,
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.downloads.tooltip",
                        // minWidth: 108
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "DailyActiveUsers",
                        title: "apps.engagementoverview.tabs.dau.title",
                        cellTemp: "leader-no-icon-cell",
                        format: "abbrNumberVisits", //hasAEORealNumbers ? 'abbrNumberVisits' : 'percentagesign:2',
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        // headerCellIcon: 'daily-users',
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.dau.tooltip.ud",
                        minWidth: 80,
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "MonthlyActiveUsers",
                        title: "apps.engagementoverview.tabs.mau.title",
                        cellTemp: "leader-default-cell",
                        format: "abbrNumberVisits", //hasAEORealNumbers ? 'abbrNumberVisits' : 'percentagesign:2',
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        // headerCellIcon: 'daily-users',
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.mau.tooltip.ud",
                        minWidth: 80,
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                ],
            },
        },
        compare: {
            AppEngagementOverviewTable: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                columns: [
                    {
                        name: "App",
                        title: "appanalysis.engagement.overview.table.compare.app",
                        cellTemp: "app-tooltip-cell",
                        sortable: false,
                        minWidth: 150,
                        //tooltip: 'appanalysis.engagement.overview.table.compare.app.tooltip',
                        ppt: {
                            overrideFormat: "App",
                        },
                    },
                    {
                        name: "CurrentInstalls",
                        title: "apps.engagementoverview.tabs.currentinstalls.title",
                        cellTemp: "leader-default-cell",
                        format: "percentagesign:2", //hasAEORealNumbers ? 'abbrNumberVisits' : 'percentagesign:2',
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        // headerCellIcon: 'reach',
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.currentinstalls.tooltip",
                        // minWidth: 108
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "Downloads",
                        title: "appanalysis.engagement.overview.table.compare.downloads",
                        cellTemp: "leader-default-cell",
                        format: "abbrNumberVisits",
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        // headerCellIcon: 'app-eng-download',
                        inverted: true,
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.downloads.tooltip",
                        // minWidth: 108
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "DailyActiveUsers",
                        title: "apps.engagementoverview.tabs.dau.title",
                        cellTemp: "leader-default-cell",
                        format: "abbrNumberVisits", //hasAEORealNumbers ? 'abbrNumberVisits' : 'percentagesign:2',
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        // headerCellIcon: 'daily-users',
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.dau.tooltip.ud",
                        minWidth: 80,
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "MonthlyActiveUsers",
                        title: "apps.engagementoverview.tabs.mau.title",
                        cellTemp: "leader-default-cell",
                        format: "abbrNumberVisits", //hasAEORealNumbers ? 'abbrNumberVisits' : 'percentagesign:2',
                        sortable: true,
                        headTemp: "leader-default-header-cell",
                        // headerCellIcon: 'daily-users',
                        cellCls: "leaders-cell",
                        tooltip: "apps.engagementoverview.tabs.mau.tooltip.ud",
                        minWidth: 80,
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                ],
            },
        },
    },
};
