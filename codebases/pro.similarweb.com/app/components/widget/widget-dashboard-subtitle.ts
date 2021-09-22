import angular from "angular";
import * as _ from "lodash";
import { Widget } from "components/widget/widget-types/Widget";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";
import { IKeywordGroup } from "userdata";

class widgetDashboardSubtitleCtrl {
    public getIcon = (item) => item.icon || item.Icon || item.image;
    public getFilterValue;
    public widget;
    public item;
    public isSingleMode;
    public durationStr: string;
    public family: string;
    public useLegendInSubtitle;
    public customSubtitle;
    public industryIcon: string;
    public asterix: boolean;
    public cutomAssetIcon: string;
    public customAssetTooltip: any;
    public singleTitle: any;

    constructor(private $scope, private i18nFilter, private $filter) {
        // get the first item from the legend items array
        let firstLegendItem = _.head<any>(this.widget.viewData.key);
        this.item =
            firstLegendItem && (firstLegendItem.Title || firstLegendItem.name)
                ? firstLegendItem
                : { name: _.head<any>(this.widget.apiParams.keys.split(",")) };
        this.family = this.widget._widgetConfig.properties.family;
        this.asterix = this.item.id;
        this.customSubtitle = this.i18nFilter(this.widget._viewData.customSubtitle);
        this.isSingleMode = this.widget.getWidgetModel().key.length == 1;
        this.getFilterValue = (filter) => {
            const filterObject: any = Widget.filterParse(filter);
            const filterObjectItem: any = filterObject[this.widget.getSearchKey()];
            return filterObjectItem && filterObjectItem.hasOwnProperty("value")
                ? filterObjectItem.value.replace(/"/g, "")
                : "";
        };

        if (_.isArray(this.widget.durationObject.forWidget)) {
            this.durationStr = this.widget.durationObject.forWidget.join(
                ` ${this.i18nFilter("compared.duration.vs")} `,
            );
        } else {
            this.durationStr = this.widget.durationObject.forWidget;
        }

        if (this.family === "Industry") {
            if (this.item.category.indexOf("$") > -1) {
                this.industryIcon = this.$filter("industryKeyToIcon")(this.item.category);
            } else {
                this.industryIcon = this.$filter("industryKeyToIcon")(`*${this.item.name}`);
            }
        }

        this.cutomAssetIcon =
            this.item.category && this.item.category.indexOf("$") == -1
                ? this.industryIcon
                : this.family === "Keyword" && this.item.id && this.item.id != this.item.name
                ? "icon sw-icon-folder"
                : null;
        if (this.cutomAssetIcon) {
            this.customAssetTooltip = {};
            this.singleTitle = this.item.name;
            switch (this.family) {
                case "Industry":
                    this.customAssetTooltip.title = "Websites in category:";
                    this.customAssetTooltip.type = "websites";
                    UserCustomCategoryService.getCustomCategoryByIdAsync(this.item.id).then(
                        (category: any) => {
                            this.customAssetTooltip.items = category ? category.domains : [];
                            this.singleTitle = category
                                ? category.name || category.text
                                : this.item.name;
                        },
                    );
                    break;
                case "Keyword":
                    this.customAssetTooltip.title = "Keywords in group:";
                    this.customAssetTooltip.type = "keywords";
                    keywordsGroupsService.findGroupByIdAsync(this.item.id).then(
                        (
                            keywordsGroup: IKeywordGroup & {
                                keywords?: string[];
                                name?: string;
                            },
                        ) => {
                            this.customAssetTooltip.items = keywordsGroup
                                ? keywordsGroup.keywords || keywordsGroup.Keywords
                                : [];
                            this.singleTitle = keywordsGroup
                                ? keywordsGroup.name || keywordsGroup.Name
                                : this.item.name;
                        },
                    );
                    break;
            }
        }

        //this.useLegendInSubtitle = this.isSingleMode && this.widget.apiParams.compareFrom && this.widget.periodOverPeriodLegend;

        $scope.$watch("$ctrl.widget.chartConfig.series", (newVal, oldVal) => {
            if (newVal) {
                this.useLegendInSubtitle =
                    this.isSingleMode &&
                    this.widget.apiParams.compareFrom &&
                    this.widget.periodOverPeriodLegend;
            }
        });
    }
}

class widgetDashboardSubtitle implements ng.IComponentOptions {
    public bindings = {
        widget: "=",
    };
    public template = `<div style="display: block;margin-top: -25px; min-height: 15px;" ng-class="$ctrl.widget.viewOptions.dashboardSubtitleClass" ng-style="{marginBottom: $ctrl.widget.viewOptions.dashboardSubtitleMarginBottom}">
            <ul class="swWidget-dashboard-subTitle u-flex-row">
                <li ng-if="$ctrl.isSingleMode" class="swWidget-dashboard-subTitle-item-keyword">
                    <span ng-if="!$ctrl.cutomAssetIcon" class="item-img {{$ctrl.industryIcon}}" title="{{::$ctrl.item.name || $ctrl.item.Title}}"
                     ng-class="{
                        'sw-icon-keyword': $ctrl.family === 'Keyword' && !$ctrl.cutomAssetIcon,
                    }">
                        <img ng-if="::$ctrl.getIcon($ctrl.item) && $ctrl.family != 'Industry' && $ctrl.family != 'Keyword'" class="item-icon"
                             ng-class="::{'website-small-icon': $ctrl.item.smallIcon}"
                             crossOrigin="anonymous"
                             ng-src="{{::$ctrl.getIcon($ctrl.item)}}" />
                    </span>
                    <span ng-if="!$ctrl.cutomAssetIcon" class="item-name" title="{{$ctrl.item.name || $ctrl.item.Title}}">{{($ctrl.item.category || $ctrl.item.name || $ctrl.item.Title) | industryKeyToTitle}}</span>
                    <sw-react ng-if="$ctrl.cutomAssetIcon"
                              component="WidgetCustomAssetTooltip" props="{
                                                                            iconClasName:$ctrl.cutomAssetIcon,
                                                                            title: $ctrl.customAssetTooltip.title,
                                                                            listItems: $ctrl.customAssetTooltip.items,
                                                                            type: $ctrl.customAssetTooltip.type,
                                                                            visibleItems: 7,
                                                                            name: $ctrl.singleTitle,
                                                                            }"></sw-react>
                </li>
                <li  ng-if="$ctrl.family==='Mobile' && !$ctrl.isSingleMode && $ctrl.widget.apiParams.metric === 'AppIndexes' " class="swWidget-dashboard-subTitle-item-legend">
                    <span class="swWidget-dashboard-subTitle-country">{{::$ctrl.i18nFilter('grid.filter.category.all')}}</span>
                </li>
                <li ng-if="$ctrl.useLegendInSubtitle" class="swWidget-dashboard-subTitle-item-legend">
                    <sw-legend class="swWidget-legend" items="$ctrl.widget.periodOverPeriodLegendItems" custom-template="$ctrl.widget.customLegendTemplate"></sw-legend>
                </li>
                <li ng-if="!$ctrl.useLegendInSubtitle && !$ctrl.widget.viewOptions.hideDurationFromSubtitle && !$ctrl.customSubtitle"
                class="swWidget-dashboard-subTitle-item-duration">
                    <span>{{$ctrl.widget.viewData.duration || $ctrl.durationStr}}</span>
                </li>
                <li ng-if="$ctrl.customSubtitle">
                    <span class="item-name" title="{{$ctrl.customSubtitle}}" ng-bind-html="$ctrl.customSubtitle"/>
                </li>
                <li class="swWidget-dashboard-subTitle-item-country">
                    <sw-react component="SWReactCountryIconsInline" props="{countryCode: $ctrl.widget.viewData.country.id}"></sw-react>
                    <span title="{{$ctrl.widget.viewData.country.text }}" class="swWidget-dashboard-subTitle-country">{{$ctrl.widget.viewData.country.text }}</span>
                </li>
                <li ng-if="$ctrl.getFilterValue($ctrl.widget.apiParams.filter) != ''" class="swWidget-dashboard-subTitle-item-filter">
                    <sw-react component="SWReactIcons" props="{iconName: 'search'}"></sw-react>
                    <span class="swWidget-dashboard-subTitle-filter">{{::$ctrl.getFilterValue($ctrl.widget.apiParams.filter)}}</span>
                </li>
                <sw-react
                    ng-if="$ctrl.widget.apiParams.ExcludeTerms || $ctrl.widget.apiParams.IncludeTerms || $ctrl.widget.apiParams.ExcludeUrls || $ctrl.widget.apiParams.IncludeUrls"
                    class="swWidget-dashboard-subTitle-boolean-search"
                    props="{ExcludeTerms: $ctrl.widget.apiParams.ExcludeTerms,
                    IncludeTerms: $ctrl.widget.apiParams.IncludeTerms,
                    ExcludeUrls: $ctrl.widget.apiParams.ExcludeUrls,
                    IncludeUrls: $ctrl.widget.apiParams.IncludeUrls}"
                    component="BooleanSearchWidgetSubtitleItem"></sw-react>
            </ul></div>
        `;
    controller = widgetDashboardSubtitleCtrl as ng.Injectable<ng.IControllerConstructor>;
}

angular.module("sw.common").component("swWidgetDashboardSubtitle", new widgetDashboardSubtitle());
