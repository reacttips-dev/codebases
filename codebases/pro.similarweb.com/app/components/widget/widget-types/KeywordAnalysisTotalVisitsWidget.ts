import DurationService from "services/DurationService";
import { PieChartWidget } from "./PieChartWidget";
import { i18nFilter } from "../../../filters/ngFilters";
import { WidgetState } from "./Widget";
export class KeywordAnalysisTotalVisitsWidget extends PieChartWidget {
    static getWidgetMetadataType() {
        return "KeywordAnalysisTotalVisits";
    }

    static getWidgetResourceType() {
        return "SingleMetric";
    }

    static getWidgetDashboardType() {
        return "SingleMetric";
    }

    public maxMonths: number;

    constructor() {
        super();
        delete this.errorConfig.messageBottom;
    }

    getData() {
        let durationData, from, to;
        const { startDate, endDate } = this._swSettings.components.KeywordAnalysis;
        const allowedMonthsDiff = DurationService.getDiffSymbol(startDate, endDate, "months");
        this.maxMonths = Math.min(12, parseInt(allowedMonthsDiff.replace("m", "")));

        if (this.maxMonths === 12) {
            durationData = DurationService.getDurationData("12m", null, "KeywordAnalysisOP").forAPI;
        } else {
            durationData = DurationService.getDurationApiFor(
                startDate,
                endDate,
                this._params.isWindow,
            );
        }

        from = durationData.from;
        to = durationData.to;

        this._params.from = from;
        this._params.to = to;
        this._params.webSource = "Total";

        super.getData();
    }

    getViewData() {
        super.getViewData();
        this.viewData.customSubtitle = i18nFilter()(this._widgetConfig.properties.subtitle, {
            months: this.maxMonths,
        });
        return this.viewData;
    }

    callbackOnGetData(response: any) {
        this.data = response.Data;
        let dataFlag: boolean = false;
        Object.keys(this.data).forEach((date) => {
            if (this.data[date].TotalVisits > 0) {
                dataFlag = true;
            }
        });
        if (!dataFlag) {
            this.widgetState = WidgetState.ERROR;
            return;
        }
        super.callbackOnGetData(response);
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/keyword-analysis-total-visits${
            this.dashboardId ? `-dashboard` : ``
        }.html`;
    }
}

KeywordAnalysisTotalVisitsWidget.register();
