import * as _ from "lodash";
import { PieChartWidget } from "./PieChartWidget";
import { ChartMarkerService } from "services/ChartMarkerService";
import { getWidgetCTATarget } from "components/widget/widgetUtils";

export class WWOTopAdNetworkWidget extends PieChartWidget {
    static getWidgetMetadataType() {
        return "PieChart";
    }

    static getWidgetResourceType() {
        return "PieChart";
    }

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        const innerLevelPackage = context.includes("analyzepublishers")
            ? "analyzepublishers"
            : context.includes("competitiveanalysis") ||
              context.includes("companyresearch") ||
              context.includes("affiliateanalysis")
            ? "competitiveanalysis"
            : null;
        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-trafficDisplay-adNetworks",
            ["marketresearch", "digitalmarketing"],
            this._swNavigator,
            innerLevelPackage,
        );
        this.viewOptions.link = this._swNavigator.href(targetState, this._swNavigator.getParams());
        this.viewOptions.target = isSameModule ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking = `${widgetConfig.properties.trackName}/${this._$filter(
            "i18n",
        )(widgetConfig.properties.options.ctaButton)}`;
        super.initWidget(widgetConfig, context);
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        let othersValue: number;
        let formattedData = this.getChartSeries(response.Data);
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
        let chartConfig = {
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
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "PieChart";
        widgetModel.metric = "DashboardAdNetworks";
        return widgetModel;
    }

    protected validateData(response: any) {
        let keys = this._params.keys.split(",");
        let isCompare = keys.length > 1;
        if (isCompare) {
            return super.validateData(response);
        } else {
            let mainDomain = _.head<any>(keys);
            return !_.isEmpty(response[mainDomain]);
        }
    }
}

WWOTopAdNetworkWidget.register();
