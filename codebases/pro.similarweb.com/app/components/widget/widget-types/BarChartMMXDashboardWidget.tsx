/* eslint-disable @typescript-eslint/no-this-alias */
import { IScope } from "angular";
import BarChartMMXDashboardWidgetFilters from "components/widget/widget-filters/BarChartMMXDashboardWidgetFilters";
import { BarChartWidget } from "components/widget/widget-types/BarChartWidget";
import * as _ from "lodash";
import { IPptBarChartRequest } from "services/PptExportService/PptExportServiceTypes";
import {
    IPptSeriesData,
    IPptSlideExportRequest,
} from "services/PptExportService/PptExportServiceTypes";
import { getBarChartWidgetPptOptions } from "../widget-utilities/widgetPpt/PptBarChartWidgetUtils";
import {
    getWidgetSubtitle,
    getWidgetTitle,
    resolveYAxisFormat,
} from "../widget-utilities/widgetPpt/PptWidgetUtils";

export class BarChartMMXDashboardWidget extends BarChartWidget {
    public isPptSupported = () => {
        return this.chartConfig.series && this.chartConfig.series.length > 0;
    };
    private MmxTrafficSourcesBar: any;
    private $scope: IScope;

    private getWidgetDataFormat = (): string => {
        const widgetFormat = this._widgetConfig?.properties?.dataMode
            ? this._widgetConfig.properties.dataMode
            : this._defaultDataFormat || "percent";
        return widgetFormat;
    };

    public getDataForPpt = (): IPptSlideExportRequest => {
        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this, { showEntities: !this.isCompare() }),
            type: "bar",
            details: {
                format: resolveYAxisFormat(this.getWidgetDataFormat()),
                options: getBarChartWidgetPptOptions(),
                data: this.isCompare()
                    ? this.getCompareModeSeriesDataForPpt()
                    : this.getSingleModeSeriesDataForPpt(),
            } as IPptBarChartRequest,
        };
    };

    private getCompareModeSeriesDataForPpt = (): IPptSeriesData[] => {
        const isPercentFormat = this.getWidgetDataFormat() === "percent";

        return this.chartConfig.series.map(
            (
                series: { name: string; color: string; data: Array<{ key: string; y: number }> },
                index: number,
            ) => {
                const { name, data } = series;
                const labels = data.map((point) => point.key);
                const values = data.map((point) => (isPercentFormat ? point.y / 100 : point.y));
                const color = this.chartConfig.options.colors[index];
                return {
                    seriesName: name,
                    seriesColor: color,
                    labels,
                    values,
                };
            },
        );
    };

    private getSingleModeSeriesDataForPpt = (): IPptSeriesData[] => {
        const isPercentFormat = this.getWidgetDataFormat() === "percent";
        const series = this.chartConfig.series[0];

        return series.data.map((record: { key: string; y: number; color: string }) => {
            const yValue = isPercentFormat ? record.y / 100 : record.y;

            return {
                seriesName: record.key,
                seriesColor: record.color,
                labels: [series.name],
                values: [yValue],
            };
        });
    };

    constructor() {
        super();
    }

    static getWidgetMetadataType() {
        return "BarChartMMXDashboard";
    }

    static getWidgetDashboardType() {
        return "BarChart";
    }

    static getFiltersComponent() {
        return BarChartMMXDashboardWidgetFilters;
    }

    get templateUrl() {
        return "/app/components/widget/widget-templates/barchartmmx.html";
    }

    public reCreateChartConfig() {
        const formattedData = this.getChartSeries(this.originalData);
        const bar = new this._Bar(
            this.metadata.chartOptions,
            formattedData,
            this._widgetConfig.properties.dataMode,
            this._params.webSource,
        );
        this.chartConfig = _.merge({}, bar.getChartConfig(), this.getOptionsChartConfig());
    }

    public getChartSeries(unorderedData: any): any {
        if (this._params.webSource === "Desktop") {
            return super.getChartSeries(unorderedData);
        }
        return _.map(unorderedData, function (v, k) {
            return {
                data: _.merge(
                    {
                        Direct: 0,
                        Mail: 0,
                        Search: 0,
                        DisplayAds: 0,
                        Referrals: 0,
                        Social: 0,
                    },
                    v !== null
                        ? {
                              Direct: v["Direct"],
                              Mail: v["Email"],
                              Search: v["Search"],
                              DisplayAds: v["Display Ads"],
                              Referrals: v["Referrals"],
                              Social: v["Social"],
                          }
                        : {},
                ),
                name: k,
            };
        });
    }

    public callbackOnGetData(response: any) {
        // condition for dashboard wizard widget
        /*if (this._params.webSource === 'Desktop'){
          return super.callbackOnGetData(response);
        }*/
        this.runProfiling();
        const compareKeys = this._params.keys.split(",");
        this.metadata.chartOptions.isCompare = compareKeys.length > 1;
        this.metadata.chartOptions.viewOptions = this._viewOptions;
        this.metadata.chartOptions.linkParams = this.buildLinkParams();
        this.reCreateChartConfig();
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
                    max: widget._widgetConfig.properties.dataMode === "percent" ? 100 : null,
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
                                    widget._widgetConfig.properties.dataMode,
                                    (point) => `${point.toFixed(2)}%`,
                                    (point) => {
                                        const isLessThanMinimum = point > 0 && point < 1000;
                                        const minimumSign = isLessThanMinimum ? "< " : "";
                                        const formattedPoint = widget._$filter("abbrNumber")(
                                            Math.max(point, 1000),
                                        );
                                        return `${minimumSign}${formattedPoint}`;
                                    },
                                );
                                return formattedData;
                            },
                        },
                    },
                },
                tooltip: {
                    pointFormatter: function () {
                        const formattedPoint = widget.formatGraphPoint(
                            this.y,
                            widget._widgetConfig.properties.dataMode,
                            (point) => (Math.round(point * 100) / 100).toFixed(2) + "%",
                            (point) => widget._$filter("abbrNumber")(point || 0),
                        );

                        const color = this.pointTooltipColor ? this.pointTooltipColor : this.color;
                        return `<span style="color:${color}; font-family: Roboto;">\u25CF </span>${this.series.name}: <span style="font-weight: bold;color:${color};">${formattedPoint}</span><br/>`;
                    },
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
}

BarChartMMXDashboardWidget.register();
