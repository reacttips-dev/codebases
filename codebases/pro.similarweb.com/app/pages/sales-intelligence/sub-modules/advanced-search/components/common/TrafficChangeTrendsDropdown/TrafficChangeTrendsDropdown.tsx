import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { IDropDownItem } from "@similarweb/ui-components/dist/dropdown";
import { TrafficChangeTrend } from "../../../filters/traffic-changes/types";
import TrafficChangesDropdown from "../TrafficChangesDropdown/TrafficChangesDropdown";

type TrafficChangeTrendsDropdownProps = {
    trends: readonly TrafficChangeTrend[];
    selected: TrafficChangeTrend | null;
    onSelect(trend: TrafficChangeTrend): void;
};

const TrafficChangeTrendsDropdown = (props: TrafficChangeTrendsDropdownProps) => {
    const translate = useTranslation();
    const { trends, selected, onSelect } = props;
    /** Trend dropdown items */
    const items: IDropDownItem[] = React.useMemo(() => {
        return trends.map((trend) => ({
            id: trend,
            key: `trend-dd-item-${trend}`,
            text: translate(`si.lead_gen_filters.trafficChanges.trend.${trend}d_by`),
        }));
    }, [trends]);

    return (
        <TrafficChangesDropdown
            items={items}
            onSelect={onSelect}
            hasSelection={selected !== null}
            selected={selected ?? "trend-dd-button"}
            buttonText={translate(
                selected !== null
                    ? `si.lead_gen_filters.trafficChanges.trend.${selected}d_by`
                    : "si.components.traffic_change_modal.trend_dd.button",
            )}
        />
    );
};

export default TrafficChangeTrendsDropdown;
