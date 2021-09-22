import angular from "angular";
/**
 * Created by vlads on 18/1/2016.
 */
const widgetUtilityTableClearComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-react component="ReactButton" props="{text: ctrl.clearText, type: 'flat', onClick: ctrl.clearFilters, isDisabled: trl.widget.widgetState==1}"></sw-react>`,
    controllerAs: "ctrl",
    controller: function ($filter, $scope) {
        let ctrl = this;
        ctrl.clearText = $filter("i18n")("forms.buttons.clearall");

        ctrl.clearFilters = function () {
            $scope.$emit("clear-widget-filter");
        };
    },
};

angular
    .module("sw.common")
    .component("swWidgetUtilityTableClear", widgetUtilityTableClearComponent);
