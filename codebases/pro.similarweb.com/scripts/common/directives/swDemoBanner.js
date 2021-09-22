import angular from "angular";
import * as _ from "lodash";
import { allTrackers } from "services/track/track";
import { swSettings } from "../services/swSettings";

angular.module("sw.common").directive("swDemoBanner", function ($filter, swNavigator) {
    return {
        restrict: "E",
        scope: {
            type: "@",
            contactSubject: "@",
        },
        templateUrl: "/partials/directives/demo-banner.html",
        compile: function () {
            return {
                pre: function (scope) {
                    scope.isHaveBanner = () => {
                        /* fixes #SIM-18622
                            swSettings.current.isAllowed was moved from WebsiteAnalysisModuleCtrl and IndustryAnalysisModuleCtrl
                            original comment: if page is not permitted it means we display hook page, and we want to hide demo banners
                        */
                        return (
                            swSettings.current.isHaveBanner &&
                            swSettings.current.isAllowed &&
                            !isUnauthorized()
                        );
                    };
                    scope.subject =
                        swSettings.current.componentId === "MobileWeb"
                            ? "Sales/Enterprise/MobileWeb"
                            : "Sales/Enterprise/PopularPages";

                    scope.onCtaClick = () => {
                        allTrackers.trackEvent("hook/Contact Us/Pop up", "click", "Demo Banner");
                    };

                    function isUnauthorized() {
                        return swNavigator.current().name.endsWith("unauthorized");
                    }
                },
            };
        },
    };
});
