import { FiltersEnum } from "components/filters-bar/utils";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const findCompetitorsConfig = {
    "salesIntelligence-findLeads-competitors": {
        parent: "salesIntelligence",
        url: "/find-leads/competitors",
        template: '<sw-react component="CompetitorCustomersStartPageContainer"></sw-react>',
        configId: "SalesWorkspace", // TODO
        trackingId: {
            section: "SI_find",
            subSection: "CompetitorsCustomers",
            subSubSection: "gate",
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    "salesIntelligence-findLeads-competitors-result": {
        abstract: true,
        parent: "sw",
        url: "/sales/find-leads/competitors/results",
        templateUrl: "/app/pages/sales-intelligence/root.html",
        trackingId: {
            section: "SI_find",
            subSection: "competitors customers",
            subSubSection: "search results",
        },
        configId: "WebAnalysis",
        data: {
            filtersConfig: {
                webSource: FiltersEnum.ENABLED,
                duration: FiltersEnum.ENABLED,
                country: FiltersEnum.ENABLED,
            },
        },
    },
    "salesIntelligence-findLeads-competitors-result-outgoing": {
        parent: "salesIntelligence-findLeads-competitors-result",
        url: "/outgoing-traffic/:key/:country/:duration?filters?orderBy",
        template: '<sw-react component="OutgoingSearchResultsPageContainer"></sw-react>',
        pageId: {
            section: "website",
            subSection: "destination",
            subSubSection: "outgoing",
        },
        params: {
            webSource: "Desktop",
        },
        trackingId: {
            section: "SI_find",
            subSection: "competitors customers",
            subSubSection: "Search Results",
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    "salesIntelligence-findLeads-competitors-result-incoming": {
        parent: "salesIntelligence-findLeads-competitors-result",
        url: "/incoming-traffic/:key/:country/:duration?webSource",
        template: '<sw-react component="IncomingSearchResultsPageContainer"></sw-react>',
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "referrals",
        },
        params: {
            webSource: "Total",
        },
        defaultQueryParams: {
            webSource: "Total",
        },
        trackingId: {
            section: "SI_find",
            subSection: "competitors customers",
            subSubSection: "Search Results",
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};
