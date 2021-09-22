import { ExcelQuotaResult, WebsiteSearchResult } from "../sub-modules/opportunities/types";
import ExcelClientDownload, {
    ExcelClientDownloadType,
} from "components/React/ExcelButton/ExcelClientDownload";
import { createFeedApiService } from "../../workspace/sales/sub-modules/feed/services/feedApiService";
import { createSignalsApiService } from "../../workspace/sales/sub-modules/signals/services/signalsApiService";
import { createBenchmarksApiService } from "../../workspace/sales/sub-modules/benchmarks/services/benchmarksApiService";
import { createOpportunitiesApiService } from "../sub-modules/opportunities/services/opportunitiesApiService";
import { createSearchesApiService } from "../sub-modules/saved-searches/services/searchesApiService";
import { createSiteTrendsApiService } from "pages/workspace/sales/sub-modules/site-trends/store/siteTrendsApiService";
import { createAdvancedSearchApiService } from "../sub-modules/advanced-search/services/advancedSearchApiService";
import { WebsiteInfo } from "pages/sales-intelligence/sub-modules/common/types";
import createCompetitorCustomersApiService from "../sub-modules/competitor-customers/services/competitorCustomersApiService";
import { createKeywordLeadsApiService } from "../sub-modules/keyword-leads/services/keywordsLeadsService";
import { createIndustriesApiService } from "../sub-modules/industries/services/industriesApiService";
import defaultFetchServiceOverride from "./fetchService";
import { IFetchService } from "services/fetchService";
import { createContactsApiService } from "pages/sales-intelligence/sub-modules/contacts/services/contactsApiService";

export const createSalesApiService = (
    fetchService: IFetchService,
    excelDownloadClient: ExcelClientDownloadType,
) => {
    return {
        /** Feed API */
        feed: createFeedApiService(fetchService),
        /** Sales signals API */
        signals: createSignalsApiService(fetchService),
        /** Benchmarks API */
        benchmarks: createBenchmarksApiService(fetchService),
        /** Sales opportunities API */
        opportunities: createOpportunitiesApiService(fetchService, excelDownloadClient),
        /** Saved searches API */
        searches: createSearchesApiService(fetchService, excelDownloadClient),
        /** Lead generator API */
        advancedSearch: createAdvancedSearchApiService(fetchService),
        siteTrends: createSiteTrendsApiService(fetchService),
        competitorCustomers: createCompetitorCustomersApiService(fetchService, excelDownloadClient),
        keywordLeads: createKeywordLeadsApiService(fetchService, excelDownloadClient),
        industries: createIndustriesApiService(fetchService, excelDownloadClient),
        contacts: createContactsApiService(fetchService),
        fetchSimilarWebsites(domain: string, size = 20): Promise<unknown[]> {
            return fetchService.get("/api/WebsiteOverview/getsimilarsites", {
                key: domain,
                limit: size,
            });
        },
        /**
         * Fetches info (like icons, category etc.) about given domain
         * TODO: Consider moving this to some common place maybe
         * @param domain
         */
        fetchWebsiteInfo(domain: string): Promise<{ [domain: string]: WebsiteInfo }> {
            return fetchService.get("/api/WebsiteOverview/getheader", {
                includeCrossData: false,
                mainDomainOnly: true,
                keys: domain,
            });
        },
        /**
         * Fetches websites based on given term
         * TODO: Consider moving this to some common place maybe
         * @param searchTerm
         * @param limit
         */
        fetchWebsitesByName(searchTerm: string, limit: number): Promise<WebsiteSearchResult[]> {
            return fetchService.get("/autocomplete/websites", {
                term: searchTerm,
                size: limit,
            });
        },
        /**
         * Fetch excel quota
         */
        fetchExcelQuota(): Promise<ExcelQuotaResult> {
            return fetchService.get("export/analysis/quota");
        },
    };
};

export default createSalesApiService(defaultFetchServiceOverride, ExcelClientDownload);
