import * as _ from "lodash";
import DurationService from "services/DurationService";
import { MmxChannelsGraphDashboardWidget } from "./MmxChannelsGraphDashboardWidget";
import { dashboardMmxTooltipPositioner, tooltipPositioner } from "services/HighchartsPositioner";
import { MmxDashboardWidgetFilters } from "../widget-filters/MmxDashboardWidgetFilters";
import {
    IPptSlideExportRequest,
    IPptLineChartRequest,
} from "services/PptExportService/PptExportServiceTypes";
import { getGraphWidgetPptOptions } from "../widget-utilities/widgetPpt/PptGraphWidgetUtils";
import {
    getWidgetTitle,
    getWidgetSubtitle,
    getYAxisFormat,
} from "../widget-utilities/widgetPpt/PptWidgetUtils";
/**
 * Created by Eyal.Albilia
 */
export class MmxTrafficShareDashboardWidget extends MmxChannelsGraphDashboardWidget {
    /**
     * MmxTrafficShareDashboardWidget inherits from GraphWidget, which supports getDataForPpt.
     * The only difference between this component and GraphWidget, is that this component data format (y-axis format)
     * is always a "number", unlike graphWidget, which could be of any type. due to a bug, where the server returns incorrect
     * configuration for this component that indicates that the graph format is "percent", we had to override the graphWidget's
     * getDataForPpt, so that we could always return "number" as this graph's data format
     */
    public getDataForPpt = (): IPptSlideExportRequest => {
        const isCompareMode = this.isCompare();

        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this, { showEntities: !isCompareMode }),
            type: "line",
            details: {
                format: "number",
                options: getGraphWidgetPptOptions(this),
                data: super.getSeriesDataForPpt(),
            } as IPptLineChartRequest,
        };
    };

    static getWidgetMetadataType() {
        return "MmxTrafficShareDashboard";
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
        const durationStr = this._swNavigator.getParams().duration;
        const durationRaw = DurationService.getDurationData(durationStr).raw;
        return this._ngHighchartsConfig.lineGraphWidget(
            _.merge({}, chartOptions, {
                stacked: false,
                format: "number",
                tooltipFormat: "abbrNumberVisits",
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

    public callbackOnGetData(response: any, comparedItemKeys?: any[]) {
        response.Data = _.mapValues(response.Data, (site) => _.omit(site, ["All Channels"]));
        return super.callbackOnGetData(response, comparedItemKeys);
    }
}

MmxTrafficShareDashboardWidget.register();
