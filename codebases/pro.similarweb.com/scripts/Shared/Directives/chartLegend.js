import { ChartMarkerService } from "services/ChartMarkerService";
import angular from "angular";

angular.module("shared").directive("chartLegend", function () {
    const defaults = {
        labelsFilter: function (label) {
            return label;
        },
        valuesFilter: function (value) {
            return value;
        },
    };

    return {
        require: "?^chartGroup",
        restrict: "E",
        scope: {
            listItemClick: "=",
            options: "=",
        },
        template: `<ul class="sw-legend sw-table-layout {{colClass}}" ng-class="{'multi-col': multiCol}" ng-repeat="colData in cols">
    <li ng-repeat="item in colData">
        <div ng-class="{'sw-clickable': item.id != undefined }" class="sw-caption">
            <span class="sw-color" ng-style="item.color | marker" data-color="{{ item.color }}"></span>
            <span class="sw-label" ng-bind-html="item.label"></span>
        </div>
        <span ng-if="item.absolute" class="sw-value sw-absolute-value">{{ item.absolute | bigNumber | number}}</span>
        <span class="sw-value sw-value-binding value-inlineBlock">{{ item.value }}</span>
    </li>
</ul>`,
        compile: function (el, attrs, linker) {
            if (attrs.valuesFilter) {
                el.find(".sw-value-binding").html("{{ item.value | " + attrs.valuesFilter + " }}");
            }

            if (attrs.labelsFilter) {
                el.find("span[ng-bind-html]").attr(
                    "ng-bind-html",
                    "item.label" + " | " + attrs.labelsFilter,
                );
            }

            if (attrs.filter) {
                el.find("div.sw-caption").attr(
                    "ng-click",
                    "listItemClick('" + attrs.filter + "',item.id)",
                );
            }

            const getCols = function (data, itemsInCol) {
                const dataInCols = [],
                    len = data && data.length;
                let i = 0;
                while (i < len) {
                    dataInCols.push(data.slice(i, (i += itemsInCol)));
                }
                return dataInCols;
            };

            return function (scope, element, attrs, chartGroupCtrl) {
                Object.assign(scope, defaults, scope.options);

                scope.data = [];

                const itemsInCol =
                    ("itemsInColumn" in attrs && Number(attrs.itemsInColumn)) || Infinity;

                scope.$watch("data", function (data) {
                    scope.cols = getCols(data, itemsInCol || 1);
                    const colsNumber = scope.cols.length;
                    scope.multiCol = colsNumber > 1;
                    if (
                        scope.multiCol &&
                        !("columnClass" in attrs) &&
                        colsNumber !== scope.colsNumber
                    ) {
                        const curColClass = "span" + Math.floor(12 / colsNumber);
                        element
                            .find("ul.sw-legend")
                            .removeClass("span" + Math.floor(12 / scope.colsNumber))
                            .addClass(curColClass);
                        scope.colClass = curColClass;
                    }
                    scope.colsNumber = colsNumber;
                    element[data && data.length ? "show" : "hide"]();
                });

                scope.colClass = "columnClass" in attrs ? attrs.columnClass : "";

                scope.showLegend = function () {
                    element.show();
                };

                if (chartGroupCtrl) {
                    chartGroupCtrl.registerLegend(scope);
                }
            };
        },
    };
});
