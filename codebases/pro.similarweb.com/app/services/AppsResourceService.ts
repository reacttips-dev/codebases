import { DefaultFetchService, NoCacheHeaders } from "services/fetchService";

const timeout = 60000;
/**
 * //TODO: ilan - This class NEEDS to be changed when there will be no more angular, the way it is now, with handler is incorrect, need to move to just return promise
 *
 */
export const AppsResourceService = {
    appInfo: (params, handler) => {
        return DefaultFetchService.getInstance()
            .get<any>("/api/MobileApps/GetAppInfo", params, { headers: NoCacheHeaders, timeout })
            .then((resource) => {
                const r = {
                    data: resource,
                };
                handler && handler(r);
            });
    },
    appInfoAndRelatedInfo: async (params) => {
        const resource = await DefaultFetchService.getInstance().get<any>(
            "/api/MobileApps/GetAppInfoAndRelatedInfo",
            params,
            {
                headers: NoCacheHeaders,
                timeout,
            },
        );

        return {
            data: resource,
        };
    },

    similarApps: (params, success?, failure?) => {
        return DefaultFetchService.getInstance()
            .get<any>("/api/MobileApps/GetSimilarApps", params, { timeout })
            .then((resource) => {
                success && success(resource);
            })
            .catch((e) => {
                failure && failure(e);
            });
    },
    affinity: (params) => {
        return DefaultFetchService.getInstance().get<any>(
            "/api/AppEngagement/GetAudienceInterests",
            params,
            { timeout },
        );
    },
    storeOptions: () => {
        return DefaultFetchService.getInstance()
            .get<any>("/api/TopApps/StoreOptions", {}, { timeout })
            .then((res) => {
                return res;
            });
    },
};
