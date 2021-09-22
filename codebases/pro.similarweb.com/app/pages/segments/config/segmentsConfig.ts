import SegmentsQueryBar from "pages/segments/SegmentsQueryBar";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import {
    segmentsAnalysisController,
    segmentsRootController,
} from "pages/segments/config/segmentsConfigHelpers";
import { FiltersEnum } from "components/filters-bar/utils";

export interface IRoutePreferences {
    [key: string]: any;
}

export interface IPreviousRoute {
    name: string;
    params?: IRoutePreferences;
}

export const segmentsConfig = {
    segments: {
        parent: "sw",
        name: "segments",
        abstract: true,
        url: "/segments",
        templateUrl: "/app/pages/segments/segmentsRoot.html",
        configId: "CustomSegments",
        secondaryBarType: "WebsiteResearch" as SecondaryBarType,
        controllerAs: "ctrl",
        controller: segmentsRootController,
    },
    "segments-homepage": {
        parent: "segments",
        url: "/home?tab",
        name: "segments.homepage",
        templateUrl: "/app/pages/segments/segmentsHomepage.html",
        configId: "CustomSegments",
        pageId: {
            section: "segments",
            subSection: "homepage",
        },
        trackingId: {
            section: "segments",
            subSection: "homepage",
            subSubSection: "",
        },
        pageTitle: "segments.homepage.title",
        reloadOnSearch: false,
    },
    "segments-analysis": {
        parent: "segments",
        name: "segments.analysis",
        url: "/analysis",
        templateUrl: "/app/pages/segments/segmentsAnalysis.html",
        abstract: true,
        controllerAs: "ctrl",
        controller: segmentsAnalysisController("segments-analysis"),
    },
    "segments-analysis-traffic": {
        parent: "segments-analysis",
        name: "segments.analysis.traffic",
        url: "/:mode/:id/:country/:duration?comparedDuration",
        templateUrl: "/app/pages/segments/segmentsAnalysisTraffic.html",
        configId: "CustomSegments",
        periodOverPeriodEnabled: true,
        pageId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "traffic",
        },
        trackingId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: (params) => (params.mode === "group" ? "comparison" : "traffic"),
        },
        pageTitle: "segments.analysis.traffic.title",
        leftSubNav: SegmentsQueryBar,
        reloadOnSearch: true,
    },
    "segments-analysis-marketingChannels": {
        parent: "segments-analysis",
        name: "segments.analysis.marketingChannels",
        url: "/traffic-channels/:mode/:id/:country/:duration",
        templateUrl: "/app/pages/segments/segmentsAnalysisMarketingChannels.html",
        configId: "CustomSegments",
        periodOverPeriodEnabled: false,
        pageId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "traffic",
        },
        trackingId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "traffic",
        },
        pageTitle: "segments.analysis.marketingChannels.title",
        leftSubNav: SegmentsQueryBar,
    },
    "segments-analysis-geography": {
        parent: "segments-analysis",
        name: "segments.geo",
        url: "geography/:mode/:id/:country/:duration",
        templateUrl: "/app/pages/segments/segmentsGeography.html",
        configId: "CustomSegments",
        periodOverPeriodEnabled: false,
        pageId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "geography",
        },
        trackingId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "geography",
        },
        pageTitle: "segments.analysis.geography.title",
        leftSubNav: SegmentsQueryBar,
        data: {
            filtersConfig: {
                country: FiltersEnum.HIDDEN,
            },
        },
    },
    "segments-wizard": {
        parent: "segments",
        url: "/wizard?sid?country?createNew",
        template: `<div class="sw-layout-scrollable-element use-sticky-css-rendering" auto-scroll-top>
            <sw-react component="SegmentWizard"></sw-react>
        </div>`,
        configId: "CustomSegments",
        pageId: {
            section: "segments",
            subSection: "wizard",
        },
        trackingId: {
            section: "segments",
            subSection: "wizard",
        },
        pageTitle: "segments.wizard.title",
        secondaryBarType: "None" as SecondaryBarType,
    },
};
