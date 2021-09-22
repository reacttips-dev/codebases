/**
 * Created by olegg on 28-Nov-16.
 */
import { IScope } from "angular";
import autobind from "autobind-decorator";
import "charts/MmxTrafficSourcesBar";
import { swSettings } from "common/services/swSettings";
import MmxBarChartDataFetcher from "components/widget/widget-fetchers/MmxBarChartDataFetcher";
import * as _ from "lodash";
import { allTrackers } from "services/track/track";
import categoryService from "common/services/categoryService";
import { MmxBarChartExporter } from "../../../exporters/MmxBarChartExporter";
import DurationService from "services/DurationService";
import dayjs from "dayjs";
import { BarChartWidget } from "./BarChartWidget";
import { WidgetState } from "./Widget";
import { MMXPoPChartContainer } from "pages/website-analysis/traffic-sources/mmx/components/MMXPoPChartContainer";
import React from "react";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { SwTrack } from "services/SwTrack";

export class BarChartMMXWidget extends BarChartWidget {
    protected customLegendTemplate;
    public legendClass;
    protected utilityNumberPercentName = "number-percent";
    private dataMode: string;
    private _chosenSites: any;
    private _MmxTrafficSourcesBar: any;
    private selectedCategoryId: string;
    private $scope: IScope;
    private mmxBarChartPopCompareComponent: any;

    private onLegendToggle?(): void;

    public static $inject = ["chosenSites", "MmxTrafficSourcesBar"];

    constructor() {
        super();
        this.legendClass = "bigNumber-custom";
    }

    initWidget(widgetConfig, context) {
        if (
            widgetConfig.properties.webSource === devicesTypes.MOBILE &&
            DurationService.getDurationData(widgetConfig.properties.duration).raw.from.isBefore(
                dayjs(swSettings.current.resources.NewAlgoMMX),
            ) &&
            DurationService.getDurationData(widgetConfig.properties.duration).raw.to.isAfter(
                dayjs(swSettings.current.resources.NewAlgoMMX),
            )
        ) {
            this.viewOptions.showMmxMobileAlert = true;
        }

        const drilldownState = "competitiveanalysis_website_overview_marketingchannels";
        const currentState = this._swNavigator.current();
        if (currentState.name !== drilldownState) {
            this.viewOptions.link = this._swNavigator.href(drilldownState, {
                ...this._swNavigator.getParams(),
            });
            this.viewOptions.ctaButtonTracking = `${
                widgetConfig.properties.trackName
            }/${this._$filter("i18n")(widgetConfig.properties.options.ctaButton)}`;
            this.viewOptions.target =
                this._swNavigator.getStateModule(currentState) ===
                this._swNavigator.getStateModule(this._swNavigator.getState(drilldownState))
                    ? "_self"
                    : "_blank";
        }

        super.initWidget(widgetConfig, context);
    }

    public runWidget() {
        this.errorConfig = {
            messageBottom: "",
        };
        super.runWidget();
    }

    public reCreateChartConfig() {
        if (this._swNavigator.getParams().comparedDuration) {
            return;
        }
        const _dataFormat = this.dataMode ? this.dataMode : this._defaultDataFormat;
        const bar = new this._MmxTrafficSourcesBar(
            this,
            this.metadata.chartOptions,
            this.originalData,
            _dataFormat,
        );
        this.chartConfig = _.merge({}, bar.getChartConfig(), this.getOptionsChartConfig());
    }

    public callbackOnGetData(response: any) {
        this.$scope.$evalAsync(() => {
            this.runProfiling();
            const utility = this.findUtility(this.utilityNumberPercentName, 0);
            this.dataMode = this.dataMode || _.get(utility, "properties.defaultItem");
            const compareKeys = this._params.keys.split(",");
            this.metadata.chartOptions.isCompare = compareKeys.length > 1;
            this.metadata.chartOptions.viewOptions = this._viewOptions;
            this.metadata.chartOptions.linkParams = this.buildLinkParams();
            this.metadata.chartOptions.currentModule = this._swNavigator.getCurrentModule();
            this.reCreateChartConfig();
            this.updateLegend();
            // eslint-disable-next-line react/display-name
            this.mmxBarChartPopCompareComponent = () =>
                React.createElement(MMXPoPChartContainer, {
                    widget: this,
                });
        });
    }

    @autobind
    public onCategorySelected(category) {
        let { id } = category;
        const { isCustomCategory } = category;
        this.onCategoryChanged(id);
        if (isCustomCategory) {
            id = "*" + id;
        }
        allTrackers.trackEvent("Drop Down", "click", `benchmark comparison/${id}/${this.dataMode}`);
    }

