/**
 * Created by liorb on 3/16/2016.
 */
import { InjectionWidgetFetcherFactory } from "../widget-fetchers/InjectionWidgetFetcherFactory";
import { Widget } from "./Widget";

export class CustomWidget extends Widget {
    constructor() {
        super();
    }

    protected validateData(response: any) {
        return true;
    }

    protected setMetadata() {}

    public getFetcherFactory() {
        return new InjectionWidgetFetcherFactory();
    }

    callbackOnGetData(response: any) {
        this.data = response[this._params.keys] || {};
    }

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        Object.assign(this._params, this._widgetConfig.properties.params);
    }

    onResize() {
        return;
    }
}

CustomWidget.register();
