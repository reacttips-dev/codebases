import angular from "angular";

angular
    .module("shared")
    .factory("s_DataGetter", function ($http, $timeout, $rootScope, $filter, $q, swNavigator) {
        var timeoutDelay = 60000;
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
            get: function (name, rawParams, apiParamsOverride, skipHeader, skipCache) {
                var apiParams = swNavigator.getApiParams(rawParams);
                var params = Object.assign({}, apiParams, apiParamsOverride || {});
                var defer = (this.defer = $q.defer());
                var cache = !skipCache;

                defers[name] = defers[name] || [];
                defers[name].push(defer);

                $http
                    .get("/api/" + name, { cache: cache, timeout: defer.promise, params: params })
                    .success(function (data, status, headers, config) {
                        defer.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        defer.reject(status);
                    });

                var timeoutId = $timeout(function () {
                    $timeout.cancel(timeoutId);
                    defer.reject("timeout");
                }, timeoutDelay);

                return defer.promise;
            },
        };
        return service;
    });
