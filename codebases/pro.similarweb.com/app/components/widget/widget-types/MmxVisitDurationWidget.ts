import angular from "angular";
import _ from "lodash";
import dayjs from "dayjs";
import { ChannelAnalysisGraphWidget } from "./ChannelAnalysisGraphWidget";

export class MmxVisitDurationWidget extends ChannelAnalysisGraphWidget {
    getHighChartsConfig(chartOptions, formattedData) {
        chartOptions.tooltipFormat = "time";
        return this._ngHighchartsConfig.lineGraphWidget(
            _.merge(
                {},
                chartOptions,
                {
                    stacked: false,
                    format: "time",
                    formatParameter: "0",
                    tooltipFormat: "time",
                    tooltip: this.getToolTipSettings(chartOptions),
                    chart: {
                        spacing: [20, 10, 17, 0],
                        marginTop: 30,
                    },
                    yAxis: {
                        labels: {
                            formatter() {
                                return dayjs.utc(this.value * 1000).format("mm:ss");
                            },
                        },
                    },
                    xAxis: {
                        labels: {
                            y: 30,
                        },
                    },
                    plotOptions: {
                        line: {
                            marker: {
                                enabled: this._widgetConfig.timeGranularity !== "Daily",
                            },
                        },
                    },
                },
                { timeGranularity: this._widgetConfig.timeGranularity },
            ),
            formattedData,
        );
    }

    formatGraphDataPointValue(pointValue, totalValue) {
        return pointValue || null;
    }

    formatLegendDataPointValue(pointValue, totalValue) {
        return pointValue ? this._$filter("time")(pointValue) : "NA";
    }

    public getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        angular.extend(widgetModel, {
            type: "MmxVisitDurationDashboard",
            metric: "ChannelsAnalysisByAverageDuration",
        });
        // angular.extend(widgetModel,{metric:"ChannelsAnalysisByAverageDuration"});
        return widgetModel;
    }
}

MmxVisitDurationWidget.register();
