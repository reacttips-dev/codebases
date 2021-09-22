import { FiltersEnum } from "components/filters-bar/utils";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { LEAD_ROUTES } from "../../../pages/find-leads/constants/routes";
import { totalConfig } from "./total";
import { organicConfig } from "./organic";
import { paidConfig } from "./paid";
import { mobileConfig } from "./mobile";

export const keywordLeadsConfig = {
    [LEAD_ROUTES.KEYWORDS]: {
        parent: "salesIntelligence",
        url: "/find-leads/keywords",
        template: '<sw-react component="KeywordLeads"></sw-react>',
        configId: "SalesWorkspace",
        trackingId: {
            section: "SI_find",
            subSection: "topic",
            subSubSection: "gate",
        },
        pageTitle: "si.pages.find_leads.document_title",
        secondaryBarType: "SalesIntelligenceFind" as SecondaryBarType,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    [LEAD_ROUTES.KEYWORD_RESULTS]: {
        abstract: true,
        parent: "salesIntelligence",
        url: "/find-leads/keywords/results",
        templateUrl: "/app/pages/sales-intelligence/root.html",
        configId: "KeywordAnalysis",
        trackingId: {
            section: "SI_find",
            subSection: "topic leaders",
            subSubSection: "search results",
        },
        defaultParams: {
            category: "All",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.ENABLED,
                webSource: FiltersEnum.ENABLED,
                country: FiltersEnum.ENABLED,
            },
        },
    },
    ...totalConfig,
    ...organicConfig,
    ...paidConfig,
    ...mobileConfig,
};
