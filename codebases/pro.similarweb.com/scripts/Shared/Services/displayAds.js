import angular from "angular";

angular.module("shared").factory("DisplayAds", function ($http, $rootScope, $filter, $q) {
    return {
        get: function (domain, country, isWindow) {
            var defer = $q.defer();
            $http
                .get("/api/websiteanalysis/GetDisplayAds", {
                    cache: true,
                    params: { key: domain, country: country, isWindow: isWindow },
                })
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function () {
                    defer.reject();
                });
            return defer.promise;
        },
    };
});
