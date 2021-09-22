import angular from "angular";
import { IWidgetFactoryService } from "components/widget/factory/WidgetFactoryService";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import DurationService from "services/DurationService";
import { getAvailableWebSource } from "components/filters-bar/utils";
import widgetSettings from "components/dashboard/WidgetSettings";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

type DefaultWidgetsType = any[] | {};

interface IIndustryAnalysisPageCtrl<T = DefaultWidgetsType> {
    widgets: T;
}

export class IndustryAnalysisPageCtrl implements IIndustryAnalysisPageCtrl {
    public title: string;
    public subtitle: string;
    public dateTitle: string;
    public widgets;
    public state;
    public tooltipText: string;
    public showTooltip: boolean;
    public deviceIcon: string;
    public deviceTitle: string;
    public isCustomCategory: boolean = false;
    protected _widgetFactoryService: IWidgetFactoryService;
    private parentModule: any;
    public webSource;
    public webSources;
    public selectedWebSource;

    constructor(
        public $scope: any,
        protected widgetFactoryService: any,
        protected swNavigator: any,
        protected swSettings: any,
        protected $filter,
        protected $timeout,
    ) {
        const params = swNavigator.getParams();
        const state = swNavigator.current().name;
        const userCustomCategories = UserCustomCategoryService.getCustomCategories();

        this.parentModule = $scope.ctrl;
        this.title = this.parentModule.title;
        this.subtitle = swNavigator.current().hideSubtitle ? null : state + ".subtitle";
        this.dateTitle = DurationService.getDurationData(params.duration).forWidget as string;
        this.state = swNavigator.current().name;
        this._widgetFactoryService = widgetFactoryService;

        this.deviceIcon = "desktop";
        this.deviceTitle = "Desktop";

        const webSources = getAvailableWebSource(swNavigator.current(), swNavigator.getParams());
        const webSourceFromState = params.webSource;
        this.selectedWebSource = _.find(webSources, { id: webSourceFromState });

        if (this.selectedWebSource) {
            this.deviceTitle = this.selectedWebSource.text;
            this.deviceIcon = this.selectedWebSource.icon;
        }

        if (swSettings.current.isAllowed) {
            this.parentModule.config.pagePermitted = true;
            this.parentModule.config.notPermittedConfig = null;
            const { category } = params;
            const categoryKey = (category) => [
                {
                    id: "$" + decodeURIComponent(category),
                    name: "$" + decodeURIComponent(category),
                },
            ];
            const customCategoryKey = (category) => {
                const cateObj = categoryService.categoryQueryParamToCategoryObject(category);
                return [
                    {
                        id: cateObj?.categoryId,
                        name: cateObj?.text,
                    },
                ];
            };
            const widgetParams: any = {
                ...params,
                country: params.country,
                key: UserCustomCategoryService.isCustomCategory(category)
                    ? customCategoryKey(category)
                    : categoryKey(category),
                duration: params.duration,

                tab: params.tab,
                parentCategory: this.parentModule.industry.name,
            };
            if (this.webSource || this.selectedWebSource) {
                widgetParams.webSource = this.webSource || this.selectedWebSource.id;
            }

            if (_.startsWith(params.category, "*")) {
                const customCategory = userCustomCategories.find(
                    (rec) => rec.forUrl === params.category,
                );
                if (customCategory) {
                    widgetParams.categoryHash = customCategory.categoryHash;
                    this.isCustomCategory = true;
                }
            }
            this.initWidgets(widgetParams);

            $scope.$on("widgetTabChange", (args, tab) => {
                swNavigator.updateParams({ tab });
            });
        } else {
            this.parentModule.config.pagePermitted = false;
            this.parentModule.config.notPermittedConfig = swNavigator.current().notPermittedConfig;
            this.parentModule.config.notPermittedConfig.description = i18nFilter()(
                this.parentModule.config.notPermittedConfig.description,
            );
            this.title = swNavigator.current().name + ".title";
        }
    }

    protected initWidgets(params: any) {
        this.widgets = [];
        const pageCtrl = this;
        this.$timeout(() => {
            pageCtrl.widgets = _.map(pageCtrl.getPageWidgets(), (widget: any) => {
                widget.properties = Object.assign({}, params, widget.properties, {
                    family: "Industry",
                });
                if (params.tab) {
                    widget.properties.initialTab = params.tab;
                }
                widget.properties.filters = pageCtrl.getWidgetFilters(widget, params);
                return pageCtrl._widgetFactoryService.create(
                    widget,
                    pageCtrl.swNavigator.current().name,
                );
            });
        });
    }

    protected getPageWidgets() {
        return widgetSettings.getPageWidgets(this.state, "single");
    }

    protected hasMobileWebData(params: any) {
        return (
            this.swSettings.allowedDuration(params.duration, "MobileWeb") &&
            this.swSettings.allowedCountry(params.country, "MobileWeb")
        );
    }

    protected getWidgetFilters(widget, params): any {
        return {
            webSource: params.webSource,
        };
    }
}

angular
    .module("sw.common")
    .controller(
        "industryAnalysisPageCtrl",
        IndustryAnalysisPageCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
