import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import React from "react";

export const TimeGranularitySwitcher = ({ timeGranularity, granularityUpdate, getGranularity }) => {
    return (
        <SwitcherGranularityContainer
            itemList={getGranularity()}
            selectedIndex={getGranularity().findIndex((ga) => ga.name === timeGranularity.name)}
            onItemClick={granularityUpdate}
            customClass={"CircleSwitcher"}
        />
    );
};
