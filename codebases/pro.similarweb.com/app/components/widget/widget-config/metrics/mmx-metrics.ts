/**
 * Created by Eran.Shain on 11/27/2016.
 */
export const MmxTrafficShare = {
    id: "MmxTrafficShare",
    properties: {
        component: "MarketingMix",
        family: "Website",
        state: "websites-trafficOverview",
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    periodOverPeriodSupport: true,
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
                    format: "minVisitsAbbr",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
        compare: {
            Graph: {
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
            },
        },
    },
};

export const ChannelsAnalysisByTrafficShare = {
    id: "ChannelsAnalysisByTrafficShare",
    properties: {
        component: "MarketingMix",
        apiController: "WebsiteOverviewDesktop",
        family: "Website",
        state: "websites-trafficOverview",
        dashboard: "true",
        title: "mmx.channelanalysis.traffic-share.title.dashboard",
        multipleChannelSupport: true,
    },
    widgets: {
        single: {
            MmxTrafficShareDashboard: {
                properties: {
                    showMoreButton: true,
                    hideMarkersOnDaily: false,
                    stacked: true,
                    options: {
                        legendAlign: "left",
                        showLegend: false,
                        legendTop: -20,
                        dashboardSubtitleMarginBottom: 15,
                        newColorPalette: true,
                    },
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
                    format: "abbrNumberVisits",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
        compare: {
            MmxTrafficShareDashboard: {
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
            },
        },
    },
};

export const MmxAvgVisitDuration = {
    id: "MmxAvgVisitDuration",
    properties: {
        component: "MarketingMix",
        family: "Website",
        state: "websites-trafficOverview",
        title: "mmx.channelanalysis.duration.title",
        apiController: "WebsiteOverview",
        dashboard: "false",
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    periodOverPeriodSupport: true,
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
                    format: "time",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
        compare: {
            Graph: {
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
                    format: "time",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
    },
};

//MmxAvgVisitDuration Replica
export const ChannelsAnalysisByAverageDuration = {
    id: "ChannelsAnalysisByAverageDuration",
    properties: {
        component: "MarketingMix",
        apiController: "WebsiteOverviewDesktop",
        family: "Website",
        state: "websites-trafficOverview",
        dashboard: "true",
        title: "mmx.channelanalysis.duration.title.dashboard",
        multipleChannelSupport: true,
    },
    widgets: {
        single: {
            MmxVisitDurationDashboard: {
                properties: {
                    showMoreButton: true,
                    options: {
                        legendAlign: "left",
                        showLegend: false,
                        legendTop: -20,
                        dashboardSubtitleMarginBottom: 15,
                        newColorPalette: true,
                    },
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
                    format: "time",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
        compare: {
            MmxVisitDurationDashboard: {
                properties: {
                    hideMarkersOnDaily: true,
                    options: {
                        showLegend: true,
                    },
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
                    format: "time",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
    },
};

export const MmxPagesPerVisit = {
    id: "MmxPagesPerVisit",
    properties: {
        component: "MarketingMix",
        family: "Website",
        state: "websites-trafficOverview",
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    periodOverPeriodSupport: true,
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
                    format: "abbrNumberVisits",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
        compare: {
            Graph: {
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
                    format: "abbrNumberVisits",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
    },
};

export const ChannelsAnalysisByPagesPerVisit = {
    id: "ChannelsAnalysisByPagesPerVisit",
    properties: {
        component: "MarketingMix",
        title: "mmx.channelanalysis.page-visits.title.dashboard",
        family: "Website",
        dashboard: "true",
        state: "websites-trafficOverview",
        apiController: "WebsiteOverviewDesktop",
        multipleChannelSupport: true,
    },
    widgets: {
        single: {
            MmxPagesPerVisitDashboard: {
                properties: {
                    showMoreButton: true,
                    options: {
                        legendAlign: "left",
                        showLegend: false,
                        legendTop: -20,
                        dashboardSubtitleMarginBottom: 15,
                        newColorPalette: true,
                    },
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
                    format: "abbrNumberVisits",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
        compare: {
            MmxPagesPerVisitDashboard: {
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
                    format: "abbrNumberVisits",
                    formatParameter: 2,
                    name: "Visits",
                    reversed: "False",
                },
                filters: {},
            },
        },
    },
};

export const MmxBounceRate = {
    id: "MmxBounceRate",
    properties: {
        component: "MarketingMix",
        family: "Website",
        state: "websites-trafficOverview",
    },
    widgets: {
        single: {
            Graph: {
                properties: {
                    periodOverPeriodSupport: true,
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
            },
        },
        compare: {
            Graph: {
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
            },
        },
    },
};

export const ChannelsAnalysisByBounceRate = {
    id: "ChannelsAnalysisByBounceRate",
    properties: {
        component: "MarketingMix",
        title: "mmx.channelanalysis.bounce-rate.title.dashboard",
        family: "Website",
        dashboard: "true",
        state: "websites-trafficOverview",
        apiController: "WebsiteOverviewDesktop",
        multipleChannelSupport: true,
    },
    widgets: {
        single: {
            MmxBounceRateDashboard: {
                properties: {
                    showMoreButton: true,
                    hideMarkersOnDaily: false,
                    options: {
                        legendAlign: "left",
                        showLegend: false,
                        legendTop: -20,
                        dashboardSubtitleMarginBottom: 15,
                        newColorPalette: true,
                    },
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
                ppt: {
                    minValue: 0,
                    maxValue: 1,
                },
            },
        },
        compare: {
            MmxBounceRateDashboard: {
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
                ppt: {
                    minValue: 0,
                    maxValue: 1,
                },
            },
        },
    },
};
