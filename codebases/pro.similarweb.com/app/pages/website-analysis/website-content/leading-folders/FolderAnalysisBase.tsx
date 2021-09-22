import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Tabs } from "@similarweb/ui-components/dist/tabs";
import { TabList } from "@similarweb/ui-components/dist/tabs/src/TabsList";
import autobind from "autobind-decorator";
import { Injector } from "common/ioc/Injector";
import xAxisLabelConfigWithLowConfidenceMarker from "components/Chart/src/configs/xAxis/xAxisLabelConfigWithLowConfidenceMarker";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { tickIntervals } from "components/widget/widget-types/GraphWidget";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import Loader from "pages/website-analysis/website-content/leading-folders/components/Loader";
import { NoDataSegments } from "pages/website-analysis/website-content/leading-folders/components/NoDataSegments";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import React from "react";
import { Component, ComponentType } from "react";
import DurationService from "services/DurationService";
import { PeriodOverPeriodChart } from "../../../../../.pro-features/components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChart";
import SegmentsApiService, { ICustomSegment } from "services/segments/segmentsApiService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import Chart from "../../../../../.pro-features/components/Chart/src/Chart";
import combineConfigs from "../../../../../.pro-features/components/Chart/src/combineConfigs";
import noLegendConfig from "../../../../../.pro-features/components/Chart/src/configs/legend/noLegendConfig";
import markerWithDashedConfig from "../../../../../.pro-features/components/Chart/src/configs/series/markerWithDashedLinePerPointChartConfig";
import defaultTooltipConfig from "../../../../../.pro-features/components/Chart/src/configs/tooltip/defaultTooltip";
import yAxisLabelsConfig from "../../../../../.pro-features/components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { granularities } from "../../../../../.pro-features/utils";
import { CHART_NAME, granularityConfigs, tabsMeta } from "./FolderAnalysisDefaults";
import {
    FolderAnalysisContainer,
    SimpleChartContainer,
    StyledScorableTab,
} from "./StyledComponents";
import { RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { SwTrack } from "services/SwTrack";

export interface IFolderAnalysisBaseProps {
    currentSegment: ICustomSegment;
    height: number;
    className?: string;
    timeGranularity: string;
    isWindow: boolean;
    InitialLoader?: ComponentType<any>;
    HeaderComponent?: ComponentType<any>;
    fetchData: () => Promise<any>;
    multiGranularitySupport?: boolean;
    simpleGraphRender?: boolean;
    showTabChange?: boolean;
    transformGraphData?: (item) => [number, number];
    isPOPMode?: boolean;
}

const weeklyPredicate = (dataPoint) =>
    dataPoint.Value.Confidence > 0 && dataPoint.Value.Confidence <= 0.3;
const monthlyPredicate = (dataPoint) =>
    dataPoint.Value.Confidence > 0 && dataPoint.Value.Confidence < 1;

export default class FolderAnalysisBase extends Component<IFolderAnalysisBaseProps, any> {
    private response: any;
    private graphData: any;
    private swNavigator: any;
    private tabs: any[];
    constructor(props) {
        super(props);
        this.swNavigator = Injector.get<any>("swNavigator");
        this.state = {
            loading: true,
            renderEmpty: false,
            isPOPMode: this.swNavigator.getParams().comparedDuration,
            tab: "Visits",
            timeGranularity: this.props.timeGranularity || granularities[2],
            availableGran: [
                { title: "D", disabled: true },
                { title: "W", disabled: false },
                { title: "M", disabled: false },
            ],
        };
    }

    public componentDidUpdate(
        prevProps: Readonly<IFolderAnalysisBaseProps>,
        prevState: Readonly<any>,
        snapshot?: any,
    ): void {
        const { duration, comparedDuration } = this.swNavigator.getParams();
        const { currentSegment } = this.props;
        const durationRaw = DurationService.getDurationData(duration).raw;
        const monthDiff = durationRaw.to.diff(durationRaw.from, "month");
        if (
            monthDiff < 1 &&
            this.state.timeGranularity !== granularities[1] &&
            !this.state.isPOPMode
        ) {
            this.setCurrentData(this.state.tab, granularities[1]);
            this.setState(
                {
                    timeGranularity: granularities[1],
                    isPOPMode: comparedDuration,
                    availableGran: [
                        { title: "D", disabled: true },
                        { title: "W", disabled: false },
                        { title: "M", disabled: true },
                    ],
                },
                () => {
                    this.setResponse();
                },
            );
        } else {
            const weeklyTabData = _.get(
                this.response,
                `[${currentSegment?.id}][${this.state.tab}][${granularities[1]}]`,
                { Confidence: 0 },
            );
            const weeklyConfindenceGroup = _.filter(weeklyTabData.Graph, weeklyPredicate);
            const weeklyDisabled = weeklyConfindenceGroup.length === 0;
            if (weeklyDisabled !== this.state.availableGran[1].disabled) {
                this.setState({
                    isPOPMode: comparedDuration,
                    availableGran: [
                        { title: "D", disabled: true },
                        { title: "W", disabled: weeklyDisabled },
                        { title: "M", disabled: false },
                    ],
                });
            }
        }
    }

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
        });
    };

    public async componentDidMount() {
        try {
            this.response = await this.fetchSegmentData();
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

    public render() {
        const { currentSegment, height = 580 } = this.props;
        const params = this.swNavigator.getParams();
        const durationObj = DurationService.getDurationData(
            params.duration,
            params.comparedDuration,
        );
        const GranularityComponent = (
            <RightFlexRow>
                {this.getSwitcherComponent()}
                <DownloadExcelContainer
                    target="_self"
                    key="SegmentAnalysisDownloadExcel"
                    href={this.getExcelUrl(currentSegment, params, durationObj)}
                    onClick={this.onDownloadClick}
                >
                    <IconButton iconName="excel" type="flat" />
                </DownloadExcelContainer>
            </RightFlexRow>
        );
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
                {!this.state.renderEmpty ? (
                    <Tabs onSelect={this.onTabSelect}>
                        <TabList>
                            {this.tabs &&
                                this.tabs.map((tab: any, index) => (
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
                                    />
                                ))}
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
                                        : durationObj.forWidget
                                }
                                showLegend={true}
                                rightSectionComponent={GranularityComponent}
                                options={{ height: 380 }}
                                yAxisFormatter={this.POPyAxisFormatter()}
                                data={{ ["Desktop"]: this.graphData }}
                            />
                        ) : (
                            <>
                                {GranularityComponent}
                                <Chart
                                    type="area"
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

    public getExcelUrl = ({ id, lastUpdated, segmentName, domain }: any, params, durationApi) => {
        const requestParams = (params: any): string => {
            return _.toPairs(params)
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
        const timeGran = durationApi?.forAPI?.isWindow ? granularities[0] : granularities[2];
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
        const { country } = this.swNavigator.getParams();
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
            const data = tabData?.Graph.map((item, idx) => ({
                Values: [
                    { Key: item.Key, Value: item.Value.Value },
                    {
                        Key: tabDataCompared?.Graph[idx].Key,
                        Value: tabDataCompared?.Graph[idx].Value.Value,
                    },
                ],
                Change: [
                    this.calcChange(item.Value.Value, tabDataCompared?.Graph[idx].Value.Value),
                ],
            }));
            this.graphData = data;
        } else {
            const data = tabData.Graph.map((item) => {
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
            this.graphData = [{ data }];
        }
    };

    public getTabs = () => {
        return Object.keys(tabsMeta).map((tab) => {
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
            title: i18nFilter()(`${tabsMeta[tab].title}`),
            value: this.getTabAverage(tab),
            changeValue,
            invertColors: tabsMeta[tab].invertChange,
            showTabChange: this.props.showTabChange || false,
            infoIcon: this.props.showTabChange
                ? i18nFilter()(`${tabsMeta[tab].title}.info`)
                : false,
            growthTooltip: this.getTabGrowthTooltipText(graphData),
        };
    };

    public getTabGrowthTooltipText = (graphData) => {
        if (
            graphData === undefined ||
            (_.get(graphData, "[0].data") === undefined &&
                _.get(graphData, "[0].Values") === undefined)
        ) {
            return "";
        }

        return this.state.isPOPMode
            ? `${dayjs(_.get(graphData, "[0].Values[0].Key")).utc().format("MMM YYYY")} vs. ${dayjs(
                  _.get(graphData, `[${graphData.length - 1}].Values[0].Key`),
              )
                  .utc()
                  .format("MMM YYYY")}`
            : `${dayjs(_.get(graphData, "[0].data[0][0]")).utc().format("MMM YYYY")} vs. ${dayjs(
                  _.get(graphData, `[0].data[${graphData[0].data.length - 1}][0]`),
              )
                  .utc()
                  .format("MMM YYYY")}`;
    };

    public getTabAverage = (tab) => {
        const { currentSegment } = this.props;
        const filter = tabsMeta[tab].filter;
        const value = this.state.isPOPMode
            ? _.get(
                  this.response,
                  `["Interval"][${currentSegment?.id}]["${tab}"]["${this.state.timeGranularity}"].Average`,
              )
            : _.get(
                  this.response,
                  `[${currentSegment?.id}]["${tab}"][${this.state.timeGranularity}].Average`,
              );
        if (value === 0 || value == null) {
            return "N/A";
        }
        return filter[0]()(value, filter[1]);
    };

    public getTabChange = (tab) => {
        const { currentSegment } = this.props;
        const graphData = this.state.isPOPMode
            ? _.get(
                  this.response,
                  `["Interval"][${currentSegment?.id}]["${tab}"]["${this.state.timeGranularity}"].Graph`,
              )
            : _.get(
                  this.response,
                  `[${currentSegment?.id}]["${tab}"]["${this.state.timeGranularity}"].Graph`,
              );
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
            return transformedData[transformedData.length - 1][1] / transformedData[0][1] - 1;
        }
        return undefined;
    };

    @autobind
    public onTabSelect(index: number, previous: number, event: Event) {
        if (index === previous) {
            return;
        }
        this.setCurrentData(this.tabs[index].id, this.state.timeGranularity);
        SwTrack.all.trackEvent("Metric Button", "click", `${CHART_NAME}/${this.tabs[index].id}`);
        this.setState({
            tab: this.tabs[index].id,
        });
        return true;
    }

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

    public POPyAxisFormatter = () => {
        const { tab } = this.state;
        const filter = tabsMeta[tab].filter;
        const yAxisFilter = tabsMeta[tab].yAxisFilter;
        const yAxisFormatter = ({ value }) =>
            yAxisFilter ? yAxisFilter[0]()(value, filter[1]) : filter[0]()(value, filter[1]);
        return yAxisFormatter;
    };

    public getChartConfig = (type) => {
        const { tab, timeGranularity } = this.state;
        const { graphData } = this;
        const format = this.state.availableGran[2].disabled ? "DD MMM" : "MMM";
        const currentGranularity = granularityConfigs[this.state.timeGranularity];
        const filter = tabsMeta[tab].filter;
        const yAxisFilter = tabsMeta[this.state.tab].yAxisFilter;
        const yAxisFormatter = ({ value }) =>
            yAxisFilter ? yAxisFilter[0]()(value, filter[1]) : filter[0]()(value, filter[1]);
        const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);
        const config = combineConfigs(
            {
                type,
                granularity: timeGranularity,
                yAxisFormatter,
                xAxisFormatter,
                data: graphData[0].data,
                filter,
                showSeriesBulletColor: false,
            },
            [
                currentGranularity,
                noLegendConfig,
                defaultTooltipConfig,
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
                            stickyTracking: false,
                            color: colorsPalettes.blue[400],
                        },
                    },
                    yAxis: {
                        gridLineWidth: 0.5,
                        min: 0,
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
