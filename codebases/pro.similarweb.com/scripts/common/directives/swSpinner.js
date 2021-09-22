import angular from "angular";

angular.module("sw.common").directive("swSpinner", function () {
    return {
        restrict: "AE",
        templateUrl: "/partials/directives/spinner.html",
    };
});
