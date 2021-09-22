import angular, { resource, IPromise } from "angular";
import { IWidget, IWidgetResource } from "components/widget/widget-types/Widget";
import { IDataFetcher } from "../widget-fetchers/IDataFetcher";
import { IDataFetcherFactory } from "./IDataFetcher";

export class DefaultDataFetcher<T> implements IDataFetcher<T> {
    protected widget: IWidget<T>;
    protected widgetResource: IWidgetResource;

    constructor(widgetResource, widget) {
        this.widgetResource = widgetResource;
        this.widget = widget;
    }

    public fetch(params): IPromise<T> {
        if (!params) {
            params = { ...this.widget.apiParams };
        }
        const { metric, ...rest } = params;
        const res = this.getResource();
        return res(rest).$promise;
    }

    // eslint:disable-next-line:no-empty
    public destroy(): void {}

    protected getResource(): resource.IResourceMethod<any> {
        const widgetConfig = this.widget.getWidgetConfig();
        const widgetMetricConfig = this.widget.getWidgetMetricConfig();
        let apiController =
            widgetConfig.properties.apiController || widgetMetricConfig.apiController;
        // for cases in which the 'apiController' is dynamic
        apiController =
            typeof apiController === "function"
                ? apiController(this.widget.getWidgetModel().key, widgetConfig.properties)
                : apiController;
        const widgetResourceType =
            this.widget.getClass().getWidgetResourceType() || widgetConfig.properties.type;
        const apiMetric = this.widget.apiParams.metric || widgetConfig.properties.metric;
        if (apiController) {
            return this.widgetResource.resourceByController(apiController, apiMetric)[
                widgetResourceType
            ];
        } else {
            // Deprecated : should currently be in use only for dashboard widgets
            // this._swLog.exception('Add metric apiController', widgetConfig);
            return this.widgetResource.websiteAppsResource(apiMetric)[widgetResourceType];
        }
    }
}

angular.module("sw.common").factory("defaultFetcherFactory", function (widgetResource) {
    const factory: IDataFetcherFactory<any> = {
        create: function (widget: IWidget<any>) {
            return new DefaultDataFetcher<any>(widgetResource, widget);
        },
    };
    return factory;
});
