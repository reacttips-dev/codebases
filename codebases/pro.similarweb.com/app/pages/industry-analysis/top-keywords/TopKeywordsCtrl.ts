import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { IndustryAnalysisPageCtrl } from "../controllers/IndustryAnalysisPageCtrl";
import { tabs } from "../config/top-keywords.tabs";
import { IndustryAnalysisTopKeywordsOrganicVsPaid } from "./widgets/IndustryAnalysisTopKeywordsOrganicVsPaid";
import { IndustryAnalysisSearchByChannel } from "./widgets/IndustryAnalysisSearchByChannel";
import { IndustryAnalysisSearchBySource } from "./widgets/IndustryAnalysisSearchBySource";
import { IndustryAnalysisTopKeywordsAll } from "./widgets/IndustryAnalysisTopKeywordsAll";
import { IndustryAnalysisTopKeywordsOrganic } from "./widgets/IndustryAnalysisTopKeywordsOrganic";
import { IndustryAnalysisTopKeywordsPaid } from "./widgets/IndustryAnalysisTopKeywordsPaid";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../scripts/common/services/swNavigator";
import { IWidget } from "../../../components/widget/widget-types/Widget";
import { SwTrack } from "services/SwTrack";

export class TopKeywordsCtrl extends IndustryAnalysisPageCtrl {
    public activeTabIndex: number;
    public isTabChange = false;
    public tabs = tabs;
    private _params: any;
    public isSearchTrends;

    constructor(
        public $scope: any,
        widgetFactoryService: any,
        swNavigator: any,
        $filter,
        $timeout,
    ) {
        super($scope, widgetFactoryService, swNavigator, swSettings, $filter, $timeout);
        $scope.$on("navUpdate", () => {
            if (!this.isTabChange) {
                this.loadTabTables(this._params);
            }
            this.isTabChange = false;
        });

        $scope.$on("$destroy", () => {
            if (this.widgets.tableAll) {
                this.widgets.tableAll.forceCleanup();
            }
            if (this.widgets.tableOrganic) {
                this.widgets.tableOrganic.forceCleanup();
            }
            if (this.widgets.tablePaid) {
                this.widgets.tablePaid.forceCleanup();
            }
        });
    }

    private setActiveTabAndTitle() {
        this.tabs = this.isSearchTrends ? tabs.filter((tab) => tab.value === "all") : [...tabs];
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        const { tab = "all" } = swNavigator.getParams();
        const tabIndex = this.tabs.findIndex(
            ({ value }) => value.trim().toLowerCase() === tab.trim().toLowerCase(),
        );
        this.activeTabIndex = tabIndex > -1 ? tabIndex : 0;
        this.title = swNavigator.current().pageTitle;
    }

    onTabSelected(index = 0) {
        this.isTabChange = true;
        this.activeTabIndex = index;
        SwTrack.all.trackEvent("Tab", "click", `Table/${this.tabs[index].name}`);
        this.$scope.$emit("widgetTabChange", this.tabs[index].value);
    }

    loadTabTables(params: any = this._params) {
        const wParams = { ...params };
        if (this.isSearchTrends) {
            wParams.isSearchTrends = true;
        }
        this.widgets.tableAll = this.creatreWidget(IndustryAnalysisTopKeywordsAll, wParams);
        if (!this.isSearchTrends) {
            this.widgets.tableOrganic = this.creatreWidget(
                IndustryAnalysisTopKeywordsOrganic,
                wParams,
            );
            this.widgets.tablePaid = this.creatreWidget(IndustryAnalysisTopKeywordsPaid, wParams);
        }
    }

    protected initWidgets(params: any = this._params) {
        this._params = params;
        this.setActiveTabAndTitle();
        this.widgets = {};
        if (!this.isSearchTrends) {
            this.widgets.organicVsPaid = this.creatreWidget(
                IndustryAnalysisTopKeywordsOrganicVsPaid,
                params,
            );
            this.widgets.byChannel = this.creatreWidget(IndustryAnalysisSearchByChannel, params);
            this.widgets.bySource = this.creatreWidget(IndustryAnalysisSearchBySource, params);
        }
        this.loadTabTables(params);
    }

    private creatreWidget(widgetClass, params) {
        return this.widgetFactoryService.createWithConfigs(
            params,
            widgetClass,
            this.swNavigator.current().name,
        );
    }
}

angular
    .module("sw.common")
    .controller("topKeywordsCtrl", TopKeywordsCtrl as ng.Injectable<ng.IControllerConstructor>);
