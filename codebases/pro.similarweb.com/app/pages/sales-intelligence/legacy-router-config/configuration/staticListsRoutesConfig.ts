import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import {
    SI_ROOT_ROUTE,
    STATIC_LIST_PAGE_ROUTE,
    STATIC_LIST_PAGE_ROUTE_URL,
} from "../../constants/routes";

export const staticListsRoutesConfig = {
    [STATIC_LIST_PAGE_ROUTE]: {
        parent: SI_ROOT_ROUTE,
        url: STATIC_LIST_PAGE_ROUTE_URL,
        template: '<sw-react component="OpportunityListPageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "target accounts",
            subSection: "static list",
            subSubSection: "static list sites",
        },
        pageId: {
            section: "target accounts",
            subSection: "static list",
            subSubSection: "static list sites",
        },
        pageTitle: "si.pages.my_lists.document_title",
        isSecondaryBarOpened: false,
        secondaryBarType: "SalesIntelligenceLists" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};
