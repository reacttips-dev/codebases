import { TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import {
    getInitialGranularity,
    isMonthsToDateSupported,
    mtdToggleClickedCallback,
    onTimeGranularityToggleCallback,
    isWeeklyKeywordsAvailable,
    closeDashboardsModal,
    onOpenAddToDashboardModal,
    onCalculateVisitsTrend,
    getCommonProps,
    onSelectedTabChange,
} from "pages/keyword-analysis/common/UtilityFunctions";
import { CPC } from "pages/keyword-analysis/KeywordsOverviewPage/Components/CPC";
import { SearchVisits } from "pages/keyword-analysis/KeywordsOverviewPage/Components/SearchVisits";
import { SearchVolume } from "pages/keyword-analysis/KeywordsOverviewPage/Components/SearchVolume";
import {
    MetricContainer,
    MetricsRow,
    MetricsRowHeader,
    MetricsSpace,
    StyledTab,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import DomainsTable from "pages/keyword-analysis/OrganicPage/Domains/Table";
import Graph from "pages/keyword-analysis/OrganicPage/Graph/Graph";
import KeywordsTable from "pages/keyword-analysis/OrganicPage/Keywords/Table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { AddToDashboard } from "../common/AddToDashboard";
import {
    EAnalysisTabName,
    DEFAULT_TABLE_TABS_HEADER_KEYS,
} from "pages/keyword-analysis/common/constants";

const i18n = i18nFilter();
const TABLE_SELECTION_KEY = "keywordAnalysis.organic_KeywordAnalysisOrganic_Table";

const Organic: React.FC<{ params: any; sites?: any[]; tabsHeaderKeys: string[] }> = (props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(
        props.params.tab === "keywords" ? EAnalysisTabName.keywords : EAnalysisTabName.domains,
    );
    const [visitsBelowThreshold, setVisitsBelowThreshold] = useState<boolean>(false);
    const addToDashBoardModal = useRef<{ result?: Promise<any>; close?: VoidFunction }>();
    useEffect(() => {
        return closeDashboardsModal(addToDashBoardModal);
    }, []);
    const { params, tabsHeaderKeys = DEFAULT_TABLE_TABS_HEADER_KEYS } = props;
    const { keyword, duration } = params;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const numOfMonths = DurationService.getMonthsFromApiDuration(from, to, isWindow);
    const commonProps = getCommonProps(params);
    const { isKeywordsGroup, GroupHash } = commonProps;
    const keys = isKeywordsGroup ? keyword.substring(1) : keyword;

    // useMemo to ignore graph render when switching between table tabs
    const graphParams = useMemo(() => {
        const { tab, ...rest } = props.params;
        return {
            ...rest,
            webSource: "Desktop",
            GroupHash,
            keyword: keys,
        };
    }, [params.mtd]);
    const tableParams = { ...props.params, webSource: "Desktop", GroupHash, keyword: keys };
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
                        <SearchVolume {...commonProps} showZeroClick={true} />
                        <AddToDashboard
                            webSource="Total"
                            type="SingleMetric"
                            metric="KeywordAnalysisVolumes"
                            onOpen={onOpenAddToDashboardModal(addToDashBoardModal)}
                        />
                    </>
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer>
                    <>
                        <SearchVisits
                            {...commonProps}
                            onCalculateVisitsTrend={onCalculateVisitsTrend(setVisitsBelowThreshold)}
                        />
                        <AddToDashboard
                            webSource="Total"
                            type="KeywordAnalysisTotalVisits"
                            metric="KeywordAnalysisTrafficShareOverTime"
                            onOpen={onOpenAddToDashboardModal(addToDashBoardModal)}
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
                            onOpen={onOpenAddToDashboardModal(addToDashBoardModal)}
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
                    excelMetric="KeywordAnalysisOrganic"
                    addToDashboardMetric="KeywordAnalysisOrganic"
                    graphApiEndpoint="/widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Graph"
                    sites={props.sites}
                    onOpenAddToDashboardModal={onOpenAddToDashboardModal(addToDashBoardModal)}
                    isKeywordsGroup={isKeywordsGroup}
                    isMonthsToDateSupported={isMonthsToDateSupported({
                        duration: props.params.duration,
                        visitsBelowThreshold,
                    })}
                    disableGranularities={numOfMonths >= 6 || visitsBelowThreshold}
                    mtdToggleClickedCallback={mtdToggleClickedCallback}
                    onTimeGranularityToggleCallback={onTimeGranularityToggleCallback}
                    pngHeaderDataTypeKey={"Keyword.analysis.organic.png.header.type"}
                />
            </MetricsRow>
            <MetricsRowHeader>{i18n("KeywordAnalysis.organic.table.title")}</MetricsRowHeader>
            <MetricsRow>
                <MetricContainer width="100%" height="auto" padding="0px">
                    {isKeywordsGroup ? (
                        <Tabs
                            selectedIndex={selectedTabIndex}
                            onSelect={onSelectedTabChange(setSelectedTabIndex)}
                            forceRenderTabPanel={true}
                        >
                            <TabList>
                                {tabsHeaderKeys.map((tabsHeaderKeys) => (
                                    <StyledTab key={tabsHeaderKeys}>
                                        {i18n(tabsHeaderKeys)}
                                    </StyledTab>
                                ))}
                            </TabList>
                            <TabPanel>
                                <DomainsTable
                                    preventCountTracking={
                                        selectedTabIndex !== EAnalysisTabName.domains
                                    }
                                    params={tableParams}
                                    tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Table"
                                    tableSelectionKey={TABLE_SELECTION_KEY}
                                    addToDashboardMetric="KeywordAnalysisOrganic"
                                    excelMetric="KeywordAnalysisOrganic"
                                    columnsType="organic"
                                    isKeywordsGroup={isKeywordsGroup}
                                />
                            </TabPanel>
                            <TabPanel>
                                <KeywordsTable
                                    preventCountTracking={
                                        selectedTabIndex !== EAnalysisTabName.keywords
                                    }
                                    params={tableParams}
                                    tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisGroupOrganic/Table"
                                    excelMetric="KeywordAnalysisGroupOrganic"
                                />
                            </TabPanel>
                        </Tabs>
                    ) : (
                        <DomainsTable
                            params={tableParams}
                            tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Table"
                            tableSelectionKey={TABLE_SELECTION_KEY}
                            addToDashboardMetric="KeywordAnalysisOrganic"
                            excelMetric="KeywordAnalysisOrganic"
                            columnsType="organic"
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

const connected = connect(mapStateToProps)(Organic);

export default SWReactRootComponent(connected, "KeywordAnalysisOrganicPage");
