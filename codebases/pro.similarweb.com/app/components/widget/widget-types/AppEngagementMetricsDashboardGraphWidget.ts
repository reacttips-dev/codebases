/**
 * Created by liorb on 5/4/2017.
 */
import DurationService from "services/DurationService";
import { GraphWidget } from "./GraphWidget";
import * as _ from "lodash";
import { ChartMarkerService } from "../../../services/ChartMarkerService";

export class AppEngagementMetricsDashboardGraphWidget extends GraphWidget {
    private metricDataKeyMap = {
        AppEngagementDownloads: "Downloads",
        AppEngagementUniqueInstalls: "UniqueInstalls",
        AppEngagementCurrentInstalls: "CurrentInstalls",
        AppEngagementDailyActiveUsers: "DailyActiveUsers",
        AppEngagementMonthlyActiveUsers: "MonthlyActiveUsers",
        AppEngagementDailyShareUsers: "DailyShareUsers",
        AppEngagementUsageTime: "UsageTime",
        AppEngagementSessionsPerUser: "SessionsPerUser",
        AppEngagementUsagePenetration: "UsagePenetration",
    };

    private metricDataTypeMap = {
        AppEngagementDownloads: "Number",
        AppEngagementUniqueInstalls: "Number",
        AppEngagementCurrentInstalls: "Percentage",
        AppEngagementDailyActiveUsers: "Number",
        AppEngagementMonthlyActiveUsers: "Number",
        AppEngagementDailyShareUsers: "Percentage",
        AppEngagementUsageTime: "Number",
        AppEngagementSessionsPerUser: "Number",
        AppEngagementUsagePenetration: "Percentage",
    };

    static getWidgetMetadataType() {
        return "AppEngagementMetricsDashboardGraph";
    }

    static getWidgetResourceType() {
        return "Data";
    }

    static getWidgetDashboardType() {
        return "Graph";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
    }

    protected getChartSeries(unorderedData: any, compareItemsKeys: string[]): any[] {
        let noDataKeys = 0; // count how many apps have no data
        let appData;
        const colors = this._ngHighchartsConfig.newColorPaletteColors();
        const formattedData = {};
        _.each(Object.keys(unorderedData), (app) => {
            formattedData[app] = {};
            const crrKey = Object.keys(unorderedData[app])[0];
            appData = unorderedData[app][crrKey];
            if (!appData) {
                formattedData[app] = null;
                noDataKeys++;
            } else {
                formattedData[app][crrKey] = appData;
            }
        });
        // if all selected apps has no data we need to show the 'no data' message
        if (noDataKeys === Object.keys(unorderedData).length) {
            return [];
        } else {
            const series = super.getChartSeries(formattedData, Object.keys(unorderedData));
            // use colors of legend if available
            return _.isEmpty(this.legendItems)
                ? series
                : series.map((serie) => {
                      const legendIndex = this.legendItems.findIndex(
                          (item) => item.name === serie.name,
                      );
                      return {
                          ...serie,
                          color: colors[legendIndex],
                          marker: {
                              symbol: ChartMarkerService.createMarkerStyle(colors[legendIndex])
                                  .background,
                          },
                      };
                  });
        }
    }

    public getProUrl(rowParams) {
        const store = this.apiParams.store === "Google" ? "0" : "1";
        const metric = this.getWidgetModel().metric;
        const { country, webSource, isWindow, from, to, keys } = this.apiParams;
        const duration = DurationService.getDiffSymbol(from, to, isWindow ? "days" : "months");

        return this._swNavigator.getStateUrl("apps-engagementoverview", {
            tab: this.metricDataKeyMap[metric],
            granularity: this.apiParams.timeGranularity,
            country,
            duration,
            appId: `${store}_${keys}`,
        });
    }

    public callbackOnGetData(response: any, comparedItemKeys?: any[]): void {
        const metric = this.getWidgetModel().metric;
        const metricResponse = { Data: {} };
        const keys = Object.keys(response.Data);
        keys.forEach((appId) => {
            const appData =
                response.Data[appId].Overtime[this.apiParams.timeGranularity][
                    this.metricDataKeyMap[metric]
                ][this.metricDataTypeMap[metric]];
            metricResponse.Data[appId] = { [this.metricDataKeyMap[metric]]: appData };
        });
        super.callbackOnGetData(metricResponse, comparedItemKeys);
    }
}
AppEngagementMetricsDashboardGraphWidget.register();
