import angular from "angular";
import "./deep-insights/module";

import { MainInsightsController } from "./mainCtrl";
import { SWInsightsHome } from "./SWInsightsHome";

angular
    .module("deepInsights")
    .controller(
        "mainInsightsController",
        MainInsightsController as ng.Injectable<ng.IControllerConstructor>,
    )
    .factory("SWInsightsHome", () => SWInsightsHome);
