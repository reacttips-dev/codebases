import angular from "angular";
import { IWidget } from "../widget-types/Widget";
import { IDataFetcherFactory } from "./IDataFetcher";
import { ReduxStateAwareDataFetcher } from "./ReduxStateAwareDataFetcher";

export class ConnectedAssetsDataFetcher<T> extends ReduxStateAwareDataFetcher<T> {
    constructor(widgetResource, widget, statePath) {
        super(widgetResource, widget, statePath);
    }

    fetch(params = this.widget.apiParams) {
        params.ShouldGetVerifiedData = this.$swNgRedux.getStatePath(this.statePath);
        return super.fetch(params);
    }
}

angular.module("sw.common").factory("ConnectedAssetsDataFetcherFactory", function (widgetResource) {
    let factory: IDataFetcherFactory<any> = {
        create: function (widget: IWidget<any>, statePath) {
            return new ConnectedAssetsDataFetcher<any>(widgetResource, widget, statePath);
        },
    };
    return factory;
});
