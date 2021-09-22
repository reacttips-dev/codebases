import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import WebsiteTypeFilterContainer from "../../filters/WebsiteTypeFilter/WebsiteTypeFilterContainer";
import { FiltersGroupContainerProps } from "../../../types/common";

const WebsiteTypeGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[{ Component: WebsiteTypeFilterContainer, key: "websiteType" }]}
            name={translate("si.lead_gen_filters.group.websiteType")}
            tooltipText={translate("si.lead_gen_filters.group.websiteType.tooltip")}
        />
    );
};

export default WebsiteTypeGroup;
