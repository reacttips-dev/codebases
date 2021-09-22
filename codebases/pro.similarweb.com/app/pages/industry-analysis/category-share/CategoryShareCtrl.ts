import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { IndustryAnalysisPageCtrl } from "../controllers/IndustryAnalysisPageCtrl";

export class CategoryShareCtrl extends IndustryAnalysisPageCtrl {
    private params: any;

    constructor(
        public $scope: any,
        public widgetFactoryService: any,
        public swNavigator: any,
        $filter,
        $timeout,
    ) {
        super($scope, widgetFactoryService, swNavigator, swSettings, $filter, $timeout);
        this.params = swNavigator.getParams();

        if (this.isCustomCategory) {
            this.subtitle = null;
        }
    }

    protected initWidgets(params: any) {
        this.widgets = {};
    }
}

angular
    .module("sw.common")
    .controller("categoryShareCtrl", CategoryShareCtrl as ng.Injectable<ng.IControllerConstructor>);
