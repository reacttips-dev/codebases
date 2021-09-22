import React from "react";
import { FiltersGroupContainerProps } from "../../../types/common";
import { useTranslation } from "components/WithTranslation/src/I18n";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import TrafficChangesFilterContainer from "../../filters/TrafficChangesFilter/TrafficChangesFilterContainer";

const TrafficChangesGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[{ Component: TrafficChangesFilterContainer, key: "trafficChanges" }]}
            name={translate("si.lead_gen_filters.group.trafficChanges.name")}
            tooltipText={translate("si.lead_gen_filters.group.trafficChanges.tooltip")}
        />
    );
};

export default TrafficChangesGroup;
