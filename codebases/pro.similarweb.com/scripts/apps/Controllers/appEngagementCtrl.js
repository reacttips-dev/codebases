import angular from "angular";
import { swSettings } from "../../common/services/swSettings";
import { SwTrack } from "../../../app/services/SwTrack";

angular
	.module("sw.apps")
	.controller("appEngagementCtrl", function (
		$scope,
		swNavigator,
		$filter,
		swConnectedAccountsService,
	) {
		const i18nFilter = $filter("i18n"),
			updateScope = function (state, params) {
				$scope.iosTurnedOn = swSettings.components.Home.resources.HasAppsIOS;
				$scope.iosLink = swNavigator.href(
					"apps-engagementoverview",
					swNavigator.getParams(),
				);
				$scope.SMBUser = swSettings.current.resources.AppEngagementSMB;
				$scope.upgradeLink = $scope.SMBUpgradeURL = swSettings.swurls.AppsUpgradeAccountURL; // Used in engagement overview hooks
				$scope.pageTitle = i18nFilter(state.name + ".pageTitle");
				$scope.showAvailableAppsIntro = swConnectedAccountsService.getUiOptions(
					state,
				).showAvailableAppsIntro;
				$scope.showBenchmarkPromo = swConnectedAccountsService.getUiOptions(
					state,
				).ShowOnPageHook;
				$scope.allowedConnectedAccount = swConnectedAccountsService.isAllowedConnectedAccount();
				$scope.forbiddenState = !(
					swSettings.current.isAllowed || $scope.allowedConnectedAccount
				);
				$scope.isGoogleStore = swNavigator.getApiParams().store.toLowerCase() === "google";

				if (params.appId) {
					// Switch to empty state for ios apps only if permitted to view the page
					$scope.emptyState =
						!$scope.forbiddenState &&
						params.appId.charAt(0) > 0 &&
						state.name !== "apps-engagementoverview" &&
						state.name !== "companyresearch_app_appengagementoverview";
				}
				if ($scope.forbiddenState) {
					let subtitles;
					if ($scope.isGoogleStore) {
						subtitles = [
							i18nFilter("apps.engagementoverview.notallowed.android.desc"),
							i18nFilter("apps.engagementretention.notallowed.android.desc"),
							i18nFilter("apps.engagementusage.notallowed.android.desc"),
							i18nFilter("apps.audience.demographics.notallowed.android.desc"),
							i18nFilter("apps.engagementaffinity.notallowed.android.desc"),
						];
					} else {
						subtitles = [
							i18nFilter("apps.engagementoverview.notallowed.ios.desc"),
							i18nFilter("apps.engagementretention.notallowed.ios.desc"),
							i18nFilter("apps.engagementusage.notallowed.ios.desc"),
							i18nFilter("apps.audience.demographics.notallowed.ios.desc"),
							i18nFilter("apps.engagementaffinity.notallowed.ios.desc"),
						];
					}
					switch (state.name) {
						case "apps-engagementoverview":
							$scope.title = i18nFilter(
								"app.analysis.engagement.overview.benchmarkapp.title",
							);
							$scope.subtitle = subtitles[0];
							$scope.forbiddenClass = "benchmark-data";
							break;
						case "apps-engagementretention":
							$scope.title = i18nFilter("apps.engagementretention.notallowed.title");
							$scope.subtitle = subtitles[1];
							$scope.forbiddenClass = "retention-img";
							break;
						case "apps-engagementusage":
							$scope.title = i18nFilter("apps.engagementusage.notallowed.title");
							$scope.subtitle = subtitles[2];
							$scope.forbiddenClass = "usage-img";
							break;
						case "apps-demographics":
							$scope.title = i18nFilter("apps.audience.demographics.title");
							$scope.subtitle = subtitles[3];
							$scope.forbiddenClass = "demographics-img";
							break;
						case "apps-appaudienceinterests":
							$scope.title = i18nFilter("apps.engagementaffinity.notallowed.title");
							$scope.subtitle = subtitles[4];
							$scope.forbiddenClass = "audience-img";
							break;
					}
				}
			};

		$scope.upgradeLink = swSettings.swurls.enterpriseUpgradeAccountURL;

		updateScope(swNavigator.current(), swNavigator.getParams());

		$scope.trackUpgrade = function () {
			SwTrack.all.trackEvent("Internal Link", "click", "Hook");
		};

		$scope.$on("$stateChangeSuccess", function (evt, toState, toParams, fromState, fromParams) {
			updateScope(toState, toParams);
		});
	});
