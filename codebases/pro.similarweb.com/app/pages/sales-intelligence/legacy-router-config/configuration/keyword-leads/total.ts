import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const totalConfig = {
    [LEAD_ROUTES.KEYWORD_RESULTS_TOTAL]: {
        parent: LEAD_ROUTES.KEYWORD_RESULTS,
        configId: "KeywordAnalysisTotal",
        url: "/total/:keyword/:country/:duration?webSource?",
        template: '<sw-react component="TotalKeywordLeadsContainer"></sw-react>',
        trackingId: {
            section: "SI_find",
            subSection: "topic leaders",
            subSubSection: "Search Results",
        },
        pageId: {
            section: "keywords",
            subSection: "keywords",
            subSubSection: "analysis",
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        params: {
            webSource: "Total",
        },
        defaultQueryParams: {
            webSource: "Total",
        },
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};
