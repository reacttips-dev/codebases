import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { FiltersGroupContainerProps } from "../../../types/common";
import RangeFilterContainer from "../../filters/RangeFilter/RangeFilterContainer";
import FiltersGroupContainer from "../../filters-groups/FiltersGroup/FiltersGroupContainer";

const AnnualRevenueGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[{ Component: RangeFilterContainer, key: "annualRevenue" }]}
            name={translate("si.lead_gen_filters.group.annualRevenue.name")}
            tooltipText={translate("si.lead_gen_filters.group.annualRevenue.tooltip")}
        />
    );
};

export default AnnualRevenueGroup;
