import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import { toggleItems } from "components/widget/widget-utilities/time-granularity";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import React from "react";

export const GranularitySwitcher = () => {
    const {
        timeGranularity,
        setTimeGranularity,
        isPeriodOverPeriod,
    } = useIndustryAnalysisOverviewHighLevelMetricsContext();
    const baseItemList = Object.values(toggleItems);
    const PeriodOverPeriodItemList = Object.values(toggleItems).map((item) => {
        return {
            ...item,
            disabled: item.value !== toggleItems.Monthly.value,
        };
    });
    const itemList = isPeriodOverPeriod ? PeriodOverPeriodItemList : baseItemList;
    const selectedIndex = itemList.findIndex(({ title }) => title === timeGranularity.title);
    const onItemClick = (index) => setTimeGranularity(itemList[index]);
    return (
        <SwitcherGranularityContainer
            itemList={itemList}
            selectedIndex={selectedIndex}
            onItemClick={onItemClick}
            customClass={"CircleSwitcher"}
        />
    );
};
