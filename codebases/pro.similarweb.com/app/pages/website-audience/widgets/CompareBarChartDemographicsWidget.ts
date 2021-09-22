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
        width: "12",
        height: "244px",
        loadingHeight: "296px",
        title: "appdemographics.bar.title",
        tooltip: "webdemographics.bar.title.tooltip",
        excelMetric: "AppDemographicsAge",
        options: {
            legendAlign: "left",
            showTopLine: false,
            showFrame: true,
            showLegend: true,
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
            smallIcon: true,
            barWidth: 20,
            useNewLegends: true,
            barShowLegend: false,
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
