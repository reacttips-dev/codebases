import angular, { resource } from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { GooglePlayStatusCode } from "./google-play-form/agoogle-play-form-interface";
import { GooglePlayErrorScreen } from "./google-play-form/agoogle-play-form-interface";
import { GooglePlayScreenTemplate } from "./GooglePlayWizardController";
import { GooglePlayVerificationCode } from "./google-play-form/agoogle-play-form-interface";
import { FavoritesService } from "services/favorites/favoritesService";
import { SwTrack } from "services/SwTrack";
/**
 * Created by yoavs on 12/11/2016.
 */
export interface IGooglePlayService {
    initAuthRequest: () => resource.IResourceService;
    initStatusPollingRequest: (username: string) => void;
    openModal: (screen?, apps?) => void;
    setCredentials: (username: string, password: string) => void;
    getCredentials: () => {};
    closeModal: () => void;
    mockSuccess: (num: number) => void;
    connectedUserRedirect: (selectedApps: {
        benchmarkedApp: string;
        competitorsAppList: string;
    }) => void;
    addBenchmarkAppsOverviewPageToFavorites: (selectedApps: {
        benchmarkedApp: string;
        competitorsAppList: string;
    }) => void;
    track: (section, onPage, eventName, eventAction) => void;
    setGoogleFormComponentState: (state: string) => void;
    getGoogleFormTrackingLabel: () => string;
    cancelStatusPollingRequest: () => void;
}
export enum GooglePlayStatusPollingResponse {
    "NoSession" = 0,
    "LogginIn" = 1,
    "LoggedIn" = 2,
}
angular
    .module("sw.common")
    .service("googlePlayService", function (
        $rootScope,
        $resource,
        $modal,
        $modalStack,
        swNavigator,
        appAnalysisConfig,
    ): IGooglePlayService {
        let _modalInstance: any;
        let _username: string;
        let _password: string;
        let _statusLog = [];
        let authResource: any = false;
        let statusResource: any = false;
        let statusResourceActive: boolean;
        let formComponentState: string;
        const GOOGLE_STORE = 0;
        const _mockApps = [
            {
                store: "0",
                id: "0_com.perseus.applock",
                title: "App Lock Pal",
                author: "MyPal Apps",
                icon:
                    "//lh3.ggpht.com/VKVv6Oc1Pv3GYWVVGePFEQfOuAxUjn3fEgdAcY-O73R1zQa7F_rkxfs5oqmt3Tjopoc=w300",
                category: "TOOLS",
                price: "Free",
                rating: 3.8137500286102295,
                ratecount: 800,
                valid: true,
            },
            {
                store: "0",
                id: "0_com.perseus.bat",
                title: "Battery Pal (2X Battery Saver)",
                author: "MyPal Apps",
                icon:
                    "//lh5.ggpht.com/TlVl0rcl9ydOnbMwEhqB780uctYpgYFJac3gQM5eYFjXaMdODN97gquPw8XOQ8IigLiO=w300",
                category: "TOOLS",
                price: "Free",
                rating: 3.8297014236450195,
                ratecount: 1239,
                valid: true,
            },
            {
                store: "0",
                id: "0_com.perseus.ic",
                title: "Clean Pal (Phone Boost)",
                author: "MyPal Apps",
                icon:
                    "//lh3.ggpht.com/z7twVD5LOCWKFZJIDD0lBSVSLEBiMfDckTrGK6LzvZggAMj5C4xOifOKgGY2XpcunYU=w300",
                category: "TOOLS",
                price: "Free",
                rating: 4.1152558326721191,
                ratecount: 2386,
                valid: true,
            },
            {
                store: "0",
                id: "0_com.perseus.net",
                title: "Network Restarter Pal",
                author: "MyPal Apps",
                icon:
                    "//lh3.ggpht.com/IZMQ-RFTlXLiANXZtxmlJHbkUU6Nmw8GEM9ScHrHCREWQ8zeV6dpvyYlaJFA-kRwulBf=w300",
                category: "TOOLS",
                price: "Free",
                rating: 3.6808509826660156,
                ratecount: 282,
                valid: true,
            },
            {
                store: "0",
                id: "0_com.perseus.rbu",
                title: "RAM Booster Ultimate Pal",
                author: "MyPal Apps",
                icon:
                    "//lh5.ggpht.com/hTcns89iq_WGhEXgDdMqTL7SmNWO_Vy95iF4Niyuqoh0GpuY4imE9-YzyM5wuoWEwM0=w300",
                category: "TOOLS",
                price: "Free",
                rating: 4.3109173774719238,
                ratecount: 7227,
                valid: true,
            },
            {
                store: "0",
                id: "0_com.perseus.av",
                title: "Security & Speed Booster",
                author: "MyPal Apps",
                icon:
                    "//lh6.ggpht.com/rJrKnOTsTY09E-DO424uUxhEWcszsbdpMeLCyY-Cl_-NTBAvABsDJNnDx5AbgeMWhKE=w300",
                category: "TOOLS",
                price: "Free",
                rating: 3.7942740917205811,
                ratecount: 6392,
                valid: true,
            },
            {
                store: "0",
                id: "0_com.cheetah.flashlightandroid",
                title: "Super Bright Flashlight",
                author: "MyPal Apps",
                icon:
                    "//lh5.ggpht.com/RNMKFH2a7dBktBBSjylMtmwy-sET08wYfrZfZ4HRawCY-wWnPzBYE4LLLzFkVEbbYpSs=w300",
                category: "TOOLS",
                price: "Free",
                rating: 3.9538445472717285,
                ratecount: 18286,
                valid: true,
            },
        ];
        let statusResourceId: number;

        /**
         * return the current available resource if exists or creates a new one
         * @returns resource | false
         */
        const initAuthRequest = function () {
            if (!authResource) {
                const http = $resource(
                    "connectgoogleplayaccount/authenticate",
                    {},
                    {
                        prompt: { method: "POST" },
                    },
                );
                return (authResource = new http());
            } else {
                return authResource;
            }
        };

        /**
         * initiates new resource for status polling requests
         * @param username
         */
        const initStatusPollingRequest = function () {
            if (!statusResourceActive) {
                statusResourceActive = true;
                const _http = $resource("connectgoogleplayaccount/status", {
                    username: _username,
                });
                statusResource = new _http();
                setTimeout(() => {
                    doStatusRequest();
                });
            }
        };

        /**
         * opens a new modal instance of GooglePlayWizard
         */
        const openModal = function (screen?, apps?) {
            //Enable only single instance of wizard modal
            if ($modalStack.getTop() == undefined) {
                _modalInstance = false;
            }
            if (_modalInstance) {
                return;
            }
            _modalInstance = $modal.open({
                animation: true,
                appendTo: angular.element(document.querySelector("#angularjs-app")),
                templateUrl: "/app/components/google-play-wizard/templates/container.html",
                windowClass: "google-play-popup wide",
                controller: "googlePlayWizardController",
                controllerAs: "ctrl",
                resolve: {
                    wizardScreen: () => screen,
                    googlePlayWizardAppsArray: () => apps,
                },
            });
        };

        /**
         * dismiss current modal instance
         */
        const closeModal = function () {
            _modalInstance.dismiss();
            _modalInstance = false;
        };

        /**
         * stores user credentials
         * @param username
         * @param password
         */
        const setCredentials = function (username, password) {
            _username = username;
            _password = password;
        };

        /**
         * returns stored user credentials
         * @returns {{username: string, password: string}}
         */
        const getCredentials = function () {
            return {
                username: _username,
                password: _password,
            };
        };

        /**
         * create modal instance with @num from _mockApps in the benchmark screen - for testing
         * @param num
         */
        const mockSuccess = function (num) {
            const _apps = [];
            for (let i = 0; i <= 6 && i < num; i++) {
                _apps.push(_mockApps[i]);
            }
            this.openModal(1, _apps);
        };

        /**
         * triggers track event regarding the connection flow with pre-defined pre-fixes
         * @param section
         * @param onPage
         * @param eventAction
         * @param eventName (optional)
         */
        const track = function (section, onPage, eventAction, eventName?) {
            eventName = eventName ? "/" + eventName : "";
            const _category = onPage ? "Hook" : "Pop Up";
            const _action = eventAction;
            const _name = "Connected Account/" + section + eventName;
            SwTrack.all.trackEvent(_category, _action, _name);
        };

        /**
         * sends new status polling request
         */
        function doStatusRequest() {
            if (!statusResourceActive) {
                return;
            }
            const _resourceId = Math.random();
            statusResourceId = _resourceId;
            statusResource.$get().then((response) => {
                if (statusResourceId != _resourceId) {
                    return;
                }
                _statusLog.push(response.code);
                handleStatusResponse(response.code);
            });
        }

        const cancelStatusPollingRequest = function () {
            statusResourceActive = false;
            _statusLog = [];
        };

        /**
         * stops current status request polling and call event to change the wizard;s screen
         * @param response
         */
        function revokeStatusPollingRequest(response: GooglePlayStatusPollingResponse) {
            //
            if (_statusLog.length > 0) {
                switch (response) {
                    case GooglePlayStatusPollingResponse.NoSession:
                        if (
                            authResource.$resolved &&
                            authResource.statusCode == GooglePlayStatusCode.WAITING &&
                            statusResourceActive
                        ) {
                            $rootScope.$broadcast(
                                "changeGooglePlayWizardScreen",
                                GooglePlayErrorScreen.ERROR_TIMEOUT,
                            );
                            track("Errors", false, "open", "Timeout");
                        }
                        if (_statusLog.length > 1) {
                            cancelStatusPollingRequest();
                        }
                        break;
                    case GooglePlayStatusPollingResponse.LoggedIn:
                        if (
                            authResource.statusCode == GooglePlayStatusCode.WAITING &&
                            statusResourceActive
                        ) {
                            $rootScope.$broadcast(
                                "changeGooglePlayWizardScreen",
                                GooglePlayScreenTemplate.LOADING,
                            );
                            track("Waiting", false, "open");
                        }
                        cancelStatusPollingRequest();
                        break;
                }
            }
        }

        /**
         * redirects the user to app engagement overview page with selected apps benchmark
         * @param selectedApps
         */
        function connectedUserRedirect(selectedApps: {
            benchmarkedApp: string;
            competitorsAppList: string;
        }) {
            const currentState = swNavigator.current().name,
                currentParams = Object.assign({}, swNavigator.getParams()),
                gotoPage = currentState === "apps-home" ? "apps-performance" : currentState;

            let appIdParam = GOOGLE_STORE + "_" + selectedApps.benchmarkedApp;
            appIdParam +=
                selectedApps.competitorsAppList && selectedApps.competitorsAppList.length > 0
                    ? "," + selectedApps.competitorsAppList
                    : "";

            swNavigator.go(gotoPage, Object.assign({}, currentParams, { appId: appIdParam }));
        }

        /**
         * adds the selected apps benchmark to the user's favorites list
         * @param selectedApps
         */
        function addEngagementOverviewPageToFavorites(selectedApps: {
            benchmarkedApp;
            competitorsAppList: string;
        }): void {
            const defaultParams = swSettings.components.AppEngagementOverview.defaultParams;
            let appIdParam = GOOGLE_STORE + "_" + selectedApps.benchmarkedApp;
            appIdParam +=
                selectedApps.competitorsAppList && selectedApps.competitorsAppList.length > 0
                    ? "," + selectedApps.competitorsAppList
                    : "";
            const pageSettings = {
                params: Object.assign(
                    {},
                    defaultParams,
                    appAnalysisConfig["apps-engagementoverview"].defaultQueryParams,
                    { appId: appIdParam },
                ),
                state: appAnalysisConfig["apps-engagementoverview"],
            };
            FavoritesService.addPageToFavorites(pageSettings);
        }

        /**
         * handles status polling response
         * @param response
         */
        function handleStatusResponse(response: GooglePlayStatusPollingResponse) {
            switch (response) {
                case GooglePlayStatusPollingResponse.NoSession:
                    revokeStatusPollingRequest(response);
                    break;
                case GooglePlayStatusPollingResponse.LogginIn:
                    setTimeout(() => {
                        doStatusRequest();
                    }, 2000);
                    break;
                case GooglePlayStatusPollingResponse.LoggedIn:
                    revokeStatusPollingRequest(response);
                    break;
            }
        }

        function setFormComponentState(componentState) {
            formComponentState = componentState;
        }

        function getFormTrackingLabel() {
            switch (formComponentState) {
                case GooglePlayVerificationCode[GooglePlayVerificationCode.DIGITS]:
                    return "2FA/";
                case GooglePlayVerificationCode[GooglePlayVerificationCode.PROMPT]:
                    return "Prompt/";
                case GooglePlayVerificationCode[GooglePlayVerificationCode.QUESTION]:
                    return "Security Question/";
                case GooglePlayVerificationCode[GooglePlayVerificationCode.COUNTRY_PHONE]:
                    return "Country Phone/";
                default:
                    return "initial details/";
            }
        }

        return {
            initAuthRequest: initAuthRequest,
            initStatusPollingRequest: initStatusPollingRequest,
            openModal: openModal,
            setCredentials: setCredentials,
            getCredentials: getCredentials,
            closeModal: closeModal,
            mockSuccess: mockSuccess,
            connectedUserRedirect: connectedUserRedirect,
            addBenchmarkAppsOverviewPageToFavorites: addEngagementOverviewPageToFavorites,
            track: track,
            setGoogleFormComponentState: setFormComponentState,
            getGoogleFormTrackingLabel: getFormTrackingLabel,
            cancelStatusPollingRequest: cancelStatusPollingRequest,
        };
    });
