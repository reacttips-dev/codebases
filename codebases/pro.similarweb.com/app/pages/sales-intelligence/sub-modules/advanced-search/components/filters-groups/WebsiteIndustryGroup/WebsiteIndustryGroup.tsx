import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import WebsiteIndustryFilterContainer from "../../filters/WebsiteIndustryFilter/WebsiteIndustryFilterContainer";
import { FiltersGroupContainerProps } from "../../../types/common";

const WebsiteIndustryGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[{ Component: WebsiteIndustryFilterContainer, key: "categories" }]}
            name={translate("si.lead_gen_filters.group.categories.name")}
            tooltipText={translate("si.lead_gen_filters.group.categories.tooltip")}
        />
    );
};

export default WebsiteIndustryGroup;
