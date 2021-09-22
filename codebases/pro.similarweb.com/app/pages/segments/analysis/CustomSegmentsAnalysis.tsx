import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Tabs } from "@similarweb/ui-components/dist/tabs";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { TabList } from "@similarweb/ui-components/dist/tabs/src/TabsList";
import { Injector } from "common/ioc/Injector";
import xAxisLabelConfigWithLowConfidenceMarker from "components/Chart/src/configs/xAxis/xAxisLabelConfigWithLowConfidenceMarker";
import { formatTooltipPointWithConfidence } from "components/Chart/src/data/confidenceProcessor";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { tickIntervals } from "components/widget/widget-types/GraphWidget";
import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import styled from "styled-components";
import { tooltipPositioner } from "../../../services/HighchartsPositioner";
import Loader from "pages/website-analysis/website-content/leading-folders/components/Loader";
import { NoDataSegments } from "pages/website-analysis/website-content/leading-folders/components/NoDataSegments";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import { Component } from "react";
import ReactDOMServer from "react-dom/server";
import DurationService from "services/DurationService";
import { PeriodOverPeriodChart } from "../../../../.pro-features/components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChart";
import SegmentsApiService from "services/segments/segmentsApiService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import Chart from "../../../../.pro-features/components/Chart/src/Chart";
import combineConfigs from "../../../../.pro-features/components/Chart/src/combineConfigs";
import noLegendConfig from "../../../../.pro-features/components/Chart/src/configs/legend/noLegendConfig";
import markerWithDashedConfig from "../../../../.pro-features/components/Chart/src/configs/series/markerWithDashedLinePerPointChartConfig";
import yAxisLabelsConfig from "../../../../.pro-features/components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { granularities } from "../../../../.pro-features/utils";
import {
    CHART_NAME,
    granularityConfigs,
    tabsMeta,
} from "../../website-analysis/website-content/leading-folders/FolderAnalysisDefaults";
import {
    FolderAnalysisContainer,
    MTDLabel,
    SimpleChartContainer,
    StyledScorableTab,
    StyledTabsCarousel,
} from "../../website-analysis/website-content/leading-folders/StyledComponents";
import { FlexColumn, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips";
import { SegmentSubtitle } from "../../../../.pro-features/pages/segments/components/benchmarkOvertime/SegmentsVsGroupLineChart";
import { algoChangeDateConfig } from "components/Chart/src/configs/plotLines/algoChangeDateConfig";
import { SwTrack } from "services/SwTrack";
import { StyledHeaderTitle } from "pages/website-analysis/audience-overlap/StyledComponents";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { TitleContainerWithBorder } from "pages/segments/geography/StyledComponents";
import { MTDTitle } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/ChannelAnalysisChartContainer";
import { swSettings } from "common/services/swSettings";
import { isPartialDataPoint } from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { getTooltipHeaderElement } from "UtilitiesAndConstants/UtilitiesComponents/chartTooltipHeaderWithMTDSupport";

export const TooltipWrapper = styled.div`
    padding: 10px 15px 5px;
    border-radius: 5px;
    white-space: normal;
`;

export interface ICustomSegmentsAnalysisProps {
    currentSegment: any;
}
const weeklyPredicate = (dataPoint) =>
    dataPoint.Value.Confidence > 0 && dataPoint.Value.Confidence <= 0.3;
const monthlyPredicate = (dataPoint) =>
    dataPoint.Value.Confidence > 0 && dataPoint.Value.Confidence < 1;
const UNIQUE_USERS = "UniqueUsers";
const MINIMUM_MONTHLY_MAX_VISITS_DAILY_GRANULARITY_TRESHOLD = 15000;
const dailyGranularityVisiblePredicate = (dataPoint) => {
    return dataPoint.Value?.Value > MINIMUM_MONTHLY_MAX_VISITS_DAILY_GRANULARITY_TRESHOLD;
};

export default class CustomSegmentsAnalysis extends Component<ICustomSegmentsAnalysisProps, any> {
    private response: any;
    private graphData: any;
    private swNavigator: any;
    private segmentsApiService: SegmentsApiService;
    private tabs: any[];
    constructor(props) {
        super(props);
        this.swNavigator = Injector.get<any>("swNavigator");
        this.segmentsApiService = new SegmentsApiService();
        const { comparedDuration, duration } = this.swNavigator.getParams();
        const durationRaw = DurationService.getDurationData(duration).raw;
        const monthDiff = durationRaw.to.diff(durationRaw.from, "month");
        this.state = {
            loading: true,
            renderEmpty: false,
            isPOPMode: comparedDuration,
            tab: "Visits",
            timeGranularity: monthDiff < 1 ? granularities[1] : granularities[2],
            availableGran: [
                { title: "D", disabled: false },
                { title: "W", disabled: false },
                { title: "M", disabled: monthDiff < 1 },
            ],
            tabSelectedIndex: 0,
            isUniqueUsersTab: false,
            isMTDActive: !comparedDuration && !durationRaw.isCustom,
            isMTDEnabled: !(comparedDuration || duration === "28d" || durationRaw.isCustom),
        };
    }

    public async componentDidMount() {
        try {
            this.response = await this.getResponseData();
        } catch {
            this.setState({
                loading: false,
            });
        }
        this.setResponse();
    }

    // this component render twice when POP mode changed, first render happening when isPOPMode props changed
    // and its run before angular render all the component and fetch the new appropriate data
    public shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isPOPMode !== this.state.isPOPMode) {
            return false;
        }
        return true;
    }

    public componentDidUpdate(
        prevProps: Readonly<ICustomSegmentsAnalysisProps>,
        prevState: Readonly<any>,
        snapshot?: any,
    ): void {
        const { duration, comparedDuration } = this.swNavigator.getParams();
        const { currentSegment } = this.props;
        const { tab, timeGranularity, isPOPMode } = this.state;
        const durationRaw = DurationService.getDurationData(duration).raw;
        const monthDiff = durationRaw.to.diff(durationRaw.from, "month");
        const isUniqueTab = tab === UNIQUE_USERS;

        // if we are on unique users tab then we don't need to update the granularity
        if (prevState.isMTDActive !== this.state.isMTDActive) {
            this.refreshResponseData();
        }
        if (isUniqueTab) {
            return;
        } else {
            const monthlyGraphVisits = isPOPMode
                ? _.get(
                      this.response,
                      `["Interval"][${currentSegment?.id}][${tabsMeta.Visits.id}][${granularities[2]}][Graph]`,
                      0,
                  )
                : _.get(
                      this.response,
                      `[${currentSegment?.id}][${tabsMeta.Visits.id}][${granularities[2]}][Graph]`,
                      0,
                  );
            const monthlyVisitsCrossThreshold = _.filter(
                monthlyGraphVisits,
                dailyGranularityVisiblePredicate,
            );
            const weeklyTabData = _.get(
                this.response,
                `[${currentSegment?.id}][${this.state.tab}][${granularities[1]}]`,
                { Confidence: 0 },
            );
            const weeklyConfindenceGroup = _.filter(weeklyTabData.Graph, weeklyPredicate);
            const weeklyDisabled = weeklyConfindenceGroup.length === 0;
            const dailyDisabled = monthlyVisitsCrossThreshold.length === 0;
            if (
                weeklyDisabled !== this.state.availableGran[1].disabled ||
                dailyDisabled !== this.state.availableGran[0].disabled
            ) {
                this.setState({
                    isPOPMode: comparedDuration,
                    availableGran: [
                        { title: "D", disabled: dailyDisabled },
                        { title: "W", disabled: weeklyDisabled },
                        { title: "M", disabled: monthDiff < 1 },
                    ],
                });
            }
            // }
        }
    }

    public onTabSelected = (index: number, enabled = true) => {
        const { tabSelectedIndex } = this.state;

        if (!enabled || tabSelectedIndex === index) {
            return false;
        }
        const { timeGranularity } = this.state;
        const isUniqueUsersTab = index === 1;

        if (isUniqueUsersTab) {
            this.setState({
                availableGran: [
                    { title: "D", disabled: true },
                    { title: "W", disabled: true },
                    { title: "M", disabled: false },
                ],
            });
            if (timeGranularity !== granularities[2]) {
                this.setState({
                    timeGranularity: granularities[2],
                });
            }
            this.setCurrentData(this.tabs[index].id, granularities[2]);
        } else {
            this.setCurrentData(this.tabs[index].id, this.state.timeGranularity);
        }

        SwTrack.all.trackEvent("Metric Button", "click", `${CHART_NAME}/${this.tabs[index].id}`);

        this.setState({
            tab: this.tabs[index].id,
            tabSelectedIndex: index,
        });
        return true;
    };

    public isTabEnabled = (tabValue) => {
        return tabValue !== "N/A";
    };

    public fetchUniqueUsersData = () => {
        const { currentSegment } = this.props;
        const segmentApiService = new SegmentsApiService();
        const params = this.swNavigator.getParams();
        const durationApi = DurationService.getDurationData(
            params.duration,
            params.comparedDuration,
        );
        const timeGran = durationApi?.forAPI?.isWindow ? granularities[0] : granularities[2];

        return segmentApiService.getUniqueUsersData({
            country: params.country,
            from: durationApi.forAPI.from,
            to: durationApi.forAPI.to,
            compareFrom: undefined,
            compareTo: undefined,
            includeSubDomains: true,
            isWindow: durationApi?.forAPI?.isWindow,
            keys: null,
            segmentsIds: [currentSegment.id],
            timeGranularity: timeGran,
            webSource: "Desktop",
            lastUpdated: currentSegment.lastUpdated,
        });
    };

    public fetchSegmentData = () => {
        const { currentSegment } = this.props;
        const segmentApiService = new SegmentsApiService();
        const params = this.swNavigator.getParams();
        const durationApi = DurationService.getDurationData(
            params.duration,
            params.comparedDuration,
        );
        const timeGran = durationApi?.forAPI?.isWindow ? granularities[0] : granularities[2];
        return segmentApiService.getCustomSegmentEngagementData({
            country: params.country,
            from: durationApi.forAPI.from,
            to: durationApi.forAPI.to,
            compareFrom: durationApi?.forAPI?.compareFrom,
            compareTo: durationApi?.forAPI?.compareTo,
            includeSubDomains: true,
            isWindow: durationApi?.forAPI?.isWindow,
            keys: null,
            segmentsIds: [currentSegment.id],
            timeGranularity: timeGran,
            webSource: "Desktop",
            lastUpdated: currentSegment.lastUpdated,
            latest:
                !this.state.isPOPMode && !durationApi.raw.isCustom && this.state.isMTDActive
                    ? "l"
                    : undefined,
        });
    };

    public async refreshResponseData() {
        this.setState({
            loading: true,
        });
        try {
            this.response = await this.getResponseData();
        } catch {
            this.setState({
                loading: false,
            });
        }
        this.setResponse();
    }

    public async getResponseData() {
        if (this.state.isPOPMode) {
            return await this.fetchSegmentData();
        }
        // is we are not on PopMode then we will fetch unique users tab as well and change our data for stracture for supporting it:
        return await Promise.all([this.fetchSegmentData(), this.fetchUniqueUsersData()]).then(
            (values) => {
                return this.transformUniqueAnEngagementResponse(values);
            },
        );
    }

    public transformUniqueAnEngagementResponse = (values) => {
        const { currentSegment } = this.props;
        const newResponse = values[0];
        const uniqueUsersGraph = values[1][currentSegment?.id]?.UniqueUsers?.Monthly?.Graph;
        const visitsGraph = values[0][currentSegment?.id]?.Visits?.Monthly?.Graph;

        uniqueUsersGraph.forEach((val, index) => {
            val.Value = {
                Value: val?.Value,
                Confidence: visitsGraph[index]?.Value?.Confidence,
            };
        });

        // adding unique users into the segmentData result
        Object.assign(newResponse[currentSegment?.id], values[1][currentSegment?.id]);

        // adding confidence into unique users:
        const Confidence = newResponse[currentSegment?.id]?.Visits?.Monthly?.Confidence;
        Confidence &&
            Object.assign(newResponse[currentSegment?.id]?.UniqueUsers?.Monthly, {
                Confidence: Confidence,
            });

        // adding the currect graph stracture for unique users:
        uniqueUsersGraph &&
            Object.assign(
                newResponse[currentSegment?.id]?.UniqueUsers?.Monthly.Graph,
                uniqueUsersGraph,
            );

        return newResponse;
    };
    public isObjectEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    };

    public renderExcelComponent = () => {
        const { currentSegment } = this.props;
        const params = this.swNavigator.getParams();
        const durationObj = DurationService.getDurationData(
            params.duration,
            params.comparedDuration,
        );
        return (
            <DownloadExcelContainer
                target="_self"
                key="SegmentAnalysisDownloadExcel"
                href={this.getExcelUrl(
                    currentSegment,
                    params,
                    durationObj,
                    this.state.timeGranularity,
                )}
                onClick={this.onDownloadClick}
            >
                <IconButton iconName="excel" type="flat" />
            </DownloadExcelContainer>
        );
    };
    public toggleMTD = () => {
        this.setState({
            ...this.state,
            isMTDActive: !this.state.isMTDActive,
        });
    };

    public getLastWindowDate = () => {
        return swSettings.current.lastSupportedDailyDate;
    };

    public getMTDTooltipContent = () => {
        return i18nFilter()("wa.mmx.channel_analysis.mtd.tooltip.last_available_date", {
            d: this.getLastWindowDate().format("MMM DD"),
        });
    };

    public render() {
        const { currentSegment } = this.props;
        const mtdTooltipText = this.getMTDTooltipContent();
        const { tabSelectedIndex, isMTDActive, isMTDEnabled } = this.state;
        const height = 630;
        const params = this.swNavigator.getParams();
        const durationObj = DurationService.getDurationData(
            params.duration,
            params.comparedDuration,
        );
        const GranularityComponent = <RightFlexRow>{this.getSwitcherComponent()}</RightFlexRow>;

        if (!currentSegment) {
            return null;
        }
        if (this.state.loading) {
            return <Loader height={height} timeGranularity={this.state.timeGranularity} hideDD />;
        }

        if (!this.response) {
            return (
                <FolderAnalysisContainer>
                    <TableNoData
                        icon="no-data"
                        messageTitle={i18nFilter()("global.nodata.notavilable")}
                    />
                </FolderAnalysisContainer>
            );
        }
        return (
            <FolderAnalysisContainer className="folder-analysis-container" height={height}>
                <TitleContainerWithBorder>
                    <FlexColumn>
                        <StyledHeaderTitle>
                            <BoxTitle>
                                {i18nFilter()("segment.analysis.traffic.and.engagement.title")}
                            </BoxTitle>
                        </StyledHeaderTitle>
                    </FlexColumn>
                    <RightFlexRow>
                        {isMTDEnabled &&
                            this.tabs[tabSelectedIndex].id !== tabsMeta.UniqueUsers.id && (
                                <PlainTooltip
                                    enabled={!!mtdTooltipText}
                                    tooltipContent={mtdTooltipText}
                                >
                                    <MTDTitle onClick={this.toggleMTD}>
                                        <OnOffSwitch isSelected={isMTDActive} onClick={_.noop} />
                                        <StyledBoxSubtitle>
                                            <MTDLabel>
                                                {i18nFilter()("segment.analysis.mtd.toggle_label")}
                                            </MTDLabel>
                                        </StyledBoxSubtitle>
                                    </MTDTitle>
                                </PlainTooltip>
                            )}
                        {this.renderExcelComponent()}
                    </RightFlexRow>
                </TitleContainerWithBorder>
                {!this.state.renderEmpty ? (
                    <Tabs selectedIndex={tabSelectedIndex}>
                        <TabList>
                            <StyledTabsCarousel offset={0} margin={0}>
                                {this.tabs &&
                                    this.tabs.map((tab: any, index) => {
                                        const tabEnabled = this.isTabEnabled(tab.value);

                                        return (
                                            <span
                                                className="ScorableTabWrapper"
                                                onClick={() => {
                                                    this.onTabSelected(index, tabEnabled);
                                                }}
                                                key={tab.id}
                                            >
                                                <StyledScorableTab
                                                    key={tab.id}
                                                    roughEstimation={tab.roughEstimation}
                                                    selected={tab.active}
                                                    metric={tab.title}
                                                    metricIcon={tab.icon}
                                                    invertChangeColors={tab.invertColors}
                                                    value={tab.value}
                                                    valueTooltip={tab.infoIcon}
                                                    changeTooltip={tab.growthTooltip}
                                                    valueChange={tab.changeValue}
                                                    hideBorder={true}
                                                    className={"scorable-tab"}
                                                    enabled={tabEnabled}
                                                />
                                            </span>
                                        );
                                    })}
                            </StyledTabsCarousel>
                        </TabList>
                    </Tabs>
                ) : null}
                {this.state.renderEmpty ? (
                    <NoDataSegments
                        messageBottomHeader={i18nFilter()("segments.nodata.notavilable")}
                        messageBottomText={i18nFilter()("segments.nodata.notavilable.subtitle")}
                    />
                ) : (
                    <SimpleChartContainer>
                        {this.state.isPOPMode ? (
                            <PeriodOverPeriodChart
                                type="line"
                                legendDurations={
                                    typeof durationObj.forWidget === "string"
                                        ? [durationObj.forWidget]
                                        : durationObj.forWidget.reverse()
                                }
                                showLegend={true}
                                rightSectionComponent={GranularityComponent}
                                options={{ height: 340 }}
                                data={{ ["Desktop"]: this.graphData }}
                            />
                        ) : (
                            <>
                                {GranularityComponent}
                                <Chart
                                    type="line"
                                    config={this.getChartConfig("line")}
                                    data={this.graphData}
                                    isFinalConfig={true}
                                />
                            </>
                        )}
                    </SimpleChartContainer>
                )}
            </FolderAnalysisContainer>
        );
    }

    public getExcelUrl = (
        { id, lastUpdated, segmentName, domain }: any,
        params,
        durationApi,
        timeGran,
    ) => {
        const requestParams = (params: any): string => {
            return _.toPairs(this.segmentsApiService.enhanceParamsWithUseAdvanced(params))
                .map(
                    ([key, value]) =>
                        `${encodeURIComponent(key)}=${
                            value ? encodeURIComponent(value.toString()) : value
                        }`,
                )
                .join("&");
        };

        const excelFileName = `SegmentAnalysis - ${segmentName} - (${params.country}) - (${
            durationApi.forAPI.from
        }) - (${durationApi.forAPI.to})
            ${
                this.state.isPOPMode
                    ? ` - AND (${durationApi.forAPI?.compareFrom}) - (${durationApi.forAPI?.compareTo})`
                    : ""
            }`;
        timeGran =
            timeGran ?? (durationApi?.forAPI?.isWindow ? granularities[0] : granularities[2]);
        return (
            "/widgetApi/TrafficAndEngagement/SegmentEngagement/Excel?" +
            requestParams({
                country: params.country,
                from: durationApi.forAPI?.from,
                to: durationApi.forAPI?.to,
                compareFrom: durationApi.forAPI?.compareFrom,
                compareTo: durationApi.forAPI?.compareTo,
                includeSubDomains: true,
                isWindow: durationApi?.forAPI?.isWindow,
                keys: null,
                segmentsIds: [id],
                timeGranularity: timeGran,
                webSource: "Desktop",
                lastUpdated,
                FileName: excelFileName,
            })
        );
    };

    public onDownloadClick = () => {
        TrackWithGuidService.trackWithGuid("custom.segment.analysis.download.excel", "click");
    };

    public getSwitcherComponent = () => {
        if (!Array.isArray(this.state.availableGran) || this.state.availableGran.length === 0) {
            return null;
        }

        return (
            <SwitcherGranularityContainer
                itemList={this.state.availableGran}
                selectedIndex={granularities.indexOf(this.state.timeGranularity)}
                onItemClick={this.onTimeGranularityClick}
                className={"gran-switch"}
            />
        );
    };

    public setResponse = () => {
        if (this.response) {
            this.setCurrentData(this.state.tab, this.state.timeGranularity);
            this.tabs = this.getTabs();
            this.setState({
                loading: false,
            });
        }
    };

    public setCurrentData = (tab, timeGranularity) => {
        // this.graphData & this.lastPoint are changed only in here
        const { currentSegment } = this.props;
        const { country, duration, comparedDuration } = this.swNavigator.getParams();
        const durationObj = DurationService.getDurationData(duration, comparedDuration);

        const tabData = this.state.isPOPMode
            ? _.get(
                  this.response,
                  `["Interval"][${currentSegment?.id}][${tab}][${timeGranularity}]`,
                  { Confidence: 0 },
              )
            : _.get(this.response, `[${currentSegment?.id}][${tab}][${timeGranularity}]`, {
                  Confidence: 0,
              });
        const confindenceGroup = _.filter(
            tabData.Graph,
            timeGranularity === "Weekly" ? weeklyPredicate : monthlyPredicate,
        );

        // TODO: Eyal once folder analysis is removed remove rule for worldwide country
        if (
            country !== "999" &&
            (tabData.Confidence === 0 || tabData.Confidence >= 1 || confindenceGroup.length === 0)
        ) {
            this.setState({
                renderEmpty: true,
            });
            return;
        }
        if (this.state.isPOPMode) {
            const tabDataCompared = _.get(
                this.response,
                `["ComparedInterval"][${currentSegment?.id}][${tab}][${timeGranularity}]`,
                { Confidence: 0 },
            );
            const data = tabData?.Graph.map((item, idx) => {
                return {
                    Values: [
                        {
                            Key: item.Key,
                            Value: item.Value.Value,
                            Confidence: item.Value.Confidence,
                        },
                        {
                            Key: tabDataCompared?.Graph[idx].Key,
                            Value: tabDataCompared?.Graph[idx].Value.Value,
                            Confidence: tabDataCompared?.Graph[idx].Value.Confidence,
                        },
                    ],
                    Change: [
                        this.calcChange(item.Value.Value, tabDataCompared?.Graph[idx].Value.Value),
                    ],
                };
            });
            this.graphData = data;
        } else {
            const data = tabData.Graph.map((item, index, arr) => {
                if (item === undefined) {
                    return [];
                }
                return [
                    new Date(item.Key).getTime(),
                    item.Value.Value,
                    {
                        partial:
                            (item.Value.Confidence >= 0.3 && item.Value.Confidence < 1) ||
                            isPartialDataPoint(
                                index,
                                arr,
                                item,
                                timeGranularity,
                                durationObj.forAPI.to.replace(/\|/g, "/"),
                            ),
                        hallowMarker: item.Value.Confidence >= 0.3 && item.Value.Confidence < 1,
                        confidenceLevel: item.Value.Confidence,
                    },
                ];
            });
            this.graphData = [{ data }];
        }
    };

    public getTabs = () => {
        const { isPOPMode } = this.state;
        const { duration, country } = this.swNavigator.getParams();
        const isTwentyEightDays = duration === "28d";
        const isWorldWide = country === "999";

        return Object.keys(tabsMeta)
            .filter((tab) => {
                // if we are on popMode then we will take out uniqueUsers from our tabs
                return !((isPOPMode || isTwentyEightDays || isWorldWide) && tab === UNIQUE_USERS);
            })
            .map((tab) => {
                return { ...this.getTabProps(tab), id: tab };
            });
    };

    public calcChange = (currentMonth, comparedMonth) => {
        return (currentMonth - comparedMonth) / comparedMonth;
    };

    public getTabProps = (tab) => {
        const { graphData, response } = this;
        const { currentSegment } = this.props;
        const { timeGranularity } = this.state;
        const changeValue = this.getTabChange(tab);
        return {
            active: this.state.tab === tab,
            roughEstimation: response
                ? (this.state.isPOPMode
                      ? _.get(
                            response,
                            `["Interval"][${currentSegment?.id}][${tab}][${timeGranularity}][Confidence]`,
                        )
                      : _.get(response, `[${tab}][${timeGranularity}][Confidence]`)) > 0.3
                : false,
            icon: tabsMeta[tab].icon,
            title:
                tab === "Visits"
                    ? "Avg. Monthly " + i18nFilter()(`${tabsMeta[tab].title}`)
                    : i18nFilter()(`${tabsMeta[tab].title}`),
            value: this.getTabAverage(tab),
            changeValue,
            invertColors: tabsMeta[tab].invertChange,
            showTabChange: false,
            infoIcon: false,
            growthTooltip: this.getTabGrowthTooltipText(tab),
        };
    };

    public getTabGrowthTooltipText = (tab) => {
        const { currentSegment } = this.props;
        const { timeGranularity, isPOPMode, isMTDActive } = this.state;
        const graphData = isPOPMode
            ? _.get(
                  this.response?.Interval,
                  `[${currentSegment?.id}]["${tab}"]["${timeGranularity}"].Graph`,
              )
            : _.get(this.response, `[${currentSegment?.id}]["${tab}"]["${timeGranularity}"].Graph`);
        if (graphData === undefined || graphData.length === 0) {
            return "";
        }

        return `${dayjs(_.get(graphData, "[0].Key")).format("MMM YYYY")} vs. ${dayjs(
            _.get(
                graphData,
                `[${
                    isMTDActive && tab !== tabsMeta.UniqueUsers.id
                        ? graphData.length - 2
                        : graphData.length - 1
                }].Key`,
            ),
        ).format("MMM YYYY")}`;
    };

    public getTabAverage = (tab) => {
        const { currentSegment } = this.props;
        const { timeGranularity, isPOPMode } = this.state;
        const filter = tabsMeta[tab].filter;
        const isUniqueUsersTab = tab === UNIQUE_USERS;
        const customTimeGranularity = "Monthly";

        if (isUniqueUsersTab && isPOPMode) {
            return "N/A";
        }

        const value = isPOPMode
            ? _.get(
                  this.response,
                  `["Interval"][${currentSegment?.id}]["${tab}"]["${timeGranularity}"].Average`,
              )
            : _.get(
                  this.response,
                  `[${currentSegment?.id}]["${tab}"][${customTimeGranularity}].Average`,
              );
        if (value === 0 || value == null) {
            return "N/A";
        }
        return filter[0]()(value, filter[1]);
    };

    public getTabChange = (tab) => {
        const { currentSegment } = this.props;
        const { timeGranularity, isPOPMode, isMTDActive } = this.state;
        const isUniqueUsersTab = tab === UNIQUE_USERS;
        const { duration } = this.swNavigator.getParams();

        if (
            duration === "28d" ||
            (isUniqueUsersTab && (timeGranularity !== "Monthly" || isPOPMode))
        ) {
            return undefined;
        }

        const graphData = isPOPMode
            ? _.get(this.response, `["Interval"][${currentSegment?.id}]["${tab}"]["Monthly"].Graph`)
            : _.get(this.response, `[${currentSegment?.id}]["${tab}"]["Monthly"].Graph`);
        const transformedData = graphData.map((item) => {
            if (item === undefined) {
                return [];
            }
            return [
                new Date(item.Key).getTime(),
                item.Value.Value,
                {
                    partial: item.Value.Confidence >= 0.3 && item.Value.Confidence < 1,
                    hallowMarker: item.Value.Confidence >= 0.3 && item.Value.Confidence < 1,
                    confidenceLevel: item.Value.Confidence,
                },
            ];
        });
        if (transformedData && transformedData.length > 1 && transformedData[0][1]) {
            return (
                transformedData[
                    isMTDActive && tab !== tabsMeta.UniqueUsers.id
                        ? transformedData.length - 2
                        : transformedData.length - 1
                ][1] /
                    transformedData[0][1] -
                1
            );
        }
        return undefined;
    };

    public onTimeGranularityClick = (index) => {
        const timeGranularity = granularities[index];
        if (this.state.timeGranularity !== timeGranularity) {
            this.setCurrentData(this.state.tab, timeGranularity);
            this.setState({
                timeGranularity,
            });
            SwTrack.all.trackEvent(
                "Time Frame Button",
                "switch",
                `Over Time Graph/${CHART_NAME}/${timeGranularity}`,
            );
        }
    };

    public getChangeTooltip = (
        metric,
        filter,
        domain,
        granularity = "Monthly",
        toDateMoment = undefined,
        isWindow = false,
    ) => {
        return {
            tooltip: {
                positioner: tooltipPositioner,
                shared: true,
                crosshairs: true,
                outside: false,
                useHTML: true,
                backgroundColor: "#fff",
                borderWidth: 0,
                followPointer: false,
                shape: "square",
                formatter() {
                    const getTooltipHeader = () => {
                        let date;
                        switch (granularity) {
                            case "Daily":
                                date = dayjs.utc(this.x).format("dddd, MMM DD, YYYY");
                                break;
                            case "Weekly":
                                const to: any = dayjs.utc(_.last(this?.points?.series?.xData));
                                const from: any = dayjs.utc(this.x);
                                const isLast: boolean =
                                    _.last(this?.points?.[0]?.series?.xData) === this.x;
                                let toWeek = dayjs.utc(this.x).add(6, "days");
                                // show partial week in case of last point when start of week and end of week aren't in the same month.
                                if (isLast && !isWindow) {
                                    if (from.month() !== toWeek.month()) {
                                        toWeek = from.clone().endOf("month").startOf("day").utc();
                                    }
                                } else if (isLast && isWindow && toDateMoment) {
                                    toWeek = toDateMoment;
                                }
                                date =
                                    "From " +
                                    dayjs.utc(this.x).format("MMM DD, YYYY") +
                                    " to " +
                                    toWeek.format("MMM DD, YYYY");
                                break;
                            case "Monthly":
                                date = dayjs.utc(this.x).format("MMM. YYYY");
                                break;
                        }
                        return date;
                    };

                    const getChange = (previousDataPoint, change) =>
                        previousDataPoint
                            ? change !== 0 && percentageSignFilter()(change, 2)
                            : i18nFilter()("common.tooltip.change.new");

                    const changeTooltipProp = () => {
                        return this.points.map((row) => {
                            const pointIndex = row.point.index;
                            const previousDataPoint =
                                pointIndex === 0
                                    ? row.series?.data[pointIndex].y
                                    : row.series?.data[pointIndex - 1].y;
                            const change = row.y / previousDataPoint - 1;
                            return {
                                displayName: domain,
                                value: formatTooltipPointWithConfidence(
                                    row.y,
                                    _.get(row, "[point][confidence]", undefined),
                                    filter,
                                ),
                                color: row.color,
                                subtitle: <SegmentSubtitle>{row.series.name}</SegmentSubtitle>,
                                change:
                                    previousDataPoint !== 0 && getChange(previousDataPoint, change),
                            };
                        });
                    };
                    const changeTooltipProps = {
                        rowHeight: 34,
                        header: getTooltipHeaderElement(
                            granularity,
                            this.x,
                            swSettings.current.lastSupportedDailyDate.isAfter(toDateMoment)
                                ? swSettings.current.lastSupportedDailyDate
                                : toDateMoment,
                        ),
                        tableHeaders: [
                            { position: 1, displayName: `${granularity} ${i18nFilter()(metric)}` },
                            { position: 0, displayName: "Segment" },
                            { position: 2, displayName: "Change" },
                        ],
                        tableRows: changeTooltipProp(),
                        showChangeColumn: true,
                    };

                    return ReactDOMServer.renderToString(
                        <TooltipWrapper>
                            <ChangeTooltip {...changeTooltipProps} />
                        </TooltipWrapper>,
                    );
                },
            },
        };
    };

    // converting the date stracture for algoChangeDateConfig
    public dateToUTC = (dateString) => {
        const date = dateString.split("-");
        return Date.UTC(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10));
    };

    public getChartConfig = (type) => {
        const { tab, timeGranularity } = this.state;
        const params = this.swNavigator.getParams();
        const durationApi = DurationService.getDurationData(
            params.duration,
            params.comparedDuration,
        );
        const { graphData } = this;
        const format = this.state.availableGran[2].disabled ? "DD MMM" : "MMM";
        const currentGranularity = granularityConfigs[this.state.timeGranularity];
        const filter = tabsMeta[tab].filter;
        const metric = tabsMeta[tab].chartTitle;
        const yAxisFilter = tabsMeta[this.state.tab].yAxisFilter;
        const yAxisFormatter = ({ value }) =>
            yAxisFilter ? yAxisFilter[0]()(value, filter[1]) : filter[0]()(value, filter[1]);
        const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);
        const algoChangeDate = "2019-09-01T00:00:00"; // on unique users tab we wont show data before 01/07/2019 so we are setting algoChangeDate for the plotLine
        const isUniqueTab = tab === UNIQUE_USERS;
        const config = combineConfigs(
            {
                isWindow: durationApi?.forAPI?.isWindow,
                windowToMoment: durationApi?.raw?.to,
                type,
                granularity: timeGranularity,
                yAxisFormatter,
                xAxisFormatter,
                data: graphData[0].data,
                filter,
                showSeriesBulletColor: false,
            },
            [
                algoChangeDate && isUniqueTab
                    ? algoChangeDateConfig(this.dateToUTC(algoChangeDate), {
                          showTooltip: true,
                          description: i18nFilter()(
                              "custom.segment.analysis.tooltip.unique.users.plotline",
                          ),
                          overwriteDateRange: true,
                          showDateTitle: false,
                      })
                    : {},
                currentGranularity,
                noLegendConfig,
                this.getChangeTooltip(
                    metric,
                    filter,
                    this.props.currentSegment.domain,
                    timeGranularity,
                    durationApi?.raw?.to,
                    durationApi?.forAPI?.isWindow,
                ),
                yAxisLabelsConfig,
                xAxisLabelConfigWithLowConfidenceMarker,
                markerWithDashedConfig,
                {
                    chart: {
                        height: null,
                        type,
                        spacingTop: 10,
                        plotBackgroundColor: "transparent",
                        events: {},
                    },
                    plotOptions: {
                        area: {
                            fillColor: "rgba(220,220,249,0.1)",
                            lineWidth: 1,
                            lineColor: colorsPalettes.blue[400],
                            connectNulls: false,
                        },
                        line: {
                            fillColor: "rgba(220,220,249,0.1)",
                            lineWidth: 2,
                            lineColor: colorsPalettes.blue[400],
                            connectNulls: false,
                        },
                        series: {
                            name: this.props.currentSegment?.segmentName,
                            connectNulls: false,
                            stickyTracking: true,
                            color: colorsPalettes.blue[400],
                        },
                    },
                    yAxis: {
                        gridLineWidth: 0.5,
                        showFirstLabel: true,
                        showLastLabel: true,
                        reversed: false,
                        gridZIndex: 2,
                        reversedStacks: true,
                        tickPixelInterval: 50,
                        labels: {
                            style: {
                                textTransform: "uppercase",
                                fontSize: "11px",
                                color: "#919191",
                            },
                        },
                    },
                    xAxis: {
                        gridLineWidth: 0,
                        gridLineDashStyle: "dash",
                        tickLength: 5,
                        labels: {
                            style: {
                                textTransform: "capitalize",
                                fontSize: "11px",
                                color: "#919191",
                            },
                        },
                        tickInterval: this.state.availableGran[2].disabled
                            ? tickIntervals.daily * 2
                            : tickIntervals.monthly,
                        minPadding: 0,
                        maxPadding: 0,
                    },
                },
            ],
        );
        return config;
    };
}
