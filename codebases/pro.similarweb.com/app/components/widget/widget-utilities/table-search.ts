import angular from "angular";
import * as _ from "lodash";
/**
 * Created by vlads on 18/1/2016.
 */
const widgetUtilityTableSearchComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-table-search term="ctrl.term" on-search="ctrl.getData(term)" isDisabled="ctrl.widget.widgetState==1"></sw-table-search>`,
    controllerAs: "ctrl",
    controller: function ($scope) {
        let utilityProp = this.utility.properties;
        this.term = utilityProp.search || "";
        this.getData = function (term) {
            if (utilityProp.onChange) {
                return utilityProp.onChange(this, term);
            }
            this.widget.page = 1;
            _.set(this, "widget.data.page", 1); //for the client side pagination
            this.widget.setFilterParam({
                param: utilityProp.param,
                name: utilityProp.column,
                type: utilityProp.type,
                operator: utilityProp.operator,
                value: term,
            });
        };

        $scope.$on("clear-utility-filter", () => {
            this.term = "";
        });
    },
};

angular
    .module("sw.common")
    .component("swWidgetUtilityTableSearch", widgetUtilityTableSearchComponent);
