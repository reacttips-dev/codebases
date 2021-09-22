import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const mobileConfig = {
    [LEAD_ROUTES.KEYWORD_RESULTS_MOBILE]: {
        parent: LEAD_ROUTES.KEYWORD_RESULTS,
        url: "/mobile/:keyword/:country/:duration?webSource?",
        template: '<sw-react component="MobileKeywordLeadsContainer"></sw-react>',
        configId: "KeywordAnalysisMobileWeb",
        trackingId: {
            section: "SI_find",
            subSection: "topic leaders",
            subSubSection: "Search Results",
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        defaultQueryParams: {
            webSource: "MobileWeb",
        },
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};
