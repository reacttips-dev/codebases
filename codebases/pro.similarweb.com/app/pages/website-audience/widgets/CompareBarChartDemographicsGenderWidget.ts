/**
 * Created by eyal.albilia on 11/22/17.
 */
import { createBaseClassFrom } from "components/widget/widgetUtils";
import { BarChartDemographicsWidget } from "../../app-analysis/app-audience/app-demographics/widgets/BarChartDemographicsWidget";
import { BarChartDemographicsGenderWidget } from "../../app-analysis/app-audience/app-demographics/widgets/BarChartDemographicsGenderWidget";
const getWidgetConfig = (params) => ({
    type: "BarChartDemographicsGender",
    properties: {
        ...params,
        family: "Website",
        metric: "WebDemographicsGender",
        apiController: "WebDemographics",
        apiParams: {
            metric: "WebDemographicsGender",
        },
        type: "BarChartDemographicsGender",
        width: "12",
        height: "244px",
        loadingHeight: "296px",
        title: "appdemographics.piechart.title",
        tooltip: "webdemographics.piechart.title.tooltip",
        excelMetric: "WebDemographicsGender",
        trackName: "Bar Chart/Demographics Gender Distribution",
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
            desktopOnly: true,
            forceSetupColors: true,
            widgetColorsFrom: "audienceOverview",
            hideCategoriesIcons: false,
            categoryColors: "maleFemaleColors",
            categoryIcons: "maleFemaleIcons",
            cssClass: "age-bar",
            barWidth: 50,
            useNewLegends: true,
            barShowLegend: true,
        },
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
    id: "WebDemographicsGender",
    properties: {
        family: "Website",
        metric: "WebDemographicsGender",
        apiController: "WebDemographics",
        title: "metric.demographics.title",
        component: "WebDemographics",
        order: "1",
        dynamicSettings: true,
        disableDatepicker: true,
        state: "websites-audienceDemographics",
    },
    single: {
        properties: {
            hasWebSource: true,
            height: 120,
        },
        objects: {
            Male: {
                name: "Male",
                title: "Male",
                type: "double",
                format: "None",
                cellTemp: "",
            },
            Female: {
                name: "Female",
                title: "Female",
                type: "double",
                format: "None",
                cellTemp: "",
            },
        },
    },
    compare: {},
});

export default createBaseClassFrom(
    BarChartDemographicsGenderWidget,
    getWidgetConfig,
    getMetricTypeConfig,
);
