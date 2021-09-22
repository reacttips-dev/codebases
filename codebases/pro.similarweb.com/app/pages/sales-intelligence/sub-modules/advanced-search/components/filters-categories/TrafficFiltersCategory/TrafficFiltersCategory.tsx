import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { WithExpandingProps } from "../../../types/common";
import FiltersCategory from "../FiltersCategory/FiltersCategory";
import VisitsGroup from "../../filters-groups/VisitsGroup/VisitsGroup";
import EngagementGroup from "../../filters-groups/EngagementGroup/EngagementGroup";
import VisitsFromGroup from "../../filters-groups/VisitsFromGroup/VisitsFromGroup";
import MarketingChannelsGroup from "../../filters-groups/MarketingChannelsGroup/MarketingChannelsGroup";
import AudienceAgeGroup from "../../filters-groups/AudienceAgeGroup/AudienceAgeGroup";
import AudienceGenderGroup from "../../filters-groups/AudienceGenderGroup/AudienceGenderGroup";
import TrafficChangesGroup from "../../filters-groups/TrafficChangesGroup/TrafficChangesGroup";

const TrafficFiltersCategory = (props: WithExpandingProps) => {
    const translate = useTranslation();

    return (
        <FiltersCategory
            {...props}
            groupsComponents={[
                VisitsFromGroup,
                VisitsGroup,
                EngagementGroup,
                MarketingChannelsGroup,
                TrafficChangesGroup,
                AudienceGenderGroup,
                AudienceAgeGroup,
            ]}
            name={translate("si.lead_gen_filters.category.traffic")}
        />
    );
};

export default TrafficFiltersCategory;
