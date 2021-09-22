import angular from "angular";
import * as _ from "lodash";

angular.module("sw.common").directive("swPageHeader", function () {
    return {
        restrict: "EA",
        templateUrl: "/app/components/page-header/page-header.html",
        scope: {
            tabletscentered: "@tabletsCentered",
        },
        transclude: {
            leftSide: "?leftSide",
            rightSide: "?rightSide",
        },
        replace: true,
        link: function ($scope, elem, attrs) {},
        controller: ["$scope", function ($scope) {}],
    };
});
