import { TabList, Tabs } from "@similarweb/ui-components/dist/tabs";
import { Injector } from "common/ioc/Injector";
import { ScorableTabs } from "components/React/ScorableTabs/ScorableTabs";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import {
    CompareTab,
    Icon,
    Pill,
    TabPanelStyled,
    TabsContainer,
} from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import { colorsPalettes } from "@similarweb/styles";
import { AvgVisitDuration } from "pages/website-analysis/TrafficAndEngagement/Metrics/AvgVisitDuration";
import { BounceRate } from "pages/website-analysis/TrafficAndEngagement/Metrics/BounceRate";
import { DeduplicatedAudience } from "pages/website-analysis/TrafficAndEngagement/Metrics/DeduplicatedAudience";
import { PagesPerVisit } from "pages/website-analysis/TrafficAndEngagement/Metrics/PagesPerVisit";
import { UniqueUsers } from "pages/website-analysis/TrafficAndEngagement/Metrics/UniqueUsers";
import { Visits } from "pages/website-analysis/TrafficAndEngagement/Metrics/Visits";
import { i18nFilter } from "filters/ngFilters";
import { StyledHeaderTitle } from "pages/conversion/components/benchmarkOvertime/StyledComponents";
import * as _ from "lodash";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { DeduplicationLockScreen } from "pages/website-analysis/components/deduplicationLockScreen";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import Loader from "pages/website-analysis/website-content/leading-folders/components/Loader";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import * as queryString from "querystring";
import React, { useCallback, useMemo } from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";
import styled from "styled-components";
import { SwLog } from "@similarweb/sw-log";
import { getMonthsToDateTooltipText } from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { useLoading } from "custom-hooks/loadingHook";
import { SwNavigator } from "common/services/swNavigator";
import { addBetaBranchParam } from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { BetaBranchLabel } from "pages/website-analysis/TrafficAndEngagement/BetaBranch/CommonComponents";
import { PageViews } from "pages/website-analysis/TrafficAndEngagement/Metrics/PageViews";

export const TitleContainer: any = styled(FlexRow)`
    padding: 0 21px 0 24px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;
TitleContainer.displayName = "TitleContainer";

const HeaderTitle = styled(StyledHeaderTitle)`
    font-size: 20px;
`;

const MTDLabel = styled.span`
    margin: 0 16px 0 8px;
`;

export const MTDTitle = styled(FlexRow)(
    (props) => `
    cursor: pointer;
    ${
        props.isDisabled &&
        `
        cursor: not-allowed;
    `
    }
    ${MTDLabel} {
        opacity: 0.5;
    }
`,
);

const RightSection = styled(FlexRow)`
    align-items: center;
