import { PieChartWidget } from "./PieChartWidget";
import { icons } from "@similarweb/icons";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
export class WWOSearchTrafficWidget extends PieChartWidget {
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
        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-trafficSearch-overview",
            ["marketresearch", "digitalmarketing"],
            this._swNavigator,
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
        let formattedData = this.getChartSeries(response.Data);
        let chartConfig = {
            legend: {
                x: -80,
                y: -30,
                labelFormatter: function () {
                    let itemMarkerClass = `item-marker-mobileweb ${this.iconClass}`;
                    return `<div class="pieChart-legend" title="${this.name}">
                                    <span class="legend-text"><span class="${itemMarkerClass}" style="color: ${
                        this.color
                    };">${icons[this.iconClass]}</span>
                                    <span class="legend-name-organicpaid">${this.name}</span>
                                    </span>&nbsp<span class="legend-value-mobileweb" style="color: ${
                                        this.color
                                    };">${this.percentage.toFixed(2)}%</span>
                                </div>`;
                },
            },
            plotOptions: {
                pie: {
                    innerSize: "68%",
                    size: "70%",
                    center: ["50%", "35%"],
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
        widgetModel.webSource = "Desktop";
        return widgetModel;
    }
}

WWOSearchTrafficWidget.register();
