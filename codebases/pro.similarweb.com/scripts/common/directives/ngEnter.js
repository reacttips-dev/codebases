import angular from "angular";

angular.module("sw.common").directive("ngEnter", function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                var locals = { domElemValue: event.currentTarget.value };
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, locals);
                });
                event.preventDefault();
            }
        });
    };
});
