import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { IAppSelectionResourceService } from "components/google-play-wizard/app-selection/appSelectionService";
import { AppsResourceService } from "./AppsResourceService";
/**
 * Created by Eyal.Albilia on 12/11/2016.
 */

export interface IConnectedAccountsUiOptions {
    ShowGlobalHook: boolean;
    ShowOnPageHook: boolean;
    IsAvailableOnPage: boolean;
    showAvailableAppsIntro: boolean;
}

export interface IConnectedAccountsService {
    hasGooglePlayConnectedAccount: () => boolean;
    getUserGoogleAccountAvailableBenchmarkApps: () => any;
    getGoogleAccountAvailableBenchmarkAppsInfo: (handler: any) => any;
    saveGooglePlaySelectedApps: (appsPayload: any) => any;
    getUiOptions: (toState) => IConnectedAccountsUiOptions;
    setHasGooglePlayAccount: (value: boolean) => void;
    setUserGoogleAccountAvailableBenchmarkApps: (value: {
        benchmarkedApp: string;
        competitorsAppList: string;
    }) => void;
    getAppIdStripped: (appId: string) => string;
    isAllowedConnectedAccount: () => boolean;
}

abstract class AbstractConnectedAccountService implements IConnectedAccountsService {
    constructor(protected swSettings: any, protected swNavigator) {}

    abstract hasGooglePlayConnectedAccount(): boolean;

    abstract getUserGoogleAccountAvailableBenchmarkApps(): any;

    abstract saveGooglePlaySelectedApps(appsPayload: any): any;

    isAllowedConnectedAccount() {
        if (!this.hasGooglePlayConnectedAccount()) {
            return false;
        }
        const currentState = this.swNavigator.$state;
        const appsPermitted = this.getUserGoogleAccountAvailableBenchmarkApps();
        const requiredApps = this.getAppIdStripped(currentState.params.appId);
        let isAllowed = true;
        angular.forEach(requiredApps.split(","), (requiredAppid: string) => {
            if (appsPermitted.indexOf(requiredAppid) == -1) {
                isAllowed = false;
            }
        });
        return isAllowed;
    }

    getAppIdStripped(appIdWithStore: string) {
        if (appIdWithStore && appIdWithStore.length > 0 && appIdWithStore.indexOf("_") > -1) {
            return appIdWithStore.substring(appIdWithStore.indexOf("_") + 1, appIdWithStore.length);
        }
        return appIdWithStore;
    }

    setHasGooglePlayAccount(value: boolean) {
        //relevant only for real data implementation // overides
        return;
    }

    setUserGoogleAccountAvailableBenchmarkApps(value: {
        benchmarkedApp: string;
        competitorsAppList: string;
    }) {
        //relevant only for real data implementation // overides
        return;
    }

    getGoogleAccountAvailableBenchmarkAppsInfo(handler) {
        if (this.getUserGoogleAccountAvailableBenchmarkApps() == undefined) {
            return;
        }
        const params: any = {};
        params.store = "google";
        params.appId = this.getUserGoogleAccountAvailableBenchmarkApps();
        return AppsResourceService.appInfo(params, handler);
    }

    getUiOptions(stateParam) {
        const state = stateParam || this.swNavigator.current();
        return {
            ShowGlobalHook:
                this.swSettings.components.Home.resources.GaMode != "Skip" &&
                state &&
                state.data &&
                state.data.showConnectedAccountsGlobalHook &&
                !this.hasGooglePlayConnectedAccount() &&
                !this.swSettings.components.AppEngagementOverview.isAllowed,
            ShowOnPageHook:
                this.swSettings.components.Home.resources.GaMode != "Skip" &&
                state &&
                state.data &&
                state.data.showConnectedAccountsOnPageHook &&
                !this.hasGooglePlayConnectedAccount() &&
                !this.swSettings.components.AppEngagementOverview.isAllowed,
            IsAvailableOnPage:
                this.swSettings.components.Home.resources.GaMode != "Skip" &&
                state &&
                state.data &&
                state.data.showConnectedAccountsOnPageHook,
            showAvailableAppsIntro:
                state &&
                state.data &&
                state.data.showAvailableAppsIntro &&
                this.hasGooglePlayConnectedAccount() &&
                !this.swSettings.components.AppEngagementOverview.isAllowed,
        };
    }
}

