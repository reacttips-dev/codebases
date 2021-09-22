import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { Dayjs } from "dayjs";
import UnlockModalConfig from "../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { unsupportedDateKeys } from "./UniqueVisitorsWidget";
import { Widget } from "./Widget";
import { SwTrack } from "services/SwTrack";

export class EngagementOverviewKpiWidget extends Widget {
    protected setMetadata() {
        // noop
        return;
    }
    onResize(): void {
        // noop
        return;
    }

    static getWidgetMetadataType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    public visitsTitle: string;
    public uniqueVisitorsDisabled: boolean;
    public UnlockModalConfig: any;
    public noWindow: boolean;
    private _swSettings = swSettings;
    private _uniqueVisitorsStartDate: _.Dictionary<Dayjs>;
    private _from: Dayjs;
    private params: any;

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        this.visitsTitle =
            this.getProperties().duration == "28d"
                ? "wa.ao.graph.avgvisitsdaily"
                : "wa.ao.graph.avgvisits";
        this.uniqueVisitorsDisabled = this._swSettings.components.UniqueVisitors.resources.IsDisabled;
        this.onButtonClick = this.onButtonClick.bind(this);
        this.UnlockModalConfig = UnlockModalConfig();
        this.params = {
            DedupPermission: !this._swSettings.components.WebDedup.IsDisabled,
            uniqueVisitorsPermission: !this._swSettings.components.UniqueVisitors.IsDisabled,
            duration: this.getProperties().duration,
            country: this._params.country,
            metric: this.apiParams.metric,
        };
        this._uniqueVisitorsStartDate = {
            Desktop: this._swSettings.components.UniqueVisitors.resources.FirstAvailableSnapshot,
            MobileWeb: this._swSettings.components.UniqueVisitorsMobileWeb.resources
                .FirstAvailableSnapshot,
            Total: this._swSettings.components.UniqueVisitorsMobileWeb.resources
                .FirstAvailableSnapshot,
        };

        this._from = this.durationObject.raw.from;
        this.noWindow = this._widgetConfig.properties.duration == "28d";
    }

    callbackOnGetData(response: any) {
        this.data = _.find(response.Data, "Source", this._params.webSource);
        this.mergeGAVerifiedFlag(response);
    }

    validateData(response: any) {
        return true;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/engagementoverviewkpi.html`;
    }

    public unsupportedDate() {
        return this._from.isBefore(this._uniqueVisitorsStartDate[this._params.webSource]);
    }

    public getUnsupportedDateKey() {
        return i18nFilter()(unsupportedDateKeys[this._params.webSource]);
    }

    getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        return widgetModel;
    }

    onButtonClick() {
        SwTrack.all.trackEvent("hook/Contact Us/Pop up", "click", "Sales/Unique Visitors");
    }
}

EngagementOverviewKpiWidget.register();
