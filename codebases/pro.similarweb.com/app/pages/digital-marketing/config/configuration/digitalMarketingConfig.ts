/* eslint-disable @typescript-eslint/camelcase */
import { adCreativeResearchConfig } from "./adCreativeResearchConfig";
import { affiliateResearchConfig } from "./affiliateResearchConfig";
import { competitiveAnalysisConfig } from "./competitiveAnalysisConfig";
import { keywordResearchConfig } from "./keywordResearchConfig";
import { mediaBuyingResearchConfig } from "./mediaBuyingResearchConfig";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import ABService, { EVwoDMIHomepageVariation } from "services/ABService";
import { homepageVariationToEventSubName } from "pages/digital-marketing/home-pages/constants";

const getVWOHomepageVersion = () => {
    const vwoDMIHomepageVariation = ABService.getFlag("vwoDMIHomepageVariation");
    return vwoDMIHomepageVariation !== EVwoDMIHomepageVariation.Control
        ? homepageVariationToEventSubName[vwoDMIHomepageVariation]
        : "";
};

const getRedirectVWOHomepageVersion = ({ id: navigationId }: { id?: string }) => {
    const versionText = getVWOHomepageVersion();
    const redirectToSuffix = `/${navigationId}`;
    return `${versionText}${navigationId ? redirectToSuffix : ""}`;
};

export const digitalMarketingConfig = {
    digitalmarketing: {
        parent: "sw",
        abstract: true,
        packageName: "digitalmarketing",
        url: "/marketing",
        templateUrl: "/app/pages/digital-marketing/root.html",
        configId: "CompetitveAnalysisOverviewHome",
        secondaryBarType: "DigitalMarketing" as SecondaryBarType,
        navBarContainerClassName: "accordion-side-bar",
        fallbackStates: {
            marketresearch: "marketresearch-home",
            legacy: "websites_root-home",
        },
    },
    digitalmarketing_root: {
        abstract: true,
        parent: "digitalmarketing",
        template: `<!-- START research layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- END research layout -->`,
    },
    "digitalmarketing-home": {
        parent: "digitalmarketing",
        url: "/home",
        templateUrl: "/app/pages/digital-marketing/digital-marketing-home.html",
        configId: "WebAnalysis",
        pageId: {
            section: "digitalmarketing",
            subSection: "homepage",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "homepage",
            subSubSection: getVWOHomepageVersion,
        },
        pageTitle: "digitalmarketing.homepage.title",
        fallbackStates: {
            marketresearch: "marketresearch-home",
            legacy: "websites_root-home",
        },
    },
    digitalMarketingRedirect: {
        parent: "digitalmarketing",
        url: "/redirect/:id",
        template: `<sw-react component="DigitalMarketingRedirect"></sw-react>`,
        configId: "WebAnalysis",
        pageId: {
            section: "digitalmarketing",
            subSection: "redirect",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "redirect",
            subSubSection: getRedirectVWOHomepageVersion,
        },
        pageTitle: "digitalmarketing.homepage.title",
        fallbackStates: {
            marketresearch: "marketresearch-home",
            legacy: "websites_root-home",
        },
    },
    ...competitiveAnalysisConfig,
    ...keywordResearchConfig,
    ...affiliateResearchConfig,
    ...mediaBuyingResearchConfig,
    ...adCreativeResearchConfig,
};