class ConnectedAccountsServiceUDOff extends AbstractConnectedAccountService {
    constructor(public swSettings: any, public swNavigator) {
        super(swSettings, swNavigator);
    }

    hasGooglePlayConnectedAccount() {
        return false;
    }

    getUserGoogleAccountAvailableBenchmarkApps() {
        return undefined;
    }

    saveGooglePlaySelectedApps(appsPayload: any) {
        return false;
    }

    getUiOptions(state) {
        return {
            ShowGlobalHook: false,
            ShowOnPageHook: false,
            showAvailableAppsIntro: false,
            IsAvailableOnPage: false,
        };
    }
}

class ConnectedAccountsServiceLocalStorage extends AbstractConnectedAccountService {
    private userId = this.swSettings.user.id;
    constructor(public swSettings: any, public swNavigator, private $q) {
        super(swSettings, swNavigator);
    }
    hasGooglePlayConnectedAccount() {
        return this.getUserGoogleAccountAvailableBenchmarkApps() != undefined;
    }
    getUserGoogleAccountAvailableBenchmarkApps() {
        // return "com.espn.espnis,com.espn.fantasy.lm.football,com.sosscores.livefootball";
        let userGoogleAccountApps: any = localStorage.getItem(this.userId);
        if (userGoogleAccountApps == undefined || userGoogleAccountApps == null) {
            return userGoogleAccountApps;
        }

        userGoogleAccountApps = JSON.parse(userGoogleAccountApps);
        return (
            userGoogleAccountApps.accountApps.benchmarkedApp +
            "," +
            userGoogleAccountApps.accountApps.competitorsAppList.join()
        );
    }
    saveGooglePlaySelectedApps(appsPayload: any) {
        const deffered = this.$q.defer();
        localStorage.setItem(this.userId, JSON.stringify({ accountApps: appsPayload }));
        deffered.resolve(true);
        return deffered.promise;
    }
}

class ConnectedAccountsServiceUserData extends AbstractConnectedAccountService {
    private hasGooglePlayAccount: boolean;
    private userGoogleAccountAvailableBenchmarkApps: string;

    constructor(
        public swSettings: any,
        public appSelectionResourceService: IAppSelectionResourceService,
        public swNavigator,
    ) {
        super(swSettings, swNavigator);
        this.hasGooglePlayAccount = this.swSettings.components.Home.resources.IsConnectedGooglePlayAccount;

        if (this.hasGooglePlayAccount) {
            if (this.swSettings.components.Home.resources.GooglePlayCompetitorsApps) {
                this.userGoogleAccountAvailableBenchmarkApps =
                    this.swSettings.components.Home.resources.GooglePlayAccountBenchmarkedApp +
                    "," +
                    this.swSettings.components.Home.resources.GooglePlayCompetitorsApps.join();
            } else {
                this.userGoogleAccountAvailableBenchmarkApps = this.swSettings.components.Home.resources.GooglePlayAccountBenchmarkedApp;
            }
        }
    }
    setHasGooglePlayAccount(value: boolean) {
        this.hasGooglePlayAccount = value;
    }

    setUserGoogleAccountAvailableBenchmarkApps(value: {
        benchmarkedApp: string;
        competitorsAppList: string;
    }) {
        this.userGoogleAccountAvailableBenchmarkApps =
            value.benchmarkedApp + "," + value.competitorsAppList;
    }

    hasGooglePlayConnectedAccount() {
        return this.hasGooglePlayAccount;
    }

