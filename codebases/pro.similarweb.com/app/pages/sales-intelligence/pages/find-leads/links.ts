import { FIND_LEADS_SEARCH_ROUTE } from "pages/sales-intelligence/constants/routes";
import { LEAD_ROUTES } from "./constants/routes";
import createFindLeadsTrackingService from "pages/sales-intelligence/services/tracking/findLeadsTrackingService";

export const getFindLeadsPageLinks = <NAV extends { go(key: string): void }>(
    navigator: NAV,
    trackingService: ReturnType<typeof createFindLeadsTrackingService>,
) => {
    return [
        {
            onClick() {
                trackingService.trackCompanySearchClicked();
                navigator.go(FIND_LEADS_SEARCH_ROUTE);
            },
            name: "customLeads",
            iconName: "funnel-colored",
            primaryText: "si.pages.find_leads.links.custom_leads.title",
            secondaryText: "si.pages.find_leads.links.custom_leads.subtitle",
        },
        {
            onClick() {
                trackingService.trackIndustryLeadersClicked();
                navigator.go(LEAD_ROUTES.INDUSTRY);
            },
            name: "industryLeads",
            iconName: "affiliates",
            primaryText: "si.pages.find_leads.links.industry_leads.title",
            secondaryText: "si.pages.find_leads.links.industry_leads.subtitle",
        },
        {
            onClick() {
                trackingService.trackTopicLeadersClicked();
                navigator.go(LEAD_ROUTES.KEYWORDS);
            },
            name: "keywordsLeads",
            iconName: "ic-keywords",
            primaryText: "si.pages.find_leads.links.keywords_leads.title",
            secondaryText: "si.pages.find_leads.links.keywords_leads.subtitle",
        },
        {
            onClick() {
                trackingService.trackCompetitorsCustomersClicked();
                navigator.go(LEAD_ROUTES.COMPETITORS);
            },
            name: "competitorsTrafficLeads",
            iconName: "competitors-icon",
            primaryText: "si.pages.find_leads.links.traffic_leads.title",
            secondaryText: "si.pages.find_leads.links.traffic_leads.subtitle",
        },
    ];
};
