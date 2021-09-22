import angular from "angular";
import { apiHelper } from "./apiHelper";
import { AppsResourceService } from "../../../app/services/AppsResourceService";
import { sitesResourceService } from "../../../app/services/sitesResource/sitesResourceService";

angular.module("sw.common").factory("similarItemsService", function ($q) {
    function getSimilarItems(mainItemParams, maxResults) {
        const _maxResults = maxResults || 20;
        const defer = $q.defer();
        switch (mainItemParams.type) {
            case "Mobile":
                var params = {};
                if (mainItemParams.appStore !== "both") {
                    params.store = mainItemParams.appStore;
                }
                params = apiHelper.transformParamsForAPI(params);
                params.appId = mainItemParams.name;
                AppsResourceService.similarApps(
                    params,
                    function ok(data) {
                        defer.resolve(data);
                    },
                    function bad(message) {
                        defer.reject(message);
                    },
                );
                break;
            case "Website":
                sitesResourceService
                    .getSimilarInfo(mainItemParams.name, _maxResults)
                    .then((data) => defer.resolve(data))
                    .catch((message) => defer.reject(message));
        }
        return defer.promise;
    }

    /* Public */
    return {
        getSimilarItems: getSimilarItems,
    };
});
