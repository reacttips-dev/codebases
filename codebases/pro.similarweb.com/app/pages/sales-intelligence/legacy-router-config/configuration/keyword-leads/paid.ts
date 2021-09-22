import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const paidConfig = {
    [LEAD_ROUTES.KEYWORD_RESULTS_PAID]: {
        parent: LEAD_ROUTES.KEYWORD_RESULTS,
        url: "/paid/:keyword/:country/:duration?webSource?",
        template: '<sw-react component="PaidKeywordLeadsContainer"></sw-react>',
        configId: "KeywordsAds",
        trackingId: {
            section: "SI_find",
            subSection: "topic leaders",
            subSubSection: "Search Results",
        },
        filters: {
            duration: true,
            country: true,
            category: true,
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
