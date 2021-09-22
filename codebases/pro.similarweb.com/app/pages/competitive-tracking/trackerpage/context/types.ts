import { granularityItem } from "components/widget/widget-utilities/time-granularity";
import { ILegendItems } from "components/React/Legends/styledComponents";
import { TChartType } from "UtilitiesAndConstants/Constants/ChartTypes";
import { ISegmentsModule } from "services/competitiveTracker/types";
import { ETabsState } from "../tabs/types";
import { IMetric } from "../metrics/types";

export enum EChartTypes {
    AREA = "area",
    LINE = "line",
}

export enum EChartViewType {
    PERCENTAGE,
    ABSOLUTE,
}

interface IQueryParams {
    trackerId: string;
}

/**
 * Metric type can be one of the following: AvgMonthVisits, AvgVisitDuration, PagesPerVisit, BounceRate,
 */
export type TrackerMetricType = string;

/**
 * Used for rendering the tab and overview data for a specific metric
 */
export interface ITrackerHeaderData {
    average?: number;
    change?: number;
}

/**
 * A single metric data. used for rendering a specific graph tab in the trackers page.
 */
export interface ITrackerMetricData {
    name: string;
    color: string;
    data: Array<{ x: number; y: number }>;
    legendData: number;
}

export interface ITrackerData {
    /**
     * Data used for rendering the graph
     */
    chartData: Record<TrackerMetricType, ITrackerMetricData[]>;

    /**
     * Data used for overview and tabs
     */
    headerData: Record<TrackerMetricType, ITrackerHeaderData>;

    /**
     * Number of months that the data covers (3 months / 12 months / 13 months)
     */
    duration: number;
}

export interface ICompetitiveTrackerHighLevelMetricsContext {
    timeGranularity: granularityItem;
    selectedMetric: IMetric;
    queryParams: IQueryParams;
    endpoint: string;
    setSelectedMetric: (metric: IMetric) => void;
    setData: (newData: any) => void;
    data: ITrackerData;
    chartType: TChartType;
    legendItems: ILegendItems;
    setLegendItems: (legendItems: ILegendItems) => void;
    setChartType: (chartType: TChartType) => void;
    chartViewType: EChartViewType;
    setChartViewType: (chartViewType: EChartViewType) => void;
    segmentsModule: ISegmentsModule;
    trackerState: ETabsState;
    setTrackerState: (tabsState: ETabsState) => void;
}
