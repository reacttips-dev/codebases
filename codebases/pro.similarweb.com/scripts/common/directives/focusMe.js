import angular from "angular";
import * as _ from "lodash";

angular.module("sw.common").directive("focusMe", function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.focusMe, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                        scope[attrs.focusMe] = false;
                        if (element[0].value) {
                            element[0].setSelectionRange(0, element[0].value.length);
                        }
                    });
                }
            });
        },
    };
});
