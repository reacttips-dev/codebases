import * as _ from "lodash";
import { ITableFilter, TableWidget } from "./TableWidget";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
export interface topKeywordsDataItem {
    Change: number;
    SearchTerm: string;
    Share: number;
    url: string;
    isPaid: boolean;
}
export class WWOTopKeywordsTableWidget extends TableWidget {
    static $inject = ["$filter"];
    protected _$filter;

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    static getWidgetMetadataType() {
        return "WWOTopKeywordsTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getWidgetDashboardType() {
        return "Table";
    }

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-trafficSearch-keywords",
            ["marketresearch", "digitalmarketing"],
            this._swNavigator,
        );
        this.viewOptions.target = isSameModule ? "_self" : "_blank";
        const params = this._swNavigator.getParams();
        this.viewOptions.link =
            widgetConfig.properties.apiParams && widgetConfig.properties.apiParams.filter
                ? this._swNavigator.href(
                      targetState,
                      _.merge(
                          params,
                          { Keywords_filters: widgetConfig.properties.apiParams.filter },
                          {
                              webSource:
                                  params.webSource &&
                                  (params.webSource === "Total" || params.webSource === "Desktop")
                                      ? "Desktop"
                                      : "Mobile",
                          },
                          { Keywords_page: "1" },
                      ),
                  )
                : "";
        this.viewOptions.ctaButtonTracking = widgetConfig.properties.options
            ? "Marketing Mix/Top Search Terms/" +
              this._$filter("i18n")(widgetConfig.properties.options.ctaButton)
            : "";
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    public setFilterParam(filter: ITableFilter) {
        super.setFilterParam(filter);
        this.apiParams.IncludePaid = !!filter.value;
        this.apiParams.IncludeOrganic = !filter.value;
        this.apiParams.filter = undefined;
    }

    callbackOnGetData(response: any) {
        let _inputParams = this._swNavigator.getParams();
        _inputParams.Keywords_filters = this.apiParams.filter;
        _inputParams.Keywords_page = "1";
        if (_inputParams.webSource && _inputParams.webSource === "Total") {
            _inputParams.webSource = "Desktop";
        }
        let isPaid = _.endsWith(this.apiParams.filter, "1");
        response.Data = _.map(response.Data, (item: topKeywordsDataItem) => {
            item.isPaid = isPaid;
            return item;
        });
        this.viewOptions.link = this._swNavigator.href(
            "websites-trafficSearch-keywords",
            _inputParams,
        );
        super.callbackOnGetData(response);
        this.legendItems = _.map(this.getLegendItems(), (legend) =>
            Object.assign({}, legend, { smallIcon: true }),
        );
    }

    setMetadata() {
        super.setMetadata();
    }

    onResize() {
        super.onResize();
    }

    validateData(response: any) {
        return super.validateData(response);
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/wwotable.html`;
    }

    getWidgetModel() {
        const _isPaid = this.apiParams.IncludePaid;
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        widgetModel.webSource = "Desktop";
        widgetModel.metric = _isPaid ? "TopPaidKeywords" : "TopOrganicKeywords";
        return widgetModel;
    }
}

WWOTopKeywordsTableWidget.register();
