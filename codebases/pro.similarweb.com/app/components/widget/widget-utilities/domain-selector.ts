import angular from "angular";
import * as _ from "lodash";
/**
 * Created by liorb on 12/19/2016.
 */
const widgetUtilityDomainSelector: ng.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-dropdown items="ctrl.options" selected="ctrl.selectedOption"></sw-dropdown>`,
    controllerAs: "ctrl",
    controller: function ($scope: ng.IScope, sitesResource) {
        let ctrl = this;
        ctrl.options = _.map(this.widget.getProperties(true).key, (item: any) => {
            return {
                id: item.id,
                text: item.id,
            };
        });

        ctrl.options.forEach(function (item) {
            sitesResource.GetWebsiteImage({ website: item.id }, function (data) {
                item.iconImage = data.image;
            });
        });

        ctrl.selectedOption = ctrl.widget.apiParams.keys.split(",")[0];
        $scope.$watch("ctrl.selectedOption", (newVal, oldVal) => {
            if (newVal != oldVal) {
                this.widget.apiParams = { keys: newVal };
                this.widget.emit("widgetKeyChanged", newVal);
            }
        });
        // update selected option when the key is changed in the widget.
        $scope.$watch("ctrl.widget.apiParams.keys", (newVal, oldVal) => {
            if (newVal !== oldVal) {
                ctrl.selectedOption = newVal;
            }
        });
    },
};

angular.module("sw.common").component("swWidgetUtilityDomainSelector", widgetUtilityDomainSelector);
