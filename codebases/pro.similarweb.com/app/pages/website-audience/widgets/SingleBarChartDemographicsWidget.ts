/**
 * Created by eyal.albilia on 11/22/17.
 */
import { createBaseClassFrom } from "components/widget/widgetUtils";
import { BarChartDemographicsWidget } from "../../app-analysis/app-audience/app-demographics/widgets/BarChartDemographicsWidget";

const getWidgetConfig = (params) => ({
    type: "BarChartDemographics",
    properties: {
        ...params,
        family: "Website",
        metric: "WebDemographicsAge",
        apiController: "WebDemographics",
        apiParams: {
            metric: "WebDemographicsAge",
        },
        type: "BarChartDemographics",
        width: "7",
        height: "244px",
        loadingHeight: "244px",
        title: "appdemographics.bar.title",
        tooltip: "webdemographics.bar.title.tooltip",
        excelMetric: "WebDemographicsAge",
        options: {
            legendAlign: "left",
            showTopLine: false,
            showFrame: true,
            showLegend: false,
            showSubtitle: false,
            showSettings: false,
            showTitle: true,
            showTitleTooltip: true,
            titleType: "text",
            // desktopOnly: true,
            forceSetupColors: true,
            widgetColorsFrom: "audienceOverview",
            hideCategoriesIcons: true,
            cssClass: "age-bar",
            barWidth: 80,
            barShowLegend: true,
        },
        trackName: "Bar Chart/Demographics Age Distribution",
    },
    utilityGroups: [
        {
            properties: {
                className: "titleRow demographics-png",
            },
            utilities: [
                {
                    id: "ellipsis",
                    properties: {
                        items: [{ id: "png" }, { id: "dashboard" }],
                        wkhtmltoimage: true,
                    },
                },
            ],
        },
    ],
});

const getMetricTypeConfig = (params) => ({
    id: "WebDemographicsAge",
    properties: {
        metric: "WebDemographicsAge",
        title: "metric.demographics.title",
        family: "Website",
        component: "WebDemographics",
        order: "1",
        dynamicSettings: "true",
        disableDatepicker: true,
        state: "websites-audienceDemographics",
        apiController: "WebDemographics",
    },
    single: {
        properties: {},
        objects: {},
    },
    compare: {
        properties: {},
        objects: {},
    },
});

export default createBaseClassFrom(
    BarChartDemographicsWidget,
    getWidgetConfig,
    getMetricTypeConfig,
);
