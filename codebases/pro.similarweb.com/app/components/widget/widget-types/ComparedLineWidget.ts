import {
    IPptSlideExportRequest,
    IPptLineChartRequest,
} from "services/PptExportService/PptExportServiceTypes";
import { getGraphWidgetPptOptions } from "../widget-utilities/widgetPpt/PptGraphWidgetUtils";
import {
    getWidgetSubtitle,
    getWidgetTitle,
    getYAxisFormat,
} from "../widget-utilities/widgetPpt/PptWidgetUtils";
import { PeriodOverPeriodBase } from "./PeriodOverPeriodBase";
import {
    getPOPWidgetSeriesData,
    isYearOverYearWidget,
} from "components/widget/widget-utilities/widgetPpt/PptPeriodOverPeriodWidgetUtils";

export class ComparedLineWidget extends PeriodOverPeriodBase {
    constructor() {
        super();
    }

    public isPptSupported = () => {
        return this.chartConfig.series && this.chartConfig.series.length > 0;
    };

    public getDataForPpt = (): IPptSlideExportRequest => {
        const isCompareMode = this.isCompare();
        const isYearOverYear = isYearOverYearWidget(this);

        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this, {
                showEntities: !isCompareMode,
                showDuration: false,
            }),
            type: "line",
            details: {
                format: getYAxisFormat(this),
                options: getGraphWidgetPptOptions(this),
                data: getPOPWidgetSeriesData(this.chartConfig.series, isYearOverYear),
            } as IPptLineChartRequest,
        };
    };

    static getWidgetDashboardType() {
        return "Graph";
    }

    static getWidgetMetadataType() {
        return "ComparedBar";
    }

    static getWidgetResourceType() {
        return "GraphPOP";
    }

    public chartType = "line";
}

ComparedLineWidget.register();
