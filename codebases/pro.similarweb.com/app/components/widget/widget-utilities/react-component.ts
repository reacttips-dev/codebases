import angular from "angular";
import { IScope } from "angular";
import { IWidget } from "../widget-types/Widget";
import { ComponentType, ReactElement } from "react";

const widgetUtilityReactComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-react component="ctrl.utility.properties.component" props="props"></sw-react>`,
    controllerAs: "ctrl",
    controller: function ($scope, $timeout) {
        $scope.props = {
            widget: this.widget,
            utility: this.utility,
            timeGranularity: this.widget.apiParams.timeGranularity,
            $scope,
        };

        $scope.timeGranularity = this.widget.apiParams.timeGranularity;
        $scope.$watch("ctrl.widget.apiParams.timeGranularity", (newVal, oldVal) => {
            if (newVal !== oldVal) {
                $scope.props = {
                    widget: this.widget,
                    utility: this.utility,
                    $scope,
                    timeGranularity: newVal,
                };
                $scope.$applyAsync();
            }
        });
        $scope.$watch("ctrl.widget.data.Filters", (val, oldVal) => {
            if (val) {
                $scope.props = {
                    widget: this.widget,
                    utility: this.utility,
                    $scope,
                };
                $scope.$applyAsync();
            }
        });
    },
};

angular.module("sw.common").component("swWidgetUtilityReactComponent", widgetUtilityReactComponent);

export interface IReactWidgetUtilityComponentProps<T> {
    $scope: IScope;
    widget: IWidget<T>;
    utility: {
        id: string;
        properties: {
            component(
                IReactWidgetUtilityComponentProps,
            ): ReactElement<IReactWidgetUtilityComponentProps<T>>;
        };
    };
}
