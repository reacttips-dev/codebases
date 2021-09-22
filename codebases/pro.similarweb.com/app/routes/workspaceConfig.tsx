import * as React from "react";
import {
    hasInvestorPermission,
    hasMarketingPermission,
    hasSalesPermission,
    hasWorkSpacesPermission,
    isHookWorkspaceEnabled,
} from "services/Workspaces.service";
import {
    MarketingWorkspaceExistsCtrl,
    MarketingWorkspaceNewCtrl,
} from "../pages/workspace/marketing/MarketingWorkspaceCtrl";
import { HasWorkspaceTrialPermission } from "../pages/workspace/common/workspacesUtils";
import { clearAllParams } from "../actions/keywordGeneratorToolActions";
import { marketingWorkspaceClearAllParams } from "../actions/marketingWorkspaceActions";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
export const getTabNameForTracking = ({ selectedArenaTab }) => {
    switch (selectedArenaTab) {
        case "1":
            return "ORGANIC SEARCH OVERVIEW";
        case "2":
            return "REFERRALS OVERVIEW";
        default:
            return "STRATEGIC OVERVIEW";
    }
};

const concatParams = (params: string[]) => params.join("&");
const root = {
    workspace: {
        abstract: true,
        parent: "sw",
        url: "/workspace",
        template:
            '<div class="sw-layout-module-inner">\n' +
            '    <div ui-view class="sw-layout-no-scroll-container sw-layout-section-content"  auto-scroll-top></div>\n' +
            "</div>\n",
        packageName: "workspace",
    },
};
const marketingWorkspaceUrl = (params = "") => `/marketing${params}`;
const marketing = {
    marketingWorkspace: {
        abstract: true,
        url: "/marketing",
        parent: "workspace",
        configId: "WebAnalysis",
        trackingId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "home",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "home",
        },
        template: "",
        secondaryBarType: "MarketingWorkspace" as SecondaryBarType,
    },
    // new workspace wizard
    "marketingWorkspace-new": {
        parent: "workspace",
        url: "/marketing/new",
        configId: "WebAnalysis",
        template:
            '<div class="sw-layout-scrollable-element"><sw-react ng-if="ready" component="MarketingWizard"/></div>',
        controller: MarketingWorkspaceNewCtrl,
        trackingId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "new",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "new",
        },
        pageTitle: "workspaces.marketing.pageTitles.new",
    },
    "marketingWorkspace-home": {
        parent: "workspace",
        url: "/marketing/home",
        configId: "WebAnalysis",
        controller: MarketingWorkspaceNewCtrl,
        trackingId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "home",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "home",
        },
        pageTitle: "workspaces.marketing.pageTitles.new",
        secondaryBarType: "MarketingWorkspace" as SecondaryBarType,
    },
    "marketingWorkspace-exists": {
        abstract: true,
        parent: "workspace",
        url: marketingWorkspaceUrl("/:workspaceId"),
        templateUrl: "/partials/workspace/marketing/index.html",
        controller: MarketingWorkspaceExistsCtrl,
        configId: "WebAnalysis",
        trackingId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "exists",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "exists",
        },
        pageTitle: "workspaces.marketing.pageTitles.exists",
        reloadOnSearch: false,
        onExit: ($ngRedux) => {
            // clear marketing workspace state when leaving marketing workspace section
            $ngRedux.dispatch(marketingWorkspaceClearAllParams());
        },
        secondaryBarType: "MarketingWorkspace" as SecondaryBarType,
    },
    "marketingWorkspace-arena": {
        parent: "marketingWorkspace-exists",
        url: "/arena/:arenaId?country?duration?websource?isWWW?selectedArenaTab?category",
        template: '<sw-react component="MarketingWorkspaceOverview"></sw-react>',
        trackingId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: getTabNameForTracking,
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "arena",
        },
        pageTitle: "workspaces.marketing.pageTitles.exists",
        reloadOnSearch: false,
    },
    "marketingWorkspace-arena-edit": {
        parent: "marketingWorkspace-exists",
        url: "/arena/:arenaId/edit",
        data: {
            hideSideNav: true,
        },
        template:
            '<div class="sw-layout-scrollable-element"><sw-react component="MarketingWizard"/></div>',
        configId: "WebAnalysis",
        trackingId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "settings",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "settings",
        },
        pageTitle: "workspaces.marketing.pageTitles.edit",
    },
    "marketingWorkspace-arena-new": {
        parent: "marketingWorkspace-exists",
        url: "/new-arena",
        data: {
            hideSideNav: true,
        },
        template:
            '<div class="sw-layout-scrollable-element"><sw-react component="MarketingWizard"/></div>',
        trackingId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "new-arena",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "new-arena",
        },
        pageTitle: "workspaces.marketing.pageTitles.exists",
        reloadOnSearch: false,
    },
    "marketingWorkspace-keywordGroup": {
        parent: "marketingWorkspace-exists",
        url: "/keywordGroup/:keywordGroupId?duration?country?websource?sites?keywordsType?isWWW",
        template: '<sw-react component="MarketingWorkspaceKeywordGroupPage"></sw-react>',
        trackingId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "keywordGroup",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "keywordGroup",
        },
        pageTitle: "workspaces.marketing.pageTitles.exists",
        reloadOnSearch: false,
    },
    "marketingWorkspace-keywordGeneratorTool": {
        parent: "marketingWorkspace-exists",
        url: "/keywordGeneratorTool",
        template:
            '<div class="sw-layout-scrollable-element  use-sticky-css-rendering" style="height: 100%">' +
            '<sw-react component="MarketingWorkspaceKeywordGeneratorTool"></sw-react>' +
            "</div>",
        configId: "KeywordsGenerator",
        controller: async ($scope, $ngRedux) => {
            $scope.$on("$destroy", () => {
                $ngRedux.dispatch(clearAllParams());
            });
        },
        data: {
            hideSideNav: true,
        },
        trackingId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "keywordGeneratorTool",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "keywordGeneratorTool",
        },
        pageTitle: "workspaces.marketing.pageTitles.exists",
        reloadOnSearch: false,
    },

    "marketingWorkspace-websiteGroupRecommendation": {
        parent: "marketingWorkspace-exists",
        url: "/websiteGroup-recommendation/:arenaId?duration?country?sites?websource",
        template:
            '<sw-react component="MarketingWorkspaceWebsiteGroupPageRecommendation"></sw-react>',
        trackingId: {
            section: "workspaces",
            subSection: "websiteGroup",
            subSubSection: "keywordGroup",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "websiteGroup",
        },
        pageTitle: "workspaces.marketing.pageTitles.exists",
        reloadOnSearch: false,
    },
    "marketingWorkspace-websiteGroup": {
        parent: "marketingWorkspace-exists",
        url: "/websiteGroup/:websiteGroupId?duration?country?sites?websource?isWWW",
        template: '<sw-react component="MarketingWorkspaceWebsiteGroupPage"></sw-react>',
        trackingId: {
            section: "workspaces",
            subSection: "websiteGroup",
            subSubSection: "keywordGroup",
        },
        pageId: {
            section: "workspaces",
            subSection: "marketing",
            subSubSection: "websiteGroup",
        },
        pageTitle: "workspaces.marketing.pageTitles.exists",
        reloadOnSearch: false,
    },
};

