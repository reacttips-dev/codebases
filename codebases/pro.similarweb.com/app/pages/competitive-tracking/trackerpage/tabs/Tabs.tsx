import React, { useEffect, useMemo, useState } from "react";
import { NoData } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { ScorableTabs } from "components/React/ScorableTabs/ScorableTabs";
import { TabPanel } from "@similarweb/ui-components/dist/tabs/src/..";
import { useDidMountEffect } from "custom-hooks/useDidMountEffect";
import { ExpandedTableRowLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { percentageSignFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { hasSegmentsClaim } from "pages/segments/config/segmentsConfigHelpers";
import { getTabsMD } from "./tabsMD";
import { IMetric } from "../metrics/types";
import { TabsContainer } from "./styled";
import { useCompetitiveTrackerHighLevelMetricsContext } from "../context/context";
import { fetchData, parseData } from "./data/data";
import { ETabsState } from "./types";
import { CompetitiveTrackingChartWrapper } from "../chart/CompetitiveTrackingChartWrapper";
import {
    ITrackerHeaderData,
    TrackerMetricType,
} from "pages/competitive-tracking/trackerpage/context/types";

export const Tabs = () => {
    const competitiveTrackerHighLevelMetricsContext = useCompetitiveTrackerHighLevelMetricsContext();
    const {
        selectedMetric,
        setSelectedMetric,
        setData,
        data,
        chartViewType,
        segmentsModule,
    } = competitiveTrackerHighLevelMetricsContext;
    const [rawData, setRawData] = useState({});
    const { LOADING, ERROR, LOADED } = ETabsState;
    const [state, setState] = useState<ETabsState>(LOADING);
    const { segmentsLoading } = segmentsModule;

    useDidMountEffect(() => {
        if (segmentsLoading || state === ERROR || !Object.values(rawData).length) return;
        const data = parseData(rawData, competitiveTrackerHighLevelMetricsContext);
        setData(data);
    }, [rawData, chartViewType, segmentsLoading]);

    useEffect(() => {
        const getData = async () => {
            try {
                setState(LOADING);
                const rawData = await fetchData(competitiveTrackerHighLevelMetricsContext);
                setRawData(rawData);
                setState(LOADED);
            } catch (e) {
                setState(ERROR);
            }
        };

        getData();
    }, []);

    const setSelected = (tab: IMetric) => {
        TrackWithGuidService.trackWithGuid("competitive.tracking.click.tab", "click", {
            tab: tab.name,
        });
        setSelectedMetric(tab);
    };

    const enrichmentTabs = (
        enrichmentData: Record<TrackerMetricType, ITrackerHeaderData>,
        duration: number,
    ) => (tab: IMetric) => {
        const { formatter, metric } = tab;

        // We should show year over year data only when the duration is more than 12 months
        const canSupportYOY = duration > 12;
        const yearOverYearData = canSupportYOY &&
            enrichmentData[metric]?.change && {
                valueChange: enrichmentData[metric]?.change,
                valueChangeString: `${percentageSignFilter()(
                    enrichmentData[metric]?.change,
                    0,
                )} YoY`,
            };

        return {
            ...tab,
            value: formatter(enrichmentData[metric]?.average),
            ...yearOverYearData,
        };
    };

    const tabs = useMemo(() => {
        return getTabsMD().map(enrichmentTabs(data.headerData, data.duration));
    }, [data]);

    if (state === ERROR) {
        return (
            <TabsContainer>
                <NoData
                    paddingTop="80px"
                    noDataTitleKey="global.nodata.notavilable"
                    noDataSubTitleKey="workspaces.marketing.nodata.subtitle"
                />
            </TabsContainer>
        );
    }
    return (
        <TabsContainer>
            {state === LOADING || (segmentsLoading && hasSegmentsClaim()) ? (
                <ExpandedTableRowLoader />
            ) : (
                <ScorableTabs tabs={tabs} selectedTab={selectedMetric} setSelected={setSelected}>
                    {tabs.map((tab) => (
                        <TabPanel key={tab.id}>
                            <CompetitiveTrackingChartWrapper />
                        </TabPanel>
                    ))}
                </ScorableTabs>
            )}
        </TabsContainer>
    );
};
