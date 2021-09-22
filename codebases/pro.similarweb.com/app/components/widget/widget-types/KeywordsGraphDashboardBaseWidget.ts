/**
 * Created by olegg on 05-Sep-16.
 */
import _ from "lodash";
import { KeywordAnalysisShareOverTimeExporter } from "../../../exporters/KeywordAnalysisShareOverTimeExporter";
import { colorsPalettes } from "@similarweb/styles";
import { GraphWidget } from "./GraphWidget";
import { WidgetState } from "./Widget";
import { i18nFilter } from "../../../filters/ngFilters";
import { dateToUTC } from "./ChartWidget";
export class KeywordsGraphDashboardBaseWidget extends GraphWidget {
    public static $inject = ["sitesResource", "$ngRedux", "$q"];
    protected _$ngRedux;
    private context: string;
    private unSubscribeFromStore: any;
    private selectedSites: any;
    protected legendResources: any;
    public legendItems: any = [];
    private error_base_message: any = this.errorConfig;
    protected shareType: "Share" | "RelativeShare" = "RelativeShare";

    public static getWidgetMetadataType() {
        return "KeywordsGraph";
    }

    public static getWidgetResourceType() {
        return "Graph";
    }

    public static getWidgetDashboardType() {
        return "Graph";
    }

    constructor() {
        super();
    }

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        //Override the type so that KeywordsGraphDashboard will be generated when exporting this widget to dashboard
        Object.assign(widgetModel, { type: "KeywordsGraphDashboard" });
        return widgetModel;
    }

    public getStateContext() {
        return `${this.context}_${this.getWidgetConfig().properties.metric}_Table`;
    }

    public initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        this.context = context;
        //Currently dashboard not support daily/weekly keywords.
        this.apiParams.timeGranularity = "Monthly";
    }

    public runWidget() {
        super.runWidget();
    }

    public updateGraphData() {
        this.apiParams = {
            sites:
                this.selectedSites.length > 0
                    ? this.getDomainAndSubdomainsFor(this.selectedSites).join(",")
                    : undefined,
        };
    }

    protected getDomainAndSubdomainsFor(domains) {
        return _.uniq(
            _.flatten(
                domains.map(({ Domain, Children }) => {
                    Children = (Children || []).slice(0, 10);
                    return [Domain, ...Children.map((childSite) => childSite.Domain)];
                }),
            ),
        );
    }

    public cleanup() {
        if (this.unSubscribeFromStore) {
            this.unSubscribeFromStore.forEach((listener) => {
                if (typeof listener === "function") {
                    listener();
                }
            });
            this.unSubscribeFromStore = [];
        }
    }

    protected getLegendResources(siteList) {
        return siteList.reduce((allSites, site) => {
            allSites[site.Domain] = {
                id: site.Domain,
                name: site.Domain,
                color: site.selectionColor,
                icon: site.Favicon || "/Images/autocomplete-default.png",
                smallIcon: true,
                Share: site.Share,
            };
            return allSites;
        }, {});
    }

    private sortSitesByTrafficShare(selectedSites) {
        return _.sortBy(selectedSites, (site) => site.Share); // sort Descending
    }

    protected updateLegendItems() {
        this.legendItems = _.sortBy(_.values(this.legendResources), (site: any) => -1 * site.Share);
        this.setUtilityData("legendItems", this.legendItems);
    }

    protected getChartSeries(unorderedData: any): any[] {
        this.shareType = this.apiParams.shareType || "RelativeShare";
        return (this.selectedSites || []).map((rootDomain) => {
            const { Domain: rootDomainName } = rootDomain;
            const legendItem = this.legendResources[rootDomainName];
            const domains = this.getDomainAndSubdomainsFor([rootDomain]);
            const a = _.pick<any, any>(unorderedData, domains);
            const b = _.map(a, (subdomain) => subdomain[Object.keys(subdomain)[0]]);
            const c = _.flatten(b);
            const dataForRootDomain = _.reduce(
                c,
                (domainResultAccumulator, subdomainData: any) => {
                    for (let { Key, Value } of subdomainData) {
                        Value = Value[this.shareType] || 0;
                        domainResultAccumulator[Key] = domainResultAccumulator[Key] || 0;
                        domainResultAccumulator[Key] = domainResultAccumulator[Key] + Value;
                    }
                    return domainResultAccumulator;
                },
                {},
            );

            const seriesData = _.map(_.toPairs(dataForRootDomain), ([Key, Value]) => ({
                Key,
                Value,
            }));

            return {
                name: rootDomainName,
                showInLegend: false,
                color: legendItem && legendItem.color,
                seriesName: rootDomainName,
                data: this.formatSeries(seriesData),
                marker: {
                    symbol: "circle",
                    lineWidth: 1,
                    color: legendItem && legendItem.color,
                },
                index: _.findIndex(
                    this.selectedSites,
                    (site: any) => site.Domain === rootDomainName,
                ),
            };
        });
    }
    protected getOthersLegend() {
        return {
            id: "others",
            name: "Others",
            color: "#E6E6E6",
            smallIcon: true,
            hidden: false,
            legendClass: "legend-item-others",
        };
    }
    public getLegendItems(seriesData) {
        if (this.shareType === "Share") {
            return this.legendItems.concat([this.getOthersLegend()]);
        } else {
            return this.legendItems;
        }
    }

    protected formatSeries(obj) {
        this.shareType = this.apiParams.shareType || "RelativeShare";
        return _.map(obj, (item: { Key: any; Value: any }) => {
            return [dateToUTC(item.Key), item.Value[this.shareType]];
        });
    }
    private buildOthersSerie(series = []) {
        if (series.length === 0) {
            return [];
        }

        const copy = series[0].data.map((d) => {
            return [d[0], 1];
        });
        return Object.assign({}, series[0], {
            color: "#E6E6E6",
            data: copy,
            seriesName: "others",
            name: "Others",
        });
    }

    getHighChartsConfig(chartOptions, formattedData) {
        const tooltips = this.getPlotLineIndicators();
        const extendedChartOptions = Object.assign({}, chartOptions, {
            plotLinesConfig: this.getPlotLinesConfig(tooltips, formattedData),
        });
        if (this.shareType === "Share") {
            const otherSeries = this.buildOthersSerie(formattedData);
            formattedData = formattedData.map((x) => ({ ...x, index: x.index + 1 }));
            formattedData.push(otherSeries);
        }
        return this._ngHighchartsConfig.stackedGraphWidget(extendedChartOptions, formattedData, {
            options: {
                lang: {
                    noData: `<div class="noData-content noData-content--wide">
                                     <div class="noData-icon">
                                        <i class="sw-icon-no-data"></i>
                                      </div>
                                     <div class="u-uppercase">${this._$filter("i18n")(
                                         "KeywordAnalysis.chart.sot.nodata",
                                     )}</div>
                                     <div class="u-uppercase"></div>
                                  </div>`,
                },
                noData: {
                    useHTML: true,
                },
            },
        });
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
    }

    protected handleDataError(statusCode: number) {
        switch (statusCode) {
            case 400:
            case 404:
            case 500:
            default:
                break;
        }
        // remove bottom message on non-dashboard widgets
        if (!this.dashboardId) {
            delete this.errorConfig.messageBottom;
        }
    }

    public getSelectedSites() {
        return this._$ngRedux.getState().tableSelection[this.getStateContext()];
    }

    public getWidgetFilters() {
        return { sites: this.apiParams.sites };
    }

    public onAppStateChanged($scope) {
        const selectedSites = this.getSelectedSites();
        if (selectedSites !== this.selectedSites) {
            this.selectedSites = this.sortSitesByTrafficShare(selectedSites);
            this.legendResources = this.getLegendResources(this.selectedSites);
            this.updateLegendItems();
            if (this.selectedSites.length) {
                this.updateGraphData();
            } else {
                this.widgetState = WidgetState.EMPTY;
                this.errorConfig = (Object as any).assign({}, this.error_base_message, {
                    messageTop: this._$filter("i18n")("KeywordAnalysis.chart.sot.nodata"),
                    messageBottom: "",
                });
            }
        }
    }

    public onWidgetMount($scope) {
        this.selectedSites = this.getSelectedSites();
        this.unSubscribeFromStore = [
            this._$ngRedux.subscribe(this.onAppStateChanged.bind(this, $scope)),
        ];
    }

    public getExporter(): any {
        return KeywordAnalysisShareOverTimeExporter;
    }

    protected getPlotLineIndicators() {
        const indicators = [];

        indicators.push({
            date: this._swSettings.getDataIndicators("KEYWORDS_ALGO_CHANGE"),
            tooltipCb: this.getPlotLineDefaultConfig.bind(this),
        });

        return indicators;
    }

    protected getPlotLineDefaultConfig(data, date, message) {
        if (data.length === 0) {
            return {};
        }
        const tooltipMessage = message || i18nFilter()("custom.tooltip.keywords.algochange");
        const tooltipTitle = message || i18nFilter()("custom.tooltip.keywords.algochange.title");
        const tooltipTemplate = `
        <span class="mobileweb-algorithm-marker">
            <div 
                id="custom-tooltip" 
                class="mobileweb-algorithm ${`mobileweb-algorithm--${
                    this._ngHighchartsConfig.positionToolipLeftComplex(data, date)
                        ? "left"
                        : "right"
                }`}">
                    <div class="mobile-algorithm-date">${tooltipTitle}</div>
                    <div class="mobile-algorithm-text">${tooltipMessage}</div>
            </div>
        </span>
        `;

        return _.merge({}, this.getPlotLineBaseConfig(), {
            color: colorsPalettes.carbon["100"], // Mobile web algorithm change tooltip
            id: "plotLine-kw-algochange",
            zIndex: 5,
            label: {
                text: tooltipTemplate,
            },
        });
    }
}

KeywordsGraphDashboardBaseWidget.register();
