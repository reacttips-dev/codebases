import angular from "angular";
import { DeepInsightsController } from ".";
import { SWGeneratedReports } from "./SWGeneratedReports";

import { InsightsService } from "./insightsService";
import { InsightsTableActionsService } from "./insightsTableActionsService";

angular
    .module("deepInsights")
    .service("insightsService", InsightsService)
    .service("insightsTableActionsService", InsightsTableActionsService)
    .controller(
        "deepInsightsController",
        DeepInsightsController as ng.Injectable<ng.IControllerConstructor>,
    );

angular.module("deepInsights").factory("SWGeneratedReports", () => SWGeneratedReports);
