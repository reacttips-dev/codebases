import * as _ from "lodash";
import { SwTrack } from "services/SwTrack";

const swData = {
    menuKbItems(state) {
        const { pageId } = state;
        const tags = _.filter([pageId.section, pageId.subSection, pageId.subSubSection]).join("-");
        return tags;
    },
    educationBarTag(state) {
        const { pageId } = state;
        const tags = _.filter([pageId.section, pageId.subSection, pageId.subSubSection])
            .join("_")
            .toUpperCase();
        return tags;
    },
    getCustomUrlType(toState) {
        // website | apps | keywords | industryAnalysis
        return this.getTrackId(toState)?.section;
    },
    getTrackId(toState, toParams?) {
        if (typeof toState.trackingId === "function") {
            return toState.trackingId(toParams);
        } else {
            return toState.trackingId || toState.pageId;
        }
    },
    pageViewTracking(toParams, toState, event) {
        // event param was added in order to differentiate between navChangeSuccess to navUpdate
        SwTrack.trackPageView(toState, toParams);
    },
    disableRecording: false,
    showConnectedAccountsGlobalHook: false,
    showConnectedAccountsOnPageHook: false,
    showAvailableAppsIntro: false,
};

export default {
    sw: {
        abstract: true,
        configId: "Home",
        url: "",
        data: swData,
        templateUrl: "/partials/sw-layout.html",
    },
    "sw-empty": {
        abstract: true,
        configId: "Home",
        url: "",
        data: swData,
        templateUrl: "/partials/sw-layout-empty.html",
    },
    home: {
        parent: "research",
        url: "/home",
        abstract: true,
        templateUrl: "/app/pages/home/home-new.html",
        controller: "newHomeCtrl",
        controllerAs: "ctrl",
        data: {
            menuKbItems: null,
        },
        pageId: {
            section: "home",
        },
    },
    proModules: {
        parent: "home",
        url: "/modules",
        pageId: {
            section: "home",
            subSection: "modules",
        },
        icon: "sw-icon-home",
        clearSearch: true,
        trackingId: {
            section: "home",
            subSection: "modules",
        },
        pageTitle: "swhome.page.title",
    },
};
