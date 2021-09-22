import angular from "angular";
import { commonWebSources } from "../filters-bar/utils";
import * as _ from "lodash";
/**
 * Created by vlads on 29/1/2016.
 */
const widgetSubtitle: angular.IComponentOptions = {
    bindings: {
        widget: "=",
    },
    template: `
            <div class="swWidget-subTitle" ng-if="!$ctrl.widget.dashboardId && $ctrl.widget.viewOptions.showSubtitle && $ctrl.widget.widgetState == 2" 
            ng-style="{position: 'relative', top: '-7px', display: 'block', marginTop: '-20px', minHeight: '15px', marginBottom: ($ctrl.widget.viewOptions.subtitleMarginBottom || '0px')}">
                <div ng-if="!$ctrl.widget.subtitleData.country && !$ctrl.widget.subtitleData.category && !$ctrl.widget.viewOptions.hideMainSubtitle" style="display: flex;margin-bottom: 5px;">
                    <span ng-if="$ctrl.widget.viewData.duration && ($ctrl.widget.viewData.customSubtitle === '' || !$ctrl.widget.viewData.customSubtitle) "><sw-react component="SWReactIcons" props="{iconName:'daily-ranking', className: 'first-icon-inline', size:'xs'}"></sw-react></span>

                    <span ng-bind-html="($ctrl.widget.viewData.customSubtitle || $ctrl.widget.viewData.duration) | i18n"></span> 
                    
                    <span ng-if="$ctrl.widget.viewOptions.showMmxMobileAlert">
                        <sw-react component="MMXAlertWithPlainTooltip"></sw-react></span>
                    </span>

                    <span ng-if="$ctrl.showCountry()">
                        <sw-react component="SWReactCountryIconsInline" props="{countryCode: $ctrl.widget.viewData.country.id}"></sw-react>
                        <span title="{{ $ctrl.widget.viewData.country.text }}">{{ $ctrl.widget.viewData.country.text }}</span>
                  
                    </span>
                    <span ng-if="$ctrl.widget.viewOptions.showWebSource" class="swWidget-subTitle-desktop-only" style="margin-left: 8px;">
                                    <sw-react component="SWReactIcons" props="{iconName: $ctrl.getWebSourceIconName(), className: 'icon-inline', size:'xs'}"></sw-react>
                                    {{$ctrl.getWebSourceText() | i18n }}
                    </span>
                    <span ng-if="$ctrl.widget.viewData.desktopOnly" class="swWidget-subTitle-desktop-only">
                                    <sw-react component="SWReactIcons" props="{iconName: 'desktop', className: 'icon-inline', size:'xs'}"></sw-react>
                                    {{::'widget.subtitle.desktoponly' | i18n }}
                    </span>
                    
                </div>
                <div ng-if="$ctrl.widget.subtitleData.country && !$ctrl.widget.viewOptions.hideCountrySubtitle" style="display: flex;margin-bottom: 5px;">
                    <span ng-if="$ctrl.widget.viewData.duration && ($ctrl.widget.viewData.customSubtitle === '' || !$ctrl.widget.viewData.customSubtitle) "><sw-react component="SWReactIcons" props="{iconName:'daily-ranking', className: 'first-icon-inline', size:'xs'}"></sw-react></span>
                    <span>{{ $ctrl.widget.viewData.duration }},&nbsp;<a class="swWidget-subtitle-link" ng-href="{{$ctrl.getCountryLink()}}" style="text-decoration: none;">
                    <i ng-class="$ctrl.widget.subtitleData.country.icon" title="{{ $ctrl.widget.subtitleData.country.text }}"></i>
                        <span class="u-underline-hover">{{ $ctrl.widget.subtitleData.country.text }}</span></span>
                    </a>
                    <span ng-if="$ctrl.widget.viewData.desktopOnly" class="swWidget-subTitle-desktop-only">
                                                           <sw-react component="SWReactIcons" props="{iconName: 'desktop', className: 'icon-inline', size:'xs'}"></sw-react>
{{::'widget.subtitle.desktoponly' | i18n }}
                    </span>
                </div>
                <div ng-if="$ctrl.widget.subtitleData.category && !$ctrl.widget.viewOptions.hideCategorySubtitle" style="margin-bottom: 5px;">
                    <a class="swWidget-subtitle-link" ng-href="{{$ctrl.getCategoryLink()}}"> {{ ::'global.in' | i18n }}
                        <i class="subTitle-sprite sprite-category" ng-class="$ctrl.widget.subtitleData.category.split('/')[0]"></i>
                        {{ $ctrl.widget.subtitleData.category | prettifyCategory }}
                    </a>
                </div>
            </div>
          <!-- one time binding for dashboard widgets -->
            
            
            <sw-widget-dashboard-subtitle ng-if="::$ctrl.widget.dashboardId" widget="$ctrl.widget"></sw-widget-dashboard-subtitle>
        `,
    controller: function (internalLinksService) {
        this.showCountry = () => {
            return this.widget.viewOptions.showCountry === undefined
                ? true
                : this.widget.viewOptions.showCountry === true;
        };
        this.getCountry = function () {
            let country;
            if (this.widget.subtitleData && this.widget.subtitleData.country) {
                country = this.widget.subtitleData.country.id;
            } else {
                country = this.widget._params.country;
            }
            return country;
        };

        this.getCountryLink = function () {
            return internalLinksService.getTopSitesLink({
                country: this.getCountry(),
                state: this.widget?._widgetConfig?.properties?.subTitleLinkState,
            });
        };

        this.getCategoryLink = function () {
            return internalLinksService.getTopSitesLink({
                country: this.getCountry(),
                category: this.widget.subtitleData.category.replace("/", "~"),
                state: this.widget?._widgetConfig?.properties?.subTitleLinkState,
            });
        };
        this.getWebSourceIconName = () =>
            commonWebSources[_.lowerFirst(this.widget.webSource)]().icon;
        this.getWebSourceText = () => commonWebSources[_.lowerFirst(this.widget.webSource)]().text;
    },
};

angular.module("sw.common").component("swWidgetSubtitle", widgetSubtitle);
