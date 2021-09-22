import { FiltersConfigResponseDto } from "../../types/common";
import { AdvancedSearchFilter, AdvancedSearchFilterDeps } from "../../types/filters";

export const enum TrafficChangePeriod {
    MonthOverMonth = "mom",
    YearOverYear = "yoy",
}

export const enum TrafficChangeTrend {
    Increase = "increase",
    Decrease = "decrease",
}

export type TrafficChangeType = {
    id: string;
    value: number;
    metric: string;
    enabled?: boolean;
    trend: TrafficChangeTrend;
    period: TrafficChangePeriod;
};

export type TrafficChangesDto = readonly Omit<TrafficChangeType, "id" | "enabled">[];

export type TrafficChangesFilterValue = readonly TrafficChangeType[];

export type TrafficChangesFilterDeps = AdvancedSearchFilterDeps<TrafficChangesFilterValue> &
    FiltersConfigResponseDto["trafficChanges"];

export interface CommonTrafficChangesFilter
    extends AdvancedSearchFilter<TrafficChangesFilterValue> {
    readonly trends: readonly TrafficChangeTrend[];
    readonly periods: readonly TrafficChangePeriod[];
    getMetricsLeft(): readonly string[];
}
