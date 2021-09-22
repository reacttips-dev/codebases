import { dateToUTC } from "components/widget/widget-types/ChartWidget";
import { GraphWidget } from "components/widget/widget-types/GraphWidget";
import _ from "lodash";
import dayjs from "dayjs";
import { ChartMarkerService } from "services/ChartMarkerService";
import UIComponentStateService from "services/UIComponentStateService";

export class CategoryShareGraphBaseWidget extends GraphWidget {
    public static getWidgetMetadataType() {
        return "Graph";
    }

    public static getWidgetResourceType() {
        return "SwitchGraph";
    }

    public static getWidgetDashboardType() {
        return "Graph";
    }

    public tableSelection: any[] = [];
    public legendClass;
    public chartMode: "number" | "percent";
    public tableKey: string;
    public showOthersLegend = true;
    public isOneMonth: boolean;
    public othersSerie: any;
    public graphReady = false;
    public storageType = "window";
    protected unsubscribe;

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        // Override the type so that CategoryShareGraphDashboardWidget and TopCategoryShare metric will be generated when exporting this widget to dashboard
        Object.assign(widgetModel, {
            metric: "TopCategoryShare",
            type: "CategoryShareGraphDashboard",
        });
        return widgetModel;
    }

    public changeToPercentage() {
        this.applyPercentageChartConfig(this.chartConfig);
        this.setGraphSeries();
        if (!_.find(this.legendItems, { id: "others" })) {
            this.legendItems = this.legendItems.concat([this.getOthersLegend()]);
        }
        this.applySeriesVisibility();
    }

    public callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        this.onSelectionChange(this.tableSelection);
    }

    public getHighChartsConfig(chartOptions, formattedData) {
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
        const config = this._ngHighchartsConfig.stackedGraphWidget(chartOptions, formattedData, {});

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

    public onSelectionChange(tableSelection: any[]) {
        if (_.isArray(tableSelection)) {
            if (tableSelection.length > 0) {
                const isPercentMode = this.chartMode === "percent";
                this.tableSelection = _.sortBy(tableSelection, (o: any) => o.Share);
                if (!this.originalData) {
                    return;
                }

                //const showOthers = tableSelection.length < _.size(this.originalData);

                this.setGraphSeries();

                this.othersSerie = this.buildOthersSerie(this.chartConfig.series);

                if (this.chartMode === "percent") {
                    this.showOthersSerie();
                }

                if (isPercentMode && this.showOthersLegend) {
                    //this.showOthersSerie();
                    this.changeToPercentage();
                }

                this.legendItems = this.getLegendItems(isPercentMode);

                this.graphReady = true;

                if (
                    this.chartMode === "percent" &&
                    tableSelection.length === _.size(this.originalData)
                ) {
                    this.setYAxisTo100Percent();
                }

                this.setPercentageLabelFormatter();

                //this.widgetToggleUtilityAction(null, this.chartMode);
            } else {
                this.legendItems = [];
                this.chartConfig.series = [];
                this.graphReady = true;
            }
        }
    }

    public getLegendItems(includeOthers) {
        if (typeof includeOthers !== "boolean") {
            includeOthers = this.chartMode === "percent";
            this.hideOthersSerie();
        }
        let legends = [];
        if (this.tableSelection) {
            legends = _.map(this.tableSelection, (selection) => {
                return {
                    id: selection.Domain,
                    name: selection.Domain,
                    color: selection.selectionColor,
                    icon: selection.Favicon,
                    smallIcon: true,
                };
            }).reverse();

            if (includeOthers) {
                legends = legends.concat([this.getOthersLegend()]);
            }
        }
        return legends;
    }

    public widgetToggleUtilityAction(utilityId: any, value: string) {
        if (value === "number") {
            this.chartMode = "number";
            this.changeToAbsoluteNumbers();
            this.hideOthersSerie();
        } else if (value === "percent") {
            this.chartMode = "percent";
            this.showOthersSerie();
            this.changeToPercentage();
        }

        UIComponentStateService.setItem(this.getUIStateKey(), this.storageType, this.chartMode);
    }

    public getUIStateKey() {
        const props = this.getProperties();
        return `${props.type}`;
    }

    protected formatSeries(obj) {
        return _.map(obj, (item: { Key: any; Value: any }) => {
            return [
                dateToUTC(item.Key),
                item.Value[this.chartMode === "number" ? "Absolute" : "Share"],
            ];
        });
    }

    protected cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    protected setPercentageLabelFormatter() {
        const config = this.chartConfig;
        const widget = this;
        if (config.yAxis) {
            _.merge(config.yAxis[0], {
                labels: {
                    formatter() {
                        return widget.formatValue(this.value, 0);
                    },
                },
            });
        }
    }

    protected hideOthersSerie(config = this.chartConfig) {
        this.showOthersLegend = false;
        const widget = this;
        _.merge(config.options, { plotOptions: { area: { stacking: "normal" } } });
        if (config.yAxis) {
            this.setPercentageLabelFormatter();

            // remove 'others' serie if present
            const othersSerie = _.findIndex(config.series, { id: "others" });
            if (othersSerie > -1) {
                _.pullAt(config.series, othersSerie);
            }
        }

        if (config.yAxis && config.options) {
            config.yAxis[0].tickPositions = null;
            config.yAxis[1].tickPositions = null;

            config.yAxis[0].max = null;
            config.yAxis[1].max = null;
            config.options.plotOptions.area.marker.enabled = this.markerEnabled();
        }
    }

    protected setMetadata(response = [{ data: [] }]) {
        const widgetProp = this._widgetConfig.properties;
        const chartOptions: any = Object.assign(
            {
                type: "Line",
                markerEnabled: this._params.timeGranularity === "Daily" ? true : null,
                format: this._metricTypeConfig.y_axis.format,
                formatParameter: this._metricTypeConfig.y_axis.formatParameter,
                reversed: this._metricTypeConfig.y_axis.reversed === "True",
                height: widgetProp.height,
                stacked: true,
                legendAlign: this._viewOptions.legendAlign,
                hideMarkersOnDaily: this._metricTypeConfig.properties.hideMarkersOnDaily || null,
            },
            widgetProp.chartOptions || {},
        );
        this.metadata = { chartOptions };
    }

    protected getChartSeries(unorderedData: any, compareItemsKeys: string[]): any[] {
        // Workaround to create config properties with actual data
        return unorderedData
            ? super.getChartSeries(unorderedData, Object.keys(unorderedData).slice(0, 1))
            : [];
    }

    protected getOthersLegend() {
        return {
            id: "others",
            name: "Others",
            color: "#E6E6E6",
            smallIcon: true,
            hidden: false,
            legendClass: "legend-item-others",
            onClick: (isHidden) => {
                if (isHidden) {
                    this.hideOthersSerie();
                } else {
                    this.showOthersSerie();
                }
            },
        };
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/category-share.html`;
    }

    protected setGraphSeries() {
        const series = [];
        this.tableSelection.forEach((selection) => {
            series.push(this.addSeries(selection.Domain, selection.selectionColor));
        });

        this.chartConfig.series = series;
    }

    protected addSeries(key: string, color: string) {
        const serie: any = super.getChartSeries(this.originalData, [key])[0];
        serie.color = color;
        serie.marker = {
            symbol: `url(${ChartMarkerService.createMarkerSrc(color)})`,
        };
        return serie;
    }

    private showOthersSerie(config = this.chartConfig) {
        this.showOthersLegend = true;
        _.merge(config.options, {
            plotOptions: {
                area: {
                    marker: {
                        enabled: this.markerEnabled(),
                    },
                },
            },
        });

        config.series.push(this.othersSerie);
        this.setYAxisTo100Percent(config);
    }

    private setYAxisTo100Percent(config = this.chartConfig) {
        // set legends in yAxis to 0,20%,40%,60%,80%,100%
        config.yAxis[0].tickPositions = [0, 0.2, 0.4, 0.6, 0.8, 1];
        config.yAxis[1].tickPositions = [0, 0.2, 0.4, 0.6, 0.8, 1];
    }

    protected markerEnabled() {
        return this.isOneMonth && this._params.timeGranularity === "Monthly";
    }

    private buildOthersSerie(series = []) {
        if (series.length === 0) {
            return {};
        }

        const copy = _.map(series[0].data, (d) => {
            return [d[0], 1];
        });
        return Object.assign({}, series[0], {
            data: copy,
            yAxis: 1,
            color: "#E6E6E6",
            zIndex: 0,
            id: "others",
            name: "Others",
            visible: true,
        });
    }

    private changeToAbsoluteNumbers() {
        this.applyAbsoluteNumberChartConfig(this.chartConfig);
        this.setGraphSeries();
        _.remove(this.legendItems, (item: any) => item.id === "others");
        this.applySeriesVisibility();
    }

    protected applyAbsoluteNumberChartConfig(config) {
        _.forEach(config.yAxis, (axis) => {
            axis.ceiling = null;
            axis.tickPositions = null;
        });
    }

    protected applyPercentageChartConfig(config) {
        _.forEach(config.yAxis, (axis) => {
            axis.ceiling = 1;
        });
    }

    protected formatValue(value, param = null) {
        if (this.chartMode === "number") {
            return this._$filter("abbrNumber")(value, param);
        } else if (this.chartMode === "percent") {
            return this._$filter("percentagesign")(value, param);
        }
    }

    // set visibility state of series according to the legends.
    // we need it when we change the series to different type of data
    private applySeriesVisibility() {
        if (this.chartMode === "percent") {
            this.showOthersSerie();
        }
        const series = this.chartConfig.series;
        const legends = this.legendItems;
        series.forEach((serie) => {
            const matchedLegend: any = _.find(legends, { id: serie.name });
            if (matchedLegend) {
                serie.visible = !matchedLegend.hidden;
            }
        });
    }
}
