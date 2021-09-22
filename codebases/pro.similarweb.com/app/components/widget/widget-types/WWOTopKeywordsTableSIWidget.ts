import * as _ from "lodash";
import { TableWidget } from "./TableWidget";
import { LEAD_ROUTES } from "pages/sales-intelligence/pages/find-leads/constants/routes";

export type TopKeywordsDataItemType = {
    Change: number;
    SearchTerm: string;
    Share: number;
    url: string;
    isPaid: boolean;
    linkState: string;
};

export class WWOTopKeywordsTableSIWidget extends TableWidget {
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

    initWidget(widgetConfig: any, context: string) {
        this.viewOptions.target = true ? "_self" : "_blank";
        const params = this._swNavigator.getParams();
        this.viewOptions.link =
            widgetConfig.properties.apiParams && widgetConfig.properties.apiParams.filter
                ? this._swNavigator.href(
                      "accountreview_website_search_keyword",
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

    callbackOnGetData(response: any) {
        const _inputParams = this._swNavigator.getParams();

        _inputParams.Keywords_filters = this.apiParams.filter;
        _inputParams.Keywords_page = "1";

        if (_inputParams.webSource && _inputParams.webSource === "Total") {
            _inputParams.webSource = "Desktop";
        }

        response.Data = _.map(response.Data, (item: TopKeywordsDataItemType) => {
            item.isPaid = _.endsWith(this.apiParams.filter, "1");
            item.linkState = "accountreview_website_search_ads";
            return item;
        });

        this.viewOptions.link = this._swNavigator.href(
            "accountreview_website_search_keyword",
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

    public getProUrl(rowParams) {
        const result = Object.assign(
            this._getProUrlParams(),
            this._metricConfig.stateParams,
            rowParams,
        );

        const state = this.apiParams.IncludePaid
            ? LEAD_ROUTES.KEYWORD_RESULTS_PAID
            : LEAD_ROUTES.KEYWORD_RESULTS_ORGANIC;

        return this._swNavigator.href(state, result, {});
    }
    getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        widgetModel.webSource = "Desktop";
        widgetModel.metric = this.apiParams.IncludePaid ? "TopPaidKeywords" : "TopOrganicKeywords";
        return widgetModel;
    }
}

WWOTopKeywordsTableSIWidget.register();
