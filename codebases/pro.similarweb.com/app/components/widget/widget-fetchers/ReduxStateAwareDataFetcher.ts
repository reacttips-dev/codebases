import angular from "angular";
import { IInjector, Injector } from "common/ioc/Injector";
import { IWidget } from "../widget-types/Widget";
import { DefaultDataFetcher } from "./DefaultDataFetcher";
import { IDataFetcherFactory } from "./IDataFetcher";

export class ReduxStateAwareDataFetcher<T> extends DefaultDataFetcher<T> {
    protected statePath: string;
    protected $swNgRedux: any;
    private unSubscribe: any;

    constructor(widgetResource, widget, statePath) {
        super(widgetResource, widget);
        this.statePath = statePath;
        this.$swNgRedux = Injector.get("$swNgRedux");
        this.unSubscribe = this.$swNgRedux.notifyOnChange(this.statePath, this.callback.bind(this));
    }

    callback(path, newState) {
        this.widget.runWidget();
    }

    destroy(): void {
        this.unSubscribe();
    }
}

angular.module("sw.common").factory("ReduxStateAwareDataFactory", function (widgetResource) {
    let factory: IDataFetcherFactory<any> = {
        create: function (widget: IWidget<any>, statePath) {
            return new ReduxStateAwareDataFetcher<any>(widgetResource, widget, statePath);
        },
    };
    return factory;
});
