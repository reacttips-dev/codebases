import angular from "angular";
/**
 * Created by vlads on 18/1/2016.
 */
const widgetUtilityTableExportComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-table-export use-client-side-csv-download="ctrl.widget._viewOptions.useClientSideCsvDownload" ng-show="ctrl.widget.data.TotalCount || ctrl.utility.properties.forceShow" download-url="{{ctrl.widget.excelUrl}}"></sw-table-export>`,
    controllerAs: "ctrl",
    controller: function () {},
};

angular
    .module("sw.common")
    .component("swWidgetUtilityTableExport", widgetUtilityTableExportComponent);
