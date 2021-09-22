import * as _ from "lodash";
import { MmxChannelsGraphDashboardWidget } from "./MmxChannelsGraphDashboardWidget";
import { dashboardMmxTooltipPositioner, tooltipPositioner } from "services/HighchartsPositioner";
import { MmxDashboardWidgetFilters } from "../widget-filters/MmxDashboardWidgetFilters";
/**
 * Created by Eyal.Albilia
 */
export class MmxBounceRateDashboardWidget extends MmxChannelsGraphDashboardWidget {
    public isPptSupported = () => {
        const hasData = this.chartConfig.series && this.chartConfig.series.length > 0;
        const hasOptions = !!this.metadata.chartOptions;
        return hasData && hasOptions;
    };

    static getWidgetMetadataType() {
        return "MmxBounceRateDashboard";
    }

    static getWidgetResourceType() {
        return "Graph";
    }

    static getWidgetDashboardType() {
        return "Graph";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
    }

    getHighChartsConfig(chartOptions, formattedData) {
        return this._ngHighchartsConfig.lineGraphWidget(
            _.merge({}, chartOptions, {
                stacked: false,
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

MmxBounceRateDashboardWidget.register();
