import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import TopLevelDomainsFilterContainer from "../../filters/TopLevelDomainsFilter/TopLevelDomainsFilterContainer";
import { FiltersGroupContainerProps } from "../../../types/common";

const TopLevelDomainsGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[{ Component: TopLevelDomainsFilterContainer, key: "topLevelDomain" }]}
            name={translate("si.lead_gen_filters.group.topLevelDomain.name")}
            tooltipText={translate("si.lead_gen_filters.group.topLevelDomain.tooltip")}
        />
    );
};

export default TopLevelDomainsGroup;
