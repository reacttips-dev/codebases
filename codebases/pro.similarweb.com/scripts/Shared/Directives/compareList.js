import angular from "angular";

angular.module("shared").directive("compareList", function ($rootScope, chosenSites, swNavigator) {
    var format = function (item) {
        return chosenSites.formatSite(item.id);
    };

    return {
        restrict: "E",
        template: function (tElm, tAttrs) {
            return '<input class="sw-site-selection" ng-model="currentSite" type="text" ng-cloak ui-select2="settings"/>';
        },
        replace: true,
        scope: {},
        compile: function () {
            return {
                pre: function (scope) {
                    scope.settings = {
                        formatSelection: format,
                        formatResult: format,
                        escapeMarkup: function (m) {
                            return m;
                        },
                        data: chosenSites.map(function (item, infoItem) {
                            return { id: item, text: infoItem.displayName };
                        }),
                    };

                    scope.currentSite =
                        swNavigator.getParams().selectedSite || scope.settings.data[0].id;
                    scope.$parent.query.key = scope.currentSite;

                    scope.$watch("currentSite", function (value) {
                        if (value && typeof value === "string") {
                            if (scope.$parent.query) {
                                scope.$parent.query.key = value;
                                swNavigator.go(
                                    swNavigator.current().name,
                                    Object.assign(swNavigator.getParams(), { selectedSite: value }),
                                );
                            }
                        }
                    });
                },
            };
        },
    };
});
