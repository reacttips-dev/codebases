import React from "react";
import FiltersGroup from "../FiltersGroup/FiltersGroup";
import { useTranslation } from "components/WithTranslation/src/I18n";
import VisitsFromFilterContainer from "../../filters/VisitsFromFilter/VisitsFromFilterContainer";
import { FiltersGroupContainerProps } from "../../../types/common";

const VisitsFromGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    const renderContent = () => {
        return (
            <VisitsFromFilterContainer filterKey="countries" onRegister={props.onFilterRegister} />
        );
    };

    return (
        <FiltersGroup
            hasValue={false}
            isCollapsible={false}
            renderContent={renderContent}
            name={translate("si.lead_gen_filters.group.countries")}
            tooltipText={translate("si.lead_gen_filters.group.countries.tooltip")}
        />
    );
};

export default VisitsFromGroup;
