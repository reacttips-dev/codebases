/**
 * Created by Eran.Shain on 11/24/2016.
 */
import CategoryBenchmark from "./components/CategoryBenchmark";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

export const channelAnalysisWidgetsConfig = (
    compare,
    comparedDuration,
    websource,
    includeSubDomains,
    showCTAButton,
) => {
    return {
        trafficSourcesOverview: {
            barChart: {
                type: "BarChartMMX",
                properties: {
                    metric: "TrafficSourcesOverview",
                    family: "Website",
                    periodOverPeriodSupport: true,
                    apiController:
                        websource === devicesTypes.MOBILE ? "MarketingMixMobile" : "MarketingMix",
                    width: "12",
                    height:
                        (comparedDuration ? (compare ? 484 : 290) : 230) +
                        (showCTAButton ? 65 : 0) +
                        "px",
                    loadingHeight:
                        (comparedDuration ? (compare ? 484 : 290) : 230) +
                        (showCTAButton ? 65 : 0) +
                        "px",
                    title:
                        compare && comparedDuration
                            ? "metric.engagementTrafficSourcesOverview.pop-compare.title"
                            : "mmx.trafficSources.bar.title",
                    tooltip: "mmx.trafficSources.bar.tooltip",
                    excelMetric: "TrafficSourcesOverview",
                    options: {
                        legendAlign: "left",
                        showTopLine: false,
                        showFrame: true,
                        showLegend: !comparedDuration,
                        titlePaddingBottom: "20px",
                        titleClass: "titleRow-no-padding",
                        showSubtitle:
                            websource === devicesTypes.MOBILE || (compare && !!comparedDuration),
                        showSettings: false,
                        showTitle: true,
                        titleType: "text",
                        showTitleTooltip: true,
                        newColorPalette: true,
                        barWidth: 50,
                        barShowLegend: false,
                        hideCategoriesIcons: true,
                        noBottomPadding: true,
                        canAddToDashboard: comparedDuration === "", // desktop and mobile only
                        legendContainerClass: "legend-container-width-large",
                        showWebSource: false,
                        showCountry: false,
                        cssClass: "chart-xaxis-with-tooltips",
                        ctaButton: showCTAButton
                            ? "mmx.trafficSources.bar.discover.hook.button.text"
                            : undefined,
                    },
                    apiParams: {
                        includeSubDomains: includeSubDomains,
                    },
                    trackName: "Bar Chart/Traffic Sources Overview",
                },
                utilityGroups: [
                    {
                        properties: {
                            className: "align-mmx-barchart",
                        },
                        utilities: [
                            !comparedDuration && {
                                id: "widget-toggle",
                                type: "number-percent",
                                properties: {
                                    trackingCategory: "Measure Button",
                                    defaultItem: compare ? "number" : "percent",
                                    items: [
                                        { title: "%", value: "percent" },
                                        { title: "#", value: "number" },
                                    ],
                                },
                            },
                            (!comparedDuration || (compare && !!comparedDuration)) && {
                                id: "chart-export",
                                properties: {
                                    hideExcel: true,
                                    wkhtmltoimage: true,
                                },
                            },
                        ],
                    },
                    {
                        properties: {
                            className: "titleRow-no-padding",
                        },
                        utilities: [
                            !comparedDuration &&
                                websource !== devicesTypes.MOBILE && {
                                    id: "react-component",
                                    properties: {
                                        component: CategoryBenchmark,
                                    },
                                },
                        ],
                    },
                ],
            },
            table: {
                type: "MmxTrafficSourcesTable",
                metric: "TrafficSourcesOverviewDataKpiWidget",
                properties: {
                    metric: "TrafficSourcesOverviewDataKpiWidget",
                    apiParams: {
                        metric: "TrafficSourcesOverviewData",
                    },
                    type: "MmxTrafficSourcesTable",
                    apiController:
                        websource === devicesTypes.MOBILE ? "MarketingMixMobile" : "MarketingMix",
                    height: "auto",
                    width: "12",
                    title: "category.overview.source",
                    tooltip: comparedDuration
                        ? "mmx.trafficSources.table.tooltip.compared"
                        : "mmx.trafficSources.table.tooltip",
                    options: {
                        cssClass: "widgetTable",
                        showIndex: true,
                        showTitle: true,
                        showTitleTooltip: true,
                        titleType: "text",
                        titlePaddingBottom: "0px",
                        titleClass: "table-title-padding",
                        legendClass: "mmx-table-legend-compare",
                        showSubtitle: false,
                        showLegend: false,
                        showSettings: false,
                        showTopLine: false,
                        showFrame: false,
                        loadingSize: 20,
                        showCompanySidebar: true,
                        newColorPalette: true,
                    },
                },
                utilityGroups: [
                    {
                        properties: {
                            className: "tableTopRow",
                        },
                        utilities: [
                            {
                                id: "table-search",
                                properties: {
                                    column: "Domain",
                                },
                            },
                            {
                                id: "dropdown",
                                properties: {
                                    param: "filter",
                                    column: "category",
                                    operator: "category",
                                    placeholder: "All Categories",
                                    showSearch: true,
                                    trackingName: "Referring Category",
                                    emptySelect: true,
                                },
                            },
                            {
                                id: "dropdown",
                                properties: {
                                    param: "filter",
                                    type: "string",
                                    column: "sourceType",
                                    operator: "==",
                                    placeholder: "All Sources",
                                    showSearch: true,
                                    trackingName: "Traffic Source",
                                    emptySelect: true,
                                },
                            },
                            {
                                id: "table-clear",
                                properties: {},
                            },
                        ],
                    },
                    {
                        properties: {
                            className: "absoluteTitleRow",
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
        },
    };
};
