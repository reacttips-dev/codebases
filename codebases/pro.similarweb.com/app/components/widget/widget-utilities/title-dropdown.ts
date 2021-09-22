import angular from "angular";
import * as _ from "lodash";
/**
 * Created by vlads on 18/1/2016.
 */
const widgetUtilityTitleDropdownComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-dropdown-title items="ctrl.items" selected="ctrl.selected" min-width="250px" sw-track-name="{{ctrl.trackName}}"></sw-dropdown-title>`,
    controllerAs: "ctrl",
    controller: function ($scope) {
        let ctrl = this;
        let utilityProp = this.utility.properties;
        let options: any = _.zip(utilityProp.titles, utilityProp.values, utilityProp.icons);
        let paramsObject = {};
        ctrl.items = _.map(options, (option) => ({
            title: option[0],
            id: option[1],
            icon: option[2],
        }));
        ctrl.selected = utilityProp.default;
        ctrl.widget.viewData.title = utilityProp.titles[0];
        paramsObject[utilityProp.param] = utilityProp.column
            ? `${utilityProp.column};${utilityProp.operator};${utilityProp.values[0]}`
            : utilityProp.values[0];
        ctrl.widget.apiParams = paramsObject;

        $scope.$watch("ctrl.selected", (newVal, oldVal) => {
            if (newVal != oldVal) {
                if (utilityProp.type === "string") {
                    newVal = `"${newVal}"`;
                } else if (utilityProp.type === "number") {
                    let numericValue = parseInt(newVal);
                    newVal = numericValue >= 0 ? numericValue : '""'; //here '""' is sent intentionally and it's handled in _setFilterParam of widget.service
                }
                ctrl.widget.viewData.title = utilityProp.titles[utilityProp.values.indexOf(newVal)];
                paramsObject[utilityProp.param] = utilityProp.column
                    ? `${utilityProp.column};${utilityProp.operator};${newVal}`
                    : newVal;
                ctrl.widget.apiParams = paramsObject;
            }
        });

        ctrl.trackName = this.widget.viewOptions.trackName;
    },
};

angular
    .module("sw.common")
    .component("swWidgetUtilityTitleDropdown", widgetUtilityTitleDropdownComponent);
