import { IOpportunityListItemTrackStatus } from "../../pages/workspace/common/types";
import { DefaultFetchService } from "../fetchService";

// TODO: make it more generic
// we have mirroring endpoints, we can use 1 class with instance variable "workspace" and reduce codebase size
export default class BaseWorkspaceApiService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }
    /**
     * Helps to know whether domain + country tracked
     *
     * @param {string} domain
     * @param {number} country
     *
     * @returns {Promise<{isTracked: boolean}>}
     */
    public getTrackingStatus(domain: string): Promise<IOpportunityListItemTrackStatus[]> {
        return this.fetchService
            .get(`/api/userdata/workspaces/workspace/opportunities-track-status/${domain}`)
            .then((items) => {
                return items.sort((a, b) => {
                    if (a.opportunityListName < b.opportunityListName) {
                        return -1;
                    }
                    if (a.opportunityListName > b.opportunityListName) {
                        return 1;
                    }
                    return 0;
                });
            });
    }

    public getWebsiteHeader(domain, country, startDate, endDate): Promise<any> {
        return this.fetchService.get(
            `/api/WebsiteOverview/getheader?country=${country}&from=${startDate}&includeCrossData=true&includeSubDomains=true&isWindow=false&keys=${domain}&mainDomainOnly=false&timeGranularity=Monthly&to=${endDate}&webSource=Total`,
        );
    }

    public getWebsiteRanks(domain, country, startDate, endDate): Promise<any> {
        return this.fetchService.get(
            `/widgetApi/WebsiteOverview/WebRanks/SingleMetric?country=${country}&from=${startDate}&includeCrossData=true&includeSubDomains=true&isWindow=false&keys=${domain}&mainDomainOnly=false&timeGranularity=Monthly&to=${endDate}&webSource=Total`,
        );
    }
}
