import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export default {
    track: {
        abstract: true,
        parent: "sw",
        template: `<!-- START track layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- START track layout -->`,
    },
    dashboard: {
        parent: "track",
        configId: "Dashboard",
        url: "/dashboard",
        templateUrl: "/app/pages/dashboard/layout.html",
        controller: "dashboardLayoutCtrl",
        data: {
            menuKbItems: null,
            educationBarTag: "DASHBOARD",
        },
        pageId: {
            section: "dashboard",
        },
        trackingId: {
            section: "dashboard",
            subSection: "home",
        },
        clearSearch: true,
        pageTitle: "dashboard.page.title",
        secondaryBarType: "Dashboards" as SecondaryBarType,
        packageName: "dashboards",
    },
    "dashboard-new": {
        parent: "dashboard",
        url: "/new",
        templateUrl: "/app/pages/dashboard/dashboard-welcome.html",
        controller: "dashboardWelcomeCtrl as ctrl",
        pageId: {
            section: "dashboard",
            subSection: "new",
        },
        trackingId: {
            section: "dashboard",
            subSection: "new",
        },
        clearSearch: true,
        pageTitle: "dashboard.page.title",
    },
    "dashboard-gallery": {
        parent: "dashboard",
        url: "/gallery",
        templateUrl: "/app/pages/dashboard/dashboard-gallery.html",
        controller: "dashboardGallery as ctrl",
        pageId: {
            section: "dashboard",
            subSection: "gallery",
        },
        trackingId: {
            section: "dashboard",
            subSection: "gallery",
        },
        clearSearch: true,
        pageTitle: "dashboard.page.title",
        disableNewDashboardButton: true,
    },
    "dashboard-gallery-blank": {
        parent: "dashboard-gallery",
        url: "/blank",
        templateUrl: "/app/pages/dashboard/dashboard-gallery-blank.html",
        controller: "dashboardGallery as ctrl",
        pageId: {
            section: "dashboard",
            subSection: "gallery",
            subSubSection: "blank",
        },
        trackingId: {
            section: "dashboard",
            subSection: "gallery",
            subSubSection: "blank",
        },
        clearSearch: true,
        pageTitle: "dashboard.page.title",
        disableNewDashboardButton: true,
    },
    "dashboard-exist": {
        parent: "dashboard",
        url: "/:dashboardId",
        stateId: "dashboardId",
        templateUrl: "/app/pages/dashboard/dashboard.html",
        controller: "dashboardCtrl as ctrl",
        pageId: {
            section: "dashboard",
            subSection: "exist",
        },
        trackingId: {
            section: "dashboard",
            subSection: "exist",
        },
        clearSearch: true,
    },
    "dashboard-created": {
        parent: "dashboard",
        url: "/:dashboardId/new",
        stateId: "dashboardId",
        templateUrl: "/app/pages/dashboard/dashboard.html",
        controller: "dashboardCtrl as ctrl",
        pageId: {
            section: "dashboard",
            subSection: "created",
        },
        trackingId: {
            section: "dashboard",
            subSection: "created",
        },
        clearSearch: true,
        pageTitle: "dashboard.page.title",
    },
};
