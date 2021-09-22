import * as React from "react";
import { icons } from "@similarweb/icons";

// Todo: it is an anti pattern to wrap a component that should be styled in a styled component!
// Todo:  what actually has to be done is refactor the SearchInput into a styled component, which should be done in a tech debt.

export const overview = {
    totalVisits: {
        single: {
            type: "SingleMetric",
            properties: {
                family: "Website",
                metric: "SearchVisitsOverview",
                type: "SingleMetric",
                width: "4",
                height: "102px",
                title: "analysis.source.search.overview.totalvisits",
                tooltip: "analysis.source.search.overview.totalvisits",
                numberField: "SearchTotal",
                percentField: "VolumeTotal",
                options: {
                    noBoxShadow: true,
                    showTitle: true,
                    showTitleTooltip: true,
                    titleType: "text",
                    showSubtitle: true,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: true,
                    titleIcon: false,
                    height: "102px",
                    template: "/app/components/single-metric/single-metric-total-visits.html",
                    titleTemplate:
                        "/app/components/widget/widget-templates/widget-title-mobile-desktop.html",
                    frameClass: "responsive",
                },
                chartOptions: {
                    legend: {
                        enabled: false,
                    },
                    chart: {
                        spacing: [0, 0, 0, 0],
                    },
                },
            },
        },
        compare: {
            type: "TablePieTotalVisits",
            properties: {
                family: "Website",
                metric: "SearchVisitsOverview",
                type: "TablePieTotalVisits",
                width: "4",
                height: "auto",
                loadingHeight: "132px",
                title: "analysis.source.search.overview.totalvisits",
                tooltip: "analysis.source.search.overview.totalvisits",
                options: {
                    noBoxShadow: true,
                    showTitle: true,
                    showTitleTooltip: true,
                    titleType: "text",
                    showSubtitle: true,
                    showLegend: false,
                    preserveLegendSpace: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: true,
                    hideBorders: true,
                    titleIcon: false,
                    titleTemplate:
                        "/app/components/widget/widget-templates/widget-title-mobile-desktop.html",
                    frameClass: "responsive",
                },
                columns: [
                    {
                        field: "SearchTotal",
                        cellTemplate: "table-pie-cell",
                        headerCellTemplate: "toggle-header-cell",
                        format: "abbrNumber",
                        fields: [
                            {
                                symbol: "widget-toggle-rank",
                                field: "SearchTotal",
                                format: "abbrNumber",
                                isActive: true,
                            },
                            {
                                symbol: "widget-toggle-percentage",
                                field: "ShareOfVisits",
                                format: "percentagesign:2",
                                isActive: false,
                            },
                        ],
                    },
                ],
                chartOptions: {
                    legend: {
                        enabled: false,
                    },
                    chart: {
                        spacing: [0, 0, 0, 0],
                    },
                },
            },
        },
    },
    organicVsPaid: {
        single: {
            type: "PieChart",
            properties: {
                family: "Website",
                widgetTemplateUrl:
                    "/app/components/widget/widget-templates/piechart-search-mobileweb.html",
                metric: "SearchOrganicPaidOverview",
                type: "PieChart",
                width: "2",
                height: "102px",
                title: "analysis.source.search.overview.organicpaid",
                tooltip: "analysis.source.search.overview.organicpaid.tooltip",
                options: {
                    noBoxShadow: true,
                    innerSize: "67%",
                    showTitle: true,
                    showTitleTooltip: true,
                    titleType: "text",
                    showSubtitle: true,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: true,
                    showOverflow: true,
                    widgetColors: "mobileWebColors",
                    widgetIcons: "mobileWebIcons",
                    isMobileOrDesktopOnly: true,
                    frameClass: "responsive",
                },
                chartOptions: {
                    legend: {
                        enabled: false,
                    },
                    chart: {
                        spacing: [0, 0, 0, 0],
                    },
                },
            },
            chartConfig: {
                plotOptions: {
                    pie: {
                        borderWidth: 3,
                    },
                },
                tooltip: {
                    formatter: function () {
                        return this.key + "<br /><b>" + this.percentage.toFixed(2) + "%</b>";
                    },
                },
                legend: {
                    labelFormatter() {
                        const itemMarker =
                            this.name === "Paid"
                                ? `<span class="item-marker-mobileweb">${icons["paid-keywords"]}</span>`
                                : `<span class="item-marker-mobileweb">${icons.search}</span>`;

                        return `<div class="pieChart-legend">
                                        <span class="legend-text">
                                        ${itemMarker}
                                            <span class="legend-name-mobileweb" title="${
                                                this.name
                                            }">${this.name}</span>
                                        </span>&nbsp
                                        <span class="legend-value-mobileweb" style="color:${
                                            this.color
                                        }">${this.percentage.toFixed(2)}%</span>
                                   </div>`;
                    },
                },
            },
        },
        compare: {
            type: "Table",
            properties: {
                family: "Website",
                widgetTemplateUrl:
                    "/app/components/widget/widget-templates/table-simple-mobileweb.html",
                metric: "SearchOrganicPaidOverview",
                type: "Table",
                width: "4",
                loadingHeight: "132px",
                height: "auto",
                title: "analysis.source.search.overview.organicpaid",
                tooltip: "analysis.source.search.overview.organicpaid.tooltip",
                options: {
                    noBoxShadow: true,
                    showTitle: true,
                    showTitleTooltip: true,
                    titleType: "text",
                    showSubtitle: true,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: true,
                    hideBorders: true,
                    frameClass: "responsive",
                },
            },
        },
    },
    brandedNonBranded: {
        single: {
            type: "PieChart",
            properties: {
                family: "Website",
                widgetTemplateUrl: "/app/components/widget/widget-templates/piechart-search.html",
                metric: "SearchBrandedKeywords",
                type: "PieChart",
                width: "2",
                height: "102px",
                title: "analysis.source.search.overview.brandednonbranded",
                tooltip: "analysis.source.search.overview.brandednonbranded.tooltip",
                options: {
                    noBoxShadow: true,
                    innerSize: "67%",
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
                    titleIcon: false,
                    showOverflow: true,
                    isMobileOrDesktopOnly: false,
                    frameClass: "responsive",
                },
                chartOptions: {
                    legend: {
                        enabled: false,
                    },
                    chart: {
                        spacing: [0, 0, 0, 0],
                    },
                },
            },
            chartConfig: {
                plotOptions: {
                    pie: {
                        borderWidth: 3,
                    },
                },
                tooltip: {
                    formatter: function () {
                        return this.key + "<br /><b>" + this.percentage.toFixed(2) + "%</b>";
                    },
                },
                legend: {
                    labelFormatter() {
                        return `<div class="pieChart-legend">
                                        <span class="legend-text">
                                            <span class="item-marker-mobileweb ${
                                                this.name === "Branded"
                                                    ? "sw-icon-branded"
                                                    : "sw-icon-non-branded"
                                            }" style="color:rgb(176, 186, 200)"></span>
                                            <span class="legend-name-mobileweb" title="${
                                                this.name
                                            }">${
                            this.name === "Branded" ? "Branded" : "Non-Branded"
                        }</span>
                                        </span>
                                        <span class="legend-value-mobileweb" style="color:${
                                            this.color
                                        }">${this.percentage.toFixed(2)}%</span>
                                   </div>`;
                    },
                },
            },
        },
        compare: {
            type: "Table",
            properties: {
                family: "Website",
                metric: "SearchBrandedKeywords", //SearchBrandedKeywords
                type: "Table",
                width: "4",
                loadingHeight: "132px",
                height: "auto",
                title: "analysis.source.search.overview.brandednonbranded",
                tooltip: "analysis.source.search.overview.brandednonbranded.tooltip",
                options: {
                    noBoxShadow: true,
                    showTitle: true,
                    showTitleTooltip: true,
                    titleType: "text",
                    showSubtitle: true,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: true,
                    hideBorders: true,
                    frameClass: "responsive",
                },
            },
        },
    },
};
export const channelEngagements = {
    trafficShare: {
        type: "ChannelAnalysisGraphSearch",
        properties: {
            metric: "MmxTrafficShare",
            excelMetric: "SearchOrganicPaidOverview",
            type: "ChannelAnalysisGraphSearch",
            width: "12",
            webSource: "Total",
            trackName: "Traffic share",
            height: "300px",
            loadingHeight: "300px",
            title: "mmx.channelanalysis.title",
            tooltip: "mmx.channelanalysis.trafficShare.tooltip",
            options: {
                noBoxShadow: true,
                showTitle: false,
                showTitleTooltip: false,
                showSubtitle: false,
                showLegend: true,
                showSettings: false,
                showTopLine: true,
                showFrame: false,
                showOverflow: true,
                noTopPadding: false,
                floatingLegend: false,
                sumTooltipValues: false,
                alignWithLegend: false,
                newColorPalette: true,
                legendContainerClass: "legend-container-width-large",
                widgetColorsFrom: "audienceOverview",
                useNewLegends: true,
            },
            chartOptions: {
                legend: {
                    enabled: false,
                },
                chart: {
                    spacing: [0, 0, 0, 0],
                },
            },
        },
        utilityGroups: [
            {
                properties: {
                    className: "absoluteBottom-align-to-data",
                },
                utilities: [
                    {
                        id: "widget-toggle",
                        type: "number-percent",
                        properties: {
                            trackingCategory: "Measure Button",
                            defaultItem: "number",
                            items: [
                                { title: "%", value: "percent" },
                                { title: "#", value: "number" },
                            ],
                        },
                    },
                    {
                        id: "chart-export",
                        properties: {
                            wkhtmltoimage: true,
                            metricDisplayName: "mmx.channelanalysis.traffic-share.title",
                            exportOptions: {
                                pngWidth: "auto",
                            },
                        },
                    },
                ],
            },
        ],
    },
    avgVisitDuration: {
        type: "MmxVisitDuration",
        properties: {
            metric: "MmxAvgVisitDuration",
            excelMetric: "SearchOrganicPaidOverview",
            type: "MmxVisitDuration",
            width: "12",
            webSource: "Total",
            trackName: "Visit Duration",
            height: "300px",
            loadingHeight: "300px",
            title: "mmx.channelanalysis.title",
            tooltip: "mmx.channelanalysis.avgVisitDuration.tooltip",
            options: {
                noBoxShadow: true,
                showTitle: false,
                showTitleTooltip: false,
                showSubtitle: false,
                showLegend: true,
                showSettings: false,
                showTopLine: true,
                showFrame: false,
                noTopPadding: false,
                floatingLegend: false,
                sumTooltipValues: false,
                alignWithLegend: false,
                newColorPalette: true,
                legendContainerClass: "legend-container-width-large",
                useNewLegends: true,
            },
            chartOptions: {
                legend: {
                    enabled: false,
                },
            },
        },
        utilityGroups: [
            {
                properties: {
                    className: "absoluteBottom-align-to-data",
                },
                utilities: [
                    {
                        id: "chart-export",
                        properties: {
                            wkhtmltoimage: true,
                            metricDisplayName: "mmx.channelanalysis.duration.title",
                        },
                    },
                ],
            },
        ],
    },
    pagesPerVisit: {
        type: "MmxPagesPerVisit",
        properties: {
            metric: "MmxPagesPerVisit",
            excelMetric: "SearchOrganicPaidOverview",
            type: "MmxPagesPerVisit",
            width: "12",
            webSource: "Total",
            trackName: "Pages per visit",
            height: "300px",
            loadingHeight: "300px",
            title: "mmx.channelanalysis.title",
            tooltip: "mmx.channelanalysis.pagesPerVisit.tooltip",
            options: {
                noBoxShadow: true,
                showTitle: false,
                showTitleTooltip: false,
                showSubtitle: false,
                showLegend: true,
                showSettings: false,
                showTopLine: true,
                showFrame: false,
                noTopPadding: false,
                floatingLegend: false,
                sumTooltipValues: false,
                alignWithLegend: false,
                newColorPalette: true,
                legendContainerClass: "legend-container-width-large",
                useNewLegends: true,
            },
            chartOptions: {
                legend: {
                    enabled: false,
                },
            },
        },
        utilityGroups: [
            {
                properties: {
                    className: "absoluteBottom-align-to-data",
                },
                utilities: [
                    {
                        id: "chart-export",
                        properties: {
                            wkhtmltoimage: true,
                            metricDisplayName: "mmx.channelanalysis.page-visits.title",
                        },
                    },
                ],
            },
        ],
    },
    bounceRate: {
        type: "MmxBounceRate",
        properties: {
            metric: "MmxBounceRate",
            excelMetric: "SearchOrganicPaidOverview",
            type: "MmxBounceRate",
            width: "12",
            webSource: "Total",
            trackName: "Bounce Rate",
            height: "300px",
            loadingHeight: "300px",
            title: "mmx.channelanalysis.title",
            tooltip: "mmx.channelanalysis.bounceRate.tooltip",
            options: {
                noBoxShadow: true,
                showTitle: false,
                showTitleTooltip: false,
                showSubtitle: false,
                showLegend: true,
                showSettings: false,
                showTopLine: true,
                showFrame: false,
                noTopPadding: false,
                floatingLegend: false,
                sumTooltipValues: false,
                alignWithLegend: false,
                newColorPalette: true,
                legendContainerClass: "legend-container-width-large",
                useNewLegends: true,
            },
            chartOptions: {
                legend: {
                    enabled: false,
                },
            },
        },
        utilityGroups: [
            {
                properties: {
                    className: "absoluteBottom-align-to-data",
                },
                utilities: [
                    {
                        id: "chart-export",
                        properties: {
                            wkhtmltoimage: true,
                            metricDisplayName: "mmx.channelanalysis.bounce-rate.title",
                        },
                    },
                ],
            },
        ],
    },
};
