import * as _ from "lodash";
/**
 * Created by vlads on 26/1/2016.
 */
import { ChartWidget } from "./ChartWidget";
import { PieChartExporter } from "../../../exporters/PieChartExporter";
import { CHART_COLORS } from "constants/ChartColors";
import {
    IPptPieChartRequest,
    IPptRecordData,
    IPptSlideExportRequest,
} from "services/PptExportService/PptExportServiceTypes";
import {
    augmentNameWithGAMark,
    getWidgetSubtitle,
    getWidgetTitle,
} from "../widget-utilities/widgetPpt/PptWidgetUtils";
import { getPieChartWidgetPptOptions } from "../widget-utilities/widgetPpt/PptPieChartWidgetUtils";
declare let similarweb;
export class PieChartWidget extends ChartWidget {
    protected _ngHighchartsConfig;
    static $inject = ["ngHighchartsConfig", "pngExportService", "$filter"];

    public isPptSupported = () => {
        const hasSeries = this.chartConfig.series && this.chartConfig.series.length > 0;
        if (!hasSeries) return false;

        return this.chartConfig.series[0].data && this.chartConfig.series[0].data.length > 0;
    };

    public getDataForPpt(): IPptSlideExportRequest {
        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this),
            type: "pie",
            details: {
                format: "percent",
                options: getPieChartWidgetPptOptions(),
                data: this.getRecordsDataForPpt(),
            } as IPptPieChartRequest,
        };
    }

    private getRecordsDataForPpt = (): IPptRecordData[] => {
        return this.chartConfig.series[0].data.map((record) => {
            return {
                recordName: augmentNameWithGAMark(record.name, record.isGAVerified),
                recordColor: record.color,
                value: record.y,
            };
        });
    };

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page, on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    static getWidgetMetadataType() {
        return "PieChart";
    }

    static getWidgetResourceType() {
        return "PieChart";
    }

    constructor() {
        super();
    }

    protected setMetadata() {
        const widgetProp = this.dashboardId
            ? this._metricTypeConfig.properties
            : this._widgetConfig.properties;
        const chartOptions = {
            type: "PieChart",
            height: widgetProp.height,
            format:
                this._widgetConfig &&
                this._widgetConfig.properties &&
                this._widgetConfig.properties.dataMode
                    ? this._widgetConfig.properties.dataMode
                    : null,
        };
        this.metadata = { chartOptions };
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        //Merge response.Data with response.KeysDataVerification for isGAVerified flag per property.
        this.mergeGAVerifiedFlag(response);

        this.metadata.chartOptions.isCompare = this._params.keys.split(",").length > 1;
        // this.metadata.chartOptions.containerWidth = $element.width();
        const formattedData = this.getChartSeries(response.Data);
        this.metadata.chartOptions.viewOptions = this._viewOptions;

        if (this._viewOptions.alignTrafficSourcesColors) {
            _.map(formattedData, (series) => {
                const items = [];
                _.each(series.data, (item: any) => {
                    const seriesName = item.seriesName;
                    const itemUpdated: any = Object.assign({}, item);
                    const index =
                        similarweb.utils.volumesAndSharesSplited.order[seriesName].priority;
                    itemUpdated.color = CHART_COLORS.chartMainColors[index];
                    items[index] = itemUpdated;
                });
                series.data = items;
                return series;
            });
        }

        this.chartConfig = this._ngHighchartsConfig.pie(
            this.metadata.chartOptions,
            formattedData,
            this._widgetConfig.chartConfig,
        );

        if (!this.isCompare()) {
            this.data = Object.assign(this.data || {}, response.Data[this._params.keys]);
        }
    }

    public getExporter(): any {
        return PieChartExporter;
    }

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    onResize() {
        if (this.chartConfig.series && this.chartConfig.series.length > 0) {
            const legends = this.chartConfig.series[0].data.length;
            let verticalHeight = 220;
            const legendY = legends * -2;
            if (this.apiParams.keys.indexOf(",") == -1 && Object.keys(this.data).length <= 2) {
                verticalHeight = 200;
            }
            const verticalSize = 75 - legends * 10;
            const verticalMarginTop = 29 * legends;
            const options = this.chartConfig.options;
            const pie = options.plotOptions.pie;
            if (this.pos.sizeX == 1) {
                options.legend.align = "center";
                options.legend.verticalAlign = "bottom";
                options.legend.y = legendY;
                options.chart.spacingRight = 0;
                pie.size = verticalSize + "%";
                options.chart.marginTop = "-" + verticalMarginTop;
                options.chart.height = verticalHeight;
                pie.visible = true;
                if (legends > 5) {
                    pie.size = "0";
                    pie.visible = false;
                    options.chart.height = 220;
                    options.chart.marginTop = -30;
                    options.legend.verticalAlign = "top";
                }
            } else {
                pie.visible = true;
                options.legend.align = "right";
                options.chart.spacingRight = 150;
                options.legend.y = legendY;
                pie.size = "75%";
                options.chart.height = 220;
                options.chart.marginTop = -30;
                if (legends > 5) {
                    options.legend.verticalAlign = "top";
                } else {
                    options.legend.verticalAlign = "middle";
                }
            }
        }
    }

    protected validateData(response: any) {
        const validByBase = super.validateData(response);
        return validByBase && !_.isEmpty(response);
    }
}

PieChartWidget.register();
