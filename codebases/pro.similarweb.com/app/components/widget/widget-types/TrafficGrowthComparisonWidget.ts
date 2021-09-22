import { CHART_COLORS } from "constants/ChartColors";
import DurationService from "services/DurationService";
import { getTrafficEngagmentComparePopSubtitle } from "../widget-subtitle-templates/traffic-engagment-compare-pop";
import { BarChartWidget } from "./BarChartWidget";
import { sitesResourceService } from "services/sitesResource/sitesResourceService";

export class TrafficGrowthComparisonWidget extends BarChartWidget {
    private _chosenSites: any;

    public isPptSupported = () => {
        return false;
    };

    public static $inject = ["chosenSites"];
    public static getWidgetMetadataType() {
        return "TrafficGrowthComparison";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getWidgetDashboardType() {
        return "BarChart";
    }

    constructor() {
        super();
    }

    public getViewData() {
        super.getViewData();
        const { forWidget } = DurationService.getDurationData(
            this._widgetConfig.properties.duration,
            this._widgetConfig.properties.comparedDuration,
            this._metricConfig.component,
        );
        this.viewData.customSubtitle = getTrafficEngagmentComparePopSubtitle(forWidget);
        this.viewData.duration = forWidget;
        this.viewData.chosenSites = this._chosenSites;
        this.viewData.isDashboard = this._swNavigator.isDashboard();
        return this.viewData;
    }

    public callbackOnGetData(response: any) {
        if (!this._swNavigator.isDashboard()) {
            this.data = response.Data.map((item) => {
                return {
                    Domain: item.Domain,
                    color: this._chosenSites.getSiteColor(item.Domain),
                    ComparedPeriodVisits: item.ComparedPeriodVisits,
                    OriginalPeriodVisits: item.OriginalPeriodVisits,
                    Change: item.Change,
                    image: this._chosenSites.listInfo[item.Domain].icon,
                };
            });
            super.callbackOnGetData(response);
            this.setExcelUrl();
        } else {
            this.data = [];
            sitesResourceService
                .getWebsitesFavicons(response.Data.map(({ Domain }) => Domain))
                .then((icons) => {
                    this.data = response.Data.map((item, index) => {
                        return {
                            Domain: item.Domain,
                            color: CHART_COLORS.compareMainColors[index],
                            ComparedPeriodVisits: item.ComparedPeriodVisits,
                            OriginalPeriodVisits: item.OriginalPeriodVisits,
                            Change: item.Change,
                            image: icons[item.Domain],
                        };
                    });
                    super.callbackOnGetData(response);
                    this.setExcelUrl();
                });
        }
    }

    protected _getExcelEndPoint() {
        const ctrl = this._widgetConfig.properties.apiController;
        const excelMetric = this._widgetConfig.properties.excelMetric;
        return `/widgetApi/${ctrl}/${excelMetric}/Excel?`;
    }

    protected validateData(data) {
        return data && !!data.length;
    }

    private setExcelUrl() {
        this["chartConfig"] = {
            ...this["chartConfig"],
            export: {
                title: this.getViewData().title,
                csvUrl: this.excelUrl,
            },
        };
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/traffic-change-compare.html`;
    }
}

TrafficGrowthComparisonWidget.register();
