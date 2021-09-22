import * as routes from "pages/sales-intelligence/constants/routes";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const findLeadsSearchRoutesConfig = {
    [routes.FIND_LEADS_SEARCH_ROUTE]: {
        parent: routes.SI_ROOT_ROUTE,
        url: routes.FIND_LEADS_SEARCH_ROUTE_URL,
        template: '<sw-react component="UnderUDSearchPageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "SI_find",
            subSection: "company search",
            subSubSection: "Search Results",
        },
        pageTitle: "si.pages.find_leads.document_title", // TODO
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    [routes.FIND_LEADS_SEARCH_RESULT_ROUTE]: {
        parent: routes.SI_ROOT_ROUTE,
        url: routes.FIND_LEADS_SEARCH_RESULT_ROUTE_URL,
        template: '<sw-react component="FindLeadsSearchResultPageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "SI_find",
            subSection: "company search",
            subSubSection: "Search Results",
        },
        pageTitle: "si.pages.find_leads.document_title", // TODO
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    [routes.FIND_LEADS_SAVED_SEARCH_ROUTE]: {
        parent: routes.SI_ROOT_ROUTE,
        url: routes.FIND_LEADS_SAVED_SEARCH_ROUTE_URL,
        template: '<sw-react component="AdvancedSearchPageRoot"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "SI_find",
            subSection: "company search",
            subSubSection: "Saved search",
        },
        pageTitle: "si.pages.find_leads.document_title", // TODO
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};
