import angular from "angular";
import _, { Dictionary } from "lodash";
import dayjs from "dayjs";
import { ChartMarkerService } from "services/ChartMarkerService";
import DurationService from "services/DurationService";
import widgetSettings from "components/dashboard/WidgetSettings";

import { SWItem, IWidgetModel } from "./Widget";
import { ChartWidget, dateToUTC } from "./ChartWidget";
import { CHART_COLORS } from "constants/ChartColors";

type datedValue = {
    Key: string;
    Value: number;
};
type periodOverPeriodDataPoint = {
    Values: datedValue[];
    Change: number[];
};
type siteData = {
    Desktop?: periodOverPeriodDataPoint[];
    "Mobile Web"?: periodOverPeriodDataPoint[];
    Total?: periodOverPeriodDataPoint[];
};

export abstract class PeriodOverPeriodBase extends ChartWidget {
    static $inject = [];

    constructor() {
        super();
    }

    static getWidgetDashboardType() {
        return "BarChart";
    }

    static getWidgetMetadataType() {
        return "ComparedBar";
    }

    static getWidgetResourceType() {
        return "GraphPOP";
    }
    public granularities;
    public periodOverPeriodLegendItems;
    public mobileWebAlgoChangePlotLineValue = null;
    public periodOverPeriodLegend = true;
    public chartType: string;
    private wasCombined: boolean;
    customLegendTemplate = "/partials/directives/comparedDurationLegend.html";

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        this.granularities = { Daily: false, Weekly: false };
        this.wasCombined = this.apiParams.webSource == "Combined";
    }

    public getSeriesColor = ({ seriesName, index }) => {
        seriesName = seriesName.replace(" ", "");
        let colorSource = CHART_COLORS.periodOverPeriod[seriesName];
        if (seriesName !== this.apiParams.webSource) {
            colorSource =
                CHART_COLORS.periodOverPeriod[seriesName + this.apiParams.webSource] ?? colorSource;
        }
        return colorSource[index];
    };

    protected getChartSeries(
        unorderedData: Dictionary<siteData>,
        compareItemsKeys: string[] = null,
    ): any[] {
        const series = [];
        const durationObjectWithoutPermissions = DurationService.getDurationData(
            this._widgetConfig.properties.duration,
            this._widgetConfig.properties.comparedDuration,
            null,
            false,
        );
        const durations = [
            {
                range: DurationService.createRange(
                    durationObjectWithoutPermissions.raw.from,
                    durationObjectWithoutPermissions.raw.to,
                    "months",
                ),
            },
            {
                range: DurationService.createRange(
                    durationObjectWithoutPermissions.raw.compareFrom,
                    durationObjectWithoutPermissions.raw.compareTo,
                    "months",
                ),
            },
        ];

        compareItemsKeys =
            compareItemsKeys ||
            _.map(this.viewData.key, function (key: SWItem) {
                return key.id ? key.id : key.name;
            });

        // loop over domains
        for (let i = 0; i < compareItemsKeys.length; i++) {
            const key = compareItemsKeys[i];
            const dataArrays = unorderedData[key];

            // loop over devices
            angular.forEach(
                dataArrays,
                (seriesArray: periodOverPeriodDataPoint[], seriesName: string) => {
                    //loop over durations in reversed order (compared duration before main duration)
                    _.forEachRight(durations, (duration, index) => {
                        const serie: any = {};

                        serie.name = seriesName;
                        serie.data = _.map(
                            seriesArray,
                            (point: periodOverPeriodDataPoint, pointIndex: number) => {
                                const dataPoint = point.Values[index];
                                // use _.isNumber since we need to handle 0 not like invalid point
                                if (_.isNumber(dataPoint.Value)) {
                                    this.checkForMobileWebAlgoChange(point.Values[index].Key);
                                    return {
                                        y: point.Values[index].Value,
                                        key: point.Values[index].Key,
                                        change: point.Change[durations.length - index - 1],
                                    };
                                } else {
                                    serie.hasInvalidPoints = true;

                                    return {
                                        y: null,
                                        key: duration.range[pointIndex],
                                        invalid: true,
                                    };
                                    //SIM-24964: null value should not appear on graph
                                }
                            },
                        );

                        serie.stack = index;
                        serie.color = this.getSeriesColor({ seriesName, index });
                        serie.marker = {
                            symbol: ChartMarkerService.createMarkerStyle(serie.color).background,
                        };
                        series.push(serie);
                    });
                },
            );
        }

        return series;
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        this.mergeGAVerifiedFlag(response);
        this.setChartConfig(response);
        this.legendItems = this.getLegendItems();
        this.periodOverPeriodLegendItems = this.dashboardId ? this.getLegendItems(null) : [];
    }

    setMetadata() {}

    getLegendItems(dashboardId: string = this.dashboardId) {
        if (dashboardId) {
            return super.getLegendItems();
        } else {
            const legends = [];
            const series = _.map(this.chartConfig.series, (serie) => {
                const serieObj: any = _.pick(serie, ["name", "color", "stack"]);
                serieObj.name = this._$filter("i18n")(
                    `websources.${serieObj.name.toLowerCase().replace(/ /g, "")}`,
                );
                return serieObj;
            });
            const groupedSeries = _.groupBy<any>(series, "stack");
            const seriesTitles = _.clone(this.durationObject.forWidget);
            for (const key in groupedSeries) {
                legends.push({
                    name: seriesTitles[parseInt(key)],
                    color: groupedSeries[key][0].color,
                    items: groupedSeries[key].reverse(),
                });
            }
            return legends.reverse();
        }
    }

    protected validateData(response: any) {
        return true;
    }

    onResize() {}

    get templateUrl() {
        return `/app/components/widget/widget-templates/barchart.html`;
    }

    get viewOptions() {
        let vo = this._viewOptions;
        vo.hideDurationSubtitle = true;
        return vo;
    }

    private _onInvalidColumnClick(event) {
        if (event.point.invalid) {
            this._openHook();
        }
    }

    private _openHook() {}

    public setChartConfig(response: any) {
        const _response = response || { Data: this.originalData };
        switch (this.chartType) {
            case "column":
                this.setColumnChartConfig(_response);
                break;
            case "line":
                this.setLineChartConfig(_response);
                break;
        }
    }

    private checkForMobileWebAlgoChange(dateKey) {
        this.mobileWebAlgoChangeDate = this._swSettings.getDataIndicators("MOBILE_WEB_ALGO_CHANGE");
        const hasMobileWebAlgoChangeDate =
            this._metricTypeConfig.properties.options.mobileWebAlgoChangeDate ||
            this._widgetConfig.properties.options.mobileWebAlgoChangeDate;
        if (hasMobileWebAlgoChangeDate && this.apiParams.webSource !== "Desktop") {
            const utcDate = dateToUTC(this.mobileWebAlgoChangeDate);
            if (dateToUTC(dateKey) === utcDate) {
                this.mobileWebAlgoChangePlotLineValue = dayjs
                    .utc(dateKey, "YYYY-MM-DD")
                    .format("MMM");
            }
        }
    }

    private setColumnChartConfig(response: any) {
        const sitesData: Dictionary<siteData> = response.Data;
        const series = this.getChartSeries(sitesData);
        const categories = _.map(series[0].data, function (point: any) {
            return dayjs.utc(point.key, "YYYY-MM-DD").format("MMM");
        });
        this._metricTypeConfig = widgetSettings.getMetricWidgetMetadata(
            this.apiParams.metric,
            this._widgetConfig.properties.type,
            this._widgetConfig.properties.key.length > 1,
        );
        this.chartConfig = this._ngHighchartsConfig.durationCompareBar(series, {
            format: this._metricTypeConfig["y_axis"].format,
            categories: categories,
            height: this._widgetConfig.properties.height,
            showTotal:
                this.apiParams.keys.split(",").length == 1 &&
                this.apiParams.webSource == "Combined",
            metric: this.apiParams.metric,
            onInvalidColumnClick: this._onInvalidColumnClick,
            isOverlapping: _.result(this, "_widgetConfig.properties.comparedDuration") == "12m",
        });
        this.chartConfig["export"] = {
            title: this.getViewData().title,
            csvUrl: this.excelUrl,
        };
        this.chartConfig.exportPng = (chartTitle) => {
            this._pngExportService.export(this.chartConfig, chartTitle, this._params);
        };
    }

    private setLineChartConfig(response: any) {
        const sitesData: Dictionary<siteData> = response.Data;
        const series = this.getChartSeries(sitesData);

        const tooltips = this.getPlotLineIndicators();
        const plotLinesConfig = this.getPlotLinesConfig(tooltips, series);

        const categories = _.map(_.last(series).data, function (point: any) {
            return dayjs.utc(point.key, "YYYY-MM-DD").format("MMM");
        });
        this._metricTypeConfig = widgetSettings.getMetricWidgetMetadata(
            this.apiParams.metric,
            this._widgetConfig.properties.type,
            this._widgetConfig.properties.key.length > 1,
        );
        this.chartConfig = this._ngHighchartsConfig.durationCompareLine(series, {
            format: this._metricTypeConfig["y_axis"].format,
            categories: categories,
            height: this._widgetConfig.properties.height,
            showTotal:
                this.apiParams.keys.split(",").length == 1 &&
                this.apiParams.webSource == "Combined",
            metric: this.apiParams.metric,
            onInvalidColumnClick: this._onInvalidColumnClick,
            plotLines: plotLinesConfig,
            mobileWebAlgoChangePlotLine: this.mobileWebAlgoChangePlotLineValue,
        });
        this.chartConfig["export"] = {
            title: this.getViewData().title,
            csvUrl: this.excelUrl,
        };
        this.chartConfig.exportPng = (chartTitle) => {
            this._pngExportService.export(this.chartConfig, chartTitle, this._params);
        };
    }

    public chartToggleUtilityAction(utility: any, value: string) {
        if (utility.id == "chart-toggle") {
            this.chartType = value;
            const metricConfig = widgetSettings.getMetricProperties(this.apiParams.metric);
            switch (this.chartType) {
                case "column":
                    if (this.wasCombined) {
                        if (
                            metricConfig.useCombinedInsteadOfTotal &&
                            this.apiParams.webSource == "Total"
                        ) {
                            this.apiParams = Object.assign({}, this.apiParams, {
                                webSource: "Combined",
                            });
                        }
                        // no need to change api params
                        else {
                            this.setChartConfig(null);
                        }
                    } else {
                        if (
                            this.apiParams.metric == "EngagementVisits" &&
                            this.apiParams.webSource == "Total"
                        ) {
                            this.apiParams = Object.assign({}, this.apiParams, {
                                webSource: "Combined",
                            });
                        }
                        // no need to change api params
                        else {
                            this.setChartConfig(null);
                        }
                    }

                    break;
                case "line":
                    // currently line graph doesn't support Combined
                    if (this.apiParams.webSource == "Combined") {
                        this.apiParams = Object.assign({}, this.apiParams, { webSource: "Total" });
                    }
                    // no need to change api params
                    else {
                        this.setChartConfig(null);
                    }
                    break;
            }
        }
    }

    public getWidgetModel() {
        const _model: IWidgetModel = super.getWidgetModel();
        switch (this.chartType) {
            case "column":
                _model.type = "ComparedBar";
                break;
            case "line":
                _model.type = "ComparedLine";
                break;
        }

        return _model;
    }
}
