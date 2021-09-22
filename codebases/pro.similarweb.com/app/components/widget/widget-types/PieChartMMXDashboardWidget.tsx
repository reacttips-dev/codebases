import BarChartMMXDashboardWidgetFilters from "components/widget/widget-filters/BarChartMMXDashboardWidgetFilters";
import { PieChartWidget } from "components/widget/widget-types/PieChartWidget";
import { IPptSlideExportRequest } from "services/PptExportService/PptExportServiceTypes";
// import { getWidgetSubtitle, getWidgetTitle } from "../widget-utilities/widgetPpt/WidgetMetricPptHandler";

export class PieChartMMXDashboardWidget extends PieChartWidget {
    private _defaultDataFormat;

    constructor() {
        super();
        this._defaultDataFormat = "percent";
    }

    static getWidgetMetadataType() {
        return "PieChart";
    }

    static getWidgetDashboardType() {
        return "PieChart";
    }

    static getFiltersComponent() {
        return BarChartMMXDashboardWidgetFilters;
    }

    get templateUrl() {
        return "/app/components/widget/widget-templates/piechart.html";
    }

    public callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
    }
}
PieChartMMXDashboardWidget.register();