    getUserGoogleAccountAvailableBenchmarkApps() {
        return this.userGoogleAccountAvailableBenchmarkApps;
    }
    saveGooglePlaySelectedApps(appsPayload) {
        return this.appSelectionResourceService.saveAppSelectedAndCompetingApps(appsPayload);
    }

    isDomainInGoogleAnalyticsAccountPrivateSites(domain) {
        const GAPrivateSites = this.swSettings.components.Home.resources
            .GoogleAnalyticsAccountPrivateSites;
        return GAPrivateSites && GAPrivateSites.indexOf(domain) > -1;
    }
}

angular
    .module("sw.common")
    .factory("swConnectedAccountsService", function (swNavigator, $q, appSelectionResourceService) {
        // var _udFlag = swSettings.components.Home.resources.GooglePlayConnect;
        let service: IConnectedAccountsService = undefined;
        // if(!_udFlag)
        // {
        //     service = new ConnectedAccountsServiceUDOff(swSettings,swNavigator);
        //     return service;
        // }
        service = new ConnectedAccountsServiceUserData(
            swSettings,
            appSelectionResourceService,
            swNavigator,
        );
        return service;
    });

//TODO : uniform the returning object from this method to match usages both to compare button and other usages
// compare suitable model {"ID":"com.espn.espnis","Icon":"https://lh5.ggpht.com/pOZgT1Q3dhWIZ5WUyoJ8tsPshfDiTnwIASB1SZDFt754FMHN8PGjDnIPqRxj7JjPheE=w300","Title":"ESPN Play","Author":"ESPN Inc","Store":0,"fromSuggestions":true},
// other usages model {"id":"com.sosscores.livefootball","image":"https://lh3.ggpht.com/uuQoxIfolqBKOoXmePRVFdjKxJVdxjBb7bAXNfACsUJQCbFN2_amzC4gcTfVlgowUW4=w300","Title":"Live Football","publisher":"SOS Football Livescore","store":"google","fromSuggestions":true},
// function getGoogleAccountAvailableBenchmarkApps(isCompare:boolean=false){
//     // let mockApps = [{"id":"com.espn.espnis","image":"https://lh5.ggpht.com/pOZgT1Q3dhWIZ5WUyoJ8tsPshfDiTnwIASB1SZDFt754FMHN8PGjDnIPqRxj7JjPheE=w300","Title":"ESPN Play","publisher":"ESPN Inc","store":"google","fromSuggestions":true},
//     // {"id":"com.espn.fantasy.lm.football","image":"https://lh3.googleusercontent.com/agdeEPKtsU_mFdAlmUkV_vbUtdf-1ldu_N0vS5lgJkDeTOHCCxKym3C1hs3VCvT-DFE=w300","Title":"ESPN Fantasy Sports","publisher":"ESPN Inc","store":"google","fromSuggestions":true},
//     // {"id":"com.sosscores.livefootball","image":"https://lh3.ggpht.com/uuQoxIfolqBKOoXmePRVFdjKxJVdxjBb7bAXNfACsUJQCbFN2_amzC4gcTfVlgowUW4=w300","Title":"Live Football","publisher":"SOS Football Livescore","store":"google","fromSuggestions":true},
//     // {"id":"air.WatchESPN","image":"https://lh3.ggpht.com/FRgzeJBgHSwyPxVVWrIgPIbZYL7VcPcUD70FLDJFgqL6E7zdKMVWCW35OGtAzUkrng=w300","Title":"WatchESPN","publisher":"ESPN Inc","store":"google","fromSuggestions":true}];
//
//     let mockAppIds = ["com.espn.espnis","com.espn.fantasy.lm.football","com.sosscores.livefootball"];
//     AppsResourceService.appInfo(params,function success(data){
//
//         if(isCompare)
//         {
//             mockApps.forEach((app)=> serializeCompare(app));
//         }
//     })
//
//     return undefined;
// }
