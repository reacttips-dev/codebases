import * as IWidget from "components/widget/widget-types/Widget";
import * as TrafficSources from "./dashboardWizardTrafficSourceGenerator";
import { IWidgetModelTypesType } from "../../../widget/widget-types/Widget";

export interface IDashboardWizardFormElements {
    autocomplete: IDashboardWizardFormElement;
    webSource: IDashboardWizardFormElement;
    duration: IDashboardWizardFormElement;
    country: IDashboardWizardFormElement;
    type: IDashboardWizardFormElement;
    trafficChannels: IDashboardWizardFormElement;
}

export interface IDashboardWizardFormElement {
    isActive: boolean;
    isVisible: boolean;
}

interface IdashboardWidgetWizardState {
    widget: IWidget.IWidgetModel;
    isCompare: boolean;
    component: string;
    mobileWebComponent: string;
    formElements: IDashboardWizardFormElements;
    availableTrafficSources: Array<TrafficSources.TrafficSource>;
    availableDurations: any;
    minDate?: any;
    maxDate?: any;
    availableCountries: any;
    availableWidgetTypes: any;
    availableFilters: any;
    comparedDurationItems?: any;
    appStore?: any;
    selectedWidgetType?: IWidgetModelTypesType;
    disableDatepicker?: boolean;
    androidOnly?: boolean;
}

export default function getDefaultstate(): IdashboardWidgetWizardState {
    return {
        widget: {
            key: [],
            selectedChannel: "Direct",
            comparedDuration: undefined,
            metric: "EngagementVisits",
            webSource: "Total",
            duration: "3m",
            country: 999,
            type: "Graph",
            filters: {
                timeGranularity: "Daily",
            },
            width: 2,
            customAsset: false,
        },
        selectedWidgetType: "Graph",
        isCompare: true,
        component: "WebAnalysis",
        mobileWebComponent: "",
        formElements: {
            autocomplete: {
                isActive: true,
                isVisible: true,
            },
            webSource: {
                isActive: true,
                isVisible: true,
            },
            duration: {
                isActive: true,
                isVisible: true,
            },
            country: {
                isActive: true,
                isVisible: true,
            },
            type: {
                isActive: true,
                isVisible: true,
            },
            trafficChannels: {
                isActive: false,
                isVisible: false,
            },
        },
        availableTrafficSources: [
            {
                id: "Total",
                text: "analysis.single.trafficsources.tabs.total",
                icon: "sw-icon-widget-total",
                upgrade: false,
            },
            {
                id: "Desktop",
                text: "analysis.audience.mobileweb.desktop.traffic",
                icon: "desktop",
                upgrade: false,
            },
            {
                id: "MobileWeb",
                text: "analysis.audience.overview.mobile",
                icon: "mobile-web",
                upgrade: false,
            },
        ],
        availableDurations: [
            {
                buttonText: "Last 28 Days",
                displayText: "Last 28 Days (As of Jun 08)",
                value: "28d",
                enabled: true,
            },
            {
                buttonText: "Last 1 month",
                displayText: "May 17 - May 17 (1 month)",
                value: "1m",
                enabled: true,
            },
            {
                buttonText: "Last 3 months",
                displayText: "Mar 17 - May 17 (3 months)",
                value: "3m",
                enabled: true,
            },
            {
                buttonText: "Last 6 months",
                displayText: "Dec 16 - May 17 (6 months)",
                value: "6m",
                enabled: false,
            },
            {
                buttonText: "Last 12 months",
                displayText: "Jun 16 - May 17 (12 months)",
                value: "12m",
                enabled: false,
            },
            {
                buttonText: "Last 18 months",
                displayText: "Dec 15 - May 17 (18 months)",
                value: "18m",
                enabled: false,
            },
            {
                buttonText: "Last 24 months",
                displayText: "Jun 15 - May 17 (24 months)",
                value: "24m",
                enabled: false,
            },
        ],
        availableCountries: [
            {
                id: 999,
                code: "ww",
                children: [],
                icon: "flag flag-ww",
                text: "WorldWide",
            },
        ],
        availableWidgetTypes: [
            {
                title: "dashboard.widgets.types.table",
                order: "3",
                width: 2,
                id: "Table",
                dashboard: true,
                type: "Table",
                disabled: true,
            },
            {
                title: "dashboard.widgets.types.graph",
                order: "2",
                width: 2,
                id: "Graph",
                dashboard: true,
                type: "Graph",
                disabled: false,
            },
            {
                title: "dashboard.widgets.types.pie",
                order: "1",
                width: 1,
                id: "PieChart",
                dashboard: true,
                type: "PieChart",
                disabled: false,
            },
            {
                title: "dashboard.widgets.types.bar",
                order: "5",
                width: 2,
                id: "BarChart",
                dashboard: true,
                type: "BarChart",
                disabled: true,
            },
            {
                title: "dashboard.widgets.types.single",
                order: "4",
                width: 1,
                id: "SingleMetric",
                dashboard: true,
                type: "SingleMetric",
                disabled: false,
            },
        ],
        availableFilters: [],
        comparedDurationItems: [],
        disableDatepicker: false,
    };
}
