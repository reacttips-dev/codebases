import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import RangeFilterContainer from "../../filters/RangeFilter/RangeFilterContainer";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import { FiltersGroupContainerProps } from "../../../types/common";

const VisitsGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[
                { Component: RangeFilterContainer, key: "monthlyVisits" },
                { Component: RangeFilterContainer, key: "mobileWebVisitsShare" },
                { Component: RangeFilterContainer, key: "uniqueVisitors" },
                { Component: RangeFilterContainer, key: "totalPageViews" },
            ]}
            name={translate("si.lead_gen_filters.group.visits")}
            tooltipText={translate("si.lead_gen_filters.group.visits.tooltip")}
        />
    );
};

export default VisitsGroup;
