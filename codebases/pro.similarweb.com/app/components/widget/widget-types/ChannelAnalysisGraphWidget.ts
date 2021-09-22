import { colorsPalettes } from "@similarweb/styles";
import angular from "angular";
import _ from "lodash";
import dayjs from "dayjs";
import DurationService from "services/DurationService";
import { ChannelAnalysisExporter } from "../../../exporters/ChannelAnalysisExporter";
import { i18nFilter } from "../../../filters/ngFilters";
import { ChartMarkerService } from "../../../services/ChartMarkerService";
import { dateToUTC } from "./ChartWidget";
import { GraphWidget } from "./GraphWidget";
import { WidgetState } from "./Widget";
import { CHART_COLORS } from "constants/ChartColors";

/**
 * Created by Eran.Shain on 11/28/2016.
 */
export class ChannelAnalysisGraphWidget extends GraphWidget {
    protected dataMode = "number"; // "real_numbers";
    protected utilityNumberPercentName = "number-percent";
    public static $inject = ["chosenSites", "$filter", "channelTranslationService"];
    protected _chosenSites;
    protected _channelTranslationService;
    protected _$filter;
    public customLegendTemplate: string;

    protected getToolTipFormatSettings(dataMode): any {
        switch (dataMode) {
            case "number":
                return {
                    tooltipFormat: "minVisitsAbbr",
                };
            case "percent":
                return {
                    tooltipFormat: "percentagesign",
                    formatParams: [2],
                };
        }
    }

    protected formatSeries(obj) {
        obj.sort((a, b) => (b.Key < a.Key ? 1 : -1));
        return _.map(obj, (item: { Key: any; Value: any }) => {
            return [dateToUTC(item.Key), item.Value];
        });
    }

    public getChartSeries(unorderedData: any, compareItemsKeys: string[] = null): any[] {
        const series = super.getChartSeries(unorderedData, compareItemsKeys);
        let seriesColorByName = CHART_COLORS.trafficSourcesColorsBySourceMMX;
        if (this._chosenSites.isCompare()) {
            seriesColorByName = this._chosenSites
                .sitelistForLegend()
                .reduce((agg, { name, color }) => {
                    return {
                        ...agg,
                        [name]: color,
                    };
                }, {});
        }

        return series.map((item) => {
            return {
                ...item,
                color: seriesColorByName[item.name],
                marker: {
                    symbol: ChartMarkerService.createMarkerStyle(
                        seriesColorByName[item.name] || item.color,
                    ).background,
                },
            };
        });
    }

