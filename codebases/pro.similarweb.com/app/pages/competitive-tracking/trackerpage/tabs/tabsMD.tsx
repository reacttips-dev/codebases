import {
    numberFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
    timeFilter,
} from "filters/ngFilters";
import { getChangeColor } from "pages/website-analysis/TrafficAndEngagement/Metrics/BounceRate";
import { EMetrics } from "pages/industry-analysis/overview/highLevelMetrics/tabsMD";
import { IMetrics } from "../metrics/types";
import { EChartViewType } from "../context/types";

const i18n = i18nFilter();

export const CHART_TYPES = [
    { id: EChartViewType.PERCENTAGE, title: "%", disabled: true },
    { id: EChartViewType.PERCENTAGE, title: "#", disabled: false },
];

export const getTabsMD = (): IMetrics => {
    return [
        {
            id: EMetrics.AvgMonthVisits,
            name: "Visits",
            metric: "Visits",
            title: i18n("wa.ao.graph.avgvisits"),
            iconName: "visits",
            tooltip: "wa.ao.graph.avgvisits.tooltip",
            formatter: (value) => minVisitsAbbrFilter()(value),
            chartTypes: CHART_TYPES.map((type) => ({ ...type, disabled: false })),
        },
        {
            id: EMetrics.AvgVisitDuration,
            name: "AvgVisitDuration",
            metric: "AvgVisitDuration",
            title: i18n("wa.ao.graph.avgduration"),
            iconName: "avg-visit-duration",
            tooltip: "wa.ao.graph.avgduration.tooltip",
            formatter: (value) => timeFilter()(value, null),
            chartTypes: CHART_TYPES,
        },
        {
            id: EMetrics.PagesPerVisit,
            name: "PagesPerVisit",
            metric: "PagesPerVisit",
            title: i18n("wa.ao.graph.pages"),
            iconName: "pages-per-visit",
            tooltip: "wa.ao.graph.pages.tooltip",
            formatter: (value) => numberFilter()(value, 2),
        },
        {
            id: EMetrics.BounceRate,
            name: "BounceRate",
            metric: "BounceRate",
            title: i18n("wa.ao.graph.bounce"),
            iconName: "bounce-rate-2",
            tooltip: "wa.ao.graph.bounce.tooltip",
            formatter: (value) => percentageSignFilter()(value, 2),
            invertChangeColors: true,
            tooltipProps: {
                getChangeColor,
            },
        },
    ];
};
