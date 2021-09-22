import { isHidden, isLocked } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { DefaultCellRightAlign } from "../../../React/Table/cells/DefaultCellRightAlign";
import { DefaultCellHeaderRightAlign } from "../../../React/Table/headerCells/DefaultCellHeaderRightAlign";

export const EngagementAvgVisitDuration = {
    id: "EngagementAvgVisitDuration",
    properties: {
        dashboard: "true",
        apiController: "TrafficAndEngagement",
        title: "metric.engagementAvgVisitDuration.title",
        hasWebSource: true,
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        state: "websites-worldwideOverview",
        titleState: "websites-audienceOverview",
        availabilityComponent: "WsWebTrafficAndEngagement",
        modules: {
            Industry: {
                dashboard: "true",
                family: "Industry",
                state: "industryAnalysis-overview",
                titleState: "industryAnalysis-overview",
                title: "metric.engagementAvgVisitDuration.title",
                apiController: "IndustryAnalysisOverview",
                component: "IndustryAnalysisOverview",
                availabilityComponent: "WsWebCategoryPerformance",
            },
        },
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
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
                    format: "time",
                    name: "Visits",
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            SingleMetric: {
                properties: {
                    width: "4",
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                objects: {
                    AvgVisitDuration: {
                        name: "AvgVisitDuration",
                        title: "Avg. Visit Duration",
                        type: "double",
                        format: "time",
                        cellTemp: "large-number",
                    },
                    Change: {
                        name: "Change",
                        title: "Monthly Change",
                        type: "int?",
                        format: "change",
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
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            ComparedBar: {
                properties: {
                    hasWebSource: true,
                    width: "4",
                    periodOverPeriodSupport: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                        dashboardSubtitleClass: "period-over-period-dashboard-subtitle",
                    },
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
                y_axis: {
                    title: "Visits",
                    type: "long",
                    format: "time",
                    name: "Visits",
                    reversed: "False",
                },
            },
            ComparedLine: {
                properties: {
                    hideMarkersOnDaily: true,
                    periodOverPeriodSupport: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                        dashboardSubtitleClass: "period-over-period-dashboard-subtitle",
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
                    format: "time",
                    name: "Visits",
                    reversed: "False",
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
        compare: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        mobileWebAlgoChangeDate: true,
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
                    format: "time",
                    name: "Visits",
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
    },
    getDashboardWidgetTypes: function (wizardParams: any, isCompare?: boolean) {
        const compare =
            isCompare !== undefined
                ? isCompare
                : _.isArray(wizardParams.competitorList) && wizardParams.competitorList.length > 0;
        const periodOverPeriod =
            wizardParams.comparedDurationSelectedItem || wizardParams.widget.comparedDuration;
        if (compare) {
            return ["Graph"];
        } else {
            if (periodOverPeriod) {
                return ["ComparedBar", "ComparedLine"];
            } else {
                return ["Graph", "SingleMetric"];
            }
        }
    },
};

export const EngagementBounceRate = {
    id: "EngagementBounceRate",
    properties: {
        dashboard: "true",
        apiController: "TrafficAndEngagement",
        hasWebSource: true,
        title: "metric.engagementBounceRate.title",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        state: "websites-worldwideOverview",
        availabilityComponent: "WsWebTrafficAndEngagement",
        modules: {
            Industry: {
                dashboard: "true",
                family: "Industry",
                state: "industryAnalysis-overview",
                titleState: "industryAnalysis-overview",
                apiController: "IndustryAnalysisOverview",
                component: "IndustryAnalysisOverview",
                availabilityComponent: "WsWebCategoryPerformance",
            },
        },
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
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
                    format: "percentagesign",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                    yAxisMax: 1,
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
                ppt: {
                    minValue: 0,
                    maxValue: 1,
                },
            },
            SingleMetric: {
                properties: {
                    width: "4",
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                objects: {
                    BounceRate: {
                        name: "BounceRate",
                        title: "Bounce Rate",
                        type: "double",
                        format: "change",
                        cellTemp: "large-number",
                    },
                    Change: {
                        name: "Change",
                        title: "Monthly Change",
                        type: "int?",
                        format: "change",
                        cellTemp: "change-inverted",
                    },
                    Trend: {
                        name: "Trend",
                        title: "Trend",
                        type: "long[]",
                        format: "percentagesign",
                        cellTemp: "trend-line",
                    },
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            ComparedBar: {
                properties: {
                    hasWebSource: true,
                    width: "4",
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                        dashboardSubtitleClass: "period-over-period-dashboard-subtitle",
                    },
                    periodOverPeriodSupport: true,
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
                y_axis: {
                    title: "Visits",
                    type: "long",
                    format: "percentagesign",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
            },
            ComparedLine: {
                properties: {
                    hideMarkersOnDaily: true,
                    periodOverPeriodSupport: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                        dashboardSubtitleClass: "period-over-period-dashboard-subtitle",
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
                    format: "time",
                    name: "Visits",
                    reversed: "False",
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
        compare: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        mobileWebAlgoChangeDate: true,
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
                    format: "percentagesign",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                    yAxisMax: 1,
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
                ppt: {
                    minValue: 0,
                    maxValue: 1,
                },
            },
        },
    },
    getDashboardWidgetTypes: function (wizardParams: any, isCompare?: boolean) {
        const compare =
            isCompare !== undefined
                ? isCompare
                : _.isArray(wizardParams.competitorList) && wizardParams.competitorList.length > 0;
        const periodOverPeriod =
            wizardParams.comparedDurationSelectedItem || wizardParams.widget.comparedDuration;
        if (compare) {
            return ["Graph"];
        } else {
            if (periodOverPeriod) {
                return ["ComparedBar", "ComparedLine"];
            } else {
                return ["Graph", "SingleMetric"];
            }
        }
    },
};

export const EngagementDesktopVsMobileVisits = {
    id: "EngagementDesktopVsMobileVisits",
    properties: {
        dashboard: "true",
        apiController: "WebsiteOverview",
        title: "metric.engagementDesktopVsMobileVisits.title",
        family: "Website",
        component: "WebAnalysis",
        hasWebSource: true,
        order: "1",
        state: "websites-worldwideOverview",
        viewPermissions: {
            trafficSources: ["Total"],
        },
        customFetcherFactory: {
            path: "common.showGAApprovedData",
            factoryName: "ConnectedAssetsDataFetcherFactory",
        },
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
                        name: "Desktop",
                        title: "Desktop",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    MobileWeb: {
                        name: "MobileWeb",
                        title: "Mobile",
                        type: "double",
                        format: "None",
                        cellTemp: "150px",
                    },
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
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
                        name: "DesktopMobileShareVisits",
                        title: "Desktop                    Mobile",
                        type: "double[]",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "percentage-bar-cell-rounded",
                        headTemp: "desktop-mobile-header-cell",
                        headerCellClass: "u-no-pointer-events",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                            overrideName: "Desktop Vs. Mobile",
                        },
                    },
                ],
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            DesktopVSMobile: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 20,
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
                        name: "DesktopMobileShareVisits",
                        title: "Desktop                    Mobile",
                        type: "double[]",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "percentage-bar-cell-rounded",
                        headTemp: "desktop-mobile-header-cell",
                        headerCellClass: "u-no-pointer-events",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            overrideFormat: "smallNumbersPercentage:2",
                            overrideName: "Desktop Vs. Mobile",
                        },
                    },
                ],
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
    },
};

export const EngagementDesktopVsMobileVisitsSI = {
    ...EngagementDesktopVsMobileVisits,
    properties: {
        ...EngagementDesktopVsMobileVisits.properties,
        state: "accountreview_website_overview_websiteperformance",
    },
};

export const EngagementOverview = {
    id: "EngagementOverview",
    properties: {
        apiController: "TrafficAndEngagement",
        title: "metric.engagementOverview.title",
        family: "Website",
        hasWebSource: true,
        component: "WebAnalysis",
        order: "1",
        state: "websites-worldwideOverview",
        customFetcherFactory: {
            path: "common.showGAApprovedData",
            factoryName: "ConnectedAssetsDataFetcherFactory",
        },
        titleState: "websites-audienceOverview",
        dashboard: "true",
        availabilityComponent: "WsWebTrafficAndEngagement",
    },
    widgets: {
        single: {
            defaultType: "EngagementTableDashboard",
            EngagementTableDashboard: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                columns: [
                    {
                        name: "Source",
                        title: "Source",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "AvgMonthVisits",
                        title: "Avg. Monthly Visits",
                        type: "double",
                        format: "minVisitsAbbr",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: DefaultCellRightAlign,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "UniqueUsers",
                        title: "wa.ao.graph.uv",
                        type: "double",
                        format: "minVisitsAbbr",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        hideFrom28Days: true,
                    },
                    {
                        name: "VisitsPerUser",
                        title: "wa.ao.graph.vpu",
                        type: "double",
                        format: "number:2",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        hideFrom28Days: true,
                    },
                    {
                        name: "AvgVisitDuration",
                        title: "Avg. Visit Duration",
                        type: "double",
                        format: "number",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "time-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            overrideFormat: "time",
                        },
                    },
                    {
                        name: "PagesPerVisit",
                        title: "Pages/Visit",
                        type: "double",
                        format: "number",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "pages-per-visit",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "BounceRate",
                        title: "Bounce Rate",
                        type: "double",
                        format: "percentagesign:2",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "asc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                ],
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
        compare: {
            defaultType: "EngagementTableDashboard",
            EngagementTableDashboard: {
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
                        name: "AvgMonthVisits",
                        title: {
                            snapshot: "wa.ao.graph.avgvisits",
                            window: "wa.ao.graph.avgvisitsdaily",
                        },
                        type: "double",
                        format: "minVisitsAbbr",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIcon: "widget-tab-visits",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "UniqueUsers",
                        title: "wa.ao.graph.uv",
                        type: "double",
                        format: "minVisitsAbbr",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIcon: "widget-tab-visits",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        hideFrom28Days: true,
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "VisitsPerUser",
                        title: "wa.ao.graph.vpu",
                        type: "double",
                        format: "number:2",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIcon: "widget-tab-visits",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        hideFrom28Days: true,
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "AvgVisitDuration",
                        title: "wa.ao.graph.avgduration",
                        type: "double",
                        format: "time",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIcon: "widget-tab-duration",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "PagesPerVisit",
                        title: "wa.ao.engagement.pagesvisit",
                        type: "double",
                        format: "number:2",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIconName: "pager-per-visit",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                    {
                        name: "BounceRate",
                        title: "wa.ao.graph.bounce",
                        type: "double",
                        format: "percentagesign:2",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "asc",
                        groupable: "False",
                        cellTemp: "leader-default-cell",
                        headTemp: "leader-default-header-cell",
                        headerCellIconName: "bounce-rate-2",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            // Highlight a row's cell in case "IsLeader" property
                            // evaluates to true
                            highlightCellWhenPropsTrue: ["IsLeader"],
                            // Do not render IsLeader property value into the ppt table
                            ignoreCellProps: ["IsLeader"],
                        },
                    },
                ],
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
    },
};

export const EngagementPagesPerVisit = {
    id: "EngagementPagesPerVisit",
    properties: {
        dashboard: "true",
        hasWebSource: true,
        apiController: "TrafficAndEngagement",
        title: "metric.engagementPagesPerVisit.title",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        state: "websites-worldwideOverview",
        availabilityComponent: "WsWebTrafficAndEngagement",
        modules: {
            Industry: {
                dashboard: "true",
                family: "Industry",
                state: "industryAnalysis-overview",
                titleState: "industryAnalysis-overview",
                apiController: "IndustryAnalysisOverview",
                component: "IndustryAnalysisOverview",
                availabilityComponent: "WsWebCategoryPerformance",
            },
        },
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    width: 2,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
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
                    format: "decimalNumber",
                    formatParameter: 2,
                    name: "Visits",
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            SingleMetric: {
                properties: {
                    width: "4",
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                },
                objects: {
                    PagesPerVisit: {
                        name: "PagesPerVisit",
                        title: "Pages / Visits",
                        type: "double",
                        format: "decimalNumber",
                        cellTemp: "large-number",
                    },
                    Change: {
                        name: "Change",
                        title: "Monthly Change",
                        type: "int?",
                        format: "change",
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
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            ComparedBar: {
                properties: {
                    hasWebSource: true,
                    width: "4",
                    periodOverPeriodSupport: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                        dashboardSubtitleClass: "period-over-period-dashboard-subtitle",
                    },
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
                y_axis: {
                    title: "Visits",
                    type: "double",
                    format: "decimalNumber",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
            },
            ComparedLine: {
                properties: {
                    hideMarkersOnDaily: true,
                    periodOverPeriodSupport: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                        dashboardSubtitleClass: "period-over-period-dashboard-subtitle",
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
                    format: "time",
                    name: "Visits",
                    reversed: "False",
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
        compare: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    width: 2,
                    options: {
                        mobileWebAlgoChangeDate: true,
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
                    format: "decimalNumber",
                    formatParameter: 2,
                    name: "Visits",
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
    },
    getDashboardWidgetTypes: function (wizardParams: any, isCompare?: boolean) {
        const compare =
            isCompare !== undefined
                ? isCompare
                : _.isArray(wizardParams.competitorList) && wizardParams.competitorList.length > 0;
        const periodOverPeriod =
            wizardParams.comparedDurationSelectedItem || wizardParams.widget.comparedDuration;
        if (compare) {
            return ["Graph"];
        } else {
            if (periodOverPeriod) {
                return ["ComparedBar", "ComparedLine"];
            } else {
                return ["Graph", "SingleMetric"];
            }
        }
    },
};

export const EngagementTotalPagesViews = {
    id: "EngagementTotalPagesViews",
    properties: {
        dashboard: "true",
        hasWebSource: true,
        apiController: "TrafficAndEngagement",
        title: "wa.ao.graph.PageViews",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        state: "websites.worldwideOverview",
        availabilityComponent: "WsWebTrafficAndEngagement",
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    stacked: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
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
                    title: "Page Views",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "PageViews",
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            ComparedLine: {
                properties: {
                    hideMarkersOnDaily: true,
                    periodOverPeriodSupport: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                        dashboardSubtitleClass: "period-over-period-dashboard-subtitle",
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
                    title: "Page Views",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "PageViews",
                    reversed: "False",
                },
            },
        },
        compare: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        mobileWebAlgoChangeDate: true,
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
                    title: "Page Views",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "PageViews",
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
    getDashboardWidgetTypes: function (wizardParams: any, isCompare?: boolean) {
        const compare =
            isCompare !== undefined
                ? isCompare
                : _.isArray(wizardParams.competitorList) && wizardParams.competitorList.length > 0;
        const periodOverPeriod =
            wizardParams.comparedDurationSelectedItem || wizardParams.widget.comparedDuration;
        if (compare) {
            return ["Graph"];
        } else {
            if (periodOverPeriod) {
                return ["ComparedLine"];
            } else {
                return ["Graph"];
            }
        }
    },
};

export const EngagementVisits = {
    id: "EngagementVisits",
    properties: {
        dashboard: "true",
        hasWebSource: true,
        apiController: (keys, { type }) => {
            return type === "TrafficGrowthComparison"
                ? "TrafficGrowthComparison"
                : "TrafficAndEngagement";
        },
        title: "metric.engagementVisits.title",
        family: "Website",
        component: "TrafficAndEngagement",
        order: "1",
        state: "websites-worldwideOverview",
        titleState: "websites-audienceOverview",
        periodOverPeriodSupport: true,
        useCombinedInsteadOfTotal: true,
        modules: {
            Industry: {
                family: "Industry",
                state: "industryAnalysis-overview",
                titleState: "industryAnalysis-overview",
                apiController: "IndustryAnalysisOverview",
                dashboard: "true",
                component: "IndustryAnalysisOverview",
                availabilityComponent: "WsWebCategoryPerformance",
            },
        },
        customFetcherFactory: {
            path: "common.showGAApprovedData",
            factoryName: "ConnectedAssetsDataFetcherFactory",
        },
        availabilityComponent: "WsWebTrafficAndEngagement",
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    stacked: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                    },
                    modules: {
                        Industry: {
                            title: "wa.ao.totalvisits",
                        },
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
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
                        name: "Desktop",
                        title: "Desktop",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    MobileWeb: {
                        name: "MobileWeb",
                        title: "Mobile",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            SingleMetric: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                    modules: {
                        Industry: {
                            title: "wa.ao.totalvisits",
                        },
                    },
                },
                objects: {
                    TotalVisits: {
                        name: "TotalVisits",
                        share: "ShareOfVisits",
                        title: "Total Visits",
                        type: "number",
                        format: "abbrNumberVisits",
                        cellTemp: "large-number",
                    },
                    Change: {
                        name: "Change",
                        title: "Monthly Change",
                        type: "int?",
                        format: "change",
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
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            ComparedBar: {
                properties: {
                    hasWebSource: true,
                    width: "4",
                    periodOverPeriodSupport: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                        dashboardSubtitleClass: "period-over-period-dashboard-subtitle",
                    },
                },
                filters: {
                    timeGranularity: [
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                    ],
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
                y_axis: {
                    title: "Visits",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "Visits",
                    reversed: "False",
                },
            },
            ComparedLine: {
                properties: {
                    hideMarkersOnDaily: true,
                    periodOverPeriodSupport: true,
                    options: {
                        showLegend: false,
                        mobileWebAlgoChangeDate: true,
                        dashboardSubtitleClass: "period-over-period-dashboard-subtitle",
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            PeriodOverPeriodVisits: {
                properties: {
                    hasWebSource: true,
                    options: {
                        template:
                            "/app/components/single-metric/single-metric-website-overview-change-pop.html",
                        showSubtitle: false,
                        showLegend: false,
                        hideDurationFromSubtitle: true,
                    },
                    periodOverPeriodSupport: true,
                },
                objects: {
                    TotalVisits: {
                        name: "TotalVisits",
                        share: "ShareOfVisits",
                        title: "Total Visits",
                        type: "double",
                        format: "abbrNumber",
                        cellTemp: "large-number",
                    },
                    Change: {
                        name: "Change",
                        title: "Monthly Change",
                        type: "int?",
                        format: "change",
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
                filters: {
                    timeGranularity: [
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                    ],
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
        compare: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        mobileWebAlgoChangeDate: true,
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
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
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
                    },
                },
                objects: {
                    TotalVisits: {
                        name: "TotalVisits",
                        title: "Total Visits",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            Table: {
                properties: {
                    width: "2",
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
                        name: "TotalVisits",
                        title: "Total Visits",
                        type: "double",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "number-comma-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            overrideFormat: "abbrNumber",
                        },
                    },
                ],
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            TrafficGrowthComparison: {
                properties: {
                    periodOverPeriodSupport: true,
                    options: {
                        showLegend: false,
                    },
                },
            },
        },
    },
    getDashboardWidgetTypes: function (wizardParams: any, isCompare?: boolean) {
        const compare =
            isCompare !== undefined
                ? isCompare
                : _.isArray(wizardParams.competitorList) && wizardParams.competitorList.length > 0;
        const periodOverPeriod =
            wizardParams.comparedDurationSelectedItem || wizardParams.widget.comparedDuration;
        if (compare) {
            if (periodOverPeriod) {
                return ["TrafficGrowthComparison"];
            }
            return ["Graph", "PieChart", "Table"];
        } else {
            if (periodOverPeriod) {
                return ["ComparedBar", "ComparedLine", "PeriodOverPeriodVisits"];
            }
            return ["Graph", "PieChart", "SingleMetric"];
        }
    },
};

export const EngagementVisitsSI = {
    ...EngagementVisits,
    properties: {
        ...EngagementVisits.properties,
        state: "accountreview_website_overview_websiteperformance",
    },
};

export const EngagementOverviewUniques = {
    id: "EngagementOverviewUniques",
    serverId: "EngagementOverview",
    properties: {
        family: "Website",
        addToDashboardMetric: "EngagementOverview",
        hasWebSource: true,
        component: "WebAnalysis",
        customFetcherFactory: {
            path: "common.showGAApprovedData",
            factoryName: "ConnectedAssetsDataFetcherFactory",
        },
    },
    widgets: {
        single: {
            Table: {
                properties: {
                    options: {
                        showLegend: false,
                    },
                },
                columns: [
                    {
                        name: "Source",
                        title: "Source",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "AvgMonthVisits",
                        title: "Avg. Monthly Visits",
                        type: "double",
                        format: "minVisitsAbbr",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "number-comma-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "AvgVisitDuration",
                        title: "Avg. Visit Duration",
                        type: "double",
                        format: "number",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "time-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            overrideFormat: "time",
                        },
                    },
                    {
                        name: "PagesPerVisit",
                        title: "Pages/Visit",
                        type: "double",
                        format: "number",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "number-twodecimals-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "BounceRate",
                        title: "Bounce Rate",
                        type: "double",
                        format: "percentagesign:2",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "asc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                ],
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
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
                        title: "wa.ao.engagement.domain",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "website-tooltip-top-cell",
                        totalCount: "False",
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
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "UniqueUsers",
                        title: "wa.ao.graph.uv",
                        type: "double",
                        format: "minVisitsAbbr",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "VisitsPerUser",
                        title: "wa.ao.graph.vpu",
                        type: "double",
                        format: "number",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "number-twodecimals-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "AvgVisitDuration",
                        title: "wa.ao.graph.avgduration",
                        type: "double",
                        format: "number",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "time-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "PagesPerVisit",
                        title: "wa.ao.engagement.pagesvisit",
                        type: "double",
                        format: "number",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "number-twodecimals-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "BounceRate",
                        title: "wa.ao.graph.bounce",
                        type: "double",
                        format: "percentagesign:2",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "asc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                ],
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
    },
};

export const UniqueUsers = {
    id: "UniqueUsers",
    properties: {
        component: "UniqueVisitors",
        state: "websites-audienceOverview",
        dashboard: "true",
        useCombinedInsteadOfTotal: true,
        hasWebSource: true,
        title: "metric.uniquevisitors.title",
        family: "Website",
        order: "1",
        apiController: "UniqueUsers",
        customFetcherFactory: {
            path: "common.showGAApprovedData",
            factoryName: "ConnectedAssetsDataFetcherFactory",
        },
        availabilityComponent: "WsWebTrafficAndEngagement",
    },
    widgets: {
        single: {
            UniqueVisitors: {
                properties: {
                    width: "4",
                    headTemp: "unique-visitors-header",
                },
                objects: {
                    TotalVisits: {
                        name: "AverageTotalVisitsMonthly",
                        title: "wa.ao.graph.avgvisits",
                        type: "double",
                        format: "minVisitsAbbr",
                        cellTemp: "unique-visitors-row",
                    },
                    UniqueUsers: {
                        name: "AverageUniqueVisitorsMonthly",
                        title: "metric.monthlyuniquevisitors",
                        type: "double",
                        format: "minVisitsAbbr",
                        titleFormat: "roundNumber",
                        cellTemp: "unique-visitors-row-unsupported-date",
                        isBeta: true,
                    },
                    VisitsPerUser: {
                        name: "VisitsPerUser",
                        title: "metric.visitsperuser",
                        type: "double",
                        format: "number:2",
                        titleFormat: "number",
                        cellTemp: "unique-visitors-row-unsupported-date",
                        isBeta: true,
                    },
                },
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    stacked: true,
                    width: 2,
                    options: {
                        showLegend: false,
                    },
                    defaultTimeGranularity: "Monthly",
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "Unique Visits",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "Unique Visits",
                    reversed: "False",
                },
                filters: {
                    timeGranularity: [
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                        {
                            value: "Daily",
                            title: "Daily",
                        },
                    ],
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
            SingleMetric: {
                properties: {
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
                    modules: {
                        Industry: {
                            title: "wa.ao.totalvisits",
                        },
                    },
                },
                objects: {
                    TotalVisits: {
                        name: "AverageUniqueVisitorsMonthly",
                        title: "Monthly Unique Visitors",
                        type: "number",
                        format: "abbrNumberVisits",
                        cellTemp: "large-number",
                    },
                    Change: {
                        name: "Change",
                        title: "Monthly Change",
                        type: "int?",
                        format: "change",
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
                filters: {
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
        compare: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    defaultTimeGranularity: "Monthly",
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "Unique Visits",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "Unique Visits",
                    reversed: "False",
                },
                filters: {
                    timeGranularity: [
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                        {
                            value: "Daily",
                            title: "Daily",
                        },
                    ],
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
    },
};

export const AudienceInterests = {
    id: "AudienceInterests",
    properties: {
        dashboard: "true",
        title: "dashboard.metrics.titles.audience.interests",
        family: "Website",
        component: "WebAnalysis",
        order: "1",
        state: "websites-audienceInterests",
        apiController: "AudienceInterests",
        noCompare: true,
        availabilityComponent: "WsWebAudienceInterests",
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
                        minWidth: 220,
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
                    {
                        name: "Rank",
                        title: "Rank",
                        type: "long",
                        format: "rank",
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
                    {
                        name: "RelevancyScore",
                        title: "RelevancyScore",
                        tooltip: "",
                        cellTemp: "score-bar-cell",
                        sortable: true,
                        minWidth: 135,
                    },
                    {
                        name: "Overlap",
                        title: "Overlap",
                        type: "double",
                        format: "percentage",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "percentage-cell",
                        totalCount: "False",
                        tooltip: "",
                        progressBarTooltip: "Visits",
                        width: 110,
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
                        width: 80,
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "RelevancyScore desc",
                            title: "RelevancyScore",
                        },
                    ],
                },
            },
        },
    },
};

export const EngagementDedup = {
    id: "EngagementDedup",
    properties: {
        component: "UniqueVisitors",
        state: "websites-audienceOverview",
        hasWebSource: false,
        title: "metric.uniquevisitors.title",
        family: "Website",
        order: "1",
        apiController: "TrafficAndEngagement",
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    width: 2,
                    options: {
                        showLegend: false,
                        widgetColors: "forceSetupColors",
                    },
                    defaultTimeGranularity: "Monthly",
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "Unique Visits",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "Unique Visits",
                    reversed: "False",
                },
                filters: {
                    timeGranularity: [
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                    ],
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
        compare: {
            Graph: {
                properties: {
                    hideMarkersOnDaily: true,
                    defaultTimeGranularity: "Monthly",
                },
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                y_axis: {
                    title: "Unique Visits",
                    type: "long",
                    format: "minVisitsAbbr",
                    formatParameter: 0,
                    name: "Unique Visits",
                    reversed: "False",
                },
                filters: {
                    timeGranularity: [
                        {
                            value: "Monthly",
                            title: "Monthly",
                        },
                    ],
                    ShouldGetVerifiedData: [
                        {
                            value: "true",
                            title: "Yes",
                        },
                        {
                            value: "false",
                            title: "No",
                        },
                    ],
                },
            },
        },
    },
};
