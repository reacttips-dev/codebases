import React from "react";
import { EChartViewType } from "../context/types";

export enum EMetrics {
    AvgMonthVisits,
    AvgVisitDuration,
    PagesPerVisit,
    BounceRate,
}

interface IChartType {
    id: EChartViewType;
    title: string;
    disabled: boolean;
}

export interface IMetric {
    id: EMetrics;
    name: string;
    title: string;
    iconName: string;
    tooltip: string;
    metric: string;
    chartTypes?: IChartType[];
    formatter: (value: number) => string;
    invertChangeColors?: boolean;
    tooltipProps?: {
        getChangeColor?: (isDecrease: boolean, isNan: boolean) => string;
        displayTooltipTotalRow?: (args: { webSource?: string }) => boolean;
    };
}

export type IMetrics = IMetric[];
