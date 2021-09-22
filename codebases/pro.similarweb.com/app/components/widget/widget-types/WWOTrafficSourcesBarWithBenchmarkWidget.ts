import categoryService from "common/services/categoryService";
import { swSettings } from "common/services/swSettings";
import MmxBarChartDataFetcher from "components/widget/widget-fetchers/MmxBarChartDataFetcher";
import * as _ from "lodash";
import { MMXPoPChartContainer } from "pages/website-analysis/traffic-sources/mmx/components/MMXPoPChartContainer";
import React from "react";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { BarChartWidget } from "./BarChartWidget";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
import { SwTrack } from "services/SwTrack";
import { percentageSignFilter } from "filters/ngFilters";
import { WidgetState } from "components/widget/widget-types/Widget";

export class WWOTrafficSourcesBarWithBenchmarkWidget extends BarChartWidget {
    static $inject = ["MmxTrafficSourcesBar", "chosenSites"];
    private mmxBarChartPopCompareComponent: any;
    private dataMode: string;
    private _MmxTrafficSourcesBar: any;
    protected customLegendTemplate;
    private _chosenSites: any;
    private selectedCategoryId: string;
    private categoryId: string;

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    static getWidgetMetadataType() {
        return "BarChart";
    }

    static getWidgetResourceType() {
        return "BarChart";
    }

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-trafficOverview",
            ["marketresearch", "digitalmarketing"],
            this._swNavigator,
        );
        const params = this._swNavigator.getParams();
        this.categoryId = this._chosenSites
            .getInfo(params.key)
            .category?.replace("/", "~")
            .split(" ")
            .join("_");
        this.viewOptions.link = this._swNavigator.href(targetState, {
            ...params,
            category: this.categoryId,
        });
        this.viewOptions.hook = {
            component: "WsWebTrafficChannels",
            hookModal: "WebTrafficChannelsFeature",
        };

        this.viewOptions.target = isSameModule ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking = `${widgetConfig.properties.trackName}/${this._$filter(
            "i18n",
        )(widgetConfig.properties.options.ctaButton)}`;
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    public getCategoryBarPointRange() {
        return 1;
    }

    public initFetcherFromConfig() {
        let category = categoryService.getCategory(this.categoryId);

        this.selectedCategoryId = category?.id;
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
            this._widgetConfig?.properties?.duration,
            "IndustryAnalysis",
        );
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        this.metadata.chartOptions.isCompare = this._chosenSites.isCompare();
        this.metadata.chartOptions.viewOptions = this._viewOptions;
        this.metadata.chartOptions.linkParams = this.buildLinkParams();
        this.reCreateChartConfig();
        this.updateLegend();
        this.mmxBarChartPopCompareComponent = () =>
            React.createElement(MMXPoPChartContainer, {
                widget: this,
            });
    }

    validateData(response: any) {
        if (
            _.every(response, (items) => {
                return _.isEmpty(items.trafficSources);
            })
        ) {
            this.widgetState = WidgetState.EMPTY;
            return;
        }
        return super.validateData(response);
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
                        pointPadding: 0.15,
                        pointWidth: null,
                        maxPointWidth: 40,
                        pointRange: 1,
                        grouping: true,
                        dataLabels: {
                            formatter() {
                                const formattedData = `${percentageSignFilter()(
                                    this.y ? this.y / 100 : null,
                                    1,
                                )}`;
                                return formattedData;
                            },
                        },
                    },
                },
                tooltip: {
                    pointFormatter() {
                        const formattedPoint = `${this.y.toFixed(2)}%`;
                        const color = this.pointTooltipColor ? this.pointTooltipColor : this.color;
                        return `<span style="color:${color}; font-family: Roboto;">\u25CF </span>${this.series.name}: <span style="font-weight: bold;color:${color};">${formattedPoint}</span><br/>`;
                    },
                    shape: "rect",
                },
            },
        };
    }

    public updateLegend() {
        const data = this.originalData;
        const legendDataMetric = "totalVisits";
        const category = categoryService
            .getFlattenedCategoriesList()
            .find(({ id }) => id === this.selectedCategoryId);
        this.customLegendTemplate = `/app/pages/website-analysis/traffic-sources/mmx/benchmark-compare-legend.html`;
        this.legendItems = super.getLegendItems().map((item) => {
            const itemData = data ? _.get(data[item.id], legendDataMetric, 0) : 0;
            const showLegendData = false;

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

        if (category) {
            const { text, id, icon, parentItem = { id: null } } = category;
            this.legendItems = [
                ...this.legendItems,
                {
                    name: text,
                    className: `${
                        id.startsWith("*")
                            ? "sw-icon-custom-categories"
                            : `sprite-category ${parentItem.id || id}`
                    }`,
                    id,
                    icon,
                    displayName: text,
                    isCategoryLegendItem: true,
                    showLegendData: false,
                    data: data.category[legendDataMetric],
                    format: "minVisitsAbbr",
                    smallIcon: true,
                    color: "gray",
                    iconType: "font",
                },
            ];
        }
    }

    get templateUrl() {
        return "/app/components/widget/widget-templates/barchart.html";
    }

    buildLinkUrl() {
        return false;
    }

    //hack for tracking on the link click
    onWidgetMount($el) {
        $el.on("click", "[data-ts-category]", (evt) => {
            const trafficSource = evt.target.getAttribute("data-ts-category");
            SwTrack.all.trackEvent(
                "Internal Link",
                "click",
                `Marketing Mix/Channels Overview/${trafficSource}`,
            );
        });
    }

    getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "BarChart";
        widgetModel.webSource = "Desktop";
        return widgetModel;
    }
}

WWOTrafficSourcesBarWithBenchmarkWidget.register();
