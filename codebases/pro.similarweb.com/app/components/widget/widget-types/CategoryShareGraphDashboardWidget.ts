/**
 * Created by Yoav.Shmaria on 2/9/2017.
 */

import DurationService from "services/DurationService";
import { CategoryShareGraphBaseWidget } from "./CategoryShareGraphBaseWidget";
import UIComponentStateService from "services/UIComponentStateService";
import * as _ from "lodash";
import { CHART_COLORS } from "constants/ChartColors";
import {
    IPptAreaChartRequest,
    IPptSlideExportRequest,
} from "services/PptExportService/PptExportServiceTypes";
import {
    getWidgetSubtitle,
    getWidgetTitle,
    getYAxisFormat,
} from "../widget-utilities/widgetPpt/PptWidgetUtils";
import { getAreaGraphWidgetPptOptions } from "../widget-utilities/widgetPpt/PptGraphWidgetUtils";

export class CategoryShareGraphDashboardWidget extends CategoryShareGraphBaseWidget {
    public isPptSupported = () => {
        return true;
    };

    public getDataForPpt = (): IPptSlideExportRequest => {
        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this, { showEntities: false }),
            type: "area",
            details: {
                format: getYAxisFormat(this),
                options: getAreaGraphWidgetPptOptions(this),
                // Format the data as if it was a line chart data
                data: this.getSeriesDataForPpt()
                    // filter out series data that are labeled as "Others".
                    // this data have no contribution to the graph, but cause rendering issues in the PPT graph
                    .filter((series) => series.seriesName !== "Others")
                    // Reverse the data, so that the ppt stacked graph will look similar to the graph in the pro platform.
                    .reverse(),
            } as IPptAreaChartRequest,
        };
    };

    public static getWidgetMetadataType() {
        return "CategoryShareGraphDashboard";
    }

    public static getWidgetResourceType() {
        return "SwitchGraph";
    }

    public static getWidgetDashboardType() {
        return "Graph";
    }

    private tableSelectionMock: any[];

    constructor() {
        super();
        this.tableSelectionMock = [];
    }

    public initWidget(config, context) {
        super.initWidget(config, context);
        this.chartMode =
            UIComponentStateService.getItem(this.getUIStateKey(), this.storageType) || "percent";
        const toggleUtility: any =
            this.utilityGroups.length > 0
                ? _.find(this.utilityGroups[0].utilities, { id: "widget-toggle" })
                : false;
        if (toggleUtility) {
            toggleUtility.properties.defaultItem = this.chartMode;
        }

        this.tableKey = config.properties.tableKey;
        this.unsubscribe = this._$swNgRedux.connect((state) => {
            return {
                value: state.tableSelection[this.tableKey],
            };
        })((tableSelection) => {
            this.onSelectionChange(tableSelection.value);
        });

        this.legendClass = "category-share-legend";
        // in 1 month interval with monthly granularity hide 'others'
        this.isOneMonth =
            !this._params.isWindow &&
            DurationService.diffByUnit(this._params.from, this._params.to, "months") === 0;
    }

    public callbackOnGetData(response: any) {
        const websites = [];
        const data = response.Data;
        for (const domain in data) {
            if (websites.length > 9) break;
            websites.push(domain);
        }
        websites.forEach((domain, index) => {
            const color = CHART_COLORS.chartMainColors[index];
            this.tableSelectionMock.unshift({
                Domain: domain,
                selectable: true,
                selectionColor: color,
            });
        });
        super.callbackOnGetData(response);
        this.onSelectionChange(this.tableSelectionMock);
    }

    public getLegendItems(includeOthers = true) {
        let legends = [];
        if (this.tableSelection) {
            _.map(this.tableSelection, (selection) => {
                legends.unshift({
                    id: selection.Domain,
                    name: selection.Domain,
                    color: selection.selectionColor,
                    smallIcon: true,
                });
                return {
                    id: selection.Domain,
                    name: selection.Domain,
                    color: selection.selectionColor,
                    smallIcon: true,
                };
            });
            legends.forEach((legend) => {
                this._sitesResource.GetWebsiteImage({ website: legend.id }, (data) => {
                    legend.icon = data.image;
                });
            });
            legends = legends.concat([this.getOthersLegend()]);
            // Access chartOptions only after the chart is drawn.
            setTimeout(() => {
                this.hideOthersSerie();
            });
        }
        return legends;
    }
}
CategoryShareGraphDashboardWidget.register();
