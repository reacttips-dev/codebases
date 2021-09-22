import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { PopularPagesWidgets } from "../config/popularpages";
import { PageBaseCtrl } from "./PageBaseCtrl";
import CountryService from "services/CountryService";

export class ContentPopularCtrl extends PageBaseCtrl {
    public title: string;
    public trackerName: string;

    constructor(public $scope, $rootScope, chosenSites, swNavigator, widgetFactoryService) {
        super($scope, $rootScope, chosenSites, swNavigator, widgetFactoryService);
        const ctrl = this;
        ctrl.trackerName = "Sales/Popular Pages";
        ctrl.title = "analysis.content.popular.title";

        const params = swNavigator.getParams();

        ctrl.chosenDevice = params.webSource ? params.webSource : this.getDevices().total;
    }

    public getWidgetsConfig(settings) {
        const mode = this.isCompare ? "compare" : "single";
        return _.cloneDeep(PopularPagesWidgets[mode]);
    }

    public getDevices() {
        return {
            total: "Total",
        };
    }
}

angular
    .module("websiteAnalysis")
    .controller("popularPagesCtrl", ContentPopularCtrl as ng.Injectable<ng.IControllerConstructor>);
