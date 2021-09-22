import React from "react";
import FiltersCategory from "../FiltersCategory/FiltersCategory";
import { useTranslation } from "components/WithTranslation/src/I18n";
import AnnualRevenueGroup from "../../filters-groups/AnnualRevenueGroup/AnnualRevenueGroup";
import EmployeeHeadcountGroup from "../../filters-groups/EmployeeHeadcountGroup/EmployeeHeadcountGroup";
import HeadquartersLocationGroup from "../../filters-groups/HeadquartersLocationGroup/HeadquartersLocationGroup";
import { WithExpandingProps } from "../../../types/common";

const CompanyFiltersCategory = (props: WithExpandingProps) => {
    const translate = useTranslation();

    return (
        <FiltersCategory
            {...props}
            groupsComponents={[
                HeadquartersLocationGroup,
                EmployeeHeadcountGroup,
                AnnualRevenueGroup,
            ]}
            name={translate("si.lead_gen_filters.category.company")}
        />
    );
};

export default CompanyFiltersCategory;
