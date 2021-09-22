import * as _ from "lodash";
import {
    IPptBarChartOptions,
    IPptSeriesData,
    IPptSlideExportRequest,
} from "services/PptExportService/PptExportServiceTypes";
import { getWidgetSubtitle, getWidgetTitle } from "../widget-utilities/widgetPpt/PptWidgetUtils";
import { BarChartWidget } from "./BarChartWidget";
import { IPptBarChartRequest } from "services/PptExportService/PptExportServiceTypes";
export class WWOSocialBarSIWidget extends BarChartWidget {
    static $inject = ["WWOSocialBar"];
    private _WWOSocialBar;

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;
    public isPptSupported = () => {
        const hasSeries = this.chartConfig.series && this.chartConfig.series.length > 0;
        if (!hasSeries) return false;

        return this.chartConfig.series[0].data && this.chartConfig.series[0].data.length > 0;
    };

    public getDataForPpt = (): IPptSlideExportRequest => {
        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this),
            type: "bar",
            details: {
                format: "percent",
                options: this.getWidgetPptOptions(),
                data: this.getSeriesDataForPpt(),
            } as IPptBarChartRequest,
        };
    };

    private getSeriesDataForPpt = (): IPptSeriesData[] => {
        const series = this.chartConfig.series[0];
        return series.data.map((record: { key: string; y: number; color: string }) => {
            return {
                seriesName: record.key,
                seriesColor: record.color,
                labels: [series.name],
                values: [record.y / 100],
            };
        });
    };

    private getWidgetPptOptions = (): IPptBarChartOptions => {
        return {
            showLegend: true,
            showValuesOnChart: false,
        };
    };

    static getWidgetDashboardType() {
        return "BarChart";
    }

    static getWidgetMetadataType() {
        return "WWOSocialBar";
    }

    static getWidgetResourceType() {
        return "BarChart";
    }

    initWidget(widgetConfig: any, context: string) {
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    constructor() {
        super();
        this.viewOptions.link = this._swNavigator.href(
            "accountreview_website_social_overview",
            this._swNavigator.getParams(),
        );
        this.viewOptions.target = true ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking = `Bar Chart/Traffic Sources Overview/${this._$filter(
            "i18n",
        )("wwo.social.sources.button")}`;
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        this.metadata.chartOptions.isCompare = false;
        this.metadata.chartOptions.viewOptions = this._viewOptions;
        this.metadata.chartOptions.linkUrl = false;
        const data = _.map(response.Data, function (v, k) {
            return { data: v, name: k };
        });
        const bar = new this._WWOSocialBar(
            this.metadata.chartOptions,
            data,
            this._params.keys.split(","),
        );
        this.chartConfig = bar.getChartConfig();
        this.legendItems = _.map(this.getLegendItems(), (legend) =>
            Object.assign({}, legend, { smallIcon: true }),
        );
    }

    get templateUrl() {
        return "/app/components/widget/widget-templates/barchart.html";
    }

    getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.webSource = "Desktop";
        return widgetModel;
    }
}

WWOSocialBarSIWidget.register();
