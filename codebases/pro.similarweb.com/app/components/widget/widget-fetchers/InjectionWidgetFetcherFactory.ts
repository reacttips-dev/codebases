/**
 * Created by Eran.Shain on 11/24/2016.
 */
import angular from "angular";
import { IWidget } from "components/widget/widget-types/Widget";
import { IDataFetcher, IDataFetcherFactory } from "./IDataFetcher";
import { Injector } from "common/ioc/Injector";

export class InjectionWidgetFetcherFactory<T> implements IDataFetcherFactory<T> {
    create(widget: IWidget<T>): IDataFetcher<T> {
        let properties = widget.getWidgetConfig().properties;
        let resource = Injector.get(properties.resource)[properties.method] as (
            params: any,
        ) => angular.resource.IResource<T>;
        return {
            fetch: () => resource(widget.apiParams).$promise,
            destroy: () => {},
        };
    }
}
