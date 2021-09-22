import angular from "angular";
/**
 * Created by vlads on 18/1/2016.
 */
const widgetUtilityGaVerifyComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-ga-verify widget="ctrl.widget" ng-hide="ctrl.utility.hideUtility"></sw-ga-verify>`,
    controllerAs: "ctrl",
    controller: function () {
        var ctrl = this;
        ctrl.trackingConfig = {
            category: "Pop Up",
        };
    },
};

angular.module("sw.common").component("swWidgetUtilityGaVerify", widgetUtilityGaVerifyComponent);
