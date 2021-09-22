import angular from "angular";
import * as _ from "lodash";

angular.module("sw.common").directive("swTableExport", function ($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            downloadUrl: "@",
            useClientSideCsvDownload: "=",
        },
        compile: function (element) {
            return {
                pre: function (scope, element) {
                    scope.totalCount = true;
                    element.html($compile("<sw-csv></sw-csv>")(scope));
                },
            };
        },
    };
});
