import { createBaseClassFrom } from "components/widget/widgetUtils";
import { ChannelAnalysisGraphWidget } from "components/widget/widget-types/ChannelAnalysisGraphWidget";
import { PlaExporter } from "exporters/PlaExporter";

function getWidgetConfig({ widgetDataFetcher, mode }) {
    return {
        properties: {
            excelMetric: "SearchOrganicPaidOverview",
            widgetDataFetcher,
            width: "12",
            webSource: "Desktop",
            trackName: "Over Time Graph/Pla/Traffic share",
            height: "300px",
            loadingHeight: "300px",
            title: "analysis.source.search.ads.pla.graph.title",
            tooltip: "analysis.source.search.ads.pla.graph.tooltip",
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
                    className: "inflow-align-right",
                },
                utilities: [
                    {
                        id: "chart-export",
                        properties: {
                            wkhtmltoimage: true,
                            hideExcel: true,
                            metricDisplayName: "mmx.channelanalysis.traffic-share.title",
                            exportOptions: {
                                pngWidth: "auto",
                            },
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
            yAxisMax: 1,
        },
        filters: {},
    };
}

export default class PlaTrafficShare extends createBaseClassFrom(
    ChannelAnalysisGraphWidget,
    getWidgetConfig,
    getMetricTypeConfig,
) {
    getExporter() {
        return PlaExporter;
    }
}
