import angular from "angular";
/**
 * Created by olegg on 29-Nov-16.
 */
const widgetToggleComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-switcher 
                        items="ctrl.items" 
                        is-beta="ctrl.isBeta"
                        disable-width-calculation="true" 
                        chosen="ctrl.chosenItem" 
                        ng-hide="ctrl.utility.hideUtility" 
                        class="time-granularity-widget-utility" 
                        tracking-name="ctrl.trackName" 
                        tracking-name-prop="'value'" 
                        tracking-action="click"
                        tracking-category="ctrl.trackingCategory"></sw-switcher>`,
    controllerAs: "ctrl",
    controller: function ($scope) {
        let ctrl = this;
        ctrl.trackName = ctrl.widget._widgetConfig.properties.trackName + "/";
        ctrl.items = this.utility.properties.items;
        ctrl.trackingCategory = this.utility.properties.trackingCategory;
        let utility = ctrl.widget.findUtility(this.utility.type, 0);
        ctrl.chosenItem = utility.properties.defaultItem;
        ctrl.isBeta = utility.isBeta;
        $scope.$watch("ctrl.chosenItem", (newVal, oldVal) => {
            if (newVal != oldVal) {
                ctrl.widget.handleUtilityAction(this.utility, newVal);
            }
        });
    },
};
angular.module("sw.common").component("swWidgetUtilityWidgetToggle", widgetToggleComponent);
