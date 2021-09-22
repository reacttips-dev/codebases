import angular from "angular";
import * as _ from "lodash";

angular
    .module("sw.common")
    .constant("dropdownConfig", {
        openClass: "is-opened",
    })
    .controller("swDropdownTitleCtrl", function ($scope, $element, $attrs) {
        var ctrl = this;

        $scope.selectItem = function (item) {
            ctrl.selectedItem = item;
            $scope.selected = item.id;
        };

        $scope.$watch("selected", function watchSelectedValue(val) {
            if (val) {
                ctrl.selectedItem = returnItem($scope.items, val);
                $scope.selected = val;
            }
        });
        // private methods
        function returnItem(items, itemId) {
            return _.find(items, function (item) {
                return item.id == itemId;
            });
        }
    })
    .directive("swDropdownTitle", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                items: "=",
                selected: "=",
                ngDisabled: "=",
            },
            templateUrl: "/app/components/dropdown-menu/swDropdown-title.html",
            controller: "swDropdownTitleCtrl",
            controllerAs: "ctrl",
            link: function (scope, element, attrs) {
                //the specific tracking name
                scope.trackName = attrs.swTrackName || "";
                scope.width = attrs.width;
                scope.minWidth = attrs.minWidth;
            },
        };
    });
