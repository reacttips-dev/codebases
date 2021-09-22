import angular from "angular";
/**
 * Created by vlads on 18/1/2016.
 */
const widgetUtilityChartExportComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-chart-export chart-config="ctrl.widget.chartConfig" export-csv-url="true" widget="ctrl.widget" utility="ctrl.utility" track-name="ctrl.trackName"></sw-chart-export>`,
    controllerAs: "ctrl",
    controller: function () {
        this.trackName = this.widget._widgetConfig.properties.trackName;
    },
};

angular
    .module("sw.common")
    .component("swWidgetUtilityChartExport", widgetUtilityChartExportComponent);
