import angular from "angular";
import * as _ from "lodash";

angular.module("shared").directive("swPager", function () {
    return {
        restrict: "EA",
        replace: false,
        template: [
            '<div class="sw-pager" ng-show="pages > 1">',
            '<ul class="pager">',
            '<li class="next">',
            '<a title="{{ \'pager.next\' | i18n }}" ng-class="{disabled: isLastPage }" href="javascript:void(0)" ng-click="nextPage()">',
            "<i></i>",
            "</a>",
            "</li>",
            '<li class="previous">',
            '<a title="{{ \'pager.prev\' | i18n }}" ng-class="{disabled: isFirstPage }" href="javascript:void(0)" ng-click="prevPage()">',
            "<i></i>",
            "</a>",
            "</li>",
            '<li class="sw-page-info">{{ \'pager.page\' | i18n }} <input type="text" ng-model="currentPage" ng-model-options="{ getterSetter: true }"/> {{ \'pager.of\' | i18n }} {{ pages }}</li>',
            "</ul>",
            "</div>",
        ].join(""),
        link: function (scope) {
            var _currentInput = scope.query.page || 1;

            scope.currentPage = function (val) {
                // input validation

                function setAndGotoPage(val) {
                    _currentInput = val;
                    scope.setPage(_currentInput);
                }

                if (!angular.isDefined(val) || !scope.pages) {
                    return _currentInput;
                } // undefined (mostly 'getter' calls)
                if (val == 1 && scope.pages == 1) {
                    return _currentInput;
                }
                if (val === "" || _.isNaN(Number(val)) || !Number.isInteger(Number(val))) {
                    _currentInput = "";
                } // user has deleted or entered Non-Integer value
                else if (val >= 1 && val <= scope.pages) {
                    // most common case (valid number)
                    setAndGotoPage(val);
                } else if (val > scope.pages) {
                    // greater then last page
                    setAndGotoPage(scope.pages);
                } else if (val < 1) {
                    // less than first page
                    setAndGotoPage(1);
                }

                return _currentInput;
            };

            scope.$watch("query.page", function (value, oldVal) {
                if (value !== oldVal) {
                    scope.currentPage(value);
                    scope.isFirstPage = value === 1;
                    scope.isLastPage = value === scope.pages;
                }
            });

            scope.$watch("pages", function (value) {
                scope.isLastPage = scope.query.page === value;
            });
        },
    };
});
