import angular from "angular";
import { IConnectedAccountsService } from "services/connectedAccounts.service";

export class SWAppSelectionController {
    static $inject = ["$scope", "swConnectedAccountsService"];
    private singleApp: boolean;
    private requestSubmit: boolean = false;
    //TODO: change implemntation to partial data coming from server
    private maxAllowedShowedApps: number = 20;
    private storeName: string = "google";
    private trackingCategory: string = "Pop Up";
    private trackingName: string = "Connected Account/Compare";
    private appSelectionI18Codes = {
        header: "Connection successful!",
        singleApp: "googleplayconnect.popup.benchmark.title.single",
        multiApps: "googleplayconnect.popup.benchmark.title.multi",
        promotionNotice: "googleplayconnect.popup.benchmark.description",
        maxAllowedShowedNotice: "googleplayconnect.popup.max.allowed.notice",
        submit: "googleplayconnect.buttons.popup.finish",
    };
    public apps;
    public selectedApp: any = undefined;
    public competitorsAppList = [null, null, null, null];

    constructor(private _$scope: any, private connectedAccountsService: IConnectedAccountsService) {
        this.singleApp = false;
        /*            //DEBUG ONLY: Mock Only
                    this.apps = [
                        {"id":"com.espn.espnis","image":"https://lh5.ggpht.com/pOZgT1Q3dhWIZ5WUyoJ8tsPshfDiTnwIASB1SZDFt754FMHN8PGjDnIPqRxj7JjPheE=w300","name":"ESPN Play","publisher":"ESPN Inc","store":"google","fromSuggestions":true},
                        {"id":"com.espn.fantasy.lm.football","image":"https://lh3.googleusercontent.com/agdeEPKtsU_mFdAlmUkV_vbUtdf-1ldu_N0vS5lgJkDeTOHCCxKym3C1hs3VCvT-DFE=w300","name":"ESPN Fantasy Sports","publisher":"ESPN Inc","store":"google","fromSuggestions":true},
                        {"id":"com.sosscores.livefootball","image":"https://lh3.ggpht.com/uuQoxIfolqBKOoXmePRVFdjKxJVdxjBb7bAXNfACsUJQCbFN2_amzC4gcTfVlgowUW4=w300","name":"Live Football","publisher":"SOS Football Livescore","store":"google","fromSuggestions":true},
                        {"id":"air.WatchESPN","image":"https://lh3.ggpht.com/FRgzeJBgHSwyPxVVWrIgPIbZYL7VcPcUD70FLDJFgqL6E7zdKMVWCW35OGtAzUkrng=w300","name":"WatchESPN","publisher":"ESPN Inc","store":"google","fromSuggestions":true},
                        {"id":"com.espn.espnis","image":"https://lh5.ggpht.com/pOZgT1Q3dhWIZ5WUyoJ8tsPshfDiTnwIASB1SZDFt754FMHN8PGjDnIPqRxj7JjPheE=w300","name":"ESPN Play","publisher":"ESPN Inc","store":"google","fromSuggestions":true},
                        {"id":"com.espn.fantasy.lm.football","image":"https://lh3.googleusercontent.com/agdeEPKtsU_mFdAlmUkV_vbUtdf-1ldu_N0vS5lgJkDeTOHCCxKym3C1hs3VCvT-DFE=w300","name":"ESPN Fantasy Sports","publisher":"ESPN Inc","store":"google","fromSuggestions":true},
                        {"id":"com.sosscores.livefootball","image":"https://lh3.ggpht.com/uuQoxIfolqBKOoXmePRVFdjKxJVdxjBb7bAXNfACsUJQCbFN2_amzC4gcTfVlgowUW4=w300","name":"Live Football","publisher":"SOS Football Livescore","store":"google","fromSuggestions":true},
                        {"id":"air.WatchESPN","image":"https://lh3.ggpht.com/FRgzeJBgHSwyPxVVWrIgPIbZYL7VcPcUD70FLDJFgqL6E7zdKMVWCW35OGtAzUkrng=w300","name":"WatchESPN","publisher":"ESPN Inc","store":"google","fromSuggestions":true}
                    ];
                    // this.selectedApp = this.apps[0];
                    // this.competitorsAppList = [{"id":"com.espn.fantasy.lm.football","image":"https://lh3.googleusercontent.com/agdeEPKtsU_mFdAlmUkV_vbUtdf-1ldu_N0vS5lgJkDeTOHCCxKym3C1hs3VCvT-DFE=w300","name":"ESPN Fantasy Sports","publisher":"ESPN Inc","store":"google","fromSuggestions":true},
                    //     {"id":"com.sosscores.livefootball","image":"https://lh3.ggpht.com/uuQoxIfolqBKOoXmePRVFdjKxJVdxjBb7bAXNfACsUJQCbFN2_amzC4gcTfVlgowUW4=w300","name":"Live Football","publisher":"SOS Football Livescore","store":"google","fromSuggestions":true},
                    //     {"id":"air.WatchESPN","image":"https://lh3.ggpht.com/FRgzeJBgHSwyPxVVWrIgPIbZYL7VcPcUD70FLDJFgqL6E7zdKMVWCW35OGtAzUkrng=w300","name":"WatchESPN","publisher":"ESPN Inc","store":"google","fromSuggestions":true}]*/
    }

