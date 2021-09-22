import { arraysHaveSamePrimitiveValues } from "pages/sales-intelligence/helpers/helpers";
import { getUniqueId } from "pages/sales-intelligence/helpers/common";
import BaseFilter from "../base/BaseFilter";
import {
    CommonTrafficChangesFilter,
    TrafficChangePeriod,
    TrafficChangesDto,
    TrafficChangesFilterDeps,
    TrafficChangesFilterValue,
    TrafficChangeTrend,
    TrafficChangeType,
} from "./types";

export default class TrafficChangesFilter extends BaseFilter<TrafficChangesFilterValue>
    implements CommonTrafficChangesFilter {
    readonly trends: readonly TrafficChangeTrend[];
    readonly periods: readonly TrafficChangePeriod[];
    private readonly metrics: readonly string[];

    constructor(deps: TrafficChangesFilterDeps) {
        super(deps);

        this.trends = deps.trends;
        this.periods = deps.periods;
        this.metrics = deps.metrics;
    }

    getMetricsLeft() {
        return this.metrics.filter((metric) => !this.getCurrentValueMetrics().includes(metric));
    }

    fromDto(dto: TrafficChangesDto) {
        const metricsFromInitialValue = this.getInitialValue().map((item) => item.metric);
        const { defaultTrafficChangesFromDto, customTrafficChanges } = dto.reduce<{
            defaultTrafficChangesFromDto: { [key: string]: TrafficChangeType };
            customTrafficChanges: TrafficChangeType[];
        }>(
            (group, trafficChange) => {
                if (metricsFromInitialValue.includes(trafficChange.metric)) {
                    group.defaultTrafficChangesFromDto[trafficChange.metric] = {
                        ...trafficChange,
                        enabled: true,
                        id: getUniqueId(),
                    };
                } else {
                    group.customTrafficChanges.push({
                        ...trafficChange,
                        enabled: true,
                        id: getUniqueId(),
                    });
                }

                return group;
            },
            { defaultTrafficChangesFromDto: {}, customTrafficChanges: [] },
        );
        const newValue: TrafficChangesFilterValue = this.getInitialValue()
            .map((tc) => {
                const fromDto = defaultTrafficChangesFromDto[tc.metric];

                if (typeof fromDto !== "undefined") {
                    return {
                        ...tc,
                        ...fromDto,
                    };
                }

                return tc;
            })
            .concat(customTrafficChanges);

        return this.setValue(newValue);
    }

    toDto() {
        const onlyEnabled = this.getCurrentlyEnabledItems();

        if (onlyEnabled.length === 0) {
            return {};
        }

        return {
            [this.key]: onlyEnabled.map((value) => {
                const { enabled, id, ...withoutEnabledProp } = value;

                return withoutEnabledProp;
            }),
        };
    }

    compareValueWithDto(dto: TrafficChangesDto) {
        return !this.toDto()[this.key].some((t) => {
            const foundInDto = dto.find((item) => item.metric === t.metric);

            if (!foundInDto) {
                return true;
            }

            return (
                foundInDto.period !== t.period ||
                foundInDto.trend !== t.trend ||
                foundInDto.value !== t.value
            );
        });
    }

    inInitialState() {
        const currentValue = this.getValue();
        const initialValue = this.getInitialValue();

        if (currentValue === initialValue) {
            return true;
        }

        if (currentValue.length !== initialValue.length) {
            return false;
        }

        const initialMetrics = initialValue.map((item) => item.metric);
        const selectedMetrics = this.getCurrentValueMetrics();
        const haveSameMetrics = arraysHaveSamePrimitiveValues(initialMetrics, selectedMetrics);
        const everythingDisabled = this.getCurrentlyEnabledItems().length === 0;

        return haveSameMetrics && everythingDisabled;
    }

    inReadyState() {
        return this.getCurrentlyEnabledItems().length > 0;
    }

    private getCurrentValueMetrics() {
        return this.getValue().map((item) => item.metric);
    }

    private getCurrentlyEnabledItems() {
        return this.getValue().filter((item) => item.enabled);
    }

    protected getSummaryValue() {
        const onlyEnabled = this.getCurrentlyEnabledItems();
        const summaryItems = onlyEnabled.map((item) => {
            const metric = this.translate(`si.lead_gen_filters.${this.key}.metric.${item.metric}`);
            const trend = this.translate(`si.lead_gen_filters.${this.key}.trend.${item.trend}`);

            return `${metric} ${trend}`;
        });

        if (summaryItems.length > 1) {
            const itemsLeft = summaryItems.slice(1).length;

            return `${summaryItems.slice(0, 1).join(", ")} +${itemsLeft}`;
        }

        return summaryItems.join(", ");
    }
}
