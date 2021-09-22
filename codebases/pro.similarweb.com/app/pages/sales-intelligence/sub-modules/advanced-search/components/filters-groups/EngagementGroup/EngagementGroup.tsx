import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import RangeFilterContainer from "../../filters/RangeFilter/RangeFilterContainer";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import { FiltersGroupContainerProps } from "../../../types/common";

const EngagementGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[
                { Component: RangeFilterContainer, key: "bounceRate" },
                { Component: RangeFilterContainer, key: "avgPagesPerVisit" },
                { Component: RangeFilterContainer, key: "avgVisitDuration" },
            ]}
            name={translate("si.lead_gen_filters.group.engagement")}
            tooltipText={translate("si.lead_gen_filters.group.engagement.tooltip")}
        />
    );
};

export default EngagementGroup;
