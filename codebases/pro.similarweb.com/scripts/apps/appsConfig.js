import angular from "angular";

angular.module("sw.apps").config(function ($stateProvider, appAnalysisConfig) {
    angular.forEach(appAnalysisConfig, function (value, key) {
        $stateProvider.state(key, value);
    });
});
