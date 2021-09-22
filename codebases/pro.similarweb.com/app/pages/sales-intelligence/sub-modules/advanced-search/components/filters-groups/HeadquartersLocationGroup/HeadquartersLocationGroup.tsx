import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import HeadquartersFilterContainer from "../../filters/HeadquartersFilter/HeadquartersFilterContainer";
import { FiltersGroupContainerProps } from "../../../types/common";

const HeadquartersLocationGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[{ Component: HeadquartersFilterContainer, key: "companyHeadquarter" }]}
            name={translate("si.lead_gen_filters.companyHeadquarter.name")}
            tooltipText={translate("si.lead_gen_filters.group.companyHeadquarter.tooltip")}
        />
    );
};

export default HeadquartersLocationGroup;
