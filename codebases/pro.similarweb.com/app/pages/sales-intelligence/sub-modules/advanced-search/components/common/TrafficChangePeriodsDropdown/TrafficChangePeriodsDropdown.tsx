import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { IDropDownItem } from "@similarweb/ui-components/dist/dropdown";
import { TrafficChangePeriod } from "../../../filters/traffic-changes/types";
import TrafficChangesDropdown from "../TrafficChangesDropdown/TrafficChangesDropdown";

type TrafficChangePeriodsDropdownProps = {
    periods: readonly TrafficChangePeriod[];
    selected: TrafficChangePeriod | null;
    onSelect(period: TrafficChangePeriod): void;
};

const TrafficChangePeriodsDropdown = (props: TrafficChangePeriodsDropdownProps) => {
    const translate = useTranslation();
    const { periods, selected, onSelect } = props;
    /** Period dropdown items */
    const items: IDropDownItem[] = React.useMemo(() => {
        return periods.map((period) => ({
            id: period,
            key: `period-dd-item-${period}`,
            text: translate(`si.components.traffic_change_modal.period_dd.${period}`),
        }));
    }, [periods]);

    return (
        <TrafficChangesDropdown
            items={items}
            onSelect={onSelect}
            hasSelection={selected !== null}
            selected={selected ?? "period-dd-button"}
            buttonText={translate(
                `si.components.traffic_change_modal.period_dd.${
                    selected !== null ? selected : "button"
                }`,
            )}
        />
    );
};

export default TrafficChangePeriodsDropdown;
