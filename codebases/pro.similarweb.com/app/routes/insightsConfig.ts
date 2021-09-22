import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const insigthsConfig = {
    insights: {
        parent: "sw",
        configId: "DeepInsights",
        url: "/insights",
        template: `<!-- START insights layout --><div class="sw-layout-no-scroll-container sw-layout-module-inner" ui-view></div><!-- END insights layout -->`,
        abstract: true,
        data: {
            menuKbItems: null,
            educationBarTag: "insights",
            disableRecording: true,
        },
        pageId: {
            section: "DeepInsights",
        },
        trackingId: {
            section: "DeepInsights",
        },
        clearSearch: true,
        pageTitle: "DeepInsights.HomePage.Title",
        secondaryBarType: "CustomInsights" as SecondaryBarType,
    },

    "insights-home": {
        parent: "insights",
        url: "/home",
        templateUrl: "/app/pages/insights/home.html",
        controller: "mainInsightsController as ctrl",
        pageId: {
            section: "DeepInsights",
            subSection: "home",
        },
        trackingId: {
            section: "DeepInsights",
            subSection: "home",
        },
        clearSearch: true,
        pageTitle: "DeepInsights.HomePage.Title",
        hideSideNav: true,
    },

    "insights-reports": {
        parent: "insights",
        url: "/reports?types",
        templateUrl: "/app/pages/insights/deep-insights/insights.html",
        controller: "deepInsightsController as ctrl",
        pageId: {
            section: "DeepInsights",
            subSection: "reports",
        },
        trackingId: {
            section: "DeepInsights",
            subSection: "reports",
        },
        reloadOnSearch: false,
        clearSearch: true,
        pageTitle: "DeepInsights.ReportsPage.Title",
    },
};
