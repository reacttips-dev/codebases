import angular from "angular";
import * as _ from "lodash";
import { SwTrack } from "../../services/SwTrack";

angular
    .module("sw")
    .controller("dashboardWelcomeCtrl", function (swNavigator, dashboardService, $filter) {
        const ctrl = this;
        if (dashboardService.dashboards.length > 0) {
            swNavigator.go("dashboard-exist", { dashboardId: dashboardService.dashboards[0].id });
        }
        ctrl.createNewDashboard = function () {
            const title = dashboardService.generateNewTitle("New Dashboard", "title");
            SwTrack.all.trackEvent("Internal Link", "click", "First dashboard");
            return dashboardService.addDashboard({ title: title }).then(function (dashboard) {
                swNavigator.go("dashboard-created", { dashboardId: dashboard.id });
            });
        };

        ctrl.title = $filter("i18n")("home.dashboards.title");
        ctrl.subtitle = $filter("i18n")("home.dashboards.subtitle");
        ctrl.buttonText = $filter("i18n")("home.dashboards.button");
    });
