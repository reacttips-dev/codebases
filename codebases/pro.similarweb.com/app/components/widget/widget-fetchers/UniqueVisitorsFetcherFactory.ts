/**
 * Created by Eran.Shain on 11/24/2016.
 */
import angular from "angular";
import { IWidget, IWidgetResource } from "components/widget/widget-types/Widget";
import { IDataFetcher, IDataFetcherFactory } from "./IDataFetcher";
import { Injector } from "common/ioc/Injector";

export class UniqueVisitorsFetcherFactory<T> implements IDataFetcherFactory<T> {
    create(widget: IWidget<T>): IDataFetcher<T> {
        let widgetResource = Injector.get("widgetResource") as IWidgetResource;
        let resource = widgetResource.websiteAppsResource()["SingleMetric"] as (
            params: any,
        ) => angular.resource.IResource<T>;
        return {
            fetch: () => resource(widget.apiParams).$promise,
            destroy: () => {},
        };
    }
}
