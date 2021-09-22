/**
 * Created by olegg on 05-Sep-16.
 */
import { colorsPalettes } from "@similarweb/styles";
import _ from "lodash";
import DurationService from "services/DurationService";
import { KeywordAnalysisShareOverTimeExporter } from "../../../exporters/KeywordAnalysisShareOverTimeExporter";

import dayjs from "dayjs";
import { i18nFilter } from "../../../filters/ngFilters";
import { ChartMarkerService } from "../../../services/ChartMarkerService";
import { CategoryShareGraphBaseWidget } from "./CategoryShareGraphBaseWidget";
import { dateToUTC } from "./ChartWidget";
import { WidgetState } from "./Widget";

export class KeywordsGraphWidget extends CategoryShareGraphBaseWidget {
    public static $inject = ["sitesResource", "$ngRedux", "$q"];
    protected _$ngRedux;
    private context: string;
    private unSubscribeFromStore: any;
    private selectedSites: any;
    protected legendResources: any;
    public legendItems: any = [];
    private error_base_message: any = this.errorConfig;
    private granularityToggleStatus: "Monthly" | "Weekly" | "Daily";

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
        this.chartMode = "number";
    }

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        //Override the type so that KeywordsGraphDashboard will be generated when exporting this widget to dashboard
        Object.assign(
            widgetModel,
            { metric: this.apiParams.metric, type: "KeywordsGraphDashboard" },
            {
                filters: Object.assign({}, widgetModel.filters, {
                    shareType: this.chartMode === "number" ? "RelativeShare" : "Share",
                }),
            },
        );
        return widgetModel;
    }

    public getStateContext() {
        return `${this.context}_${this.getWidgetConfig().properties.metric}_Table`;
    }

    public initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        this.apiParams.timeGranularity = this.getDefaultGranularity();
        this.granularityToggleStatus = this.granularityToggleStatus || this.getDefaultGranularity();
        this.context = context;
    }

    public updateGraphData() {
        const selectedSitesCount = this.selectedSites.length;
        if (this.apiParams.timeGranularity === "Monthly") {
            this.apiParams = {
                sites:
                    selectedSitesCount > 0
                        ? this.getDomainAndSubdomainsFor(this.selectedSites).join(",")
                        : undefined,
            };
        } else {
            if (selectedSitesCount > 0) {
                this.apiParams = {
                    sites: this.getDomainAndSubdomainsFor(this.selectedSites).join(","),
                };
            }
        }
    }

    public callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        this.onSelectionChange(this.selectedSites);
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
        super.cleanup();
    }

    public canAddToDashboard() {
        return this.apiParams.timeGranularity === "Monthly";
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
                    let timeFrameData = subdomainData;
                    if (this.granularityToggleStatus !== "Monthly") {
                        timeFrameData = subdomainData[this.granularityToggleStatus];
                    }
                    for (let { Key, Value } of timeFrameData) {
                        Value = Value[this.chartMode === "number" ? "RelativeShare" : "Share"] || 0;
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
                index: _.findIndex(
                    this.selectedSites,
                    (site: any) => site.Domain === rootDomainName,
                ),
                zIndex: 1,
            };
        });
    }

    public getHighChartsConfig(chartOptions, formattedData) {
        const { duration } = this._swNavigator.getParams();
        const tooltips = this.getPlotLineIndicators();
        const widgetInstance = this;
        const formatParam = 2;
        const overrideStackedGraphConfig = {
            tooltip: {
                formatter() {
                    const from = dayjs.utc(this.x);
                    const to = from.clone();
                    let date;
                    const lines = [];
                    let sum = 0;

                    switch (widgetInstance._params.timeGranularity) {
                        case "Daily":
                            date = from.format("dddd, MMM DD, YYYY");
                            break;
                        case "Weekly":
                            const isLast = _.last<any>(this.points[0].series.points).x === this.x;
                            let toWeek = to.add(6, "days");
                            // show partial week in case of last point when start of week and end of week aren't in the same month.
                            if (isLast) {
                                if (from.month() !== toWeek.month()) {
                                    toWeek = from.clone().endOf("month").startOf("day").utc();
                                }
                            }
                            date =
                                "From " +
                                from.format("MMM DD, YYYY") +
                                " to " +
                                toWeek.format("MMM DD, YYYY");
                            break;
                        case "Monthly":
                            date = from.format("MMMM YYYY");
                            break;
                    }
                    lines.push(
                        '<div class="date">' +
                            date +
                            "</div>" +
                            '<div class="line-seperator"></div>',
                    );
                    _.forEach(this.points, function (point) {
                        const seriesName =
                            point.series.name.indexOf("$") !== -1
                                ? point.series.name
                                      .replace("*", "")
                                      .replace("$", "")
                                      .replace(/_/g, " ")
                                      .replace("~", " > ")
                                : point.series.name;
                        if (seriesName === "Others") {
                            return;
                        }
                        sum += parseFloat(widgetInstance.formatValue(point.point.y, formatParam));

                        lines.push(
                            '<div><span class="item-marker" style="background: ' +
                                point.series.color +
                                '"></span>' +
                                '<span class="item-name">' +
                                seriesName +
                                '<span class="item-value" style="margin-left:4px;color: ' +
                                point.series.color +
                                ';">' +
                                widgetInstance.formatValue(point.point.y, formatParam) +
                                "</span></span></div>",
                        );
                    });

                    if (widgetInstance.showOthersLegend === true) {
                        lines.push(
                            '<div class="legend-item-others"><span class="item-marker" style="background:#E6E6E6"></span><span class="item-name">others ' +
                                widgetInstance.formatValue(1 - sum / 100, formatParam) +
                                "</span></div>",
                        );
                    }

                    return lines.join("");
                },
            },
        };
        Object.assign(chartOptions, overrideStackedGraphConfig, { reflowTimeout: 750 });
        const extendedChartOptions = Object.assign(
            {},
            chartOptions,
            {
                plotOptions: {
                    series: {
                        marker: {
                            enabled:
                                this.granularityToggleStatus === "Monthly" && duration === "1m",
                        },
                    },
                },
            },
            {
                plotLinesConfig: this.getPlotLinesConfig(tooltips, formattedData),
            },
        );
        const config = this._ngHighchartsConfig.stackedGraphWidget(
            extendedChartOptions,
            formattedData,
            {
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
            },
        );

        config.yAxis = [
            config.yAxis,
            Object.assign({}, config.yAxis, { labels: { enabled: false } }),
        ];

        if (this.chartMode === "number") {
            this.applyAbsoluteNumberChartConfig(config);
        } else {
            this.applyPercentageChartConfig(config);
        }
        return config;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
    }

    protected applyAbsoluteNumberChartConfig(config) {
        _.forEach(config.yAxis, (axis) => {
            axis.ceiling = 1;
        });
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

    public onAppStateChanged = () => {
        const selectedSites = this.getSelectedSites();
        if (selectedSites !== this.selectedSites) {
            if (!Array.isArray(selectedSites)) {
                this.widgetState = WidgetState.ERROR;
                return;
            }
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
    };

    public onWidgetMount($scope) {
        this.selectedSites = this.getSelectedSites();
        this.unSubscribeFromStore = [this._$ngRedux.subscribe(this.onAppStateChanged)];
    }

    public getExporter(): any {
        return KeywordAnalysisShareOverTimeExporter;
    }

    public get excelUrl() {
        const newParams: any = _.merge({}, this._params);
        const metric = newParams.metric;
        if (newParams.metric) {
            delete newParams.metric;
        }
        const excelParams = _.reduce(
            newParams,
            (paramString, paramVal: any, paramKey) => {
                if (paramVal !== undefined) {
                    return `${paramString}${paramKey}=${encodeURIComponent(paramVal)}&`;
                } else {
                    return paramString;
                }
            },
            "",
        );

        return (
            `/widgetApi/KeywordAnalysisOP/${metric}/TrafficDistributionExcel?` +
            _.trimEnd(excelParams, "&")
        );
    }

    protected getPlotLineIndicators() {
        const indicators = [];

        indicators.push({
            date: this._swSettings.getDataIndicators("KEYWORDS_ALGO_CHANGE"),
            tooltipCb: this.getPlotLineDefaultConfig.bind(this),
        });
        if (this.getWidgetConfig().properties.webSource === "MobileWeb") {
            indicators.push({
                date: this._swSettings.getDataIndicators("KEYWORDS_MOBILE_ALGO_CHANGE"),
                tooltipCb: (data, date) => {
                    return this.getPlotLineDefaultConfig(
                        data,
                        date,
                        i18nFilter()("custom.tooltip.keywords.mobile.algochange.message"),
                        i18nFilter()("custom.tooltip.keywords.mobile.algochange.title"),
                    );
                },
            });
        }

        return indicators;
    }

    protected getPlotLineDefaultConfig(data, date, message, messageTitle = null) {
        if (data.length === 0) {
            return {};
        }
        const tooltipMessage = message || i18nFilter()("custom.tooltip.keywords.algochange");
        const tooltipTitle =
            messageTitle || message || i18nFilter()("custom.tooltip.keywords.algochange.title");
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

    protected formatSeries(obj) {
        return _.map(obj, (item: { Key: any; Value: any }) => {
            return [dateToUTC(item.Key), item.Value];
        });
    }

    protected formatValue(value, param = null) {
        return this._$filter("percentagesign")(value, param);
    }

    protected setGraphSeries() {
        const series = [];
        this.selectedSites.forEach((selection) => {
            series.push(this.addSeries(selection.Domain, selection.selectionColor));
        });

        this.chartConfig.series = series;
    }

    protected setMetadata() {
        super.setMetadata();
    }

    protected markerEnabled() {
        return false;
    }

    protected addSeries(key: string, color: string) {
        const serie: any = this.getChartSeries(this.originalData).find((d) => d.name === key);
        serie.color = color;
        serie.marker = {
            symbol: `url(${ChartMarkerService.createMarkerSrc(color)})`,
        };
        return serie;
    }

    protected getDefaultGranularity() {
        const diffSymbol = DurationService.getDiffSymbol(
            this.apiParams.from,
            this.apiParams.to,
            "months",
        );
        const diffNumber = parseInt(diffSymbol.replace("m", ""));
        if (diffNumber === 1 && this.apiParams.metric !== "KeywordAnalysisTotal") {
            return "Weekly";
        } else {
            return "Monthly";
        }
    }

    protected timeGranularityUtilityAction(utility, value) {
        this.setExcel(value);
        this.granularityToggleStatus = value;
        const paramsObject = {};
        paramsObject["timeGranularity"] = value;

        // update widget api params only if at least one param has really changed
        if (!_.isEqual(_.pick(this.apiParams, _.keys(paramsObject)), paramsObject)) {
            this.apiParams = paramsObject;
        }
    }
    private setExcel = (value) => {
        const utility = this.utilityGroups[0].utilities.find(({ id }) => id === "chart-export");
        if (utility && utility.properties) {
            utility.properties.hideExcel = value === "Monthly";
        }
    };
}

KeywordsGraphWidget.register();