`;

const unsupportedMTDTabs = ["UniqueUsers", "DeduplicatedAudience"];
const mapTabToDataProperty = {
    Visits: "AvgMonthVisits",
    AvgVisitDuration: "AvgVisitDuration",
    PagesPerVisit: "PagesPerVisit",
    BounceRate: "BounceRate",
    UniqueUsers: "UniqueUsers",
    DeduplicatedAudience: "DedupUniqueUsers",
    PageViews: "TotalPagesViews",
};

export const TrafficAndEngagementTabs = ({
    availableTabs,
    selectedTab,
    showGAApprovedData,
    showBetaBranchData,
    params,
    graphProps,
    hasDedupeClaim,
}) => {
    const { i18n, swNavigator } = React.useMemo(
        () => ({
            i18n: i18nFilter(),
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        }),
        [],
    );
    const [tableDataQuery, tableDataQueryOps] = useLoading();

    const isSingleCompare = graphProps.meta.isSingleMode && showBetaBranchData;

    React.useEffect(() => {
        const { webSource, duration, comparedDuration, country, key, isWWW } = params;
        const { from, to, compareFrom, compareTo, isWindow } = DurationService.getDurationData(
            duration,
            comparedDuration,
        ).forAPI;
        const apiParams =
            "widgetApi/TrafficAndEngagement/EngagementOverview/Table?" +
            queryString.stringify(
                addBetaBranchParam(
                    {
                        ShouldGetVerifiedData: showGAApprovedData,
                        compareTo,
                        compareFrom,
                        country,
                        from,
                        includeSubDomains: isWWW === "*",
                        isWindow,
                        keys: key,
                        webSource:
                            webSource === "Total" && !graphProps.meta.isPOP
                                ? "Combined"
                                : webSource,
                        to,
                        timeGranularity: graphProps.meta.is28Days ? "Daily" : "Monthly",
                    },
                    showBetaBranchData,
                    isSingleCompare,
                ),
            );
        tableDataQueryOps
            .load(() => DefaultFetchService.getInstance().get<{ Data: any }>(apiParams))
            .catch((e) => SwLog.exception("Error in Traffic and engagement", e));
    }, [
        showGAApprovedData,
        params.webSource,
        params.duration,
        params.comparedDuration,
        params.country,
        params.key,
        params.isWWW,
        graphProps.meta.is28Days,
        showBetaBranchData,
        isSingleCompare,
    ]);

    const tabs = React.useMemo(() => {
        const { webSource } = params;

        let tabs = availableTabs.map((tab) => ({
            ...tab,
            ...(tab.getTitle && { title: tab.getTitle(graphProps.meta.is28Days) }),
        }));

        if (!graphProps.meta.isSingleMode) {
            tabs = availableTabs.map(({ value, ...tabProps }) => tabProps);
        } else if (tableDataQuery.data) {
            const webSourceData = tableDataQuery.data.Data.find((i) => i.Source === webSource);
            tabs = tabs.map((tab) => {
                let value = webSourceData?.[mapTabToDataProperty[tab.name]];
                if (graphProps.meta.isPOP && tab.name === "UniqueUsers") {
                    value = undefined;
                }
                return { ...tab, value };
            });
        }

        return tabs;
    }, [
        availableTabs,
        tableDataQuery.data,
        graphProps.meta.is28Days,
        graphProps.meta.isSingleMode,
        graphProps.meta.isPOP,
        params.webSource,
    ]);

    const setSelected = (newSelectedTab) => {
        allTrackers.trackEvent(
            "Metric Button",
            "click",
            `Over Time Graph/Engagement Overview/${newSelectedTab.name}`,
        );
        swNavigator.applyUpdateParams({ selectedWidgetTab: newSelectedTab.name || null });
    };
    const { duration, comparedDuration, mtd } = params;
    const MTDShown = useMemo(
        () =>
            !showBetaBranchData &&
            !DurationService.getDurationData(duration).raw?.isCustom &&
            duration !== "28d",
        [comparedDuration, duration, showBetaBranchData],
    );
    const MTDAvailable = useMemo(() => MTDShown && !unsupportedMTDTabs.includes(selectedTab.name), [
        MTDShown,
        selectedTab,
    ]);
    const isMTDActive = useMemo(() => MTDAvailable && String(mtd).toLowerCase() === "true", [
        MTDAvailable,
        mtd,
    ]);
    const toggleMTD = useCallback(() => {
        if (MTDAvailable) {
            allTrackers.trackEvent("Checkbox", "toggle", `Over Time Graph/Engagement Overview/MTD`);
            swNavigator.applyUpdateParams({ mtd: !isMTDActive }, { replace: true });
        }
    }, [MTDAvailable, isMTDActive]);
    const mtdTooltipText = getMonthsToDateTooltipText(MTDAvailable, isMTDActive);
    const [excelLink, setExcelLink] = React.useState(null);
    const onExcelClick = React.useCallback(() => {
        allTrackers.trackEvent(
            "Download",
            "submit-ok",
            `Over Time Graph/Engagement Overview/Excel`,
        );
    }, []);
    const curGraphProps = React.useMemo(
        () => ({
            ...graphProps,
            meta: {
                ...graphProps.meta,
                MTDAvailable,
                isMTDActive,
                isSingleCompare,
                showBetaBranchData,
            },
            toggleMTD,
            updateExcelLink: setExcelLink,
        }),
        [
            graphProps,
            MTDAvailable,
            isMTDActive,
            toggleMTD,
            setExcelLink,
            isSingleCompare,
            showBetaBranchData,
        ],
    );

    return graphProps.meta.isSingleMode &&
        (tableDataQuery.state === useLoading.STATES.LOADING ||
            tableDataQuery.state === useLoading.STATES.INIT) ? (
        <Loader height="500" />
    ) : (
        <>
            <TitleContainer>
                <HeaderTitle>{i18n("wa.traffic.engagement.over.time.title")}</HeaderTitle>
                <RightSection>
                    {showBetaBranchData && !isSingleCompare && <BetaBranchLabel />}
                    {MTDShown && (
                        <PlainTooltip enabled={true} tooltipContent={mtdTooltipText}>
                            <MTDTitle onClick={toggleMTD} isDisabled={!MTDAvailable}>
                                <OnOffSwitch
                                    isSelected={isMTDActive}
                                    onClick={_.noop}
                                    isDisabled={!MTDAvailable}
                                />
                                <StyledBoxSubtitle>
                                    <MTDLabel>
                                        {i18n("wa.traffic.engagement.over.time.mtd.toggle_label")}
                                    </MTDLabel>
                                </StyledBoxSubtitle>
                            </MTDTitle>
                        </PlainTooltip>
                    )}
                    {excelLink && (
                        <a href={excelLink}>
                            <DownloadButtonMenu
                                Excel={true}
                                downloadUrl={excelLink}
                                exportFunction={onExcelClick}
                            />
                        </a>
                    )}
                </RightSection>
            </TitleContainer>
            {curGraphProps.meta.isSingleMode ? (
                <SingleModeTabs
                    availableTabs={tabs}
                    setSelected={setSelected}
                    selectedTab={selectedTab}
                    hasDedupeClaim={hasDedupeClaim}
                    graphProps={curGraphProps}
                />
            ) : (
                <CompareModeTabs
                    availableTabs={tabs}
                    selectedTab={selectedTab}
                    setSelected={setSelected}
                    graphProps={curGraphProps}
                    hasDedupeClaim={hasDedupeClaim}
                />
            )}
        </>
    );
};

const SingleModeTabs = ({
    availableTabs,
    selectedTab,
    setSelected,
    graphProps,
    hasDedupeClaim,
}) => {
    return (
        <>
            <ScorableTabs tabs={availableTabs} selectedTab={selectedTab} setSelected={setSelected}>
                {getTabsPanels({ availableTabs, hasDedupeClaim, graphProps })}
            </ScorableTabs>
        </>
    );
};

const getTabsPanels = ({ availableTabs, hasDedupeClaim, graphProps }) => {
    graphProps = {
        ...graphProps,
        meta: {
            ...graphProps.meta,
            isSingleMode: graphProps.meta.isSingleMode && !graphProps.meta.isSingleCompare, // if comparing for single, then get config of compare (old vs new)
        },
    };
    const availableTab = (tabName) =>
        availableTabs.find((tab) => tab.name === tabName) !== undefined;
    return (
        <>
            {availableTab("Visits") && (
                <TabPanelStyled>
                    <Visits {...graphProps} />
                </TabPanelStyled>
            )}
            {availableTab("UniqueUsers") && (
                <TabPanelStyled>
                    <UniqueUsers {...graphProps} />
                </TabPanelStyled>
            )}
            {availableTab("DeduplicatedAudience") && (
                <TabPanelStyled>
                    {hasDedupeClaim ? (
                        <DeduplicatedAudience {...graphProps} />
                    ) : (
                        <DeduplicationLockScreen />
                    )}
                </TabPanelStyled>
            )}
            {availableTab("AvgVisitDuration") && (
                <TabPanelStyled>
                    <AvgVisitDuration {...graphProps} />
                </TabPanelStyled>
            )}
            {availableTab("PagesPerVisit") && (
                <TabPanelStyled>
                    <PagesPerVisit {...graphProps} />
                </TabPanelStyled>
            )}
            {availableTab("BounceRate") && (
                <TabPanelStyled>
                    <BounceRate {...graphProps} />
                </TabPanelStyled>
            )}
            {availableTab("PageViews") && (
                <TabPanelStyled>
                    <PageViews {...graphProps} />
                </TabPanelStyled>
            )}
        </>
    );
};

const CompareModeTabs = ({
    selectedTab,
    availableTabs,
    setSelected,
    graphProps,
    hasDedupeClaim,
}) => {
    const i18n = i18nFilter();
    return (
        <TabsContainer>
            <Tabs
                selectedIndex={availableTabs.findIndex((tab) => tab.name === selectedTab.name)}
                onSelect={(index) => setSelected(availableTabs[index])}
            >
                <TabList>
                    {availableTabs.map((tab, index) => (
                        <CompareTab key={index} tooltipText={i18n(tab.tooltip)}>
                            <Icon size="sm" type="inline" iconName={tab.iconName} />
                            {i18n(tab.getTitle ? tab.getTitle() : tab.title)}
                            {tab.beta && <Pill>BETA</Pill>}
                        </CompareTab>
                    ))}
                </TabList>
                {getTabsPanels({ availableTabs, hasDedupeClaim, graphProps })}
            </Tabs>
        </TabsContainer>
    );
};
