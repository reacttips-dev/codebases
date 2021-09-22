import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import {
    getInitialGranularity,
    isMonthsToDateSupported,
    mtdToggleClickedCallback,
    onTimeGranularityToggleCallback,
    changeMonthToDateUrlState,
    isWeeklyKeywordsAvailable,
    closeDashboardsModal,
} from "pages/keyword-analysis/common/UtilityFunctions";
import { CPC } from "pages/keyword-analysis/KeywordsOverviewPage/Components/CPC";
import { SearchVisits } from "pages/keyword-analysis/KeywordsOverviewPage/Components/SearchVisits";
import { SearchVolume } from "pages/keyword-analysis/KeywordsOverviewPage/Components/SearchVolume";
import {
    MetricContainer,
    MetricsRow,
    MetricsRowHeader,
    MetricsSpace,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import DomainsTable from "pages/keyword-analysis/OrganicPage/Domains/Table";
import Graph from "pages/keyword-analysis/OrganicPage/Graph/Graph";
import KeywordsTable from "pages/keyword-analysis/OrganicPage/Keywords/Table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import styled from "styled-components";
import { allTrackers } from "services/track/track";
import { SwNavigator } from "common/services/swNavigator";
import { AddToDashboard } from "../common/AddToDashboard";
import { EAnalysisTabName } from "../common/constants";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const StyledTab = styled(Tab)`
    min-width: 200px;
`;

const i18n = i18nFilter();
const TABLE_SELECTION_KEY = "keywordAnalysis.paid_KeywordAnalysisPaid_Table";

const Paid: React.FC<{ params: any; sites?: any[] }> = (props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(
        props.params.tab === "keywords" ? 1 : 0,
    );
    const [visitsBelowThreshold, setVisitsBelowThreshold] = useState<boolean>(false);
    const addToDashBoardModal = useRef<{ result?: Promise<any>; close?: VoidFunction }>();

    useEffect(() => {
        return closeDashboardsModal(addToDashBoardModal);
    }, []);

    const { params } = props;
    const { country, keyword, isWWW, duration } = params;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const numOfMonths = DurationService.getMonthsFromApiDuration(from, to, isWindow);
    const isKeywordsGroup = keyword?.substring(0, 1) === "*";
    const keys = isKeywordsGroup ? keyword.substring(1) : keyword;
    const { GroupHash } = keywordsGroupsService.findGroupById(keyword.substring(1));
    const queryParams = {
        country,
        from,
        includeSubDomains: isWWW === "*",
        isWindow,
        keys,
        to,
        webSource: "Total",
        GroupHash,
    };
    const commonProps = { queryParams, isKeywordsGroup };

    const onSelectedTabChange = (index) => {
        const tab = index === 0 ? "domains" : "keywords";
        allTrackers.trackEvent("Tab", "click", `Table/${tab}`);
        setSelectedTabIndex(index);
        Injector.get<SwNavigator>("swNavigator").applyUpdateParams({ tab });
    };
    // useMemo to ignore graph render when switching between table tabs
    const graphParams = useMemo(() => {
        const { tab, ...rest } = props.params;
        return { ...rest, webSource: "Desktop", GroupHash, keyword: keys };
    }, [params.mtd]);
    const tableParams = { ...props.params, webSource: "Desktop", GroupHash, keyword: keys };
    const onCalculateVisitsTrend = ({ calculatedAvgVisits }) => {
        if (calculatedAvgVisits < 5000) {
            setVisitsBelowThreshold(true);
            changeMonthToDateUrlState(false);
        }
    };
    const onOpenAddToDashboardModal = async (modal) => {
        addToDashBoardModal.current = modal;
        // clear the ref when the modal is closed
        if (addToDashBoardModal.current.result) {
            addToDashBoardModal.current.result.finally(() => {
                addToDashBoardModal.current = null;
            });
        }
    };

    const initialGranularity = getInitialGranularity({
        duration: graphParams.duration,
        isMonthsToDateActive: params.mtd === true.toString(),
        isWeeklyKeywordsAvailable: isWeeklyKeywordsAvailable(swSettings),
    });

    return (
        <>
            <MetricsRow>
                <MetricContainer>
                    <>
                        <SearchVolume {...commonProps} showZeroClick={false} />
                        <AddToDashboard
                            webSource="Total"
                            type="SingleMetric"
                            metric="KeywordAnalysisVolumes"
                            onOpen={onOpenAddToDashboardModal}
                        />
                    </>
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer>
                    <>
                        <SearchVisits
                            {...commonProps}
                            onCalculateVisitsTrend={onCalculateVisitsTrend}
                        />
                        <AddToDashboard
                            webSource="Total"
                            type="KeywordAnalysisTotalVisits"
                            metric="KeywordAnalysisTrafficShareOverTime"
                            onOpen={onOpenAddToDashboardModal}
                            overrideAddToDasboardParams={{ duration: "12m" }}
                        />
                    </>
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer>
                    <>
                        <CPC {...commonProps} />
                        <AddToDashboard
                            webSource="Total"
                            type="SingleMetric"
                            metric="KeywordAnalysisCPC"
                            onOpen={onOpenAddToDashboardModal}
                        />
                    </>
                </MetricContainer>
            </MetricsRow>
            <br />
            <MetricsRow>
                <Graph
                    params={graphParams}
                    isMarketShareDisable={visitsBelowThreshold}
                    isDailyDisabled={visitsBelowThreshold}
                    initialGranularity={initialGranularity}
                    disableGranularities={numOfMonths >= 6 || visitsBelowThreshold}
                    excelMetric="KeywordAnalysisPaid"
                    addToDashboardMetric="KeywordAnalysisPaid"
                    graphApiEndpoint="/widgetApi/KeywordAnalysisOP/KeywordAnalysisPaid/Graph"
                    sites={props.sites}
                    onOpenAddToDashboardModal={onOpenAddToDashboardModal}
                    isKeywordsGroup={isKeywordsGroup}
                    isMonthsToDateSupported={isMonthsToDateSupported({
                        duration: props.params.duration,
                        visitsBelowThreshold,
                    })}
                    mtdToggleClickedCallback={mtdToggleClickedCallback}
                    onTimeGranularityToggleCallback={onTimeGranularityToggleCallback}
                    pngHeaderDataTypeKey={"Keyword.analysis.paid.png.header.type"}
                />
            </MetricsRow>
            <MetricsRowHeader>{i18n("keywordAnalysis-paid.table.title")}</MetricsRowHeader>
            <MetricsRow>
                <MetricContainer width="100%" height="auto" padding="0px">
                    {isKeywordsGroup ? (
                        <Tabs
                            selectedIndex={selectedTabIndex}
                            onSelect={onSelectedTabChange}
                            forceRenderTabPanel={true}
                        >
                            <TabList>
                                <StyledTab>Domains</StyledTab>
                                <StyledTab>Keywords</StyledTab>
                            </TabList>
                            <TabPanel>
                                <DomainsTable
                                    preventCountTracking={
                                        selectedTabIndex !== EAnalysisTabName.domains
                                    }
                                    params={tableParams}
                                    tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisPaid/Table"
                                    tableSelectionKey={TABLE_SELECTION_KEY}
                                    addToDashboardMetric="KeywordAnalysisPaid"
                                    excelMetric="KeywordAnalysisPaid"
                                    columnsType="paid"
                                    isKeywordsGroup={isKeywordsGroup}
                                />
                            </TabPanel>
                            <TabPanel>
                                <KeywordsTable
                                    preventCountTracking={
                                        selectedTabIndex !== EAnalysisTabName.keywords
                                    }
                                    params={tableParams}
                                    tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisGroupPaid/Table"
                                    excelMetric="KeywordAnalysisGroupPaid"
                                />
                            </TabPanel>
                        </Tabs>
                    ) : (
                        <DomainsTable
                            params={tableParams}
                            tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisPaid/Table"
                            tableSelectionKey={TABLE_SELECTION_KEY}
                            addToDashboardMetric="KeywordAnalysisPaid"
                            columnsType="paid"
                            excelMetric="KeywordAnalysisPaid"
                            isKeywordsGroup={isKeywordsGroup}
                        />
                    )}
                </MetricContainer>
            </MetricsRow>
        </>
    );
};

const mapStateToProps = ({ routing, tableSelection }) => {
    return {
        params: routing.params,
        sites: tableSelection[TABLE_SELECTION_KEY],
    };
};

const connected = connect(mapStateToProps)(Paid);

export default SWReactRootComponent(connected, "KeywordAnalysisPaidPage");
