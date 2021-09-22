import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { PieChartWidget } from "components/widget/widget-types/PieChartWidget";
import * as _ from "lodash";
export class IndustryAnalysisTrafficShareWidget extends PieChartWidget {
    public static getWidgetMetadataType() {
        return "PieChart";
    }

    public static getWidgetResourceType() {
        return "PieChart";
    }

    public static getAllConfigs(params) {
        const widgetConfig: any = IndustryAnalysisTrafficShareWidget.getWidgetConfig(params);
        const metricConfig = IndustryAnalysisTrafficShareWidget.getMetricConfig();
        const metricTypeConfig = IndustryAnalysisTrafficShareWidget.getMetricTypeConfig();
        const apiController = widgetConfig.properties.apiController;

        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig,
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public static getWidgetConfig(params) {
        return widgetConfig(params);
    }

    public static getMetricConfig() {
        return metricConfig;
    }

    public static getMetricTypeConfig() {
        return metricConfig;
    }

    public isMobileWebCountry: boolean;

    public canAddToDashboard() {
        return true;
    }

    public callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        const country = this._params.country;
        this.isMobileWebCountry = _.includes(
            swSettings.components.MobileWeb.resources.Countries,
            parseInt(country),
        );
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/piechart.html`;
    }

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = this._params.webSource === "Total" ? "PieChart" : "SingleMetric";
        widgetModel.metric = "EngagementVisits";
        return widgetModel;
    }
}

const widgetConfig = (params) => {
    return {
        type: "Table",
        properties: {
            ...params,
            apiController: "IndustryAnalysisOverview",
            family: "Industry",
            tooltip: "wa.ao.trafficshare.tooltip",
            apiParams: {
                metric: "EngagementVisits",
            },
            width: "4",
            height: "186px",
            loadingHeight: "192px",
            title: "wa.ao.trafficshare",
            options: {
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                widgetColors: "mobileWebColors",
                widgetIcons: "mobileWebIcons",
                isMobileOrDesktopOnly: true,
            },
        },
    };
};

const metricConfig = {
    properties: {
        hasWebSource: false,
        options: {
            twoColorMode: true,
            showLegend: false,
            dashboardSubtitleMarginBottom: 15,
        },
    },
    objects: {
        Desktop: {
            name: "Desktop",
            title: "Desktop",
            type: "double",
            format: "None",
            cellTemp: "",
        },
        MobileWeb: {
            name: "MobileWeb",
            title: "Mobile",
            type: "double",
            format: "None",
            cellTemp: "",
        },
    },
    filters: {
        ShouldGetVerifiedData: [
            {
                value: "true",
                title: "Yes",
            },
            {
                value: "false",
                title: "No",
            },
        ],
    },
};
