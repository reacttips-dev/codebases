import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { WithExpandingProps } from "../../../types/common";
import FiltersCategory from "../FiltersCategory/FiltersCategory";
import WebsiteTypeGroup from "../../filters-groups/WebsiteTypeGroup/WebsiteTypeGroup";
import TechnologiesGroup from "../../filters-groups/TechnologiesGroup/TechnologiesGroup";
import TopLevelDomainsGroup from "../../filters-groups/TopLevelDomainsGroup/TopLevelDomainsGroup";
import WebsiteIndustryGroup from "../../filters-groups/WebsiteIndustryGroup/WebsiteIndustryGroup";

const WebsiteFiltersCategory = (props: WithExpandingProps) => {
    const translate = useTranslation();

    return (
        <FiltersCategory
            {...props}
            name={translate("si.lead_gen_filters.category.website")}
            groupsComponents={[
                WebsiteTypeGroup,
                WebsiteIndustryGroup,
                TechnologiesGroup,
                TopLevelDomainsGroup,
            ]}
        />
    );
};

export default WebsiteFiltersCategory;
