import React from "react";
import {
    ITabsMd,
    tabs as tabsInner,
    EMetrics,
    ITabMd,
} from "pages/industry-analysis/overview/highLevelMetrics/tabsMD";
import { ScorableTabs } from "components/React/ScorableTabs/ScorableTabs";
import { TabPanel } from "@similarweb/ui-components/dist/tabs/src/..";
import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import { BasicDurations } from "services/DurationService";

type IMetricSummaryDataBase<T extends Record<string, any>> = Record<T[keyof T], number>;
export type IMetricSummaryData = IMetricSummaryDataBase<typeof EMetrics>;

interface ITabsProps {
    tabsMd?: ITabsMd;
    enrichmentData: IMetricSummaryData;
}

export const Tabs: React.FunctionComponent<ITabsProps> = ({
    tabsMd = tabsInner,
    enrichmentData,
}) => {
    const { params } = useIndustryAnalysisOverviewHighLevelMetricsContext();
    const is28d = params.duration === BasicDurations.LAST_TWENTY_EIGHT_DAYS;
    const enrichmentTabs = (enrichmentData: IMetricSummaryData) => (tab: ITabMd) => ({
        ...tab,
        title: tab.getTitle({ is28d }),
        value: tab.formatter(enrichmentData?.[tab.id]),
    });
    const tabs = tabsMd.map(enrichmentTabs(enrichmentData));
    const {
        selectedMetric,
        setSelectedMetric,
    } = useIndustryAnalysisOverviewHighLevelMetricsContext();

    const setSelected = (tab) => {
        setSelectedMetric(tab);
    };
    return (
        <>
            <ScorableTabs tabs={tabs} selectedTab={selectedMetric} setSelected={setSelected}>
                {tabs.map((tab) => (
                    <TabPanel key={tab.id}>
                        <tab.metricComponent />
                    </TabPanel>
                ))}
            </ScorableTabs>
        </>
    );
};
