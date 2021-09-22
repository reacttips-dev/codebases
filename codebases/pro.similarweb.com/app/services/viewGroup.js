import angular from "angular";
import { chosenItemsSetHeaderData } from "../../app/actions/routingActions";

angular
    .module("shared")
    .factory("s_ViewGroup", function (
        $http,
        $timeout,
        $rootScope,
        $q,
        sitesResource,
        chosenSites,
        swNavigator,
        $ngRedux,
    ) {
        var timeoutDelay = 120000;
        var defers = {};
        var service = {
            cancel: function (url) {
                angular.forEach(defers[url] || [], function (canceler) {
                    canceler.reject("reject");
                });
                delete defers[url];
            },
            cancelAll: function () {
                if (this.defer) {
                    this.defer.reject("rejectAll");
                    delete this.defer;
                }
            },
            get: function (name, rawParams, apiParamsOverride, infoOnly) {
                var apiParams = swNavigator.getApiParams(rawParams);
                var params = Object.assign({}, apiParams, apiParamsOverride || {});
                var defer = (this.defer = $q.defer());
                var cache = true;
                var resolveData = null;
                var headerLoaded = false;
                var dataLoaded = false;

                defers[name] = defers[name] || [];
                defers[name].push(defer);

                // fetch header/similar (cached)
                sitesResource.getSiteInfo(
                    {
                        keys: params.key,
                        mainDomainOnly: !!params.isWWW,
                    },
                    function (headerData) {
                        chosenSites.updateMainSite(headerData);
                        chosenSites.updateInfo(headerData);
                        // update redux with new data
                        $ngRedux.dispatch(chosenItemsSetHeaderData(headerData));
                        headerLoaded = true;
                        if (dataLoaded || infoOnly) defer.resolve(resolveData);
                    },
                );
                if (infoOnly) return service;
                // fetch data
                delete params.selectedTab;
                var request = "GET/api/" + name + "?" + $.param(params);
                var fetchDataFromServer = function () {
                    $http
                        .get("/api/" + name, {
                            cache: cache,
                            timeout: defer.promise,
                            params: params,
                        })
                        .success(function (data, status, headers, config) {
                            dataLoaded = true;
                            if (headerLoaded) defer.resolve(data);
                            else resolveData = data;
                        })
                        .error(function (data, status, headers, config) {
                            defer.reject(status);
                        });
                };
                fetchDataFromServer();

                var timeoutId = $timeout(function () {
                    $timeout.cancel(timeoutId);
                    defer.reject("timeout");
                }, timeoutDelay);

                return defer.promise;
            },
        };
        return service;
    });
