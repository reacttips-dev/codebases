import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";
import { FiltersEnum } from "components/filters-bar/utils";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const findIndustryConfig = {
    [LEAD_ROUTES.INDUSTRY_RESULT]: {
        parent: "sw",
        abstract: true,
        url: "/sales/find-leads/industry/results",
        templateUrl: "/app/pages/sales-intelligence/root.html",
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
    },
    [`${LEAD_ROUTES.INDUSTRY_RESULT}-TopWebsites`]: {
        parent: LEAD_ROUTES.INDUSTRY_RESULT,
        url: "/top-websites/:category/:country/:duration?webSource?",
        template: '<sw-react component="IndustryResultContainer"></sw-react>',
        configId: "IATopWebsitesExtended",
        pageId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "Search Results",
        },
        filters: {
            duration: false, // 'false' for visible and disabled filter
            country: true,
            category: true,
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
            },
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    [`${LEAD_ROUTES.INDUSTRY_RESULT}-IncomingTraffic`]: {
        parent: LEAD_ROUTES.INDUSTRY_RESULT,
        url: "/incoming-traffic/:category/:country/:duration?webSource?",
        template: '<sw-react component="IndustryResultContainer"></sw-react>',
        configId: "IndustryAnalysisGeneral",
        pageId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "Search Results",
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        filters: {
            duration: true,
            country: true,
            category: true,
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    [`${LEAD_ROUTES.INDUSTRY_RESULT}-OutboundTraffic`]: {
        parent: LEAD_ROUTES.INDUSTRY_RESULT,
        url: "/outbound-traffic/:category/:country/:duration?webSource?",
        template: '<sw-react component="IndustryResultContainer"></sw-react>',
        configId: "IndustryAnalysisOutgoingLinks",
        pageId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "Search Results",
        },
        filters: {
            duration: true,
            country: true,
            category: true,
            webSource: true,
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.HIDDEN,
            },
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    [`${LEAD_ROUTES.INDUSTRY_RESULT}-SearchLeaders`]: {
        parent: LEAD_ROUTES.INDUSTRY_RESULT,
        url: "/search-leaders/:category/:country/:duration?webSource?",
        template: '<sw-react component="IndustryResultContainer"></sw-react>',
        configId: "CategoryLeaders",
        pageId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "Search Results",
        },
        filters: {
            duration: false, // 'false' for visible and disabled filter
            country: true,
            category: true,
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
                webSource: FiltersEnum.DISABLED,
            },
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    [`${LEAD_ROUTES.INDUSTRY_RESULT}-SocialLeaders`]: {
        parent: LEAD_ROUTES.INDUSTRY_RESULT,
        url: "/social-leaders/:category/:country/:duration?webSource?",
        template: '<sw-react component="IndustryResultContainer"></sw-react>',
        configId: "CategoryLeaders",
        pageId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "SocialLeaders",
        },
        filters: {
            duration: false, // 'false' for visible and disabled filter
            country: true,
            category: true,
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
                webSource: FiltersEnum.DISABLED,
            },
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    [`${LEAD_ROUTES.INDUSTRY_RESULT}-DisplayLeaders`]: {
        parent: LEAD_ROUTES.INDUSTRY_RESULT,
        url: "/display-leaders/:category/:country/:duration?webSource?",
        template: '<sw-react component="IndustryResultContainer"></sw-react>',
        configId: "CategoryLeaders",
        pageId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "Search Results",
        },
        filters: {
            duration: false, // 'false' for visible and disabled filter
            country: true,
            category: true,
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
                webSource: FiltersEnum.DISABLED,
            },
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    [`${LEAD_ROUTES.INDUSTRY_RESULT}-ReferralLeaders`]: {
        parent: LEAD_ROUTES.INDUSTRY_RESULT,
        url: "/referral-leaders/:category/:country/:duration?webSource?",
        template: '<sw-react component="IndustryResultContainer"></sw-react>',
        configId: "CategoryLeaders",
        pageId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "Search Results",
        },
        filters: {
            duration: false, // 'false' for visible and disabled filter
            country: true,
            category: true,
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
                webSource: FiltersEnum.DISABLED,
            },
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    [`${LEAD_ROUTES.INDUSTRY_RESULT}-DirectLeaders`]: {
        parent: LEAD_ROUTES.INDUSTRY_RESULT,
        url: "/direct-leaders/:category/:country/:duration?webSource?",
        template: '<sw-react component="IndustryResultContainer"></sw-react>',
        configId: "CategoryLeaders",
        pageId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "Search Results",
        },
        filters: {
            duration: false, // 'false' for visible and disabled filter
            country: true,
            category: true,
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
                webSource: FiltersEnum.DISABLED,
            },
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    [`${LEAD_ROUTES.INDUSTRY_RESULT}-EmailLeaders`]: {
        parent: LEAD_ROUTES.INDUSTRY_RESULT,
        url: "/email-leaders/:category/:country/:duration?webSource?",
        template: '<sw-react component="IndustryResultContainer"></sw-react>',
        configId: "CategoryLeaders",
        pageId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "search results",
        },
        trackingId: {
            section: "SI_find",
            subSection: "industry leaders",
            subSubSection: "Search Results",
        },
        filters: {
            duration: false, // 'false' for visible and disabled filter
            country: true,
            category: true,
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
                webSource: FiltersEnum.DISABLED,
            },
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        icon: "sw-icon-traffic-sources",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
};
