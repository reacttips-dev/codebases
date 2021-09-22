import angular from "angular";
import * as _ from "lodash";
import { ChannelAnalysisGraphWidget } from "./ChannelAnalysisGraphWidget";
/**
 * Created by Eran.Shain on 11/28/2016.
 */
export class MmxBounceRateWidget extends ChannelAnalysisGraphWidget {
    getHighChartsConfig(chartOptions, formattedData) {
        _.merge(chartOptions, this.getToolTipFormatSettings("percent"));
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
    }

    getMetricWinner(list) {
        return _.min(_.values(list));
    }

    formatGraphDataPointValue(pointValue, totalValue) {
        return pointValue || null;
    }

    formatLegendDataPointValue(pointValue, totalValue) {
        return pointValue
            ? this._$filter("tinyFractionApproximation")(`${(100 * pointValue).toFixed(2)}%`, 0.01)
            : "NA";
    }

    public getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        angular.extend(widgetModel, {
            type: "MmxBounceRateDashboard",
            metric: "ChannelsAnalysisByBounceRate",
        });
        return widgetModel;
    }
}

MmxBounceRateWidget.register();
