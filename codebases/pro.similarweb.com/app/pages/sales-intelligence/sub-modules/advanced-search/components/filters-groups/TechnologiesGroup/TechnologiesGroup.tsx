import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { FiltersGroupContainerProps } from "../../../types/common";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import TechnologiesFilterContainer from "../../filters/TechnologiesFilter/TechnologiesFilterContainer";

const TechnologiesGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[{ Component: TechnologiesFilterContainer, key: "technologies" }]}
            name={translate("si.lead_gen_filters.group.technologies.name")}
            tooltipText={translate("si.lead_gen_filters.group.technologies.tooltip")}
        />
    );
};

export default TechnologiesGroup;
