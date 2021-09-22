import angular from "angular";
import * as _ from "lodash";
import { SwTrack } from "../../services/SwTrack";

angular.module("sw.common").directive("swTableSearch", function () {
    return {
        scope: {},
        bindToController: {
            term: "=",
            isDisabled: "=",
            onSearch: "&",
        },
        restrict: "E",
        replace: true,
        templateUrl: "/app/components/table-search/table-search.html",
        controllerAs: "ctrl",
        controller: function () {
            const ctrl = this;
            ctrl.search = function () {
                ctrl.onSearch({ term: ctrl.term });
                SwTrack.all.trackEvent("Search Bar", "click", "Table/" + ctrl.term);
            };
        },
    };
});
