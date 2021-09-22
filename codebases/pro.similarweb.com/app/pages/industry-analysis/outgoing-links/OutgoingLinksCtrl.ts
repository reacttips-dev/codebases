import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { IndustryAnalysisPageCtrl } from "../controllers/IndustryAnalysisPageCtrl";

export class OutgoingLinksCtrl extends IndustryAnalysisPageCtrl {
    constructor(
        public $scope: any,
        widgetFactoryService: any,
        swNavigator: any,
        $filter,
        $timeout,
    ) {
        super($scope, widgetFactoryService, swNavigator, swSettings, $filter, $timeout);
    }

    protected initWidgets(params: any) {
        this.widgets = {};
    }
}

angular
    .module("sw.common")
    .controller("OutgoingLinksCtrl", OutgoingLinksCtrl as ng.Injectable<ng.IControllerConstructor>);
