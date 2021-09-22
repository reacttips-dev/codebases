import angular from "angular";
const widgetUtilityChartToggleComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-switcher legacy="true" class="chart-type-toggle-widget-utility" disable-width-calculation="true"  items="$ctrl.items" chosen="$ctrl.chosenItem" tracking-name="$ctrl.trackName" tracking-name-prop="'value'" tracking-category="$ctrl.trackingCategory"></sw-switcher>`,
    controller: function ($scope) {
        this.items = [
            {
                iconSwClass: "sw-icon-line-graph",
                value: "line",
            },
            {
                iconSwClass: "sw-icon-bar-graph",
                value: "column",
            },
        ];
        this.chosenItem = this.widget.chartType;
        $scope.$watch("$ctrl.chosenItem", (newVal, oldVal) => {
            if (newVal !== oldVal) {
                if (newVal) {
                    this.widget.handleUtilityAction(this.utility, newVal);
                }
            }
        });
    },
};

angular
    .module("sw.common")
    .component("swWidgetUtilityChartToggle", widgetUtilityChartToggleComponent);
