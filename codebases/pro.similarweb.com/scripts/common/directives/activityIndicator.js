import angular from "angular";

angular.module("sw.common").directive("activityIndicator", function ($timeout) {
    return {
        restrict: "EA",
        scope: {
            readyWhen: "=",
            putAtTop: "=", //boolean or undefined - default behaviour is that the indicator will be located at the middle
        },
        link: function (scope, element, attr) {
            // support for <div activityIndicator="resource.$resolved"></div>
            if (attr.activityIndicator) {
                scope.$parent.$watch(attr.activityIndicator, function activityIndicatorWatchAction(
                    newVal,
                    oldVal,
                ) {
                    scope.readyWhen = newVal;
                });
            }
        },
        transclude: true,
        replace: false,
        templateUrl: "/partials/directives/activity-indicator.html",
    };
});
