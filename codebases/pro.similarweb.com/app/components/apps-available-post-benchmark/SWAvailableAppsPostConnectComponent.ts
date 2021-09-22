import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { IGooglePlayService } from "../google-play-wizard/google-play-service";
/**
 * Created by Eyal.Albilia on 12/13/2016.
 */
class SWAppsAvailablePostConnectController {
    static $inject = [
        "$scope",
        "swConnectedAccountsService",
        "swNavigator",
        "appAnalysisConfig",
        "$timeout",
        "googlePlayService",
    ];
    private appDefaultParams;
    private swSettings = swSettings;
    public availableApps;
    constructor(
        private _$scope,
        private swConnectedAccountsService,
        private swNavigator,
        private appAnalysisConfig,
        private $timeout,
        private googlePlayService: IGooglePlayService,
    ) {
        this.availableApps = [];
        this.swConnectedAccountsService.getGoogleAccountAvailableBenchmarkAppsInfo((data: any) => {
            this.availableApps = data.data.map(function (keypair) {
                return keypair.Value;
            });
        });
    }

    benchmarkApp(app) {
        this.googlePlayService.connectedUserRedirect({
            benchmarkedApp: app.Id,
            competitorsAppList: undefined,
        });
    }

    benchmarkAllApps() {
        if (!this.availableApps) {
            return false;
        }
        let mainApp = this.availableApps[0];
        let competitorsAppIds = [];
        for (var i = 1; i < this.availableApps.length; i++) {
            competitorsAppIds.push(this.availableApps[i].Id);
        }
        this.googlePlayService.connectedUserRedirect({
            benchmarkedApp: mainApp.Id,
            competitorsAppList: competitorsAppIds.join(),
        });
    }
}

export class SWAvailableAppsPostConnectComponent implements angular.IComponentOptions {
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.templateUrl =
            "/app/components/apps-available-post-benchmark/available-apps-post-benchmark.html";
        this.controller = SWAppsAvailablePostConnectController;
    }
}

angular
    .module("sw.common")
    .component("swAvailableAppsPostConnect", new SWAvailableAppsPostConnectComponent());
