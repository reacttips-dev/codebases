/**
 * handles SimilarWebPro.Website.Controllers.Api.TrendsController
 */

import angular from "angular";
import * as _ from "lodash";

angular.module("sw.common").factory("topAppsResourceSI", function ($resource, swNavigator) {
    return $resource(
        "",
        {},
        {
            getTrends: {
                url: "/api/TopApps/Trends",
                method: "GET",
                cache: true,
                interceptor: {
                    response: function (response) {
                        function addHref(tableData) {
                            return _.map(tableData, function (item) {
                                var appStorePrefix = item.Tooltip.AppStore;
                                var params = swNavigator.getParams();
                                var appId = appStorePrefix + "_" + item.AppID;
                                item.url = swNavigator.href(
                                    "salesIntelligence-apps-engagementoverview",
                                    {
                                        appId: appId,
                                        country: params.country,
                                    },
                                );
                                item.tooltip = angular.copy(item.Tooltip);
                                item.App = item.AppID;
                                item.Tooltip.AppStore =
                                    item.Tooltip.AppStore == "1" ? "Apple" : "Google";
                                return item;
                            });
                        }

                        response.resource.data = {};
                        response.resource.data.SimilarWebTrends = angular.copy(
                            response.resource.SimilarWebTrends,
                        );
                        response.resource.data.AppStoreTrends = angular.copy(
                            response.resource.AppStoreTrends,
                        );

                        var similarWebKeys = _.keys(response.resource.data.SimilarWebTrends);
                        angular.forEach(similarWebKeys, function (key) {
                            response.resource.data.SimilarWebTrends[key] = addHref(
                                response.resource.data.SimilarWebTrends[key],
                            );
                        });

                        var appStoreKeys = _.keys(response.resource.data.AppStoreTrends);
                        angular.forEach(appStoreKeys, function (key) {
                            response.resource.data.AppStoreTrends[key] = addHref(
                                response.resource.data.AppStoreTrends[key],
                            );
                        });

                        return response.resource;
                    },
                },
            },
        },
    );
});
