import * as _ from "lodash";
import {
    IPptBarChartRequest,
    IPptSeriesData,
    IPptSlideExportRequest,
} from "services/PptExportService/PptExportServiceTypes";
import { getBarChartWidgetPptOptions } from "../widget-utilities/widgetPpt/PptBarChartWidgetUtils";
import {
    augmentNameWithGAMark,
    getWidgetSubtitle,
    getWidgetTitle,
} from "../widget-utilities/widgetPpt/PptWidgetUtils";
import { ChartWidget } from "./ChartWidget";
import { getYAxisFormat } from "components/widget/widget-utilities/widgetPpt/PptWidgetUtils";

export class BarChartWidget extends ChartWidget {
    public isPptSupported = () => {
        return this.chartConfig.series && this.chartConfig.series.length > 0;
    };
    protected _ngHighchartsConfig;
    protected _Bar;
    protected _defaultDataFormat = "percent";
    static $inject = ["ngHighchartsConfig", "Bar"];

    public getDataForPpt = (): IPptSlideExportRequest => {
        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this, { showEntities: !this.isCompare() }),
            type: "bar",
            details: {
                format: getYAxisFormat(this),
                options: getBarChartWidgetPptOptions(),
                data: this.getSeriesForPowerpoint(),
            } as IPptBarChartRequest,
        };
    };

    private getSeriesForPowerpoint = (): IPptSeriesData[] => {
        return this.chartConfig.series.map(
            (
                series: {
                    name: string;
                    color: string;
                    data: Array<{ key: string; y: number }>;
                    isGAVerified: boolean;
                },
                index: number,
            ) => {
                const { name, data, isGAVerified } = series;
                const labels = data.map((point) => point.key);
                const values = data.map((point) => point.y / 100);
                const color = this.chartConfig.options.colors[index];
                return {
                    seriesName: augmentNameWithGAMark(name, isGAVerified),
                    seriesColor: color,
                    labels,
                    values,
                };
            },
        );
    };

    static getWidgetMetadataType() {
        return "BarChart";
    }

    static getWidgetResourceType() {
        return "BarChart";
    }

    constructor() {
        super();
    }

    protected setMetadata() {
        const widgetProp = this._widgetConfig.properties;
        const chartOptions = {
            type: "BarChart",
            height: widgetProp.height,
            dashboardId: this.dashboardId,
        };
        this.metadata = { chartOptions };
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        const compareKeys = this._params.keys.split(",");
        this.metadata.chartOptions.isCompare = compareKeys.length > 1;
        this.metadata.chartOptions.viewOptions = this._viewOptions;
        this.metadata.chartOptions.linkParams = this.buildLinkParams();
        this.legendItems = this.getLegendItems(response.Data);
        this.buildBar();
    }

    buildBar(dataFormat?) {
        const _dataFormat = dataFormat ? dataFormat : this._defaultDataFormat;
        const formattedData = this.getChartSeries(this.originalData);
        const bar = new this._Bar(
            this.metadata.chartOptions,
            formattedData,
            _dataFormat,
            this._params.webSource,
        );
        this.chartConfig = bar.getChartConfig();
    }

    getChartSeries(unorderedData) {
        return _.map(unorderedData, function (v, k) {
            return {
                data: _.merge(
                    {
                        Direct: 0,
                        Mail: 0,
                        OrganicSearch: 0,
                        DisplayAds: 0,
                        PaidSearch: 0,
                        Referrals: 0,
                        Social: 0,
                    },
                    v !== null
                        ? {
                              Direct: v["Direct"],
                              Mail: v["Mail"],
                              OrganicSearch: v["Organic Search"],
                              DisplayAds: v["Paid Referrals"],
                              PaidSearch: v["Paid Search"],
                              Referrals: v["Referrals"],
                              Social: v["Social"],
                          }
                        : {},
                ),
                name: k,
            };
        });
    }

    buildLinkParams() {
        const props = this.getProperties();
        return {
            country: props.country,
            duration: props.duration,
            isWWW: "*",
            key: props.key.map((k) => k.name).join(","),
        };
    }

    protected validateData(response: any) {
        const validByBase = super.validateData(response);
        const isEmpty = _.isEmpty(response);
        const emptyValues =
            isEmpty ||
            _.every(_.values(response), function (i) {
                return _.isNull(i) || _.isUndefined(i);
            });
        return validByBase && !emptyValues;
    }

    onResize() {
        if (this.chartConfig.series && this.metadata.chartOptions.isCompare) {
            if (this.pos.sizeX < 4) {
                this.chartConfig.options.plotOptions.column.pointWidth = 15;
                if (this.pos.sizeX === 2) {
                    this.chartConfig.options.xAxis.labels.style.fontSize = "9px";
                }
            } else {
                this.chartConfig.options.plotOptions.column.pointWidth = 20;
                this.chartConfig.options.xAxis.labels.style.fontSize = "13x";
            }
        } else {
            if (this.chartConfig.options) {
                if (this.pos.sizeX === 2) {
                    this.chartConfig.options.xAxis.labels.style.fontSize = "10px";
                } else {
                    this.chartConfig.options.xAxis.labels.style.fontSize = "14px";
                }
            }
        }
    }
}
BarChartWidget.register();
