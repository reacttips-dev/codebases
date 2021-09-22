import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { accountReviewConfig } from "./accountReviewConfig";
import { staticListsRoutesConfig } from "./staticListsRoutesConfig";
import { dynamicListsRoutesConfig } from "./dynamicListsRoutesConfig";
import { findLeadsSearchRoutesConfig } from "./findLeadsSearchRoutesConfig";
import { findCompetitorsConfig } from "./findCompetitorsConfig";
import * as routes from "../../constants/routes";
import { LEAD_ROUTES } from "../../pages/find-leads/constants/routes";
import { Solutions2Package } from "common/services/solutions2Helper";
import { keywordLeadsConfig } from "./keyword-leads/keywordLeadsConfig";
import { findIndustryConfig } from "./findIndustryConfig";
import { appAnalysisConfig } from "./appAnalysisConfig";
import appCategoryConfig from "./appCategoryConfig";

const salesIntelligenceMain = {
    [routes.SI_ROOT_ROUTE]: {
        parent: "sw",
        abstract: true,
        packageName: "salesIntelligence" as Solutions2Package,
        url: routes.SI_ROOT_ROUTE_URL,
        templateUrl: "/app/pages/sales-intelligence/root.html",
        configId: "SalesWorkspace", // TODO
        secondaryBarType: "None" as SecondaryBarType,
    },
    [routes.HOME_PAGE_ROUTE]: {
        parent: routes.SI_ROOT_ROUTE,
        url: "",
        template: '<sw-react component="HomePageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "SI_home",
            subSection: "SI_home",
            subSubSection: "SI_home",
        },
        pageTitle: "si.pages.home.document_title",
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceHome" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    [routes.MY_LISTS_PAGE_ROUTE]: {
        parent: routes.SI_ROOT_ROUTE,
        url: routes.MY_LISTS_PAGE_ROUTE_URL,
        template: '<sw-react component="MyListsPageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "target accounts",
            subSection: "accounts home",
            subSubSection: "accounts main",
        },
        pageTitle: "si.pages.my_lists.document_title",
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceLists" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    [routes.FIND_LEADS_PAGE_ROUTE]: {
        parent: routes.SI_ROOT_ROUTE,
        url: routes.FIND_LEADS_PAGE_ROUTE_URL,
        template: '<sw-react component="FindLeadsPageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "SI_find",
            subSection: "find home",
            subSubSection: "find main",
        },
        pageTitle: "si.pages.find_leads.document_title",
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    [LEAD_ROUTES.INDUSTRY]: {
        parent: "salesIntelligence",
        url: "/find-leads/industry",
        template: '<sw-react component="IndustryLeads"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "SI_find",
            subSection: "Industry",
            subSubSection: "gate",
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};

export const salesIntelligenceConfig = {
    ...salesIntelligenceMain,
    ...staticListsRoutesConfig,
    ...dynamicListsRoutesConfig,
    ...findLeadsSearchRoutesConfig,
    ...accountReviewConfig,
    ...findCompetitorsConfig,
    ...keywordLeadsConfig,
    ...findIndustryConfig,
    ...appAnalysisConfig,
    ...appCategoryConfig,
};
