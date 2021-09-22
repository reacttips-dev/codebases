import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import * as routes from "../../constants/routes";

export const dynamicListsRoutesConfig = {
    [routes.DYNAMIC_LIST_PAGE_ROUTE]: {
        parent: routes.SI_ROOT_ROUTE,
        url: routes.DYNAMIC_LIST_PAGE_ROUTE_URL,
        template: '<sw-react component="DynamicListPageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "target accounts",
            subSection: "Saved Search",
            subSubSection: "Account Main",
        },
        pageId: {
            section: "target accounts",
            subSection: "Saved Search",
            subSubSection: "Account Main",
        },
        pageTitle: "si.pages.my_lists.document_title",
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceLists" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    [routes.NEW_DYNAMIC_LIST_SEARCH_ROUTE]: {
        parent: routes.SI_ROOT_ROUTE,
        url: routes.NEW_DYNAMIC_LIST_SEARCH_ROUTE_URL,
        template: '<sw-react component="NewSearchPageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "SI_find",
            subSection: "company search",
            subSubSection: "Search Results",
        },
        pageTitle: "si.pages.find_leads.document_title", // TODO
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceLists" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    [routes.NEW_DYNAMIC_LIST_SEARCH_RESULT_ROUTE]: {
        parent: routes.SI_ROOT_ROUTE,
        url: routes.NEW_DYNAMIC_LIST_SEARCH_RESULT_ROUTE_URL,
        template: '<sw-react component="NewSearchResultPageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "SI_find",
            subSection: "company search",
            subSubSection: "Search Results",
        },
        pageTitle: "si.pages.find_leads.document_title", // TODO
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceLists" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};
