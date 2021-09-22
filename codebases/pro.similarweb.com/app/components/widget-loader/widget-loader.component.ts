import angular from "angular";
import { i18nFilter } from "../../filters/ngFilters";
/**
 * Created by vlads on 12/1/2016.
 */
const widgetLoader: angular.IComponentOptions = {
    bindings: {
        widget: "=",
    },
    template: `
            <div style="position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <div ng-if="!ctrl.bigTable" style="position:relative;width:1px;height:1px;left:50%;top:-5%;transform:translate(-50%, -45%);">
                    <sw-react component="SpinnerLoading" ng-if="!ctrl.longLoader" props="{top: '-10px'}" ></sw-react>
                    <sw-react ng-if="ctrl.longLoader" component="LoaderListBullets" props="{title: ctrl.loaderTitle, subtitle: ctrl.loaderSubtitle}"></sw-react>
                </div>
                <div ng-if="ctrl.bigTable" style="position: relative; left: 50%;transform: translate(-50%, 0);padding: 0 20px" ng-include="'/app/components/widget-loader/table-big.svg'"></div>
            </div>`,
    controllerAs: "ctrl",
    controller: function () {
        const widgetProperties = this.widget._widgetConfig.properties;
        const i18n = i18nFilter();
        this.bigTable =
            /Table/.test(this.widget.type) && /widgetTable/.test(this.widget.viewOptions.cssClass);
        this.longLoader = widgetProperties.longLoader;
        this.loaderTitle = i18n(widgetProperties.loaderTitle);
        this.loaderSubtitle = i18n(widgetProperties.loaderSubtitle);
    },
};

angular.module("sw.common").component("swWidgetLoader", widgetLoader);