    @autobind
    public onCategoryChanged(id) {
        this.$scope.$evalAsync(() => {
            this.selectedCategoryId = id;
            if (this._swNavigator.getParams().category !== id) {
                this._swNavigator.updateParams({ category: id });
            }
            this.initFetcherFromConfig();
            this.getData();
        });
    }

    @autobind
    public onCategoryToggle(isOpen) {
        const state = isOpen ? "open" : "close";
        allTrackers.trackEvent("Drop Down", state, `benchmark comparison`);
    }

    @autobind
    public updateLegend() {
        const data = this.originalData;
        const isMobileSource = this._swNavigator.getParams().webSource === devicesTypes.MOBILE;
        const isDurationCompare = this._widgetConfig?.properties?.comparedDuration;

        if (!this.isCompare()) {
            this.customLegendTemplate = `/app/components/widget/widget-templates/mmx-data-legend.html`;
            const mainDomain = this._params.keys.split(",")[0];
            this.legendItems = isDurationCompare
                ? []
                : [
                      {
                          showLegendData: true,
                          name: isMobileSource
                              ? "analysis.trafficsources.mobile"
                              : "analysis.trafficsources.desktop",
                          value: data ? data[mainDomain].totalVisits : 0,
                      },
                  ];
        } else {
            this.customLegendTemplate = `/app/pages/website-analysis/traffic-sources/mmx/benchmark-compare-legend.html`;
            const legendItems = super.getLegendItems().map((item) => {
                const itemData = data ? _.get(data[item.id], "totalVisits", 0) : 0;
                const showLegendData = !this.inBenchmarkMode() && !isDurationCompare && itemData;

                return _.merge(
                    {
                        showLegendData,
                        smallIcon: true,
                        data: itemData,
                        format: "minVisitsAbbr",
                    },
                    this._chosenSites.getInfo(item.id),
                );
            });
            if (this.inBenchmarkMode()) {
                const {
                    text,
                    id,
                    icon,
                    parentItem = { id: null },
                } = categoryService
                    .getFlattenedCategoriesList()
                    .find(({ id }) => id === this.selectedCategoryId);
                this.legendItems = [
                    ...legendItems,
                    {
                        showLegendData: false,
                        smallIcon: true,
                        name: text,
                        color: "gray",
                        iconType: "font",
                        isCategoryLegendItem: true,
                        className: `${
                            id.startsWith("*")
                                ? "sw-icon-custom-categories"
                                : `sprite-category ${parentItem.id || id}`
                        }`,
                        id,
                        icon,
                        displayName: text,
                        data: data?.category?.totalVisits,
                        format: "minVisitsAbbr",
                    },
                ];
            } else {
                this.legendItems = legendItems;
            }
        }
    }

    protected inBenchmarkMode() {
        return (
            this.selectedCategoryId &&
            this.selectedCategoryId !== "no-category" &&
            this._swNavigator.getParams().webSource !== "MobileWeb"
        );
    }

    public isCompare() {
        return super.isCompare() || this.inBenchmarkMode();
    }

    public getLegendItems(data) {
        return this.legendItems || [];
    }

    public widgetToggleUtilityAction(utility, value) {
        // this.apiParams.Metric = value;
        this.dataMode = value;
        if (this.legendItems) {
            this.legendItems.forEach((item) => {
                if (item.hidden) {
                    item.hidden = false;
                }
            });
        }
        this.getData();
    }

    get templateUrl() {
        return this._swNavigator.getParams().comparedDuration
            ? "/app/pages/website-analysis/traffic-sources/mmx/mmx-bar-chart-pop.html"
            : "/app/components/widget/widget-templates/barchartdemographics.html";
    }

    public getVisibleSeries() {
        const { series = [] } = this.chartConfig;
        return series.filter((s) => s.data.length && s.visible !== false);
    }

    public getGroupPadding() {
        const visibleItems =
            this._chosenSites.count() -
            _.sumBy(this.legendItems, (item: any) =>
                item.isCategoryLegendItem || item.hidden ? 1 : 0,
            );
        return 0.45 - visibleItems * 0.05;
    }

    public getCategoryBarPointRange() {
        const visibleSeries = this.getVisibleSeries();
        const visibleCountWithoutCategory = visibleSeries.filter((s) => !s.isCategorySeries).length;
        switch (visibleCountWithoutCategory) {
            case 0:
                return 0.5;
            case 1:
                return 1;
            default:
                return 1.5;
        }
    }

    public onSeriesToggle() {
        //this.chartConfig.options.plotOptions.column.groupPadding = this.getGroupPadding();
        const allHidden = _.every(this.legendItems, (item: any) => item.hidden === true);
        if (allHidden) {
            this.widgetState = WidgetState.ERROR;
        } else {
            this.widgetState = WidgetState.LOADED;
        }
        const categorySeries = this.chartConfig.series.find((s) => s.isCategorySeries);
        if (categorySeries) {
            categorySeries.pointRange = this.getCategoryBarPointRange();
        }
    }