    public getHighChartsConfig(chartOptions, formattedData) {
        const tooltips = this.getPlotLineIndicators();
        const durationStr = this._swNavigator.getParams().duration;
        const durationRaw = DurationService.getDurationData(durationStr).raw;
        const monthDiff = durationRaw.to.diff(durationRaw.from, "months");
        const isOneMonth = monthDiff < 2;
        _.merge(chartOptions, this.getToolTipFormatSettings(this.dataMode));
        switch (this.dataMode) {
            case "number":
                return this._ngHighchartsConfig.lineGraphWidget(
                    _.merge({}, chartOptions, {
                        stacked: false,
                        format: "number",
                        tooltipFormat: chartOptions.tooltipFormat,
                        chart: {
                            spacing: [0, 10, 17, 0],
                            marginTop: 30,
                        },
                        tooltip: this.getToolTipSettings(chartOptions),
                        xAxis: {
                            labels: {
                                y: 30,
                            },
                            plotLines: this.getPlotLinesConfig(tooltips, formattedData),
                        },
                        plotOptions: {
                            line: {
                                marker: {
                                    enabled: this._widgetConfig.timeGranularity !== "Daily",
                                },
                            },
                        },
                    }),
                    formattedData,
                );
            case "percent":
                if (isOneMonth) {
                    return this._ngHighchartsConfig.lineGraphWidget(
                        _.merge({}, chartOptions, {
                            stacked: false,
                            tooltip: this.getToolTipSettings(chartOptions),
                            yAxis: {
                                endOnTick: false, // don't change! fixes #SIM-14215
                                ceiling: 1.02, // don't change! fixes #SIM-14215
                                max: null,
                                labels: {
                                    formatter() {
                                        return `${Math.floor(100 * (this.value || 0))}%`;
                                    },
                                },
                            },
                            xAxis: {
                                labels: {
                                    y: 30,
                                },
                                plotLines: this.getPlotLinesConfig(tooltips, formattedData),
                            },
                            chart: {
                                spacing: [0, 10, 17, 0],
                                marginTop: 30,
                            },
                            plotOptions: {
                                line: {
                                    marker: {
                                        enabled: this._widgetConfig.timeGranularity !== "Daily",
                                    },
                                },
                            },
                        }),
                        formattedData,
                    );
                } else {
                    return this._ngHighchartsConfig.stackedGraphWidget(
                        _.merge({}, chartOptions, {
                            stacked: true,
                            chart: {
                                spacing: [0, 10, 17, 0],
                                marginTop: 30,
                            },
                            plotOptions: {
                                area: {
                                    marker: {
                                        enabled: isOneMonth,
                                    },
                                },
                            },
                            tooltip: this.getToolTipSettings(chartOptions),
                            yAxis: {
                                gridZIndex: 5,
                                endOnTick: false, // don't change! fixes #SIM-14215
                                labels: {
                                    formatter() {
                                        return `${Math.floor(100 * (this.value || 0))}%`;
                                    },
                                },
                                ceiling: 1.02, // don't change! fixes #SIM-14215
                                max: null,
                            },
                            xAxis: {
                                type: "datetime",
                            },
                        }),
                        formattedData,
                    );
                }
        }
    }

    protected getPlotLineIndicators() {
        const indicators = [];
        if (this._params.webSource === "MobileWeb") {
            indicators.push({
                date: this._swSettings.getDataIndicators("MOBILE_WEB_DATA_START"),
                tooltipCb: this.getPlotLineDefaultConfig.bind(this),
            });
        }
        return indicators;
    }

    protected getPlotLineDefaultConfig(data, date, message) {
        if (data.length === 0) {
            return {};
        }
        const tooltipMessage = message || i18nFilter()("custom.tooltip.mmx.mobileweb");
        const tooltipTitle = message || i18nFilter()("custom.tooltip.mmx.mobileweb.title");
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

    public runWidget() {
        const defaultItem: any = _.get(
            this.utilityGroups,
            "[0].utilities[0].properties.defaultItem",
        );
        if (defaultItem) {
            this.dataMode = defaultItem;
        }
        this.customLegendTemplate = `/app/pages/website-analysis/traffic-sources/mmx/engagement-widgets-legend-single.html`;
        if (this._chosenSites.isCompare()) {
            this.customLegendTemplate = `/app/pages/website-analysis/traffic-sources/mmx/engagement-widgets-legend-compare.html`;
        }
        super.runWidget();
    }

    public widgetToggleUtilityAction(utility, value) {
        this.dataMode = value;
        this.getData();
        /* this.widgetState = WidgetState.LOADING;
         this._$timeout(()=>{
         this.getData();
         },1000);*/
    }

    public initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        this.updateApiParams({
            timeGranularity: widgetConfig.timeGranularity,
        });
    }

