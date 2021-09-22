import _ from "lodash";
import dayjs from "dayjs";
import { MmxChannelsGraphDashboardWidget } from "./MmxChannelsGraphDashboardWidget";
import { dashboardMmxTooltipPositioner, tooltipPositioner } from "services/HighchartsPositioner";
import { MmxDashboardWidgetFilters } from "../widget-filters/MmxDashboardWidgetFilters";

/**
 * Created by Eyal.Albilia
 */
export class MmxVisitDurationDashboardWidget extends MmxChannelsGraphDashboardWidget {
    static getWidgetMetadataType() {
        return "MmxVisitDurationDashboard";
    }

    static getWidgetResourceType() {
        return "Graph";
    }

    static getWidgetDashboardType() {
        return "Graph";
    }

    getHighChartsConfig(chartOptions, formattedData) {
        return this._ngHighchartsConfig.lineGraphWidget(
            _.merge({}, chartOptions, {
                stacked: false,
                format: "time",
                formatParameter: "0",
                showLegend: true,
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
                tooltip: {
                    positioner: this.isCompare()
                        ? tooltipPositioner
                        : dashboardMmxTooltipPositioner,
                },
            }),
            formattedData,
        );
    }

    static getFiltersComponent() {
        return MmxDashboardWidgetFilters;
    }
}

MmxVisitDurationDashboardWidget.register();
