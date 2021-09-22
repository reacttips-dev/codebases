import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { LeadingFoldersWidgets } from "./leading-folders";
import { PageBaseCtrl } from "../../controllers/PageBaseCtrl";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import CountryService from "services/CountryService";

export class LeadingFoldersCtrl extends PageBaseCtrl {
    public title: string;
    public trackerName: string;
    showFolderAnalysisPanelInfo: boolean;

    constructor($scope, $rootScope, chosenSites, swNavigator, widgetFactoryService) {
        super($scope, $rootScope, chosenSites, swNavigator, widgetFactoryService);

        let ctrl = this;
        ctrl.trackerName = "Sales/Leading Folders";
        ctrl.title = "analysis.common.content.pop.folders";
        let params = swNavigator.getParams();
        ctrl.showFolderAnalysisPanelInfo =
            swSettings.components.Home.resources.HasFolderAnalysis &&
            params.webSource !== "MobileWeb";
    }

    getWidgetsConfig(settings) {
        let mode = this.isCompare ? "compare" : "single";
        const hasFolderAnalysis = settings.components.Home.resources.HasFolderAnalysis;

        return _.cloneDeep(LeadingFoldersWidgets(hasFolderAnalysis)[mode]);
    }

    public getDevices() {
        return {
            total: "Total",
        };
    }
}

angular
    .module("websiteAnalysis")
    .controller(
        "leadingFoldersCtrl",
        LeadingFoldersCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
