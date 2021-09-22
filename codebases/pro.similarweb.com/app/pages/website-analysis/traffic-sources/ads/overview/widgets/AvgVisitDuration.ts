import { getEngagementBaseClass } from "../../utils";
import { MmxVisitDurationWidget } from "components/widget/widget-types/MmxVisitDurationWidget";

function getWidgetConfig({ mode }) {
    const isCompare = mode === "compare";
    return {
        properties: {
            excelMetric: "SearchOrganicPaidOverview",
            width: "12",
            webSource: "Total",
            trackName: "Over Time Graph/display_and_video_engagement/Visit Duration",
            height: "300px",
            loadingHeight: "300px",
            title: "analysis.sources.ads.overview.engagements.metrics",
            tooltip: "mmx.channelanalysis.avgVisitDuration.tooltip",
            apiController: "WebsiteDisplayAds",
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
            apiParams: {
                metric: "AverageDuration",
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
    };
}

function getMetricTypeConfig(params) {
    return {
        properties: {},
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
            formatParameter: 2,
            name: "Visits",
            reversed: "False",
        },
        filters: {},
    };
}

export default getEngagementBaseClass(MmxVisitDurationWidget, getWidgetConfig, getMetricTypeConfig);
