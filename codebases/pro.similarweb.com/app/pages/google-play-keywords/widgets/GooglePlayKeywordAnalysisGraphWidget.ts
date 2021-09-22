import _ from "lodash";
import dayjs from "dayjs";
import { GraphWidget } from "components/widget/widget-types/GraphWidget";
import { GooglePlayKeywordAnalysisExporter } from "exporters/GooglePlayKeywordAnalysisExporter";
import { ChartMarkerService } from "services/ChartMarkerService";
import { INTERVALS } from "constants/Intervals";

type tableSelection = {
    value: string;
    color: string;
};

export class GooglePlayKeywordAnalysisGraphWidget extends GraphWidget {
    static getWidgetMetadataType() {
        return "Graph";
    }

    static getWidgetResourceType() {
        return "Graph";
    }
    static $inject = ["$ngRedux"];
    private INTERVALS;
    private _tableKey: string;
    private graphReady = false;
    protected unsubscribe;
    public tableSelection: any[] = [];
    public legendClass: string;

    // public legendClass;

    initWidgetWithConfigs(config, context) {
        super.initWidgetWithConfigs(config, context);
        this._tableKey = config.widgetConfig.properties.tableKey;
        this.unsubscribe = this._$swNgRedux.connect((state) => {
            return {
                value: state.tableSelection[this._tableKey],
            };
        })((tableSelection) => {
            this.onSelectionChange(tableSelection.value);
        });
    }

    protected setMetadata(response = [{ data: [] }]) {
        const widgetProp = this._widgetConfig.properties;
        const chartOptions: any = Object.assign(
            {
                type: "Line",
                markerEnabled: false,
                height: widgetProp.height,
                stacked: false,
                format: "number",
                reversed: true,
                lang: { noData: this._$filter("i18n")("appstorekeywords.analysis.chart.nodata") },
            },
            widgetProp.chartOptions || {},
        );
        this.metadata = { chartOptions };
        this.legendClass = "demographics-legend";
    }

    callbackOnGetData(response: any) {
        response.Data = response.Data[Object.keys(response.Data)[0]];
        super.callbackOnGetData(response);
        this.onSelectionChange(this.tableSelection);
    }

    protected getChartSeries(unorderedData: any, compareItemsKeys: string[]): any[] {
        // Workaround to create config properties with actual data
        return unorderedData
            ? super.getChartSeries(unorderedData, Object.keys(unorderedData).slice(0, 1))
            : [];
    }