const investors = {
    investorsWorkspace: {
        url: "/investors?workspaceId&listId",
        parent: "workspace",
        controller: ($scope) => {
            $scope.Component = () => <h1>Investors Workspace</h1>;
        },
        trackingId: {
            section: "workspaces",
            subSection: "investors",
            subSubSection: (params) => (params.wizard ? "wizard" : "home"),
        },
        reloadOnSearch: false,
        configId: "InvestorsWorkspace",
        template:
            '<sw-react style="height: 100%;" component="InvestorsWorkspaceContainer"></sw-react>',
        pageTitle: "workspaces.investors.pageTitles",
        secondaryBarType: "InvestorsWorkspace" as SecondaryBarType,
    },
};

const SALES_QUERY_PARAMS = [
    "workspaceId",
    "listId",
    "searchId",
    "domain",
    "showFeed",
    "showRecommendations",
    "showUnsubscribe",
    "newLeadsOnly",
    "excludeUserLeads",
    "showWizard",
    "unsubscribeFromMonthlyDigest",
];

const sales = {
    salesWorkspace: {
        url: `/sales?${concatParams(SALES_QUERY_PARAMS)}`,
        parent: "workspace",
        controller: ($scope) => {
            $scope.Component = () => <h1>Sales Workspace</h1>;
        },
        reloadOnSearch: false,
        trackingId: {
            section: "workspaces",
            subSection: "sales",
            subSubSection: (params) => (params.wizard ? "wizard" : "home"),
        },
        configId: "SalesWorkspace",
        template: '<sw-react style="height: 100%;" component="SalesWorkspaceContainer"></sw-react>',
        pageTitle: "workspaces.sales.pageTitles",
        secondaryBarType: "SalesWorkspace" as SecondaryBarType,
    },
};

const hook = {
    hookWorkspace: {
        url: "/hook",
        parent: "workspace",
        reloadOnSearch: false,
        pageId: {
            section: "workspaces",
            subSection: "hook",
            subSubSection: "trialExpired",
        },
        configId: "HookWorkspace",
        template:
            '<div class="sw-layout-scrollable-element use-sticky-css-rendering fadeIn" auto-scroll-top>\n' +
            '<sw-react component="HookWorkspaceContainer"></sw-react>\n' +
            "</div>",
        pageTitle: "workspaces.hook.pageTitles",
    },
};

const empty = {};

export const getWorkspaceConfig = () => {
    if (isHookWorkspaceEnabled()) {
        return {
            ...(hasWorkSpacesPermission() || HasWorkspaceTrialPermission() ? root : empty),
            ...hook,
        };
    }

    return {
        ...(hasWorkSpacesPermission() || HasWorkspaceTrialPermission() ? root : empty),
        ...(hasMarketingPermission() || HasWorkspaceTrialPermission() ? marketing : empty),
        ...(hasSalesPermission() ? sales : empty),
        ...(hasInvestorPermission() ? investors : empty),
    };
};
