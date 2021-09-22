import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const organicConfig = {
    [LEAD_ROUTES.KEYWORD_RESULTS_ORGANIC]: {
        parent: LEAD_ROUTES.KEYWORD_RESULTS,
        url: "/organic/:keyword/:country/:duration?webSource?",
        template: '<sw-react component="OrganicKeywordLeadsContainer"></sw-react>',
        trackingId: {
            section: "SI_find",
            subSection: "topic leaders",
            subSubSection: "Search Results",
        },
        pageId: {
            section: "keywords",
            subSection: "topic",
            subSubSection: "Search Results",
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        params: {
            webSource: "Desktop",
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};
