import angular from "angular";
/**
 * Created by vlads on 18/1/2016.
 */
const widgetUtilityComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    controllerAs: "ctrl",
    controller: function ($scope, $element, $compile) {
        let utilityType = this.utility.id;
        $element.append(
            $compile(
                `<sw-widget-utility-${utilityType} widget="ctrl.widget" utility="ctrl.utility" ng-class="{'no-a2d': !ctrl.widget.canAddToDashboard()}"></sw-widget-utility-${utilityType}>`,
            )($scope),
        );
    },
};

angular.module("sw.common").component("swWidgetUtility", widgetUtilityComponent);
