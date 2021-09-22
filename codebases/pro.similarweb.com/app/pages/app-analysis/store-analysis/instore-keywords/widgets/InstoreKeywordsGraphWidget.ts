import _ from "lodash";
import dayjs from "dayjs";
import { GraphWidget } from "components/widget/widget-types/GraphWidget";
import { WidgetState } from "components/widget/widget-types/Widget";
import { GooglePlayKeywordAnalysisExporter } from "exporters/GooglePlayKeywordAnalysisExporter";
import { chosenItems } from "common/services/chosenItems";
import { INTERVALS } from "constants/Intervals";

type tableSelection = {
    value: string;
    color: string;
};
export class InstoreKeywordsGraphWidget extends GraphWidget {
    static getWidgetMetadataType() {
        return "InstoreKeywordsGraph";
    }

    static getWidgetResourceType() {
        return "Graph";
    }
    static $inject = ["$ngRedux"];
    private _$ngRedux;
    private INTERVALS;
    private _tableKey: string;
    private graphReady = false;
    private isCompareMode: boolean;
    protected unsubscribe;
    public tableSelection: any[] = [];
    public legendClass: string;

    initWidgetWithConfigs(config, context) {
        super.initWidgetWithConfigs(config, context);

        this.graphReady = false;
        this.widgetState = WidgetState.LOADING;
        this.isCompareMode = this.apiParams.keys.split(",").length > 1;
        this.errorConfig = {
            ...this.errorConfig,
            messageBottom: "",
        };

        this._tableKey = config.widgetConfig.properties.tableKey;
        this.unsubscribe = this._$ngRedux.connect((state) => {
            return {
                value: state.tableSelection[this._tableKey],
            };
        })((tableSelection) => {
            this.tableSelection = tableSelection.value;
            this.onSelectionChange();
        });
    }

    protected setMetadata(response = [{ data: [] }]) {
        const widgetProp = this._widgetConfig.properties;
        const chartOptions = {
            type: "Line",
            markerEnabled: false,
            height: widgetProp.height,
            stacked: false,
            format: "number",
            reversed: true,
            lang: { noData: this._$filter("i18n")("appstorekeywords.analysis.chart.nodata") },
            ...(widgetProp.chartOptions || {}),
        };

        this.metadata = { chartOptions };
    }

    callbackOnGetData(response: any) {
        if (this.isCompareMode) {
            // renaming apps ids into real names
            const data = {};
            chosenItems.forEach((item) => {
                data[item.Title] = response.Data[item.Id];
            });
            response.Data = data;
        } else {
            response.Data = response.Data[Object.keys(response.Data)[0]];
        }
        super.callbackOnGetData(response);
    }

    protected getChartSeries(unorderedData: any, compareItemsKeys: string[]): any[] {
        // Workaround to create config properties with actual data
        return unorderedData ? super.getChartSeries(unorderedData, Object.keys(unorderedData)) : [];
    }

    getHighChartsConfig(chartOptions, formattedData) {
        const intervals = INTERVALS;
        const extendedOptions = {
            ...chartOptions,
            chart: {
                marginTop: this.isCompareMode ? 20 : 0,
            },
            timeGranularity: "Daily",
            legendAlign: "left",
            showLegend: false,
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
        };
        return this._ngHighchartsConfig.lineGraphWidget(extendedOptions, formattedData);
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/category-share.html`;
    }

    onSelectionChange() {
        if (_.isArray(this.tableSelection) && this.tableSelection.length > 0) {
            this.apiParams = {
                ...this.apiParams,
                terms: this.tableSelection.map((item: any) => item.SearchTerm),
            };
            this.legendItems = this.getLegendItems();
        } else {
            this.legendItems = [];
            this.chartConfig.series = [];
            this.graphReady = true;
            this.widgetState = WidgetState.ERROR;
        }
        this.setExcelUrl();
    }

    getLegendItems() {
        if (this.tableSelection) {
            return this.isCompareMode
                ? this.getProperties().key
                : this.tableSelection.map((selection) => {
                      return {
                          id: selection.SearchTerm,
                          name: selection.SearchTerm,
                          color: selection.selectionColor,
                      };
                  });
        }
        return [];
    }

    protected cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    public get excelUrl() {
        if (!this.tableSelection) {
            return "";
        }
        const widgetProp = this._widgetConfig.properties,
            newParams: any = {
                ...this._params,
                metric: widgetProp.excelMetric,
            };
        if (newParams.terms) {
            delete newParams.terms;
        }

        let excelURL =
            this._getExcelEndPoint() +
            _.trimEnd(
                _.reduce(
                    newParams,
                    (paramString, paramVal: any, paramKey) =>
                        `${paramString}${paramKey}=${encodeURIComponent(paramVal)}&`,
                    "",
                ),
                "&",
            );
        // avoid terms with ',' by sending "terms=xx&terms=yy&terms=zz"
        this.tableSelection.forEach((item) => {
            excelURL += `&terms=${item.SearchTerm}`;
        });
        return excelURL;
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
        const isCompare = mode === "compare";
        const apiController = "StorePageSearchPositions";
        const widgetConfig = InstoreKeywordsGraphWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = InstoreKeywordsGraphWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController, isCompare) {
        return {
            type: "InstoreKeywordsGraph",
            properties: {
                ...params,
                family: "StoreKeywords",
                type: "InstoreKeywordsGraph",
                metric: "InStoreAppPositionsForKeywords",
                apiController,
                apiParams: {
                    metric: "InStoreAppPositionsForKeywords",
                },
                title: "appanalysis.instore.graph.title",
                tooltip: "appanalysis.instore.graph.title.tooltip",
                subtitle: "googleplaykeyword.analysis.graph.subtitle",
                width: "12",
                height: "250px",
                autoFetchData: false,
                excelMetric: "InStoreAppPositionsForKeywords",
                options: {
                    showTitle: true,
                    showSubtitle: false,
                    showTitleTooltip: true,
                    showLegend: true,
                    legendAlign: "left",
                    hideMarkersOnDaily: true,
                    showSettings: false,
                    showFrame: true,
                    showTopLine: false,
                    selectionColors: isCompare ? false : true,
                    legendContainerClass: isCompare ? "" : "instore-keywords-graph-legend",
                    titleTemplate:
                        "/app/pages/app-analysis/store-analysis/store-analysis-graph-title.html",
                    useNewLegends: true,
                },
                tableKey: "apps.instoresearch_InStoreKeywordsAnalysis_Table",
                trackName: "Over Time Graph/In-Store Keywords",
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
            id: "InStoreAppPositionsForKeywords",
            properties: {
                metric: "InStoreAppPositionsForKeywords",
                title: "",
                family: "StoreKeywords",
                component: "StorePage",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "apps.instoresearch",
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
        };
    }
}
