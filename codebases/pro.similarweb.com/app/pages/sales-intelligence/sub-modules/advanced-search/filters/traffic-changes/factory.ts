import { getUniqueId } from "pages/sales-intelligence/helpers/common";
import { SupportedFilterKey } from "../../types/filters";
import { TranslateFunction } from "app/@types/I18nInterfaces";
import TrafficChangesFilter from "./TrafficChangesFilter";
import { FiltersConfigResponseDto } from "../../types/common";
import {
    CommonTrafficChangesFilter,
    TrafficChangePeriod,
    TrafficChangesFilterValue,
    TrafficChangeTrend,
} from "./types";

export default function createTrafficChangesFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
    config: FiltersConfigResponseDto["trafficChanges"],
): CommonTrafficChangesFilter {
    const { trends, metrics, periods } = config;
    const initialValue: TrafficChangesFilterValue = [
        {
            id: getUniqueId(),
            value: 0.05,
            period: TrafficChangePeriod.MonthOverMonth,
            trend: TrafficChangeTrend.Increase,
            metric: "monthly_visits_change",
            enabled: false,
        },
        {
            id: getUniqueId(),
            value: 0.1,
            period: TrafficChangePeriod.YearOverYear,
            trend: TrafficChangeTrend.Increase,
            metric: "unique_monthly_visitors_change",
            enabled: false,
        },
        {
            id: getUniqueId(),
            value: 0.15,
            period: TrafficChangePeriod.MonthOverMonth,
            trend: TrafficChangeTrend.Increase,
            metric: "total_page_views_change",
            enabled: false,
        },
    ];

    return new TrafficChangesFilter({
        key,
        trends,
        metrics,
        periods,
        translate,
        initialValue,
    });
}