    getHighChartsConfig(chartOptions, formattedData) {
        const intervals = INTERVALS;
        const extendedOptions = Object.assign(chartOptions, {
            isApp: true,
            timeGranularity: "Daily",
            xAxis: {
                tickInterval: intervals.biDaily,
                labels: {
                    formatter: function () {
                        let format = "D MMM.",
                            xAxis,
                            intervalYears;
                        try {
                            xAxis = this.chart.xAxis[0];
                            if (xAxis.tickInterval === intervals.monthly) {
                                intervalYears = dayjs
                                    .utc(xAxis.dataMax)
                                    .diff(dayjs.utc(xAxis.dataMin), "months");
                                if (intervalYears >= 11) {
                                    format = "MMM'YY";
                                }
                            }
                        } catch (e) {}
                        return dayjs(this.value).utc().format(format);
                    },
                },
            },
        });
        return this._ngHighchartsConfig.lineGraphWidget(extendedOptions, formattedData);
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/category-share.html`;
    }

    onSelectionChange(tableSelection: tableSelection[]) {
        if (_.isArray(tableSelection)) {
            if (tableSelection.length > 0) {
                this.tableSelection = _.sortBy(tableSelection, (o: any) => o.Share);
                if (!this.originalData) {
                    return;
                }
                const series = [];
                this.tableSelection.forEach((selection) => {
                    series.push(
                        this.addSeries(
                            selection.App,
                            selection.Tooltip.Title,
                            selection.selectionColor,
                        ),
                    );
                });

                this.chartConfig.series = series;
                this.legendItems = this.getLegendItems();
                this.graphReady = true;
            } else {
                this.chartConfig.series = [];
                this.legendItems = [];
                this.graphReady = true;
            }

            this.setExcelUrl();
        }
    }

    addSeries(key: string, name: string, color: string) {
        const serie = super.getChartSeries(this.originalData[Object.keys(this.originalData)[0]], [
            key,
        ])[0];
        serie.name = name;
        serie.key = key;
        serie.color = color;
        serie.marker = {
            symbol: `url(${ChartMarkerService.createMarkerSrc(color)})`,
        };
        return serie;
    }

    getLegendItems() {
        let legends = [];
        if (this.tableSelection) {
            legends = _.map(this.tableSelection, (selection) => {
                return {
                    id: selection.App,
                    name: selection.Tooltip.Title,
                    color: selection.selectionColor,
                    icon: selection.Tooltip.Icon,
                };
            });
        }
        return legends;
    }

    protected cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    public get excelUrl() {
        const widgetProp = this._widgetConfig.properties;
        const newParams: any = _.merge({}, this._params);
        newParams.keys = newParams.keys;
        newParams.appIds = _.map(this.legendItems, (item: any) => item.id).join(",");
        if (widgetProp.excelMetric) {
            newParams.metric = widgetProp.excelMetric;
        }
        return (
            this._getExcelEndPoint() +
            _.trimEnd(
                _.reduce(
                    newParams,
                    (paramString, paramVal: any, paramKey) =>
                        `${paramString}${paramKey}=${encodeURIComponent(paramVal)}&`,
                    "",
                ),
                "&",
            )
        );
    }

    private setExcelUrl() {
        this.chartConfig = {
            ...this.chartConfig,
            export: {
                csvUrl: this.excelUrl,
            },
        };
    }

    public getExporter() {
        return GooglePlayKeywordAnalysisExporter;
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const apiController = "GooglePlayKeywords";
        const widgetConfig = GooglePlayKeywordAnalysisGraphWidget.getWidgetConfig(
            params,
            apiController,
        );
        const metricConfig = GooglePlayKeywordAnalysisGraphWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController) {
        return {
            type: "GooglePlayKeywordAnalysisGraph",
            properties: {
                ...params,
                family: "GooglePlayKeyword",
                type: "GooglePlayKeywordAnalysisGraph",
                metric: "AppPositions",
                title: "googleplaykeyword.analysis.graph.title",
                subtitle: "googleplaykeyword.analysis.graph.subtitle",
                apiController,
                apiParams: {
                    metric: "AppPositions",
                },
                width: "12",
                height: "360px",
                forcedDuration: "6m",
                excelMetric: "AppPositions",
                options: {
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: true,
                    legendAlign: "left",
                    hideMarkersOnDaily: true,
                    showSettings: false,
                    showFrame: true,
                    showTopLine: false,
                    legendContainerClass: "google-play-graph-legend",
                    useNewLegends: true,
                },
                tableKey: "keywords.analysis_GooglePlayKeywordAnalysis_Table",
                trackName: "Over Time Graph/Google Play Keyword Analysis",
            },
            utilityGroups: [
                {
                    properties: {
                        className: "titleRow",
                    },
                    utilities: [
                        {
                            id: "chart-export",
                            properties: {
                                wkhtmltoimage: true,
                            },
                        },
                    ],
                },
            ],
        };
    }

    static getMetricConfig(apiController) {
        return {
            id: "AppPositions",
            properties: {
                metric: "AppPositions",
                title: "googleplaykeyword.analysis.graph.title",
                family: "GooglePlayKeyword",
                component: "AppKeywordAnalysis",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "keywords-analysis",
                apiController,
            },
            single: {
                properties: {},
                // eslint-disable-next-line @typescript-eslint/camelcase
                x_axis: {
                    title: "Date",
                    type: "date",
                    format: "None",
                    name: "Date",
                    reversed: "False",
                },
                // eslint-disable-next-line @typescript-eslint/camelcase
                y_axis: {
                    title: "Ranks",
                    type: "long",
                    format: "number",
                    name: "Rank",
                    reversed: "True",
                },
                filters: {},
            },
            compare: {},
        };
    }
}
