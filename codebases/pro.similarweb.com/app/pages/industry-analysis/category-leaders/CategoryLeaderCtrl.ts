import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { IndustryAnalysisPageCtrl } from "../controllers/IndustryAnalysisPageCtrl";
import { CHART_COLORS } from "../../../constants/ChartColors";
import { CategoryLeadersDirect } from "./widgets/CategoryLeadersDirect";
import { CategoryLeadersReferrals } from "./widgets/CategoryLeadersReferrals";
import { CategoryLeadersSearch } from "pages/industry-analysis/category-leaders/widgets/CategoryLeadersSearch";
import { CategoryLeadersSocial } from "./widgets/CategoryLeadersSocial";
import { CategoryLeadersAds } from "pages/industry-analysis/category-leaders/widgets/CategoryLeadersAds";
import { CategoryLeadersMail } from "./widgets/CategoryLeadersMail";
import { i18nFilter } from "../../../filters/ngFilters";
/**
 * Created by liorb on 11/28/2016.
 */
export class CategoryLeaderCtrl extends IndustryAnalysisPageCtrl {
    public activeTabIndex = 0;
    public title;
    public tabs = [
        {
            name: "Search",
            value: "CategoryLeadersSearch",
            color: CHART_COLORS.trafficSourcesColorsBySourceMMX.OrganicSearch,
            title: "industryanalysis.categoryLeaders.CategoryLeadersSearch.title",
        },
        {
            name: "Social",
            value: "CategoryLeadersSocial",
            color: CHART_COLORS.trafficSourcesColorsBySourceMMX.Social,
            title: "industryanalysis.categoryLeaders.CategoryLeadersSocial.title",
        },
        {
            name: "Display Ads",
            value: "CategoryLeadersAds",
            color: CHART_COLORS.trafficSourcesColorsBySourceMMX.DisplayAds,
            title: "industryanalysis.categoryLeaders.CategoryLeadersAds.title",
        },
        {
            name: "Referrals",
            value: "CategoryLeadersReferrals",
            color: CHART_COLORS.trafficSourcesColorsBySourceMMX.Referrals,
            title: "industryanalysis.categoryLeaders.CategoryLeadersReferrals.title",
        },

        {
            name: "Direct",
            value: "CategoryLeadersDirect",
            color: CHART_COLORS.trafficSourcesColorsBySourceMMX.Direct,
            title: "industryanalysis.categoryLeaders.CategoryLeadersDirect.title",
        },
        {
            name: "Mail",
            value: "CategoryLeadersMail",
            color: CHART_COLORS.trafficSourcesColorsBySourceMMX.Mail,
            title: "industryanalysis.categoryLeaders.CategoryLeadersMail.title",
        },
    ];

    constructor(
        public $scope: any,
        widgetFactoryService: any,
        swNavigator: any,
        $filter,
        $timeout,
    ) {
        super($scope, widgetFactoryService, swNavigator, swSettings, $filter, $timeout);
        const initialTab = swNavigator.getParams().tab;

        if (initialTab) {
            this.activeTabIndex = _.findIndex(this.tabs, { value: initialTab });
        } else {
            this.activeTabIndex = 0;
            this.swNavigator.updateParams({ tab: this.tabs[this.activeTabIndex].value });
        }
        this.title = i18nFilter()(this.tabs[this.activeTabIndex].title);
    }

    protected initWidgets(params: any) {
        this.widgets = {
            referrals: this.createWidget(params, CategoryLeadersReferrals),
            social: this.createWidget(params, CategoryLeadersSocial),
            ads: this.createWidget(params, CategoryLeadersAds),
            direct: this.createWidget(params, CategoryLeadersDirect),
            mail: this.createWidget(params, CategoryLeadersMail),
        };
    }

    private createWidget(params, widgetClass) {
        return this.widgetFactoryService.createWithConfigs(
            params,
            widgetClass,
            this.swNavigator.current().name,
        );
    }
}

angular
    .module("sw.common")
    .controller(
        "CategoryLeaderCtrl",
        CategoryLeaderCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
