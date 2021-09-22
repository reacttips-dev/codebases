import angular from "angular";
/**
 * Created by liorb on 3/16/2016.
 */

const dynamicDirective: angular.IComponentOptions = {
    bindings: {
        widget: "=",
    },
    controllerAs: "ctrl",
    controller: function ($element, $compile, $scope) {
        $element.html(
            $compile(
                `<${this.widget._widgetConfig.properties.directive} ng-if="ctrl.widget.data" widget="ctrl.widget" data="ctrl.widget.data"></${this.widget._widgetConfig.properties.directive}>`,
            )($scope),
        );
    },
};
angular.module("sw.common").component("swDynamicDirective", dynamicDirective);
