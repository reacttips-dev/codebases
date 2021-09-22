import angular from "angular";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { IndustryAnalysisEngagementGraph } from "pages/industry-analysis/overview/widgets/IndustryAnalysisEngagementGraph";
import { OverviewTopSitesTableWidget } from "pages/industry-analysis/overview/widgets/OverviewTopSitesTable";
import { IndustryAnalysisPageCtrl } from "../controllers/IndustryAnalysisPageCtrl";
import { IndustryAnalysisCustomCategoriesTable } from "./widgets/IndustryAnalysisCustomCategoriesTable";
import { IndustryAnalysisEngagementGraphPeriodOverPeriod } from "./widgets/IndustryAnalysisEngagementGraphPeriodOverPeriod";
import { IndustryAnalysisGeographyTable } from "./widgets/IndustryAnalysisGeographyTable";
import { IndustryAnalysisRelatedCategoriesTable } from "./widgets/IndustryAnalysisRelatedCategoriesTable";
import { IndustryAnalysisTotalVisitsPeriodOverPeriod } from "./widgets/IndustryAnalysisTotalVisitsPeriodOverPeriod";
import { IndustryAnalysisTotalVisitsSingle } from "./widgets/IndustryAnalysisTotalVisitsSingle";
import { IndustryAnalysisTrafficShareWidget } from "./widgets/IndustryAnalysisTrafficShareWidget";

export class IAOverviewCtrl extends IndustryAnalysisPageCtrl {
    constructor(
        public $scope: any,
        widgetFactoryService: any,
        swNavigator: any,
        $filter,
        $timeout,
    ) {
        super($scope, widgetFactoryService, swNavigator, swSettings, $filter, $timeout);
    }

    protected initWidgets(params: any) {
        this.widgets = {};
        this.title = "industryAnalysis.performance.page.title"; // this overrides the title field on the parent controller which is the old title
        const swNavigator = Injector.get("swNavigator") as any;
        const currentName = swNavigator.current().name;
        const isMobileWeb = swNavigator.getParams().webSource === "MobileWeb";
        const isCustomCategory = swNavigator.getParams().category[0] === "*";
        const categoryWidget = isCustomCategory
            ? this._widgetFactoryService.createWithConfigs(
                  params,
                  IndustryAnalysisCustomCategoriesTable,
                  currentName,
              )
            : this._widgetFactoryService.createWithConfigs(
                  params,
                  IndustryAnalysisRelatedCategoriesTable,
                  currentName,
              );
        this.$timeout(() => {
            if (params.comparedDuration) {
                this.widgets = {
                    topSitesExtendedTable: this._widgetFactoryService.createWithConfigs(
                        params,
                        OverviewTopSitesTableWidget,
                        currentName,
                    ),
                    trafficSharePie: this._widgetFactoryService.createWithConfigs(
                        params,
                        IndustryAnalysisTrafficShareWidget,
                        currentName,
                    ),
                    totalVisitsMetric: this._widgetFactoryService.createWithConfigs(
                        params,
                        IndustryAnalysisTotalVisitsPeriodOverPeriod,
                        currentName,
                    ),
                    engagementVisitsGraph: this._widgetFactoryService.createWithConfigs(
                        params,
                        IndustryAnalysisEngagementGraphPeriodOverPeriod,
                        currentName,
                    ),
                    geographyTable: isMobileWeb
                        ? null
                        : this._widgetFactoryService.createWithConfigs(
                              params,
                              IndustryAnalysisGeographyTable,
                              currentName,
                          ),
                    categoriesTable: isMobileWeb ? null : categoryWidget,
                };
            } else {
                this.widgets = {
                    topSitesExtendedTable: this._widgetFactoryService.createWithConfigs(
                        params,
                        OverviewTopSitesTableWidget,
                        currentName,
                    ),
                    trafficSharePie: this._widgetFactoryService.createWithConfigs(
                        params,
                        IndustryAnalysisTrafficShareWidget,
                        currentName,
                    ),
                    totalVisitsMetric: this._widgetFactoryService.createWithConfigs(
                        params,
                        IndustryAnalysisTotalVisitsSingle,
                        currentName,
                    ),
                    engagementVisitsGraph: this._widgetFactoryService.createWithConfigs(
                        params,
                        IndustryAnalysisEngagementGraph,
                        currentName,
                    ),
                    geographyTable: isMobileWeb
                        ? null
                        : this._widgetFactoryService.createWithConfigs(
                              params,
                              IndustryAnalysisGeographyTable,
                              currentName,
                          ),
                    categoriesTable: isMobileWeb ? null : categoryWidget,
                };
            }
        });
    }
}

angular
    .module("sw.common")
    .controller("IAOverviewCtrl", IAOverviewCtrl as ng.Injectable<ng.IControllerConstructor>);
