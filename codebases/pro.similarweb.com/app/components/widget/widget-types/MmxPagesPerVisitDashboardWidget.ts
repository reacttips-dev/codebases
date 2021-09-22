import * as _ from "lodash";
import { MmxChannelsGraphDashboardWidget } from "./MmxChannelsGraphDashboardWidget";
import { dashboardMmxTooltipPositioner, tooltipPositioner } from "services/HighchartsPositioner";
import { MmxDashboardWidgetFilters } from "../widget-filters/MmxDashboardWidgetFilters";
/**
 * Created by Eyal.Albilia
 */
export class MmxPagesPerVisitDashboardWidget extends MmxChannelsGraphDashboardWidget {
    static getWidgetMetadataType() {
        return "MmxPagesPerVisitDashboard";
    }

    static getWidgetResourceType() {
        return "Graph";
    }

    static getWidgetDashboardType() {
        return "Graph";
    }

    protected getToolTipFormatSettings(dataMode): any {
        return {
            tooltipFormat: "number",
            formatParams: [2],
        };
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
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

MmxPagesPerVisitDashboardWidget.register();
