import { ISimilarInfo, ISitesResource, IWebsitesFavicons } from "services/sitesResource/types";
import { DefaultFetchService } from "services/fetchService";

const FAVICONS_ENDPOINT = "api/images";
const SIMILAR_SITES_ENDPOINT = "/api/WebsiteOverview/getsimilarsites";
const DEFAULT_WEBSITES_DELIMITER = ",";

const getWebsitesFavicons = (websites) => {
    const fetchService = DefaultFetchService.getInstance();
    const websitesString = websites.join(DEFAULT_WEBSITES_DELIMITER);
    const queryParams = { domains: websitesString };
    const getPromise = fetchService.get<IWebsitesFavicons>(FAVICONS_ENDPOINT, queryParams);
    return getPromise;
};

const getSimilarInfo = (domain = String(), limit = 5) => {
    const fetchService = DefaultFetchService.getInstance();
    const queryParams = { key: domain, limit };
    const getPromise = fetchService.get<ISimilarInfo>(SIMILAR_SITES_ENDPOINT, queryParams);
    return getPromise;
};

export const sitesResourceService: ISitesResource = {
    getWebsitesFavicons,
    getSimilarInfo,
};
