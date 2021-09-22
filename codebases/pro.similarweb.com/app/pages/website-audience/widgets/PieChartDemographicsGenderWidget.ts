/**
 * Created by eyal.albilia on 11/22/17.
 */
import { createBaseClassFrom } from "components/widget/widgetUtils";
import { BarChartDemographicsWidget } from "../../app-analysis/app-audience/app-demographics/widgets/BarChartDemographicsWidget";
import { BarChartDemographicsGenderWidget } from "../../app-analysis/app-audience/app-demographics/widgets/BarChartDemographicsGenderWidget";
import { PieChartGenderWidget } from "../../app-analysis/app-audience/app-demographics/widgets/PieChartGenderWidget";

const getWidgetConfig = (params) => ({
    type: "PieChartGender",
    async: "true",
    properties: {
        ...params,
        family: "Website",
        metric: "WebDemographicsGender",
        apiController: "WebDemographics",
        state: "websites-audienceDemographics",
        apiParams: {
            metric: "WebDemographicsGender",
        },
        type: "PieChart",
        width: "5",
        height: "244px",
        loadingHeight: "244px",
        title: "appdemographics.piechart.title",
        tooltip: "webdemographics.piechart.title.tooltip",
        options: {
            showTitle: true,
            showTitleTooltip: true,
            titleType: "text",
            showSubtitle: false,
            showLegend: false,
            showSettings: false,
            showTopLine: false,
            showFrame: true,
            widgetColors: "maleFemaleColors",
            widgetIcons: "maleFemaleIcons",
            legendConfig: {
                verticalAlign: "bottom",
                layout: "horizontal",
                align: "center",
                itemMarginTop: 0,
                itemMarginBottom: 0,
                legendMap: [
                    {
                        seriesName: "Male",
                        legendIndex: 0,
                    },
                    {
                        seriesName: "Female",
                        legendIndex: 1,
                    },
                ],
            },
            marginTop: 20,
            marginBottom: 80,
            innerSize: "66%",
            sortBy: "value",
            sortAsc: true,
        },
        trackName: "Pie Chart/Demographics Gender Distribution",
    },
    utilityGroups: [
        {
            properties: {
                className: "titleRow demographics-png pie-ellipsis",
            },
            utilities: [
                {
                    id: "ellipsis",
                    properties: {
                        items: [{ id: "png" }, { id: "dashboard" }],
                        wkhtmltoimage: true,
                        exportOptions: { pngWidth: "432" },
                    },
                },
            ],
        },
    ],
});

const getMetricTypeConfig = (params) => ({
    id: "WebDemographicsGender",
    properties: {
        title: "metric.demographics.title",
        component: "WebDemographics",
        order: "1",
        dynamicSettings: true,
        disableDatepicker: true,
        family: "Website",
        metric: "WebDemographicsGender",
        apiController: "WebDemographics",
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

export default createBaseClassFrom(PieChartGenderWidget, getWidgetConfig, getMetricTypeConfig);