    public getToolTipSettings(options) {
        const $filter = this._$filter,
            that = this;
        return {
            borderColor: "#fff",
            borderWidth: 0,
            shadow: true,
            formatter() {
                let from = dayjs.utc(this.x),
                    to = from.clone(),
                    date,
                    lines = [],
                    sum = 0,
                    isTooltipSum = options.viewOptions.sumTooltipValues && this.points.length > 1;
                const colors = CHART_COLORS.trafficSourcesColorsBySourceMMX;

                const channelToColorFallback = that._chosenSites.isCompare()
                    ? that._chosenSites.sitelistForLegend().reduce((agg, { name, color }) => {
                          return {
                              ...agg,
                              [name]: color,
                          };
                      }, {})
                    : _.mapValues(that.originalData.Total, (val, channelName) => {
                          return colors[channelName];
                      });
                const formatParam = angular.isNumber(options.formatParameter)
                    ? options.formatParameter
                    : options.yPercentPrecision;
                switch (options.timeGranularity) {
                    case "Daily":
                        date = from.format("dddd, MMM DD, YYYY");
                        break;
                    case "Weekly":
                        const t: any = _.last(this.points[0].series.points);
                        const isLast = t.x == this.x;
                        let toWeek = to.add(6, "days");
                        // show partial week in case of last point when start of week and end of week aren't in the same month.
                        if (isLast) {
                            if (from.month() != toWeek.month()) {
                                toWeek = from.clone().endOf("month").startOf("day").utc();
                            }
                        }
                        date =
                            "From " +
                            from.format("MMM DD, YYYY") +
                            " to " +
                            toWeek.format("MMM DD, YYYY");
                        break;
                    default:
                        date = from.format("MMMM YYYY");
                        break;
                }
                lines.push(
                    '<div class="date">' + date + "</div>" + '<div class="line-seperator"></div>',
                );
                const pointsForTooltip = Object.keys(channelToColorFallback).map((channelName) => {
                    const point = _.find(this.points, function (point) {
                        const seriesName =
                            point.series.name.indexOf("$") != -1
                                ? point.series.name
                                      .replace("*", "")
                                      .replace("$", "")
                                      .replace(/_/g, " ")
                                      .replace("~", " > ")
                                : point.series.name;
                        return seriesName === channelName;
                    });
                    if (point) {
                        sum += point.point.y;
                    }
                    return Object.assign(
                        {},
                        {
                            color: channelToColorFallback[channelName],
                            name: channelName,
                            value: "NA",
                        },
                        point
                            ? {
                                  value: point.point.y,
                              }
                            : {},
                    );
                });
                const tooltipPointMarkup = pointsForTooltip.map((point: any) =>
                    that.getToltipPointMarkup(point, options),
                );
                lines.push(tooltipPointMarkup.join(""));
                if (isTooltipSum) {
                    lines.push(
                        '<div><span style="margin-left: 2px;font-size: 12px;vertical-align: middle;"><b>Total</b> ' +
                            $filter(options.format)(sum, formatParam) +
                            "</b></span></div>",
                    );
                }
                return lines.join("");
            },
            style: {
                // forcing refresh on tooltip due to a bug in highcharts-ng
                // https://github.com/pablojim/highcharts-ng/issues/335
                id: options.metric,
                opacity: 1,
            },
            format: options.format,
            timeGranularity: options.timeGranularity,
        };
    }

    public getToltipPointMarkup(point, options) {
        const $filter = this._$filter;
        return `<div>
                    <span class="item-marker" style="background: ${point.color}"></span>
                    <span class="item-name">${point.name}
                        <span class="item-value" style="margin-left:4px;color:${
                            point.color
                        };font-weight: bold;">${$filter("noData")(
            $filter(options.tooltipFormat || options.format)(
                point.value,
                ...(options.formatParams || []),
            ),
            "^((00:00:00)|0|null|N\\/A)$",
            "NA",
        )}</span>
                    </span>
                </div>`;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
    }

    public getMetricWinner(list) {
        return _.max(_.values(list));
    }

    public shouldDisableLegend(item) {
        return /^(na|0%?)$/i.test(item.data);
    }

