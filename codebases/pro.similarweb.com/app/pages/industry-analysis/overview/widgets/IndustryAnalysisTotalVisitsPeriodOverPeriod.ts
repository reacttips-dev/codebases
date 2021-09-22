import { PeriodOverPeriodVisitsWidget } from "../../../../components/widget/widget-types/PeriodOverPeriodVisitsWidget";

export class IndustryAnalysisTotalVisitsPeriodOverPeriod extends PeriodOverPeriodVisitsWidget {
    public static getWidgetMetadataType() {
        return "SingleMetric";
    }

    public static getWidgetResourceType() {
        return "SingleMetric";
    }

    public static getAllConfigs(params) {
        const widgetConfig: any = IndustryAnalysisTotalVisitsPeriodOverPeriod.getWidgetConfig(
            params,
        );
        const metricConfig = IndustryAnalysisTotalVisitsPeriodOverPeriod.getMetricConfig();
        const metricTypeConfig = IndustryAnalysisTotalVisitsPeriodOverPeriod.getMetricTypeConfig();
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

    public canAddToDashboard() {
        return true;
    }

    public getWidgetModel() {
        return Object.assign(super.getWidgetModel(), { metric: "EngagementVisits" });
    }

    get templateUrl() {
        return `/app/components/single-metric/single-metric-website-overview-change-pop.html`;
    }
}

const widgetConfig = (params) => {
    return {
        type: "PeriodOverPeriodVisits",
        properties: {
            apiController: "IndustryAnalysisOverview",
            type: "PeriodOverPeriodVisits",
            periodOverPeriodSupport: true,
            width: "4",
            height: "186px",
            loadingHeight: "192px",
            title: "wa.ao.totalvisits",
            ...params,
            family: "Industry",
            tooltip: "wa.ao.totalvisits.tooltip",
            apiParams: {
                metric: "EngagementVisits",
            },
            options: {
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                titleClass: "",
                showSubtitle: false,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                titleIcon: true,
                height: "194px",
                template:
                    "/app/components/single-metric/single-metric-website-overview-change-pop.html",
            },
        },
    };
};

const metricConfig = {
    properties: {
        hasWebSource: true,
        periodOverPeriodSupport: true,
        component: "IndustryAnalysisOverview",
        family: "Industry",
        state: "industryAnalysis-overview",
        titleState: "industryAnalysis-overview",
        options: {
            showLegend: false,
            dashboardSubtitleMarginBottom: 15,
        },
        modules: {
            Industry: {
                title: "wa.ao.totalvisits",
            },
        },
    },
    objects: {
        TotalVisits: {
            name: "TotalVisits",
            share: "ShareOfVisits",
            title: "Total Visits",
            type: "number",
            format: "abbrNumberVisits",
            cellTemp: "large-number",
        },
        Change: {
            name: "Change",
            title: "Monthly Change",
            type: "int?",
            format: "change",
            cellTemp: "change",
        },
        Trend: {
            name: "Trend",
            title: "Trend",
            type: "long[]",
            format: "None",
            cellTemp: "trend-line",
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
