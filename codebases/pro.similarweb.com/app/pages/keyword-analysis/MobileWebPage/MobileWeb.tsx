import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { Injector } from "common/ioc/Injector";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { CPC } from "pages/keyword-analysis/KeywordsOverviewPage/Components/CPC";
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
import {
    KeywordMetricsSubTitle,
    MetricTitle,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { AssetsService } from "services/AssetsService";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { AddToDashboard } from "../common/AddToDashboard";
import { closeDashboardsModal } from "pages/keyword-analysis/common/UtilityFunctions";
import { EAnalysisTabName } from "../common/constants";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const StyledTab = styled(Tab)`
    min-width: 200px;
`;

const MobileVsDesktopContainer = styled(FlexRow)`
    margin-top: 50px;
`;
const MobileVsDesktopTextContainer = styled(FlexColumn)`
    align-self: flex-end;
    margin-left: 12px;
`;
const MobileVsDesktopTitle = styled.div`
    font-size: 26px;
`;
const MobileVsDesktopSubTitle = styled.div`
    font-size: 16px;
`;

const i18n = i18nFilter();
const TABLE_SELECTION_KEY = "keywordAnalysis.mobile_KeywordAnalysisOrganic_Table";

const MobileWeb: React.FC<{ params: any; sites?: any[] }> = (props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(
        props.params.tab === "keywords" ? 1 : 0,
    );
    const addToDashBoardModal = useRef<{ result?: Promise<any>; close?: VoidFunction }>();
    useEffect(() => {
        return closeDashboardsModal(addToDashBoardModal);
    }, []);
    const { params } = props;
    const { country, keyword, isWWW, duration } = params;
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const durationText = durationObject.forWidget;
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
        return { ...rest, webSource: "MobileWeb", GroupHash, keyword: keys };
    }, []);
    const tableParams = { ...props.params, webSource: "MobileWeb", GroupHash, keyword: keys };
    const onOpenAddToDashboardModal = async (modal) => {
        addToDashBoardModal.current = modal;
        // clear the ref when the modal is closed
        if (addToDashBoardModal.current.result) {
            addToDashBoardModal.current.result.finally(() => {
                addToDashBoardModal.current = null;
            });
        }
    };
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
                        <CPC {...commonProps} />
                        <AddToDashboard
                            webSource="Total"
                            type="SingleMetric"
                            metric="KeywordAnalysisCPC"
                            onOpen={onOpenAddToDashboardModal}
                        />
                    </>
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer>
                    <>
                        <MetricTitle
                            headline={i18n("keywordAnalysis.organic.widgets.trafficshare")}
                            tooltip={i18n(
                                isKeywordsGroup
                                    ? "KeywordAnalysis.organic.widgets.trafficshare.keywordgroup.tooltip"
                                    : "keywordAnalysis.organic.widgets.trafficshare.tooltip",
                            )}
                        />
                        <KeywordMetricsSubTitle subtitle={durationText as string} />
                        <MobileVsDesktopContainer>
                            <img
                                src={AssetsService.assetUrl("/images/phone-data.svg")}
                                width="42px"
                                height="70px"
                                alt=""
                            />

                            <MobileVsDesktopTextContainer>
                                <MobileVsDesktopTitle>{i18n("not.available")}</MobileVsDesktopTitle>
                                <MobileVsDesktopSubTitle>
                                    {i18n("toggler.title.mobile")}
                                </MobileVsDesktopSubTitle>
                            </MobileVsDesktopTextContainer>
                        </MobileVsDesktopContainer>
                    </>
                </MetricContainer>
            </MetricsRow>
            <br />
            <MetricsRow>
                <Graph
                    params={graphParams}
                    disableGranularities={true}
                    graphApiEndpoint="/widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Graph"
                    onOpenAddToDashboardModal={onOpenAddToDashboardModal}
                    addToDashboardMetric="KeywordAnalysisOrganic"
                    sites={props.sites}
                    isKeywordsGroup={isKeywordsGroup}
                    pngHeaderDataTypeKey={"Keyword.analysis.mobile.png.header.type"}
                />
            </MetricsRow>
            <MetricsRowHeader>{i18n("KeywordAnalysis.mobileweb.table.title")}</MetricsRowHeader>
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
                                    tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Table"
                                    tableSelectionKey={TABLE_SELECTION_KEY}
                                    addToDashboardMetric="KeywordAnalysisOrganic"
                                    excelMetric="KeywordAnalysisOrganic"
                                    columnsType="mobile"
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
                            columnsType="mobile"
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

const connected = connect(mapStateToProps)(MobileWeb);

export default SWReactRootComponent(connected, "KeywordAnalysisMobileWebPage");
