import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import { DEFAULT_PAGE_LAYOUT_CLASS_NAME } from "UtilitiesAndConstants/Constants/css";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

export interface IIndustry {
    name: string;
    subName: string;
    title?: string;
    subTitle?: string;
}

export interface IModuleConfig {
    tab: string;
    pagePermitted: boolean;
    notPermittedConfig: any;
}

export class IndustryAnalysisModuleCtrl {
    public sideNavIsOpened: boolean;
    public w;
    public state: any;
    public navObj;
    public fixHeight: boolean;
    public tooltipText: string;
    public config: IModuleConfig;
    public trackerName: string;
    public title: string;
    public pageLayoutClassName: string;
    upgrade;
    pageFrameContainer: string;
    industry: IIndustry;
    category: any;
    headerDescHTML: string;
    subNavComponent: string;

    constructor($scope, swNavigator, $window) {
        /* API */
        let ctrl = this;
        let component = swSettings.current;
        let params = swNavigator.getParams();

        ctrl.w = angular.element($window);
        ctrl.sideNavIsOpened = false;
        ctrl.fixHeight = true;
        ctrl.config = {
            tab: params.tab,
            pagePermitted: component.isAllowed,
            notPermittedConfig: swNavigator.current().notPermittedConfig,
        };

        ctrl.trackerName = "Sales/Industry Analysis";
        ctrl.subNavComponent = "IndustryAnalysisSubNav";

        ctrl.pageFrameContainer = "/app/pages/industry-analysis/industry-analysis-page-frame.html";
        const applyPageLayoutClassName = () => {
            ctrl.pageLayoutClassName =
                swNavigator.current().pageLayoutClassName ?? DEFAULT_PAGE_LAYOUT_CLASS_NAME;
        };
        applyPageLayoutClassName();

        ctrl.toggleHideClass();
        ctrl.buildIndustry(params);

        $scope.$on("slideScreen", function () {
            ctrl.toggleSideNav();
        });

        this.setTitle(swNavigator.current(), swNavigator.getParams());
        $scope.$on("navChangeComplete", (event, toState) => {
            if (swNavigator.isIndustryAnalysis(toState)) {
                ctrl.buildIndustry(swNavigator.getParams());
            }
            ctrl.state = _.cloneDeep(swNavigator.current());
            this.setTitle(toState, swNavigator.getParams());
            applyPageLayoutClassName();
        });
    }

    setTitle(state, params) {
        this.title =
            params.tab !== undefined
                ? `industryanalysis.categoryLeaders.${params.tab}.title`
                : state.name + ".title";
    }

    toggleHideClass() {
        let ctrl = this;
        ctrl.sideNavIsOpened = ctrl.w.width() >= 1200;
    }

    toggleSideNav() {
        let ctrl = this;
        ctrl.sideNavIsOpened = !ctrl.sideNavIsOpened;
    }

    buildIndustry(params) {
        let ctrl = this;
        let categories = params.category.split("~");
        params.category = decodeURIComponent(params.category);
        ctrl.category = params.category;
        if (categories.length > 0) {
            ctrl.headerDescHTML =
                categories[0][0] === "*"
                    ? i18nFilter()("industryAnalysis.overview.header.desc.customcat")
                    : i18nFilter()("industryAnalysis.overview.header.desc");
            ctrl.industry = {
                name: UserCustomCategoryService.isCustomCategory(categories[0])
                    ? UserCustomCategoryService.getCustomCategoryById(categories[0].substr(1)).name
                    : categories[0] === "All"
                    ? "All Categories"
                    : categories[0].replace(/_/g, " ").replace("*", ""),
                subName: categories[1] ? i18nCategoryFilter()(params.category, true) : null,
            };
            ctrl.industry.title =
                categories.length === 1 ? ctrl.industry.name : ctrl.industry.subName;
            ctrl.industry.subTitle = categories.length === 2 ? ctrl.industry.name : null;
        }
    }
}

angular
    .module("sw.common")
    .controller(
        "industryAnalysisModuleCtrl",
        IndustryAnalysisModuleCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
