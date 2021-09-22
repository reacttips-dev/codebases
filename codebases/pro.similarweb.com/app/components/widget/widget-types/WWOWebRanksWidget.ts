import { Widget } from "./Widget";
import { WidgetState } from "./Widget";
import { SwTrack } from "services/SwTrack";
export class WWOWebRanksWidget extends Widget {
    static $inject = ["$filter"];
    protected _$filter: any;

    static getWidgetMetadataType() {
        return "SingleMetric";
    }

    static getWidgetResourceType() {
        return "SingleMetric";
    }

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
    }

    setMetadata() {}

    callbackOnGetData(response: any) {
        this.runProfiling();
        this.data = response.Data[Object.keys(response.Data)[0]];
    }

    validateData(response: any) {
        return true;
    }

    handleDataError(error: number) {
        //no error state
        this.widgetState = WidgetState.LOADED;
        super.handleDataError(error);
    }

    onResize() {}

    get templateUrl() {
        return `/app/components/widget/widget-templates/singlemetric.html`;
    }

    getCountryLink(country) {
        return this._swNavigator.href("industryAnalysis-topSites", {
            country: country,
            duration: "1m",
            category: "All",
        });
    }

    getCategoryLink(category, country) {
        category = category.replace("/", "~");
        return this._swNavigator.href("industryAnalysis-topSites", {
            country: country,
            duration: "1m",
            category: category,
        });
    }

    getCountryText(countryId) {
        return this._$filter("countryTextById")(countryId);
    }

    getCategoryText(categoryId) {
        return this._$filter("prettifyCategory")(categoryId, 'null : "N/A"');
    }

    trackClick(category, name, value) {
        SwTrack.all.trackEvent(category, "click", name + value);
    }
}

WWOWebRanksWidget.register();
