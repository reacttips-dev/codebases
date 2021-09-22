import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { ToggleHeaderCellRightAlign } from "../../../components/React/Table/headerCells";

let getWidgets = (mode) => {
    var visitsSingleMetric = {
        type: "AudienceOverviewVisits",
        properties: {
            metric: "EngagementVisits",
            type: "AudienceOverviewVisits",
            width: "4",
            height: "102px",
            title: "wa.ao.totalvisits",
            options: {
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                titleClass: "",
                titleIcon: true,
                height: "102px",
                template:
                    "/app/components/single-metric/single-metric-website-overview-change.html",
            },
        },
    };
    var visitsPie = {
        type: "PieChart",
        async: "true",
        properties: {
            metric: "EngagementDesktopVsMobileVisits",
            type: "PieChart",
            width: "4",
            height: "102px",
            title: "wa.ao.trafficshare",
            options: {
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                widgetColors: "mobileWebColors",
                widgetIcons: "mobileWebIcons",
                isMobileOrDesktopOnly: true,
            },
        },
    };
    var webRanks = {
        type: "SingleMetric",
        properties: {
            metric: "WebRanks",
            type: "SingleMetric",
            width: "4",
            height: "211px",
            loadingHeight: "201px",
            title: "wa.ao.ranks",
            options: {
                showTitle: false,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: false,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                widgetColors: "mobileWebColors",
                titleClass: "page-widget-title",
                showOverflow: true,
                noTopPadding: true,
                noBottomPadding: true,
                renderTextInsteadOfLinks: true,
            },
        },
    };

    var engagementGraph = {
        type: "EngagementMetricsChart",
        properties: {
            metric: "EngagementVisits",
            type: "EngagementMetricsChart",
            width: "12",
            height: "340px",
            title: "wa.ao.graph.avgvisits",
            apiController: "TrafficAndEngagement",
            excelMetric: "EngagementOverview",
            options: {
                showTitle: false,
                showTitleTooltip: false,
                showSubtitle: false,
                showLegend: false,
                legendAlign: "left",
                legendTop: -20,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                noTopPadding: true,
                floatingLegend: true,
                legendData: true,
                sumTooltipValues: true,
                //"audienceOverviewColors": true,
                alignWithLegend: true,
                widgetColors: "mobileWebColors",
                titleClass: "page-widget-title",
                dailyDataSince: "2015-10-01",
                plotLineIndicator: true,
                hideMarkersOnDaily: true,
                addToDashboardIconClass: "scorable-tabs-add-to-dashboard",
            },
            trackName: "Over Time Graph/Engagement Overview",
            cachedParams: ["timeGranularity", "metric"],
            apiParams: {
                timeGranularity: "Daily",
            },
        },
        utilityGroups: [
            {
                properties: {
                    className: "ScorableTabs",
                },
            },
            {
                id: "engagement-ga-chart-granularity",
                properties: {
                    className:
                        "titleRow align-with-legend no-padding-right margin-right__large engagement-ga-chart-granularity",
                },
                utilities: [
                    {
                        id: "ga-verify",
                        properties: {},
                    },
                    {
                        id: "time-granularity",
                        properties: {},
                    },
                    {
                        id: "chart-export",
                        properties: {
                            utilitiesData: ["graph-tabs"],
                            wkhtmltoimage: true,
                            hideExcel: function () {
                                return !swSettings.components.Home.resources.IsExcelAllowed;
                            },
                        },
                    },
                ],
            },
        ],
    };
    var periodOverPeriodGraph: any = _.merge({}, engagementGraph, {
        type: "ComparedLine",
        properties: {
            type: "ComparedLine",
            apiParams: {
                timeGranularity: "Monthly",
            },
            options: {
                showLegend: true,
                legendData: false,
            },
        },
    });
    periodOverPeriodGraph.utilityGroups[1].utilities[2].properties.hidePNG = true;
    periodOverPeriodGraph.utilityGroups[1].utilities.splice(1, 0, {
        id: "chart-toggle",
        properties: {
            class: "chart-toggle-utility",
        },
    });
    //remove  granularity picker in POP
    periodOverPeriodGraph.utilityGroups[1].utilities = periodOverPeriodGraph.utilityGroups[1].utilities.filter(
        (a) => a.id !== "time-granularity",
    );
    var periodOverPeriodVisits = _.merge({}, visitsSingleMetric, {
        type: "PeriodOverPeriodVisits",
        properties: {
            type: "PeriodOverPeriodVisits",
            height: "107px",
            options: {
                template:
                    "/app/components/single-metric/single-metric-website-overview-change-pop.html",
                showSubtitle: false,
            },
        },
    });

    var visitsTable = {
        type: "Table",
        properties: {
            metric: "EngagementVisits",
            type: "Table",
            width: "4",
            height: "auto",
            loadingHeight: "132px",
            title: "wa.ao.compare.totalvisits",
            options: {
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                preserveLegendSpace: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                //"audienceOverviewColors": true,
                hideBorders: true,
                titleIcon: true,
            },
            columns: [
                {
                    field: "Domain",
                },
                {
                    field: "TotalVisits",
                    cellTemplate: "compare-progressbar",
                    headerComponent: ToggleHeaderCellRightAlign,
                    cellClass: "progress-bar-hide-on-medium-screen",
                    format: "minVisitsAbbr",
                    fields: [
                        {
                            symbol: "widget-toggle-rank",
                            field: "TotalVisits",
                            format: "minVisitsAbbr",
                            isActive: true,
                        },
                        {
                            symbol: "widget-toggle-percentage",
                            field: "ShareOfVisits",
                            format: "percentagesign",
                            isActive: false,
                        },
                    ],
                },
            ],
        },
    };
    var webRankTable = {
        type: "Table",
        properties: {
            metric: "WebRanksCountry",
            type: "Table",
            width: "4",
            height: "auto",
            loadingHeight: "118px",
            title: "wa.ao.ranks.dropdown",
            options: {
                inlineBorderless: true,
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                subtitleMarginBottom: "0px",
                showLegend: false,
                preserveLegendSpace: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                titleClass: "page-widget-title",
                hideBorders: true,
                hideDuration: true,
                hideHeader: false,
                trackName: "WebRank",
                tableClass: "web-ranks-table",
            },
        },
        utilityGroups: [
            {
                properties: {
                    className: "titleRowLeft",
                },
                utilities: [
                    {
                        id: "dropdown",
                        properties: {
                            chosen: "WebRanksCountry",
                            param: "metric",
                            column: "",
                            type: "number",
                            minWidth: "144px",
                            width: "210px",
                            className: "title-dropdown-web-ranks-table",
                            showSearch: false,
                            emptySelect: false,
                            placeholder: null,
                            asBorderless: true,
                            onChange: (ctrl, newVal) => {
                                // update the value of the widget's apiParam -'metric'- to the chosen dropdown value.
                                ctrl.widget.apiParams = { [ctrl.utility.properties.param]: newVal };
                            },
                            values: [
                                {
                                    disabled: false,
                                    text: "wa.ao.ranks.dropdown.country",
                                    id: "WebRanksCountry",
                                },
                                {
                                    disabled: false,
                                    text: "wa.ao.ranks.dropdown.global",
                                    id: "WebRanksGlobal",
                                },
                                {
                                    disabled: false,
                                    text: "wa.ao.ranks.dropdown.category",
                                    id: "WebRanksCategory",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
    var desktopVsMobile = {
        type: "DesktopVSMobile",
        properties: {
            metric: "EngagementDesktopVsMobileVisits",
            type: "DesktopVSMobile",
            width: "4",
            loadingHeight: "132px",
            height: "auto",
            title: "wa.ao.trafficshare",
            options: {
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                hideBorders: true,
            },
        },
    };
    var engagementTable = {
        type: "Table",
        properties: {
            metric: "EngagementOverview",
            apiController: "TrafficAndEngagement",
            type: "Table",
            width: "12",
            height: "auto",
            loadingHeight: "132px",
            title: "wa.ao.engagement",
            apiParams: {
                includeLeaders: true,
            },
            options: {
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                preserveLegendSpace: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                titleClass: "page-widget-title",
                canAddToDashboard: true,
            },
            columns: [
                {
                    field: "Domain",
                    cellClass: "leaders-cell",
                    cellTemplate: "website-tooltip-top-cell",
                },
                {
                    field: "AvgMonthVisits",
                    cellTemplate: "leader-default-cell",
                    format: "minVisitsAbbr",
                    sortable: true,
                    headerCellTemplate: "leader-default-header-cell",
                    headerCellIconName: "visits",
                    cellClass: "leaders-cell",
                },
                {
                    field: "AvgVisitDuration",
                    cellTemplate: "leader-default-cell",
                    format: "time",
                    sortable: true,
                    headerCellTemplate: "leader-default-header-cell",
                    headerCellIconName: "avg-visit-duration",
                    cellClass: "leaders-cell",
                },
                {
                    field: "PagesPerVisit",
                    cellTemplate: "leader-default-cell",
                    format: "number:2",
                    sortable: true,
                    headerCellTemplate: "leader-default-header-cell",
                    headerCellIconName: "pages-per-visit",
                    cellClass: "leaders-cell",
                },
                {
                    field: "BounceRate",
                    cellTemplate: "leader-default-cell",
                    format: "percentagesign:2",
                    sortable: true,
                    headerCellTemplate: "leader-default-header-cell",
                    headerCellIconName: "bounce-rate-2",
                    inverted: true,
                    cellClass: "leaders-cell",
                },
            ],
        },
    };

    const periodOverPeriodGraphCompare = {
        type: "TrafficGrowthComparison",
        properties: {
            apiController: "TrafficGrowthComparison",
            metric: "EngagementVisits",
            type: "TrafficGrowthComparison",
            width: "12",
            height: "300",
            loadingHeight: "87px",
            title: "traffic_and_engagement.growth_change.compare.title",
            excelMetric: "EngagementVisits",
            options: {
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                titleIcon: false,
                showOverflow: true,
                titleClass: "page-widget-title Traffic-Growth-Comparison-title",
                showWebSource: true,
            },
        },
        utilityGroups: [
            {
                properties: {
                    className: "titleRow swWidget-utilityGroup-align-with-title",
                },
                utilities: [
                    {
                        id: "chart-export",
                        properties: {
                            utilitiesData: ["graph-tabs"],
                            wkhtmltoimage: true,
                            hideExcel: () => !swSettings.components.Home.resources.IsExcelAllowed,
                            exportOptions: { pngWidth: "auto" },
                        },
                    },
                ],
            },
        ],
    };

    var presets = {
        single: [visitsSingleMetric, visitsPie, webRanks],
        compare: [visitsTable, desktopVsMobile, webRankTable],
        singlePeriodOverPeriod: [periodOverPeriodVisits, visitsPie, webRanks],
        comparePeriodOverPeriod: [periodOverPeriodGraphCompare],
    };
    return presets[mode];
};
export const AccountReviewAudienceOverviewWidgets = getWidgets;
