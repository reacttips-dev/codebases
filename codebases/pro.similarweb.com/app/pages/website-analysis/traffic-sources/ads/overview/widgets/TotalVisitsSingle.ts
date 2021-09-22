import { createBaseClassFrom } from "components/widget/widgetUtils";
import { SingleMetricWidget } from "components/widget/widget-types/SingleMetricWidget";

const getWidgetConfig = (params) => ({
    type: "DisplayAdsTotalVisits",
    properties: {
        family: "Website",
        type: "SingleMetric",
        width: "4",
        title: "analysis.source.ads.overview.totalvisits",
        tooltip: "analysis.source.ads.overview.totalvisits",
        height: "215px",
        loadingHeight: "202px",
        apiController: "WebsiteDisplayAds",
        numberField: "AdsTotal",
        percentField: "VolumeTotal",
        options: {
            noBoxShadow: true,
            showTitle: true,
            showTitleTooltip: true,
            titlePaddingBottom: "0px",
            titleClass: "u-no-margin",
            titleType: "text",
            showSubtitle: false,
            showLegend: false,
            showSettings: false,
            showTopLine: false,
            showFrame: true,
            titleIcon: false,
            dashboardSubtitleMarginBottom: "-4",
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
        apiParams: {
            metric: "WebsiteAdsVisitsOverview",
        },
    },
});

const getMetricTypeConfig = (params) => ({
    properties: {
        options: {
            showLegend: false,
            dashboardSubtitleMarginBottom: 15,
        },
    },
    objects: {
        Total: {
            name: "AdsTotal",
            title: "Total Visits",
            type: "double",
            format: "abbrNumberVisits",
            headTemp: "none",
            cellTemp: "large-single-number",
        },
    },
});

export default createBaseClassFrom(SingleMetricWidget, getWidgetConfig, getMetricTypeConfig);
