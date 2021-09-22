import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import FiltersGroupContainer from "../FiltersGroup/FiltersGroupContainer";
import AudienceFilterContainer from "../../filters/AudienceFilter/AudienceFilterContainer";
import { FiltersGroupContainerProps } from "../../../types/common";

const AudienceGenderGroup = (props: FiltersGroupContainerProps) => {
    const translate = useTranslation();

    return (
        <FiltersGroupContainer
            {...props}
            groupFilters={[{ Component: AudienceFilterContainer, key: "audienceGenderSplits" }]}
            name={translate("si.lead_gen_filters.group.audienceGenderSplits")}
            tooltipText={translate("si.lead_gen_filters.group.audienceGenderSplits.tooltip")}
        />
    );
};

export default AudienceGenderGroup;
