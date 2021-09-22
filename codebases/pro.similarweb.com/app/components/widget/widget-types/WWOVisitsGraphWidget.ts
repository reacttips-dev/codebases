import angular from "angular";
import { WidgetState } from "components/widget/widget-types/Widget";
import { i18nFilter, minVisitsAbbrFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { ChartMarkerService } from "services/ChartMarkerService";
import DurationService from "services/DurationService";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { GraphWidget } from "./GraphWidget";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
import { swSettings } from "common/services/swSettings";

export class WWOVisitsGraphWidget extends GraphWidget {
    static $inject = ["widgetResource"];

    static getWidgetMetadataType() {
        return "Graph";
    }

    static getWidgetResourceType() {
        return "Graph";
    }

    private _widgetResource;
    private legendsData;
    private swNavigator;
    private isSingleMode;
    private duration;
    private params;

    public isAdditionWWSixMonthMode = false;

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    constructor() {
        super();
        this.swNavigator = Injector.get<any>("swNavigator");
        this.isSingleMode = this.swNavigator.$stateParams.key.split(",").length === 1;
        this.params = this.swNavigator.getParams();
        if (
            this.params.country === "999" &&
            !swSettings.allowedCountry(this.params.country, "WebAnalysis") &&
            DurationService.isGreaterThanSixMonths(this.params.duration)
        ) {
            this.isAdditionWWSixMonthMode = true;
        }
        const durationRaw = DurationService.getDurationData(this.params.duration).raw;
        const { from, to } = durationRaw;
        const duration = DurationService.getDiffSymbol(from, to);
        this.duration = parseInt(duration.replace("m", ""), 10);
    }
    initWidget(widgetConfig, context) {
        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-audienceOverview",
            ["marketresearch", "digitalmarketing"],
            this._swNavigator,
        );
        this.viewOptions.hook = {
            component: "WsWebTrafficAndEngagement",
            hookModal: "WebMarketAnalysisOverviewHomepage",
        };
        if (this.isAdditionWWSixMonthMode && widgetConfig?.properties?.preloaderHeight) {
            widgetConfig.properties.preloaderHeight = "620px";
        }
        const _inputParams = this.params;
        _inputParams.selectedWidgetTab = "Visits";
        _inputParams.mtd = true;
        this.viewOptions.link = this._swNavigator.href(targetState, _inputParams);
        this.viewOptions.target = isSameModule ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking =
            "Traffic And Engagement/" +
            this._$filter("i18n")(widgetConfig.properties.options.ctaButton);
        this.viewOptions.webSourceText = this.getWebSourceText(this.params.webSource);
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    runWidget() {
        if (this.isAdditionWWSixMonthMode) {
            const durationRaw = DurationService.getDurationData("6m");
            this._params.from = durationRaw.forAPI.from;
        }
        super.runWidget();
        setTimeout(() => {
            const params = angular.copy(this._params);
            const metric = this.apiParams.metric || this._widgetConfig.properties.metric;
            const resource = this._widgetResource.resourceByController(
                this._widgetConfig.properties.apiController,
                metric,
            )["Table"];
            resource(params).$promise.then((response) => {
                _.forEach(this.legendItems, (legend, index: number) => {
                    const domain = legend.id;
                    const data: any = _.find(response.Data, { Domain: domain });
                    if (data) {
                        // check if the website is in the black list
                        const totalVisitsParMonth = data.TotalVisits / this.duration;
                        if (totalVisitsParMonth < 5000) {
                            // if the total visits is 0 we wont to present N/A in the data
                            legend.data = totalVisitsParMonth
                                ? minVisitsAbbrFilter()(data.TotalVisits / this.duration)
                                : "N/A";
                            // disabled the legend in the auto compare
                            if (index > 0) {
                                legend.isDisabled = true;
                                legend.hidden = true;
                            }
                        } else {
                            legend.data = this._$filter("abbrNumber")(data.TotalVisits);
                        }
                    }
                });
            });
            // on auto compare we want the legend to be hidden hse default
            if (this.isSingleMode) {
                this.legendItems.map((legend, index) => {
                    legend.hidden = index !== 0;
                });
            }
        });
    }

    setMetadata() {
        super.setMetadata();
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
    }

    get templateUrl() {
        return "/app/components/widget/widget-templates/graph.html";
    }
    ז;

    getTitleTemplate() {
        return "/app/components/widget/containers/widget-custom-title.html";
    }

    public getTitleIcon() {
        const webSrcIconMap = { total: "combined", mobileweb: "mobile-web", desktop: "desktop" };

        if (this._viewData.family === "Website" || this._viewData.family === "Industry") {
            const webSource = this._params.webSource ? this._params.webSource.toLowerCase() : false;

            if (this._widgetConfig.properties.metric === "TopReferrals" && this._params.webSource) {
                return webSrcIconMap[webSource] || "desktop";
            } else if (this._metricConfig.hasWebSource) {
                return webSrcIconMap[webSource] || "combined";
            }
        }
    }

    getWebSourceText = (webSource) => {
        switch (webSource) {
            case "Total":
                return i18nFilter()("wwo.visits.graph.webSource.total");
            case "Desktop":
                return i18nFilter()("wwo.visits.graph.webSource.Desktop");
            case "MobileWeb":
                return i18nFilter()("wwo.visits.graph.webSource.MobileWeb");
            default:
                return webSource;
        }
    };

    isBlackList = (item, data, webSource) => {
        let totalUsers = 0;
        data[item.name][webSource][0].forEach((data) => {
            totalUsers += data.Value;
        });
        return totalUsers / this.duration < 5000;
    };

    getHighChartsConfig(chartOptions, formattedData, data) {
        let webSource = this.swNavigator.$stateParams.webSource;
        // in MobileWeb case fix the webSource to the webSource in the data
        if (webSource === "MobileWeb") {
            webSource = "Mobile Web";
        }
        // if the site as lase then 5000 per month we wont to hide is line in the graph
        for (let i = 1; i < formattedData.length; i++) {
            if (this.isBlackList(formattedData[i], data, webSource)) {
                formattedData[i].visible = false;
            }
        }

        const type = this._params.keys.split(",").length > 1 ? "line" : "area";
        const tooltips = this.getPlotLineIndicators();
        const extendedSeriesOptions = Object.assign(chartOptions, {
            chart: {
                type,
            },
            plotLines: this.getPlotLinesConfig(tooltips, formattedData),
        });
        if (this.isSingleMode) {
            // change the opacity of the graph line for the sites from auto compare
            for (let i = 1; i < formattedData.length; i++) {
                formattedData[i].color = `${formattedData[i].color}66`;
                formattedData[i].marker.symbol = ChartMarkerService.createMarkerStyle(
                    formattedData[i].color,
                ).background;
                formattedData[i].className = "wwo-visits-over-time-graph-auto-compare-line";
                this.legendItems[i].hidden !== false && (formattedData[i].visible = false);
            }
        }
        return this._ngHighchartsConfig.lineGraphWidget(extendedSeriesOptions, formattedData);
    }

    validateData(response: any) {
        if (this.isSingleMode && !_.has(response, this.params.key)) {
            this.widgetState = WidgetState.EMPTY;
            return;
        }
        return super.validateData(response);
    }

    onResize() {
        super.onResize();
    }

    getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "Graph";
        // on Auto compare mode we wont to have only the main site when add to dashboard
        if (this.isSingleMode) {
            const mainSite = widgetModel.key[0];
            widgetModel.key = [];
            widgetModel.key.push(mainSite);
        }
        return widgetModel;
    }
}

WWOVisitsGraphWidget.register();
