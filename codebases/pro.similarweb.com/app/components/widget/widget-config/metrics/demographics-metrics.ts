export const WebDemographicsAge = {
    id: "WebDemographicsAge",
    properties: {
        title: "appdemographics.bar.title",
        family: "Website",
        component: "WebDemographics",
        state: "websites-audienceDemographics",
        apiController: "WebDemographics",
        dashboard: "true",
        hasWebSource: true,
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        availabilityComponent: "WsWebDemographics",
    },
    widgets: {
        single: {
            BarChartDemographics: {
                properties: {
                    height: 220,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 5,
                        desktopOnly: false,
                        legendAlign: "left",
                        showTopLine: false,
                        showFrame: true,
                        showSubtitle: false,
                        showTitleTooltip: true,
                    },
                },
                objects: {
                    Visits: {
                        name: "Visits",
                        title: "Visits",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
            PieChart: {
                properties: {
                    height: 240,
                    options: {
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 25,
                        desktopOnly: false,
                        legendConfig: {
                            margin: 20,
                        },
                        forceSetupColors: true,
                        widgetColorsFrom: "audienceOverview",
                    },
                },
                objects: {
                    Age18To24: {
                        name: "Age18To24",
                        title: "18-24",
                        displayName: "18-24",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    Age25To34: {
                        name: "Age25To34",
                        title: "25-34",
                        displayName: "25-34",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    Age35To44: {
                        name: "Age35To44",
                        title: "35-44",
                        displayName: "35-44",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    Age45To54: {
                        name: "Age45To54",
                        title: "45-54",
                        displayName: "45-54",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    Age55To64: {
                        name: "Age55To64",
                        title: "55-64",
                        displayName: "55-64",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    Age65Plus: {
                        name: "Age65Plus",
                        title: "65+",
                        displayName: "65+",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
        },
        compare: {
            BarChartDemographics: {
                properties: {
                    height: 200,
                    options: {
                        height: 140,
                        dashboardSubtitleMarginBottom: 5,
                        desktopOnly: false,
                        legendAlign: "left",
                        showTopLine: false,
                        showFrame: true,
                        showSubtitle: false,
                        showTitleTooltip: true,
                        forceSetupColors: true,
                        widgetColorsFrom: "audienceOverview",
                    },
                },
                objects: {
                    Visits: {
                        name: "Visits",
                        title: "Visits",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
        },
    },
};

export const WebDemographicsGender = {
    id: "WebDemographicsGender",
    properties: {
        title: "appdemographics.piechart.title",
        family: "Website",
        component: "WebDemographics",
        state: "websites-audienceDemographics",
        apiController: "WebDemographics",
        dashboard: "true",
        hasWebSource: true,
        viewPermissions: {
            trafficSources: ["MobileWeb", "Desktop"],
        },
        availabilityComponent: "WsWebDemographics",
    },
    widgets: {
        single: {
            PieChart: {
                properties: {
                    height: 220,
                    options: {
                        twoColorMode: true,
                        showLegend: false,
                        dashboardSubtitleMarginBottom: 15,
                    },
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
        },
        compare: {
            BarChartDemographicsGender: {
                properties: {
                    height: 200,
                    options: {
                        height: 140,
                        dashboardSubtitleMarginBottom: 5,
                        desktopOnly: false,
                        legendAlign: "left",
                        showTopLine: false,
                        showFrame: true,
                        showSubtitle: false,
                        showTitleTooltip: true,
                        forceSetupColors: true,
                        widgetColorsFrom: "audienceOverview",
                        cssClass: "age-bar",
                        barWidth: 50,
                        barShowLegend: true,
                    },
                },
            },
        },
    },
};
