import angular from "angular";
const columnsToggle: ng.IComponentOptions = {
    bindings: {
        widget: "=",
        utility: "=",
    },
    template:
        '<sw-table-column-selector options="ctrl.widget.metadata.options" ng-if="ctrl.widget.metadata.columns" columns="ctrl.widget.metadata.columns" class="pull-right"></sw-table-column-selector>',
    controllerAs: "ctrl",
    controller: function ($scope) {},
};

angular.module("sw.common").component("swWidgetUtilityColumnsToggle", columnsToggle);
