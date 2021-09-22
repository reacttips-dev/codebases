import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { IndustryAnalysisPageCtrl } from "../controllers/IndustryAnalysisPageCtrl";
import { TrafficSourcesBarChartWidget } from "./widgets/TrafficSourcesBarChartWidget";
import { TrafficSourcesOverviewGraphWidget } from "./widgets/TrafficSourcesOverviewGraphWidget";
import { TrafficSourcesOverviewTableWidget } from "./widgets/TrafficSourcesOverviewTableWidget";

export class IndustryAnalysisTrafficSourcesCtrl extends IndustryAnalysisPageCtrl {
    private params: any;

    constructor(
        public $scope: any,
        public widgetFactoryService: any,
        public swNavigator: any,
        $filter,
        $timeout,
    ) {
        super($scope, widgetFactoryService, swNavigator, swSettings, $filter, $timeout);
        this.params = swNavigator.getParams();
    }

    protected initWidgets(params: any) {
        this.widgets = {};
        this.title = "industryAnalysis.trafficchannels.page.title"; //this overrides the title field on the parent controller which is the old title
        this.widgets = {
            barChart: this._widgetFactoryService.createWithConfigs(
                params,
                TrafficSourcesBarChartWidget,
                this.swNavigator.current().name,
            ),
            trafficSourcesOverviewGraph: this._widgetFactoryService.createWithConfigs(
                params,
                TrafficSourcesOverviewGraphWidget,
                this.swNavigator.current().name,
            ),
            trafficSourcesOverviewTable: this._widgetFactoryService.createWithConfigs(
                params,
                TrafficSourcesOverviewTableWidget,
                this.swNavigator.current().name,
            ),
        };
    }
}

angular
    .module("sw.common")
    .controller(
        "industryAnalysisTrafficSourcesCtrl",
        IndustryAnalysisTrafficSourcesCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
