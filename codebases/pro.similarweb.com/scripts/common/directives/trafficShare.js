import angular from "angular";
import * as _ from "lodash";
import { ChartMarkerService } from "services/ChartMarkerService";

angular.module("sw.common").directive("trafficShare", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/partials/directives/traffic-share.html",
    };
});
