import { SITE_TRENDS_ENDPOINT } from "pages/workspace/sales/types";
import { SiteTrends } from "../types";
import { IFetchService } from "services/fetchService";

export const createSiteTrendsApiService = (fetchService: IFetchService) => {
    return {
        fetchSiteTrends(
            country: string,
            domain: string,
            workspaceId: string,
        ): Promise<SiteTrends[]> {
            return fetchService.get(
                `${SITE_TRENDS_ENDPOINT}?country=${country}&domain=${domain}&workspaceId=${workspaceId}`,
            );
        },
    };
};
