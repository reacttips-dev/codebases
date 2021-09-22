import React from "react";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import { useCompetitiveTrackerHighLevelMetricsContext } from "../../context/context";
import { CHART_TYPES } from "../../tabs/tabsMD";

export const GraphTypeSwitcher = () => {
    const competitiveTrackerHighLevelMetricsContext = useCompetitiveTrackerHighLevelMetricsContext();
    const {
        setChartViewType,
        chartViewType,
        selectedMetric,
    } = competitiveTrackerHighLevelMetricsContext;
    const { chartTypes = CHART_TYPES } = selectedMetric;
    const onItemClick = (index) => setChartViewType(index);
    if (chartTypes[chartViewType].disabled) {
        const chartViewType = chartTypes.findIndex(({ disabled }) => !disabled);
        setChartViewType(chartViewType);
    }
    return (
        <Switcher
            selectedIndex={chartViewType}
            customClass="CircleSwitcher"
            onItemClick={onItemClick}
        >
            {chartTypes.map(({ id, title, disabled }) => (
                <CircleSwitcherItem key={id} disabled={disabled}>
                    {title}
                </CircleSwitcherItem>
            ))}
        </Switcher>
    );
};
