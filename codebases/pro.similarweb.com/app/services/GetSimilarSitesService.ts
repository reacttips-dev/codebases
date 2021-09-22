import { DefaultFetchService } from "./fetchService";

export interface ISimilarSitesService {
    fetchSimilarSites: (siteName: string, limit: number) => Promise<any>;
}
export default class SimilarSitesService implements ISimilarSitesService {
    private static _instance: SimilarSitesService;
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public static getInstance() {
        if (!SimilarSitesService._instance) {
            SimilarSitesService._instance = new SimilarSitesService();
        }
        return SimilarSitesService._instance;
    }

    public fetchSimilarSites(siteName: string, limit: number): Promise<any> {
        return this.fetchService.get(
            `/api/WebsiteOverview/getsimilarsites?key=${siteName}&limit=${limit}`,
        );
    }
}
