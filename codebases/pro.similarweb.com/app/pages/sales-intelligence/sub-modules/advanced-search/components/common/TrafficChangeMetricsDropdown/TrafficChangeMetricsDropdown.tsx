import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { IDropDownItem } from "@similarweb/ui-components/dist/dropdown";
import TrafficChangesDropdown from "../TrafficChangesDropdown/TrafficChangesDropdown";

type TrafficChangeMetricsDropdownProps = {
    metrics: readonly string[];
    selected: string | null;
    onSelect(metric: string): void;
};

const TrafficChangeMetricsDropdown = (props: TrafficChangeMetricsDropdownProps) => {
    const translate = useTranslation();
    const { metrics, selected, onSelect } = props;
    /** Metric dropdown items */
    const items: IDropDownItem[] = React.useMemo(() => {
        return metrics.map((metric) => ({
            id: metric,
            key: `metric-dd-item-${metric}`,
            text: translate(`si.lead_gen_filters.trafficChanges.metric.${metric}`),
        }));
    }, [metrics]);

    return (
        <TrafficChangesDropdown
            items={items}
            onSelect={onSelect}
            hasSelection={selected !== null}
            selected={selected ?? "metric-dd-button"}
            buttonText={translate(
                selected !== null
                    ? `si.lead_gen_filters.trafficChanges.metric.${selected}`
                    : "si.components.traffic_change_modal.metric_dd.button",
            )}
        />
    );
};

export default TrafficChangeMetricsDropdown;
