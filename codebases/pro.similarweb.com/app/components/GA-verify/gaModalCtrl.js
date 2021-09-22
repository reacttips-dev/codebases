import angular from "angular";
import * as _ from "lodash";
import swLog from "@similarweb/sw-log";
import { swSettings } from "../../../scripts/common/services/swSettings";
import { SwTrack } from "../../services/SwTrack";

const errorCodes = {
    unexpectedError: 0,
    invalidToken: 1,
    noGoogleAnalyticsAccount: 2,
    noDataInProfile: 3,
    profileDoesntExist: 4,
    badParams: 5,
    domainAlreadyConnected: 6,
};

angular
    .module("shared")
    .controller("gaVerifyModalCtrl", function ($scope, $http, $route, $modalInstance) {
        const clientId = "906636109364-fliqh5d4jl4guuslap2f4ckj2qusj7op.apps.googleusercontent.com";
        $scope.authScope =
            "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly openid";
        const trackingConfig = {
            category: $scope.trackingConfig
                ? $scope.trackingConfig.category || "Connect GA"
                : "Connect GA",
        };

        // window.addEventListener("message", gaConnect, false);

        function gaConnect({ code }) {
            if (!code) {
                return;
            }
            // close popup & authenticate
            swLog.debug("Got code from OAuth", code);
            $scope.authenticate(code);
        }

        $scope.cancel = function () {
            this.trackEvent("close", "Connect GA/Get your website verified");
            // window.removeEventListener("message", gaConnect);
            $modalInstance.dismiss("cancel");
        };

        $scope.close = function (refresh) {
            // window.removeEventListener("message", gaConnect);
            $modalInstance.close("ok");
            if (refresh) {
                $route.reload();
            }
        };

        $scope.trackEvent = function (action, name) {
            const category = trackingConfig.category;
            SwTrack.all.trackEvent(category, action, name);
        };
        $scope.step = "init";
        $scope.trackEvent("open", "Connect GA");

        $scope.gaConnect = function () {
            this.trackEvent("Click", "Connect GA/Get your website verified");
            const config = {
                client_id: clientId,
                scope: $scope.authScope,
                redirect_uri: "https://" + window.location.hostname + "/ga",
            };

            let googleAuth = gapi.auth2.getAuthInstance();
            if (!googleAuth) {
                googleAuth = gapi.auth2.init(config);
            }

            googleAuth
                .grantOfflineAccess({
                    scope: config.scope,
                })
                .then(
                    function (resp) {
                        gaConnect(resp);
                    },
                    function (res) {
                        if ($scope.$$phase) {
                            $scope.loading = false;
                        } else {
                            $scope.$apply(() => {
                                $scope.loading = false;
                            });
                        }
                    },
                );

            // gapi.auth.authorize(config);
            $scope.loading = "authorizing";
        };

        $scope.authenticate = function (code) {
            if (!code) {
                this.trackEvent("Click", "Cancel Goggle Auth");
                this.close();
                return;
            }
            $scope.loading = "fetching sites";
            $http
                .post("/api/ga/authenticate", {
                    code: code,
                    referrer: window.location.href,
                    swUserName: swSettings.user.username,
                    redirectUri: "postmessage",
                })
                .success(function (data, status) {
                    swLog.debug("Got response from ga-authenticate", data);
                    $scope.allData = data.items;
                    $scope.accounts = data.items.map((account) => ({
                        id: account.accountId,
                        name: account.accountName,
                    }));
                    $scope.loading = false;
                    $scope.email = data.email;

                    const step = "site-selection";
                    // if (!data.isValid) {
                    //     step = 'error';
                    // } else if (data.existingProfiles !== null && data.existingProfiles.length > 0) {
                    //     step = 'profile-edit';
                    // }

                    $scope.step = step;
                })
                .error(function (data, status) {
                    $scope.loading = false;
                    $scope.errorCode = -1;
                    $scope.step = "error";
                });
        };

        $scope.submitProfile = function () {
            $scope.loading = "Adding profile...";

            const account = _.filter($scope.accounts, { selected: true })[0];
            const webProperty = _.filter($scope.webProperties, { selected: true })[0];
            const profile = _.filter($scope.profiles, { selected: true })[0];

            $http({
                method: "post",
                url: "/api/ga/addnewprofile",
                cache: false,
                data: {
                    email: $scope.email,
                    domain: profile.profileWebsiteUrl,
                    accountId: account.id,
                    accountName: account.name,
                    webPropertyId: webProperty.id,
                    webPropertyName: webProperty.name,
                    profileId: profile.profileId,
                    profileName: profile.profileName,
                    profileWebsiteUrl: profile.profileWebsiteUrl,
                    isPrivate: true,
                },
            })
                .success(function (data, status) {
                    $scope.loading = false;
                    $scope.existingProfiles = data;
                    $scope.step = "profile-edit";
                })
                .error(function (data, status) {
                    $scope.loading = false;
                    if (data) {
                        $scope.step = "error";
                        $scope.errorCode = data.errorCode;
                        SwTrack.all.trackEvent("GA", "Profile", `Error: ${data.errorCode}`);
                    } else {
                        $scope.step = "error";
                        SwTrack.all.trackEvent("GA", "Profile", "Unable to add profile");
                    }
                });
        };

        // $scope.deleteProfile = function (profile) {
        //
        //     var account = $scope.accounts[0];
        //
        //     $http({
        //         method: 'post', url: '/api/ga/removeprofile', cache: false,
        //         data: {
        //             email: account.userName,
        //             profileId: profile.profileId,
        //             profileName : profile.profileName,
        //             devAccount: profile.accountName,
        //             webPropertyName: profile.webPropertyName,
        //             domain: profile.domain
        //         }
        //     })
        //      .success(function (data, status) {
        //          SwTrack.all.trackEvent("GA", "Profile", "deleted profile");
        //      })
        //      .error(function (data, status) {
        //          swLog.error(data);
        //          SwTrack.all.trackEvent("GA", "Profile", "unable to deleted profile");
        //     });
        //
        //     var newExisitingProfiles = [];
        //     _.each($scope.existingProfiles, function(p) {
        //         if (p.profileId !== profile.profileId) {
        //             newExisitingProfiles.push(p);
        //         }
        //     });
        //
        //     $scope.existingProfiles = newExisitingProfiles;
        // };

        $scope.editProfile = function (profile) {
            $http({
                method: "PUT",
                url: "/api/ga/updatePrivacy",
                cache: false,
                data: {
                    devAccount: profile.accountName,
                    webPropertyName: profile.webPropertyName,
                    profileName: profile.profileName,
                    isPrivate: !profile.isPublic,
                    domain: profile.domain,
                },
            })
                .success(function (data, status) {
                    SwTrack.all.trackEvent("GA", "Profile", "edited profile");
                })
                .error(function (data, status) {
                    swLog.error(data);
                    SwTrack.all.trackEvent("GA", "Profile", "unable to edit profile");
                });
        };

        $scope.goToStep = function (step) {
            $scope.step = step;
        };

        function getWebPropertiesFromAccount(id) {
            return $scope.allData.find(({ accountId }) => accountId === id).webProperties;
        }

        function getProfilesFromWebProperty(_accountId, webPropertyId) {
            return $scope.allData
                .find(({ accountId }) => accountId === _accountId)
                .webProperties.find(({ id }) => id === webPropertyId).profiles;
        }

        $scope.selectAccount = function (account) {
            // $scope.loading = "fetching properties";
            $scope.webProperties = [];
            $scope.profiles = [];
            $scope.profileSelected = false;

            $scope.accounts.forEach(function (item) {
                if (item.id == account.id) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            });

            $scope.webProperties = getWebPropertiesFromAccount(account.id).map((wp) => ({
                accountId: account.id,
                id: wp.id,
                name: wp.name,
                websiteUrl: wp.websiteUrl,
            }));
        };

        $scope.selectProperty = function (webProperty) {
            // $scope.loading = "fetching views";
            $scope.profiles = [];
            $scope.profileSelected = false;

            const account = _.filter($scope.accounts, { selected: true })[0];

            _.each($scope.webProperties, function (item) {
                if (item.id == webProperty.id) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            });

            $scope.profiles = getProfilesFromWebProperty(account.id, webProperty.id).map(
                (profile) => ({
                    accountId: account.id,
                    profileId: profile.id,
                    profileName: profile.name,
                    profileWebsiteUrl: profile.websiteUrl || webProperty.websiteUrl,
                    webPropertyId: webProperty.id,
                }),
            );
        };

        $scope.selectProfile = function (profile) {
            _.each($scope.profiles, function (item) {
                if (item.profileId == profile.profileId) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            });
            $scope.profileSelected = true;
        };

        $scope.onPrivatePublicToggle = function (profile) {
            $scope.$apply(function () {
                profile.isPublic = !profile.isPublic;
                $scope.editProfile(profile);
            });
        };
    });
