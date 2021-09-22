import {
    numberFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
    timeFilter,
} from "filters/ngFilters";
import React from "react";
import { ChartWrapper } from "pages/industry-analysis/overview/highLevelMetrics/ChartWrapper";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import { getChangeColor } from "pages/website-analysis/TrafficAndEngagement/Metrics/BounceRate";

export enum EMetrics {
    AvgMonthVisits,
    AvgVisitDuration,
    PagesPerVisit,
    BounceRate,
}

export interface ITabMd {
    id: EMetrics;
    name: string;
    getTitle: (args: { is28d?: boolean }) => string;
    metric: string;
    iconName: string;
    tooltip: string;
    formatter: (value: number) => string;
    metricComponent: React.FunctionComponent;
    getEndpoint: (args: { isPeriodOverPeriod: boolean }) => string;
    family?: string;
    type?: string;
    getChartType?: (args: { webSource?: string; isPeriodOverPeriod: boolean }) => string;
    mobileWebApiName?: string;
    tooltipProps?: {
        getChangeColor?: (isDecrease: boolean, isNan: boolean) => string;
        displayTooltipTotalRow?: (args: { webSource?: string }) => boolean;
    };
}
export type ITabsMd = ITabMd[];

const i18n = i18nFilter();

const mobileWebApiName = "Mobile Web";

export const tabs: ITabsMd = [
    {
        id: EMetrics.AvgMonthVisits,
        name: "Visits",
        getTitle: ({ is28d }) =>
            is28d ? i18n("wa.ao.graph.avgvisitsdaily") : i18n("wa.ao.graph.avgvisits"),
        metric: "EngagementVisits",
        iconName: "visits",
        tooltip: "wa.ao.graph.avgvisits.tooltip",
        formatter: (value) => minVisitsAbbrFilter()(value),
        metricComponent: ChartWrapper,
        getEndpoint: ({ isPeriodOverPeriod }) =>
            isPeriodOverPeriod
                ? "widgetApi/IndustryAnalysisOverview/EngagementVisits/GraphPOP"
                : "widgetApi/IndustryAnalysisOverview/EngagementVisits/Graph",
        getChartType: ({ webSource, isPeriodOverPeriod }) =>
            webSource === devicesTypes.TOTAL && !isPeriodOverPeriod
                ? chartTypes.AREA
                : chartTypes.LINE,
        tooltipProps: {
            displayTooltipTotalRow: ({ webSource }) => webSource === devicesTypes.TOTAL,
        },
        mobileWebApiName,
    },
    {
        id: EMetrics.AvgVisitDuration,
        name: "AvgVisitDuration",
        getTitle: () => i18n("wa.ao.graph.avgduration"),
        metric: "EngagementAvgVisitDuration",
        iconName: "avg-visit-duration",
        tooltip: "wa.ao.graph.avgduration.tooltip",
        formatter: (value) => timeFilter()(value, null),
        metricComponent: ChartWrapper,
        getEndpoint: ({ isPeriodOverPeriod }) =>
            isPeriodOverPeriod
                ? "widgetApi/IndustryAnalysisOverview/EngagementAvgVisitDuration/GraphPOP"
                : "widgetApi/IndustryAnalysisOverview/EngagementAvgVisitDuration/Graph",
    },
    {
        id: EMetrics.PagesPerVisit,
        name: "PagesPerVisit",
        getTitle: () => i18n("wa.ao.graph.pages"),
        metric: "EngagementPagesPerVisit",
        iconName: "pages-per-visit",
        tooltip: "wa.ao.graph.pages.tooltip",
        formatter: (value) => numberFilter()(value, 2),
        metricComponent: ChartWrapper,
        getEndpoint: ({ isPeriodOverPeriod }) =>
            isPeriodOverPeriod
                ? "widgetApi/IndustryAnalysisOverview/EngagementPagesPerVisit/GraphPOP"
                : "widgetApi/IndustryAnalysisOverview/EngagementPagesPerVisit/Graph",
    },
    {
        id: EMetrics.BounceRate,
        name: "BounceRate",
        getTitle: () => i18n("wa.ao.graph.bounce"),
        metric: "EngagementBounceRate",
        iconName: "bounce-rate-2",
        tooltip: "wa.ao.graph.bounce.tooltip",
        formatter: (value) => percentageSignFilter()(value, 2),
        metricComponent: ChartWrapper,
        getEndpoint: ({ isPeriodOverPeriod }) =>
            isPeriodOverPeriod
                ? "widgetApi/IndustryAnalysisOverview/EngagementBounceRate/GraphPOP"
                : "widgetApi/IndustryAnalysisOverview/EngagementBounceRate/Graph",
        tooltipProps: {
            getChangeColor,
        },
    },
];
