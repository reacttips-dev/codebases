import angular from "angular";
import * as _ from "lodash";
import { WidgetState } from "../widget-types/Widget";
/**
 * Created by vlads on 18/1/2016.
 */

const widgetUtilityTablePagerComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-table-pager ng-if="ctrl.showPager()" page="ctrl.page" pages="ctrl.pages" on-pagination="ctrl.getData(page)" disabled="ctrl.widget.widgetState==1"></sw-table-pager>`,
    controllerAs: "ctrl",
    controller: function ($scope) {
        var self = this;
        this.page = this.widget.page;
        this.pages = 1;
        this.getData = (page) => {
            this.page = page;
            if (typeof this.widget.setPageData === "function") {
                this.widget.setPageData(page);
            } else {
                let paramsObject = {};
                paramsObject[this.utility.properties.param] = page;
                this.widget.apiParams = paramsObject;
            }
        };
        this.showPager = () => {
            return (
                this.widget.widgetState === WidgetState.LOADED &&
                this.widget.data &&
                this.widget.data.TotalCount > 0
            );
        };
        $scope.$watch("ctrl.widget.data.TotalCount", (val) => {
            if (val) {
                this.pages = _.ceil(val / 100);
            }
        });

        $scope.$watch("ctrl.widget.page", function (newVal, oldVal) {
            if (newVal != oldVal) {
                self.page = newVal;
            }
        });

        $scope.$watch("ctrl.page", function (newVal, oldVal) {
            if (newVal != oldVal) {
                self.widget.page = newVal;
            }
        });
    },
};

angular
    .module("sw.common")
    .component("swWidgetUtilityTablePager", widgetUtilityTablePagerComponent);
