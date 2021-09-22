import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { FiltersGroupContainerProps } from "../../../types/common";
import RangeFilterContainer from "../../filters/RangeFilter/RangeFilterContainer";
import FiltersGroupContainer from "../../filters-groups/FiltersGroup/FiltersGroupContainer";

const EmployeeHeadcountGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[{ Component: RangeFilterContainer, key: "employeeCount" }]}
            name={translate("si.lead_gen_filters.group.employeeCount.name")}
            tooltipText={translate("si.lead_gen_filters.group.employeeCount.tooltip")}
        />
    );
};

export default EmployeeHeadcountGroup;
