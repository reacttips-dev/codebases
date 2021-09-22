import angular from "angular";
import * as _ from "lodash";
import { ChannelAnalysisGraphWidget } from "./ChannelAnalysisGraphWidget";
/**
 * Created by Eran.Shain on 11/28/2016.
 */
export class MmxPagesPerVisitWidget extends ChannelAnalysisGraphWidget {
    constructor() {
        super();
        this.dataMode = "number";
    }

    protected getToolTipFormatSettings(dataMode): any {
        return {
            tooltipFormat: "number",
            formatParams: [2],
        };
    }

    getHighChartsConfig(chartOptions, formattedData) {
        _.merge(chartOptions, this.getToolTipFormatSettings(null));
        return this._ngHighchartsConfig.lineGraphWidget(
            _.merge({}, chartOptions, {
                stacked: false,
                xAxis: {
                    labels: {
                        y: 30,
                    },
                },
                tooltip: this.getToolTipSettings(chartOptions),
                chart: {
                    spacing: [20, 10, 17, 0],
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

    formatGraphDataPointValue(pointValue, totalValue) {
        return pointValue || null;
    }

    formatLegendDataPointValue(pointValue, totalValue) {
        return pointValue ? pointValue.toFixed(2) : "NA";
    }

    public getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        angular.extend(widgetModel, {
            type: "MmxPagesPerVisitDashboard",
            metric: "ChannelsAnalysisByPagesPerVisit",
        });
        return widgetModel;
    }
}

MmxPagesPerVisitWidget.register();
