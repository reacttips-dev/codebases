import { getEngagementBaseClass } from "../../utils";
import { MmxBounceRateWidget } from "components/widget/widget-types/MmxBounceRateWidget";

function getWidgetConfig({ mode }) {
    const isCompare = mode === "compare";
    return {
        properties: {
            excelMetric: "SearchOrganicPaidOverview",
            width: "12",
            webSource: "Total",
            trackName: "Over Time Graph/display_and_video_engagement/Bounce Rate",
            height: "300px",
            loadingHeight: "300px",
            title: "analysis.sources.ads.overview.engagements.metrics",
            tooltip: "mmx.channelanalysis.bounceRate.tooltip",
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
                metric: "BounceRate",
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
            format: "percentagesign",
            formatParameter: 2,
            name: "Visits",
            reversed: "False",
            yAxisMax: 1,
        },
        filters: {},
    };
}

export default getEngagementBaseClass(MmxBounceRateWidget, getWidgetConfig, getMetricTypeConfig);