    $onInit() {
        if (this.apps && this.apps.length == 1) {
            this.singleApp = true;
            this.selectApp(this.apps[0]);
        }
    }

    actualCompetitorsAppsLength() {
        let validApps = [];
        this.competitorsAppList.map(function (compApp) {
            if (compApp != null && compApp != undefined) {
                validApps.push(compApp);
            }
        });
        return validApps.length;
    }

    selectApp(app) {
        if (this.requestSubmit) {
            return;
        }
        this.selectedApp = Object.assign(app, {
            id: this.connectedAccountsService.getAppIdStripped(app.id),
        });
    }

    hasOneCompetitor(competitorsApps) {
        if (!competitorsApps || competitorsApps.length == 0) {
            return false;
        }
        return competitorsApps[0] != null && competitorsApps[0] != undefined;
    }

    submitSelectedApps() {
        this.requestSubmit = true;
        //first filter undefined values than flat array objects and get only ids
        let competitorsAppListIds = this.competitorsAppList
            .filter(function (app) {
                if (!app) {
                    return false;
                }
                return app;
            })
            .map(function (app) {
                return app.id;
            });
        let benchmarkedAppId = this.connectedAccountsService.getAppIdStripped(this.selectedApp.id);
        var savePromise = this.connectedAccountsService.saveGooglePlaySelectedApps({
            benchmarkedApp: benchmarkedAppId,
            competitorsAppList: competitorsAppListIds,
        });
        savePromise.then(
            (data) => {
                // success handler
                if (data) {
                    this.connectedAccountsService.setHasGooglePlayAccount(true);
                    this.connectedAccountsService.setUserGoogleAccountAvailableBenchmarkApps({
                        benchmarkedApp: benchmarkedAppId,
                        competitorsAppList: competitorsAppListIds.join(),
                    });
                    this._$scope.$emit("successConnectGooglePlayAccount", {
                        benchmarkedApp: benchmarkedAppId,
                        competitorsAppList: competitorsAppListIds.join(),
                    });
                } else {
                    // error handler : fire event to mediator controller to handle and show proper view
                    this._$scope.$emit("appSelectionError", {
                        benchmarkedApp: this.selectedApp,
                        competitorsAppList: this.competitorsAppList,
                    });
                }
            },
            (error) => {
                // error handler : fire event to mediator controller to handle and show proper view
                this._$scope.$emit("appSelectionError", {
                    benchmarkedApp: this.selectedApp,
                    competitorsAppList: this.competitorsAppList,
                });
            },
        );
    }
}

export class SWAppSelectionComponent implements angular.IComponentOptions {
    public bindings: any;
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.bindings = {
            //should be set To equals only
            apps: "<",
            competitorsAppList: "=?",
            selectedApp: "=?",
        };
        this.templateUrl =
            "/app/components/google-play-wizard/app-selection/app-selection-screen.html";
        this.controller = "SWAppSelectionController";
    }
}

angular.module("sw.common").component("swAppSelectionComponent", new SWAppSelectionComponent());
angular
    .module("sw.common")
    .controller(
        "SWAppSelectionController",
        SWAppSelectionController as ng.Injectable<ng.IControllerConstructor>,
    );
