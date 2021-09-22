// https://github.com/angular-ui/bootstrap/blob/0.13.0/src/bindHtml/bindHtml.js
import angular from "angular";

angular
    .module("ui.bootstrap.bindHtml", [])

    .directive("bindHtmlUnsafe", function () {
        return function (scope, element, attr) {
            element.addClass("ng-binding").data("$binding", attr.bindHtmlUnsafe);
            scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
                element.html(value || "");
            });
        };
    });
