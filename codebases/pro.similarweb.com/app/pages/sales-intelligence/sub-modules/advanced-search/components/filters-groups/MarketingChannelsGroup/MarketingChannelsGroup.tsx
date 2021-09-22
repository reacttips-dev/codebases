import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import RangeFilterContainer from "../../filters/RangeFilter/RangeFilterContainer";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import { FiltersGroupContainerProps } from "../../../types/common";

const MarketingChannelsGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[
                { Component: RangeFilterContainer, key: "directShare" },
                { Component: RangeFilterContainer, key: "referralsShare" },
                { Component: RangeFilterContainer, key: "socialShare" },
                { Component: RangeFilterContainer, key: "organicSearchShare" },
                { Component: RangeFilterContainer, key: "paidSearchShare" },
                { Component: RangeFilterContainer, key: "displayAdsShare" },
            ]}
            name={translate("si.lead_gen_filters.group.marketing_channels")}
            tooltipText={translate("si.lead_gen_filters.group.marketing_channels.tooltip")}
        />
    );
};

export default MarketingChannelsGroup;
