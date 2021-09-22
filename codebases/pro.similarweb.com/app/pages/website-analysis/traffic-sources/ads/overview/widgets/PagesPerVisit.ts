import { getEngagementBaseClass } from "../../utils";
import { MmxPagesPerVisitWidget } from "components/widget/widget-types/MmxPagesPerVisitWidget";

function getWidgetConfig({ mode }) {
    const isCompare = mode === "compare";
    return {
        properties: {
            excelMetric: "SearchOrganicPaidOverview",
            width: "12",
            webSource: "Total",
            trackName: "Over Time Graph/display_and_video_engagement/Pages per visit",
            height: "300px",
            loadingHeight: "300px",
            title: "analysis.sources.ads.overview.engagements.metrics",
            tooltip: "mmx.channelanalysis.pagesPerVisit.tooltip",
            options: {
                noBoxShadow: true,
                showTitle: false,
                showTitleTooltip: false,
                showSubtitle: false,
                showLegend: true, //isCompare,
                preserveLegendSpace: false,
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
            apiParams: {
                metric: "PagesPerVisit",
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
    };
}

function getMetricTypeConfig(params) {
    return {
        properties: {
            hideMarkersOnDaily: false,
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
            format: "abbrNumberVisits",
            formatParameter: 2,
            name: "Visits",
            reversed: "False",
        },
        filters: {},
    };
}

export default getEngagementBaseClass(MmxPagesPerVisitWidget, getWidgetConfig, getMetricTypeConfig);
