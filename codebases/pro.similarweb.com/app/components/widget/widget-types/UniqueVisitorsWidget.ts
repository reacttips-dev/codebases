import { UniqueVisitorsFetcherFactory } from "../widget-fetchers/UniqueVisitorsFetcherFactory";
import { SingleMetricWidget } from "./SingleMetricWidget";
export const unsupportedDateKeys = {
    Desktop: "metric.uniquevisitors.unsupporteddate.date",
    MobileWeb: "metric.uniquevisitors.unsupporteddate.date.mobileweb",
    Total: "metric.uniquevisitors.unsupporteddate.date.mobileweb",
};
export class UniqueVisitorsWidget extends SingleMetricWidget {
    static $inject = ["$window", "$filter"];

    static getWidgetMetadataType() {
        return "UniqueVisitors";
    }

    static getWidgetResourceType() {
        return "SingleMetric";
    }

    private _popup: any;
    private _$window;
    private _$filter;
    public unsupportedDateKey;

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
    }

    public unsupportedDate() {
        return this._widgetConfig.properties.options.unsupportedDuration;
    }

    public claimMissing() {
        return this._widgetConfig.properties.options.claimMissing;
    }

    public getUnsupportedDateKey() {
        return this._$filter("i18n")(unsupportedDateKeys[this._params.webSource]);
    }

    protected getDataFetcherFactory() {
        return new UniqueVisitorsFetcherFactory();
    }

    protected noWindow() {
        return this._widgetConfig.properties.options.noWindow;
    }

    // user regular single metric component template
    get templateUrl() {
        return `/app/components/widget/widget-templates/singlemetric.html`;
    }

    public canAddToDashboard() {
        return false;
    }

    public getWidgetModel() {
        const model = super.getWidgetModel();
        model.metric = "UniqueUsers";
        return model;
    }
}

UniqueVisitorsWidget.register();
