/**
 * Created by eran.shain on 26/06/2017.
 */
import { Widget, WidgetState } from "./Widget";
export class DataNotSupportedWidget extends Widget {
    callbackOnGetData(response: any, comparedItemKeys?: any[]): void {}

    protected setMetadata() {}

    protected validateData(response: any): boolean {
        return true;
    }

    onResize(): void {}

    getData() {
        return (this.widgetState = WidgetState.LOADED);
    }

    get templateUrl() {
        return this._widgetConfig.properties.widgetTemplateUrl;
    }
}

DataNotSupportedWidget.register();
