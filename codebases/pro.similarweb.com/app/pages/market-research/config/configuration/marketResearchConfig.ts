/* eslint-disable @typescript-eslint/camelcase */
import { companyResearchConfig } from "./companyResearchConfig";
import { industryResearchConfig } from "./industryResearchConfig";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { competitiveTrackingConfig } from "./competitiveTrackingConfig";

export const marketResearchConfig = {
    marketresearch: {
        parent: "sw",
        abstract: true,
        packageName: "marketresearch",
        url: "/research",
        templateUrl: "/app/pages/market-research/root.html",
        configId: "WebMarketAnalysisOverviewHomepage",
        secondaryBarType: "MarketResearch" as SecondaryBarType,
    },
    marketresearch_root: {
        abstract: true,
        parent: "marketresearch",
        template: `<!-- START research layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- END research layout -->`,
    },
    "marketresearch-home": {
        parent: "marketresearch",
        url: "/home",
        templateUrl: "/app/pages/market-research/market-research-home.html",
        configId: "WebAnalysis",
        pageId: {
            section: "marketresearch",
            subSection: "homepage",
        },
        trackingId: {
            section: "Market Research",
            subSection: "homepage",
            subSubSection: "",
        },
        pageTitle: "marketintelligence.homepage.title",
        fallbackStates: {
            digitalmarketing: "digitalmarketing-home",
            legacy: "websites_root-home",
        },
    },
    ...competitiveTrackingConfig,
    ...industryResearchConfig,
    ...companyResearchConfig,
};
