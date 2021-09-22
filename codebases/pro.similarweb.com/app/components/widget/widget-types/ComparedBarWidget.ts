import { result } from "lodash";
import { IPptSlideExportRequest } from "services/PptExportService/PptExportServiceTypes";
import {
    getWidgetSubtitle,
    getWidgetTitle,
    getYAxisFormat,
} from "../widget-utilities/widgetPpt/PptWidgetUtils";
/**
 * Created by liorb on 11/1/2016.
 */
import { PeriodOverPeriodBase } from "./PeriodOverPeriodBase";
import { getPOPWidgetSeriesData } from "../widget-utilities/widgetPpt/PptPeriodOverPeriodWidgetUtils";
import { getBarChartWidgetPptOptions } from "../widget-utilities/widgetPpt/PptBarChartWidgetUtils";
import { IPptBarChartRequest } from "services/PptExportService/PptExportServiceTypes";
import { isYearOverYearWidget } from "components/widget/widget-utilities/widgetPpt/PptPeriodOverPeriodWidgetUtils";

type datedValue = {
    Key: string;
    Value: number;
};
type periodOverPeriodDataPoint = {
    Values: datedValue[];
    Change: number[];
};
type siteData = {
    Desktop?: periodOverPeriodDataPoint[];
    "Mobile Web"?: periodOverPeriodDataPoint[];
    Total?: periodOverPeriodDataPoint[];
};

export class ComparedBarWidget extends PeriodOverPeriodBase {
    constructor() {
        super();
    }

    public isPptSupported = () => {
        return this.chartConfig.series && this.chartConfig.series.length > 0;
    };

    public getDataForPpt = (): IPptSlideExportRequest => {
        const isYearOverYear = isYearOverYearWidget(this);

        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this, { showDuration: false }),
            type: "bar",
            details: {
                format: getYAxisFormat(this),
                options: getBarChartWidgetPptOptions(),
                data: getPOPWidgetSeriesData(this.chartConfig.series, isYearOverYear),
            } as IPptBarChartRequest,
        };
    };

    static getWidgetDashboardType() {
        return "BarChart";
    }

    static getWidgetMetadataType() {
        return "ComparedBar";
    }

    static getWidgetResourceType() {
        return "GraphPOP";
    }

    public chartType = "column";

    public onResize() {
        if (result(this, "chartConfig.options.yAxis")) {
            if (this.pos.sizeX == 2 && this.chartConfig.options.xAxis.categories.length > 5) {
                this.chartConfig.options.yAxis.stackLabels.enabled = false;
                this.chartConfig.options.xAxis.labels.y = 12;
            } else if (
                this.pos.sizeX == 3 &&
                this.chartConfig.options.xAxis.categories.length > 11
            ) {
                this.chartConfig.options.yAxis.stackLabels.enabled = false;
                this.chartConfig.options.xAxis.labels.y = 12;
            } else {
                this.chartConfig.options.yAxis.stackLabels.enabled = true;
                this.chartConfig.options.xAxis.labels.y = 25;
            }
        }
    }
}

ComparedBarWidget.register();
