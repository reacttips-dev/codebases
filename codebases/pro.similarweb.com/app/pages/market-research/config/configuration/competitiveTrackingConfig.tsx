/* eslint-disable @typescript-eslint/camelcase */

import { competitiveTrackingRootController } from "pages/competitive-tracking/root/competitiveTrackingRootController";

export const competitiveTrackingConfig = {
    companyresearch_competitivetracking: {
        parent: "marketresearch",
        url: "/competitivetracking",
        name: "competitive tracking",
        configId: "WebAnalysis",
        abstract: true,
        template: `<div ui-view class="sw-layout-module fadeIn u-flex-column" auto-scroll-top></div>`,
        controller: competitiveTrackingRootController,
    },
    companyresearch_competitivetracking_home: {
        parent: "companyresearch_competitivetracking",
        url: "/home",
        template:
            '<sw-react style="height: 100%" component="CompetitiveTrackingHomepage"></sw-react>',
        pageId: {
            section: "Market Research",
            subSection: "Monitoring Section",
        },
        trackingId: {
            section: "Market Research",
            subSection: "Monitoring Section",
            subSubSection: "",
        },
    },
    companyresearch_competitivetracking_wizard: {
        parent: "companyresearch_competitivetracking",
        url: "/wizard",
        template: `<sw-react component="CompetitiveTrackingWizard"></sw-react>`,
        pageId: {
            section: "Market Research",
            subSection: "Monitoring Section",
            subSubSection: "Wizard",
        },
        secondaryBarType: "None",
    },
    companyResearch_competitiveTracking_tracker: {
        parent: "companyresearch_competitivetracking",
        url: "/tracker/:trackerId",
        template: `<sw-react component="CompetitiveTrackerHighLevelMetrics"></sw-react>`,
        pageId: {
            section: "Market Research",
            subSection: "Monitoring Section",
            subSubSection: "Tracker",
        },
    },
    companyResearch_competitiveTracking_edit: {
        parent: "companyresearch_competitivetracking",
        url: "/edit/:trackerId",
        template: `<sw-react component="CompetitiveTrackingEditPageWrapper"></sw-react>`,
        pageId: {
            section: "Market Research",
            subSection: "Monitoring Section",
            subSubSection: "Edit",
        },
    },
};
