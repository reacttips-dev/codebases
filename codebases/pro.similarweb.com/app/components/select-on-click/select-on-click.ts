import angular from "angular";
import * as _ from "lodash";
/**
 * Created by olegg on 19-Jun-16.
 */
//from here http://stackoverflow.com/questions/14995884/select-text-on-input-focus

angular.module("sw.common").directive("selectOnClick", [
    "$window",
    function ($window) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.on("click", function () {
                    if (!$window.getSelection().toString() && !_.isEmpty(this.value)) {
                        // Required for mobile Safari
                        this.setSelectionRange(0, this.value.length);
                    }
                });
            },
        };
    },
]);