    public getLegendItems(seriesData) {
        if (this.originalData) {
            const winner = this.getMetricWinner(
                _.pickBy(this.originalData.Total, (val) => this.ensureNumberDataType(val)[0] > 0),
            );
            const totalOfTotal = _.sum(_.values(this.originalData.Total));
            return _.map(this.originalData.Total, (val, channelName) => {
                const [channelValue, total] = this.ensureNumberDataType(val, totalOfTotal);
                const item = _.merge(
                    {
                        data: this.formatLegendDataPointValue(channelValue, total),
                        // show trophy for the winning item only if more than 1 item exists
                        isWinner:
                            channelValue === winner &&
                            Object.keys(this.originalData.Total).length > 1,
                        id: channelName,
                        name: channelName,
                        showLegendData: true,
                        color: this._chosenSites.isCompare()
                            ? this._chosenSites
                                  .sitelistForLegend()
                                  .find((x) => x.name === channelName)?.color
                            : CHART_COLORS.trafficSourcesColorsBySourceMMX[channelName],
                    },
                    this._chosenSites.isCompare()
                        ? this._chosenSites.getInfo(channelName)
                        : {
                              name: this._$filter("i18n")(
                                  this._channelTranslationService.getKey(channelName),
                              ),
                          },
                );
                item.alwaysDisabled = this.shouldDisableLegend(item);
                return item;
            });
        }
    }

    public ensureNumberDataType(pointValue, totalValue?): [number, number] {
        return [+pointValue || 0, +totalValue || 0];
    }

    public formatGraphDataPointValue(pointValue, totalValue) {
        switch (this.dataMode) {
            case "percent":
                return totalValue && pointValue ? pointValue / totalValue : null;
            case "number":
                return pointValue || null;
        }
    }

    public formatLegendDataPointValue(pointValue, totalValue) {
        switch (this.dataMode) {
            case "percent":
                if (pointValue) {
                    return this._$filter("tinyFractionApproximation")(
                        `${(100 * (pointValue / totalValue)).toFixed(2)}%`,
                        0.01,
                    );
                } else {
                    return "N/A";
                }

            case "number":
                if (pointValue > 0) {
                    return this._$filter("minVisitsAbbr")(pointValue);
                } else {
                    return "N/A";
                }
        }
    }

    public callbackOnGetData(response) {
        this.runProfiling();
        const graphData = _.toPairs(response.Data.BreakDown).reduce(
            (all: any, [date, channels]: [string, { [channel: string]: number }]) => {
                let dateTotal = _.sum(_.values(channels));
                return [
                    ...all,
                    ..._.map(channels, (channelValue, channelName) => {
                        [channelValue, dateTotal] = this.ensureNumberDataType(
                            channelValue,
                            dateTotal,
                        );
                        return {
                            channelName,
                            Key: date,
                            Value: this.formatGraphDataPointValue(channelValue, dateTotal),
                        };
                    }),
                ];
            },
            [],
        );

        const comparedItemKeys: any[] = _.uniq(
            _.map(_.values(graphData), (item: any) => item.channelName),
        );

        return super.callbackOnGetData(
            {
                Data: _.reduce(
                    _.groupBy(graphData, "channelName"),
                    (all, channelValues, channelName) => {
                        all[channelName] = [channelValues];
                        return all;
                    },
                    {},
                ),
            },
            comparedItemKeys,
        );
    }

    public validateData(data) {
        try {
            return (
                "BreakDown" in data &&
                "Total" in data &&
                !_.every(data.Total, (val) => val === null)
            );
        } catch (e) {
            return false;
        }
    }

    public onSeriesToggle() {
        const allHidden = _.every(
            this.legendItems,
            (item: any) => item.hidden || item.alwaysDisabled,
        );
        if (allHidden) {
            const errorMessage = this._chosenSites.isCompare()
                ? "channelanalysis.selectOneDomainError"
                : "mmx.channelanalysis.selectOneSourceError";
            this.widgetState = WidgetState.ERROR;
            this.errorConfig = {
                messageTop: this._$filter("i18n")(errorMessage),
                messageBottom: "",
            };
        } else {
            this.widgetState = WidgetState.LOADED;
        }
    }

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        if (this._chosenSites.isCompare()) {
            angular.extend(widgetModel, { selectedChannel: this._widgetConfig.selectedChannel });
        }
        angular.extend(widgetModel, {
            type: "MmxTrafficShareDashboard",
            metric: "ChannelsAnalysisByTrafficShare",
        });
        return widgetModel;
    }

    public getExporter() {
        return ChannelAnalysisExporter;
    }
}

ChannelAnalysisGraphWidget.register();
