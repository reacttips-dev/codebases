import * as _ from "lodash";
import { PieChartWidget } from "./PieChartWidget";
import { ChartMarkerService } from "services/ChartMarkerService";

export class WWOTopAdNetworkSIWidget extends PieChartWidget {
    static getWidgetMetadataType() {
        return "PieChart";
    }

    static getWidgetResourceType() {
        return "PieChart";
    }

    constructor() {
        super();
    }

    initWidget(widgetConfig: any, context: string) {
        this.viewOptions.link = this._swNavigator.href(
            "accountreview_website_display_ad_networks",
            this._swNavigator.getParams(),
        );
        this.viewOptions.target = true ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking = `${widgetConfig.properties.trackName}/${this._$filter(
            "i18n",
        )(widgetConfig.properties.options.ctaButton)}`;
        super.initWidget(widgetConfig, context);
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        let othersValue: number;
        const formattedData = this.getChartSeries(response.Data);
        if (formattedData[0].data.length > 0) {
            othersValue = 1 - formattedData[0].data.reduce((a, b) => ({ y: a.y + b.y })).y;
        } else {
            othersValue = 0;
        }
        formattedData[0].data.push({
            color: "#e6e6e6",
            data: [],
            marker: {
                symbol: ChartMarkerService.createMarkerStyle("#e6e6e6").background,
            },
            name: "Others",
            seriesName: "Others",
            y: othersValue,
            zIndex: 1,
        });
        const chartConfig = {
            legend: {
                x: -80,
                y: -25,
            },
            plotOptions: {
                pie: {
                    innerSize: "68%",
                    size: "70%",
                    center: ["50%", "45%"],
                },
            },
        };
        this.metadata.chartOptions.viewOptions = this._viewOptions;
        this.chartConfig = this._ngHighchartsConfig.pie(
            this.metadata.chartOptions,
            formattedData,
            chartConfig,
        );
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/piechart.html`;
    }

    getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "PieChart";
        widgetModel.metric = "DashboardAdNetworks";
        return widgetModel;
    }

    protected validateData(response: any) {
        const keys = this._params.keys.split(",");

        if (keys.length > 1) {
            return super.validateData(response);
        } else {
            return !_.isEmpty(response[_.head<any>(keys)]);
        }
    }
}

WWOTopAdNetworkSIWidget.register();
