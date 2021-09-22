import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import NgRedux from "ng-redux";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { addSiteToWatchList } from "../../pages/workspace/common/actions_creators/common_worksapce_action_creators";
import { isDomainInWorkspace } from "../../pages/workspace/common/workspacesUtils";
import userEngagementResource from "../../../scripts/common/resources/userEngagementResource";
import { SwTrack } from "services/SwTrack";

/**
 * Created by liorb on 3/16/2016.
 */
const websiteHeader: angular.IComponentOptions = {
    bindings: {
        widget: "=",
        data: "=",
    },
    templateUrl: "/app/components/website-header/website-header.html",
    controllerAs: "ctrl",
    controller: function ($scope, swNavigator, $window, chosenSites, $q, $swNgRedux) {
        const DISPLAY_APPS = 3;

        if (!angular.isDefined(this.data)) {
            this.data = {};
        }

        const ctrl = this;
        const iosApps = this.data.relatedApps ? this.data.relatedApps["apps_1"] : [];
        const googleApps = this.data.relatedApps ? this.data.relatedApps["apps_0"] : [];
        ctrl.relatedApps = false;
        ctrl.noDescription = this.data.description == "";

        if (!this.data.isVirtual && this.data.relatedApps) {
            ctrl.relatedApps = {
                ios: getIosApps(),
                google: getGoogleApps(),
            };
            ctrl.relatedApps.ios.showMore = ctrl.relatedApps.ios.apps.length > DISPLAY_APPS;
            ctrl.relatedApps.google.showMore = ctrl.relatedApps.google.apps.length > DISPLAY_APPS;
        }

        if (ctrl.data.category && ctrl.data.category.toLocaleLowerCase() == "adult") {
            ctrl.websiteMaskImage = ctrl.data.icon;
            ctrl.isAdult = true;
        } else {
            ctrl.websiteMaskImage = ctrl.data.imageLarge;
        }

        if (ctrl.data.isVirtual || !ctrl.data.imageLarge || ctrl.data.imageLarge == "") {
            ctrl.noImage = true;
            ctrl.websiteMaskImage = "";
        }

        // logic for track button
        ctrl.showTrackButton = false;
        ctrl.isTrackLoading = true;

        function recheckDomainTrackStatus() {
            isDomainInWorkspace(chosenSites.getPrimarySite().name)
                .then(async ({ hasLists, isTracked }) => {
                    ctrl.hasTrackWorkspaces = hasLists;
                    ctrl.isTrackLoading = false;
                    $scope.$evalAsync(() => {
                        ctrl.showTrackButton = !isTracked;
                    });
                })
                .catch((err) => {
                    ctrl.isTrackLoading = false;
                });
        }

        recheckDomainTrackStatus();

        ctrl.addToWorkspace = async () => {
            TrackWithGuidService.trackWithGuid("website_analysis.track", "click");
            const domain = chosenSites.getPrimarySite().name;
            ctrl.isTrackLoading = true;
            const store = Injector.get<NgRedux.INgRedux>("$ngRedux");
            await store.dispatch<any>(addSiteToWatchList(domain));
            ctrl.isTrackLoading = false;
            recheckDomainTrackStatus();
        };

        //Logic for verified data icon
        switch (ctrl.data.privacyStatus) {
            case "None":
                ctrl.showVerifiedData = false;
                break;
            case "Public":
                ctrl.showVerifiedData = true;
                break;
            case "Private":
                if (ctrl.data.hasGaToken) {
                    ctrl.showVerifiedData = true;
                } else {
                    ctrl.showVerifiedData = false;
                }
        }

        ctrl.showMore = function (store: string) {
            SwTrack.all.trackEvent("Internal Link", "click", "Related Apps/" + store + "/More");
            ctrl.relatedApps[store].apps = ctrl.relatedApps[store].apps.slice(
                DISPLAY_APPS,
                ctrl.relatedApps[store].apps.length,
            );

            if (ctrl.relatedApps[store].apps.length <= DISPLAY_APPS) {
                ctrl.relatedApps[store].showMore = false;
                ctrl.relatedApps[store].showBack = true;
            }
        };

        ctrl.back = function (store: string) {
            if (store == "ios") {
                ctrl.relatedApps.ios = getIosApps();
            }
            if (store == "google") {
                ctrl.relatedApps.google = getGoogleApps();
            }
        };

        ctrl.trackAppClick = function (appName: string, store: string) {
            SwTrack.all.trackEvent(
                "Internal Link",
                "click",
                "Related Apps/" + store + "/" + appName,
            );
        };

        //Logic for showing the tooltip only once if the cureent website is the user's website.
        ctrl.showGAConnectCTA = undefined;

        if (isCurrentDomainRelatedToUser()) {
            didUserViewedGAConnectCTA().then((response) => {
                ctrl.showGAConnectCTA = !response;
            });
        } else {
            ctrl.showGAConnectCTA = false;
        }

        function isCurrentDomainRelatedToUser() {
            const _userSettings = swSettings.user;
            const _primaryDomain = chosenSites.getPrimarySite().name;
            if (_userSettings.username.split("@")[1] == _primaryDomain) {
                return true;
            } else if (_userSettings.customData.selectedWebApp == _primaryDomain) {
                return true;
            }
            return false;
        }

        function didUserViewedGAConnectCTA() {
            const _defered = $q.defer();
            userEngagementResource.getAll((data) => {
                if (!data.hasOwnProperty("gaConnectYourWebsiteTooltip")) {
                    userEngagementResource.logEngagement({
                        engType: "gaConnectYourWebsiteTooltip",
                    });
                    _defered.resolve(false);
                } else {
                    _defered.resolve(true);
                }
            });
            return _defered.promise;
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////

        function getIosApps() {
            const apps = _.map(iosApps, function (app: any) {
                app.appId = `1_${app.id}`;
                app.appStore = "apple";
                return app;
            });

            return {
                apps: apps,
                showMore: apps.length > DISPLAY_APPS,
                showBack: false,
            };
        }

        function getGoogleApps() {
            const apps = _.map(googleApps, function (app: any) {
                app.appId = `0_${app.id}`;
                app.appStore = "google";
                return app;
            });

            return {
                apps: apps,
                showMore: apps.length > DISPLAY_APPS,
                showBack: false,
            };
        }
    },
};
angular.module("sw.common").component("websiteHeader", websiteHeader);
