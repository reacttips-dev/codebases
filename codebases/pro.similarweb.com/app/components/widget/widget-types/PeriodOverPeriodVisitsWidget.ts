import * as _ from "lodash";
import DurationService from "services/DurationService";
/**
 * Created by liorb on 11/30/2016.
 */
import { SingleMetricWidget } from "./SingleMetricWidget";
import { CHART_COLORS } from "constants/ChartColors";
import {
    adaptSingleMetricChart,
    resolveSingleMetricType,
} from "../widget-utilities/widgetPpt/PptSingleMetricWidgetUtils";
import {
    IPptSingleMetricRecordData,
    IPptSingleMetricRequest,
    IPptSlideExportRequest,
} from "services/PptExportService/PptExportServiceTypes";
import { getWidgetSubtitle, getWidgetTitle } from "../widget-utilities/widgetPpt/PptWidgetUtils";
import { percentageFilter } from "filters/ngFilters";
type periodData = {
    visits: number;
    duration: string;
    color: string;
    barHeight?: string;
    change?: number;
    restricted?: boolean;
};
export class PeriodOverPeriodVisitsWidget extends SingleMetricWidget {
    private _CHART_COLORS;
    private _$window;
    private _popup;
    public periodsData: periodData[] = [];
    static $inject = ["$window"];

    /**
     * POP single metric is not yet supported.
     */
    public isPptSupported = () => {
        return false;
    };

    static getWidgetDashboardType() {
        return "SingleMetric";
    }

    static getWidgetMetadataType() {
        return "PeriodOverPeriodVisits";
    }

    static getWidgetResourceType() {
        return "SingleMetric";
    }

    constructor() {
        super();
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        const durationRange = DurationService.createRange(
            this.durationObject.raw.from,
            this.durationObject.raw.to,
            "months",
        );
        const comparedDurationRange = DurationService.createRange(
            this.durationObject.raw.compareFrom,
            this.durationObject.raw.compareTo,
            "months",
        );
        const hasRestrictedData = durationRange.length > comparedDurationRange.length;

        this.periodsData = [];
        _.forEachRight(this.data, (data, index) => {
            this.periodsData.push({
                visits: data.TotalVisits,
                duration: this.durationObject.forWidget[index],
                color: CHART_COLORS.periodOverPeriod[this._params.webSource][index],
                change: data.Change,
            });
        });

        this.calcBarHeights();

        if (hasRestrictedData) {
            this.periodsData[0].restricted = true;
            this.periodsData[0].barHeight = "100%";
        }
    }

    private calcBarHeights(periods: periodData[] = this.periodsData) {
        const maxPeriod = _.maxBy(periods, (p) => p.visits);
        maxPeriod.barHeight = "100%";

        _.forEach(periods, (p) => {
            if (!p.barHeight) {
                p.barHeight = `${(p.visits / maxPeriod.visits) * 100}%`;
            }
        });
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/singlemetric.html`;
    }
}

PeriodOverPeriodVisitsWidget.register();
