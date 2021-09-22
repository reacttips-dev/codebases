import { getEngagementBaseClass } from "../../utils";
import { ChannelAnalysisGraphWidget } from "components/widget/widget-types/ChannelAnalysisGraphWidget";

function getWidgetConfig({ widgetDataFetcher, mode }) {
    const isCompare = mode === "compare";
    let utilities = [
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
    ];
    if (!isCompare) {
        utilities = utilities.slice(1);
    }
    return {
        //type: "ChannelAnalysisGraphSearch",
        properties: {
            // metric: "MmxTrafficShare",
            excelMetric: "SearchOrganicPaidOverview",
            widgetDataFetcher,
            //type: "ChannelAnalysisGraphSearch",
            width: "12",
            webSource: "Desktop",
            trackName: "Over Time Graph/display_and_video_engagement/Traffic share",
            height: "300px",
            loadingHeight: "300px",
            title: "analysis.sources.ads.overview.engagements.metrics",
            tooltip: "mmx.channelanalysis.trafficShare.tooltip",
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
            apiParams: {
                metric: "TrafficShare",
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
                utilities,
            },
        ],
    };
}

function getMetricTypeConfig(params) {
    return {
        properties: {
            hideMarkersOnDaily: false,
            stacked: true,
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
        },
        filters: {},
    };
}

export default class DisplayAdsTrafficShare extends getEngagementBaseClass(
    ChannelAnalysisGraphWidget,
    getWidgetConfig,
    getMetricTypeConfig,
) {
    onTabChanged(from, to) {
        /*fixes #SIM-18490 */
        if (from === "trafficShare" && to !== "trafficShare") {
            this.widgetToggleUtilityAction(null, "number");
        }
    }
}