    public getOptionsChartConfig() {
        const widget = this;
        return {
            options: {
                chart: {
                    height: 220,
                    margin: [20, 20, 30, 50],
                    spacing: [10, 0, 0, 0],
                },
                yAxis: {
                    min: null,
                    max: widget.dataMode === "percent" ? 100 : null,
                    endOnTick: true,
                },
                plotOptions: {
                    column: {
                        //groupPadding: this.getGroupPadding(),
                        pointPadding: 0.15,
                        pointWidth: null,
                        maxPointWidth: 40,
                        pointRange: 1,
                        grouping: true,
                        dataLabels: {
                            formatter() {
                                const formattedData = widget.formatGraphPoint(
                                    this.point.y,
                                    widget.dataMode,
                                    (point) => `${point.toFixed(2)}%`,
                                    (point) => {
                                        const formattedPoint = widget._$filter("minVisitsAbbr")(
                                            Math.max(point, 1000),
                                        );
                                        return formattedPoint;
                                    },
                                );
                                return formattedData;
                            },
                        },
                    },
                },
                tooltip: {
                    pointFormatter() {
                        const formattedPoint = widget.formatGraphPoint(
                            this.y,
                            widget.dataMode,
                            (point) => (Math.round(point * 100) / 100).toFixed(2) + "%",
                            (point) => widget._$filter("minVisitsAbbr")(point || 0),
                        );
                        const color = this.pointTooltipColor ? this.pointTooltipColor : this.color;
                        return `<span style="color:${color}; font-family: Roboto;">\u25CF </span>${this.series.name}: <span style="font-weight: bold;color:${color};">${formattedPoint}</span><br/>`;
                    },
                    shape: "rect",
                },
            },
        };
    }

    public formatGraphPoint(
        pointValue: number,
        pointDataType: string,
        formatPercent: (point: number) => string,
        formatNumber: (point: number) => string,
    ) {
        if (!pointValue || pointValue <= Number.EPSILON) {
            return "N/A";
        }

        switch (pointDataType) {
            case "number":
                return formatNumber(pointValue);

            case "percent":
                return formatPercent(pointValue);

            default:
                return "N/A";
        }
    }

    public initFetcherFromConfig() {
        let category = categoryService.getCategory(this.selectedCategoryId);
        if (
            !this.allowedCategoryForDuration() ||
            this._swNavigator.getParams().webSource === devicesTypes.MOBILE
        ) {
            category = null;
        }
        this._dataFetcher = MmxBarChartDataFetcher.create(category, this) as any;
    }

    public allowedCategoryForDuration() {
        return swSettings.allowedDuration(
            this._widgetConfig.properties.duration,
            "IndustryAnalysis",
        );
    }

    public getExporter() {
        return MmxBarChartExporter;
    }

    public onWidgetMount($el, $scope) {
        this.$scope = $scope;
        $el.on("click", "[data-ts-category]", (evt) => {
            const trafficSource = evt.target.getAttribute("data-ts-category");
            SwTrack.all.trackEvent(
                "Internal Link",
                "click",
                `Traffic Sources Overview/${trafficSource}`,
            );
        });
        // eslint-disable-next-line prefer-const
        let { category = "no-category", comparedDuration } = this._swNavigator.getParams();
        if (comparedDuration) {
            category = "no-category";
        }

        this.onCategoryChanged(category);
        $scope.$watch("ctrl.widget.selectedCategoryId", this.updateLegend);
    }

    public anyDataAvailable(data = this.originalData || {}) {
        return (
            Object.values(data).filter((item: any) => {
                const { trafficSources = {} } = item || {};
                return !_.isEmpty(trafficSources);
            }).length > 0
        );
    }

    protected validateData(response: any) {
        if (this._swNavigator.getParams().comparedDuration) {
            const websiteName = Object.keys(response.Data || {})[0];
            return (
                websiteName &&
                !_.isEmpty(response.Data[websiteName]) &&
                !_.isEmpty(response.ComparedData[websiteName])
            );
        }

        const validData = this.anyDataAvailable(response);
        if (!validData) {
            this.originalData = {}; // to always make sure a legend is displayed.
            this.updateLegend(); // and make sure the legend items are updated.
            this.errorConfig.messageTop = this._$filter("i18n")(
                "home.dashboards.widget.table.error1",
            );
        } else {
            this.errorConfig.messageTop = this._$filter("i18n")(
                "mmx.channelanalysis.selectOneSourceError",
            );
        }
        return validData;
    }

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.dataMode = this.dataMode;
        widgetModel.type = "BarChartMMXDashboard";
        return widgetModel;
    }
}

BarChartMMXWidget.register();
