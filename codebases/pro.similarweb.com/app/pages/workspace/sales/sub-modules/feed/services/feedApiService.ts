import { Feed, FeedRequestParams } from "../types/feed";
import { SALES_WIDGET_ENDPOINT, ANALYSIS_ENDPOINT, API_ANALYSIS_ENDPOINT } from "../../../types";
import { TSiteInfo } from "../types/siteInfo";
import { TAdNetworksAbout } from "../types/adNetwork";
import { TTopCountries } from "../types/topCountries";
import { TechnologiesData } from "../types/technologies";
import { IFetchService } from "services/fetchService";

const technologiesTableUrl = "/widgetApi/SalesSiteAnalysis/SalesSiteAnalysis/Technographics";

export const createFeedApiService = (fetchService: IFetchService) => {
    return {
        /**
         * Fetches feed items for given domain
         * @param params
         */
        fetchWebsiteFeed(params: FeedRequestParams): Promise<Feed[]> {
            return fetchService.get(`${API_ANALYSIS_ENDPOINT}/News`, params);
        },
        fetchTopCountries(domain: string): Promise<TTopCountries> {
            return fetchService.get(
                `${ANALYSIS_ENDPOINT}/TopCountriesByGrowthAndShare/Table?domain=${domain}`,
            );
        },
        fetchAdNetworks(domain: string, country: string | number): Promise<TAdNetworksAbout> {
            return fetchService.get(
                `${API_ANALYSIS_ENDPOINT}/AdNetworks?domain=${domain}&country=${country}`,
            );
        },
        fetchSiteInfo(domain: string, country: number | string): Promise<TSiteInfo> {
            return fetchService.get(
                `${ANALYSIS_ENDPOINT}/SalesSiteInfo/SingleMetric?domain=${domain}&country=${country}`,
            );
        },
        /**
         * Marks given feed items as "seen"
         * @param payload
         */
        setFeedItemsSeen(
            payload: FeedRequestParams & {
                feedItemsIds: string[];
                opportunityListId?: string;
                workspaceId: string;
            },
        ): Promise<unknown> {
            const { workspaceId, domain, feedItemsIds, opportunityListId } = payload;

            return fetchService.post(
                `${SALES_WIDGET_ENDPOINT}/OpprotunitiesData/SeenItemsFeed` +
                    `?workspaceId=${workspaceId}&opportunityListId=${opportunityListId}&domain=${domain}`,
                { feedItemsIds },
            );
        },

        fetchTechnologies(key: string): Promise<TechnologiesData> {
            return fetchService.get(`${technologiesTableUrl}?domain=${encodeURIComponent(key)}`);
        },
    };
};
