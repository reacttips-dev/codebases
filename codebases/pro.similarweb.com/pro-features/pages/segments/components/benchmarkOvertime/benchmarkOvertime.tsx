import { colorsSets } from "@similarweb/styles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Switcher, TabSwitchItem } from "@similarweb/ui-components/dist/switcher";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { ExcelButton } from "components/React/ExcelButton/ExcelButton";
import * as _ from "lodash";
import * as React from "react";
import { ReactElement } from "react";
import {
    ICustomSegment,
    ICustomSegmentGroupWebsite,
    SEGMENT_TYPES,
} from "services/segments/segmentsApiService";
import { ICustomSegmentAvailableMembers, SegmentsUtils } from "services/segments/SegmentsUtils";
import { allTrackers } from "services/track/track";
import {
    abbrNumberVisitsFilter,
    decimalNumberFilter,
    i18nFilter,
    percentageSignFilter,
    timeFilter,
    minVisitsAbbrFilter,
} from "../../../../../app/filters/ngFilters";
import BoxSubtitle from "../../../../components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "../../../../components/BoxTitle/src/BoxTitle";
import Chart from "../../../../components/Chart/src/Chart";
import "../../../../components/Chart/styles/sharedTooltip.scss";
import { GraphLoader } from "../../../../components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { NoData } from "../../../../components/NoData/src/NoData";
import StyledBoxSubtitle from "../../../../styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import { getChartConfig, transformData } from "./SegmentsVsGroupLineChart";
import {
    BoxContainer,
    Bullet,
    ChartContainer,
    ContentContainer,
    ExcelButtonContainer,
    GraphContainer,
    LabelOverflowHidden,
    LegendContainer,
    LegendTitle,
    NoDataContainer,
    SegmentNameLabel,
    SitesChartLoaderContainer,
    StyledHeaderTitle,
    StyledLegendContainer,
    TabsContainer,
    TitleContainer,
    UtilitiesContainer,
} from "./StyledComponents";
import { SegmentTypeBadge } from "pages/segments/StyledComponents";
import DurationService from "services/DurationService";

export interface IBenchmarkOvertimeProps {
    title: string;
    titleTooltip: string;
    filters: any;
    data: any;
    selectedRows?: any[];
    isLoading?: boolean;
    renderChart?: (selectedTab, filteredChartData, selectedRows) => ReactElement<any>;
    renderLegend?: (selectedChartData, selectedTab) => ReactElement<any>;
    onGraphDDClick: (props) => void;
    tableExcelLink?: string;
    selectedGranularity?: string;
    rowSelectionProp?: string;
    availableMembers: ICustomSegmentAvailableMembers;
    SwitcherComponent: any;
}

export interface IBenchmarkOvertimeState {
    selectedTabIndex: number;
}

export interface IBenchmarkVertical {
    title: string;
    tooltipInfo: string;
    dataKey: string;
    filter: any;
    name: string;
    metricLabel: string;
    yAxisFilter?: any;
}

export interface IBenchmarkVerticals {
    [key: string]: IBenchmarkVertical;
}

export function visitsFormatter() {
    return (num) => {
        return abbrNumberVisitsFilter()(num) || "N/A";
    };
}

export function pagesPerVisitsFormatter() {
    return (num) => {
        return decimalNumberFilter()(num, true) || "N/A";
    };
}

export const benchmarkVerticals: IBenchmarkVerticals = {
    Visits: {
        title: "segments.group.analysis.tab.visits.title",
        tooltipInfo: "segments.group.analysis.tab.visits.tooltip",
        dataKey: "Visits",
        filter: [minVisitsAbbrFilter],
        yAxisFilter: [visitsFormatter],
        name: "Visits",
        metricLabel: "Scale",
    },
    PagesViews: {
        title: "segments.group.analysis.tab.pageViews.title",
        tooltipInfo: "segments.group.analysis.tab.pageViews.tooltip",
        dataKey: "PagesViews",
        filter: [minVisitsAbbrFilter],
        yAxisFilter: [visitsFormatter],
        name: "PagesViews",
        metricLabel: "Scale",
    },
    PagePerVisit: {
        title: "segments.group.analysis.tab.pagePerVisit.title",
        tooltipInfo: "segments.group.analysis.tab.pagePerVisit.tooltip",
        dataKey: "PagePerVisit",
        filter: [pagesPerVisitsFormatter],
        name: "PagePerVisit",
        metricLabel: "Scale",
    },
    VisitDuration: {
        title: "segments.group.analysis.tab.visitDuration.title",
        tooltipInfo: "segments.group.analysis.tab.visitDuration.tooltip",
        dataKey: "Duration",
        filter: [timeFilter],
        name: "VisitDuration",
        metricLabel: "Scale",
    },
    BounceRate: {
        title: "segments.group.analysis.tab.bounceRate.title",
        tooltipInfo: "segments.group.analysis.tab.bounceRate.tooltip",
        dataKey: "BounceRate",
        filter: [percentageSignFilter, 1],
        name: "BounceRate",
        metricLabel: "Efficiency",
    },
    TrafficShare: {
        title: "segments.group.analysis.tab.trafficshare.title",
        tooltipInfo: "segments.group.analysis.tab.trafficshare.tooltip",
        dataKey: "TrafficShare",
        filter: [percentageSignFilter, 1],
        name: "SegmentShare",
        metricLabel: "Efficiency",
    },
};

const segmentTypesDisabledVerticals = {
    [SEGMENT_TYPES.WEBSITE]: ["TrafficShare"],
};

export class BenchmarkOvertime extends React.PureComponent<
    IBenchmarkOvertimeProps,
    IBenchmarkOvertimeState
> {
    protected translate;
    protected swNavigator;

    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 0,
        };
        this.translate = i18nFilter();
        this.swNavigator = Injector.get<SwNavigator>("swNavigator");
        this.renderLegend = this.renderLegend.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
    }

    public onTabClick(value) {
        const verticalKey = Object.keys(benchmarkVerticals)[value];
        allTrackers.trackEvent(
            "Metric Button",
            "click",
            `${this.translate(this.props.title)}/Change Tab/${
                benchmarkVerticals?.[verticalKey]?.name
            }`,
        );
        this.setState({
            selectedTabIndex: value,
        });
    }

    public renderChart(selectedTab, filteredChartData, selectedRows) {
        const { rowSelectionProp, availableMembers, selectedGranularity } = this.props;
        const transformedData = transformData(
            filteredChartData,
            selectedRows,
            rowSelectionProp,
            availableMembers,
        ).sort((a, b) => a.rowIndex - b.rowIndex);
        const { duration } = this.swNavigator.getParams();
        const durationApi = DurationService.getDurationData(duration);
        const chart = this.props.renderChart ? (
            this.props.renderChart(selectedTab, filteredChartData, selectedRows)
        ) : (
            <ChartContainer>
                <Chart
                    type={"line"}
                    config={getChartConfig({
                        type: "line",
                        metric: selectedTab,
                        filter: selectedTab.filter,
                        data: transformedData,
                        timeGranularity: selectedGranularity,
                        isWindow: durationApi?.forAPI?.isWindow,
                        toDateMoment: durationApi?.raw?.to,
                        durationObject: durationApi,
                    })}
                    data={transformedData}
                    // isFinalConfig={true}
                />
            </ChartContainer>
        );
        return chart;
    }

    public renderLegend(selectedChartData, selectedTab) {
        const chartLegend = this.props.renderLegend
            ? this.props.renderLegend(selectedChartData, selectedTab)
            : this._renderLegend(selectedChartData, selectedTab);
        return chartLegend;
    }

    public _renderLegend(selectedChartData, selectedTab) {
        const { selectedRows, rowSelectionProp, availableMembers } = this.props;
        const legendItemsColors = selectedRows
            ? _.map(selectedRows, (row: any) => ({
                  chartSegmentId: row[rowSelectionProp],
                  chartSegmentColor: row.selectionColor,
              }))
            : _.map(Object.keys(selectedChartData), (chartSegmentId: string, index) => ({
                  chartSegmentId,
                  chartSegmentColor: colorsSets.c.toArray()[index],
              }));
        const legendItems = _.map(legendItemsColors, ({ chartSegmentId, chartSegmentColor }) => {
            const [customSegment, segmentType] = SegmentsUtils.getSegmentObjectByKey(
                chartSegmentId,
                availableMembers,
            );
            if (!customSegment) {
                return null;
            }
            let segmentNameComp;
            let segmentTypeName;
            switch (segmentType) {
                case SEGMENT_TYPES.SEGMENT:
                    const segmentObj = customSegment as ICustomSegment;
                    segmentNameComp = this._renderLegendItemSegment(
                        segmentObj.domain,
                        segmentObj.segmentName,
                    );
                    break;
                case SEGMENT_TYPES.WEBSITE:
                    const websiteObj = customSegment as ICustomSegmentGroupWebsite;
                    segmentTypeName = this.translate("segments.group.analysis.legend.website");
                    segmentNameComp = this._renderLegendItemWebsite(
                        websiteObj.domain,
                        segmentTypeName,
                    );
                    break;
            }
            const isDisabled = segmentTypesDisabledVerticals[segmentType]?.includes(
                selectedTab.dataKey,
            );
            const legendItem = (
                <LegendContainer key={`${chartSegmentId}`} isDisabled={isDisabled}>
                    <LegendTitle>
                        <Bullet color={chartSegmentColor} />
                        <LabelOverflowHidden>{customSegment.domain}</LabelOverflowHidden>
                    </LegendTitle>
                    {segmentNameComp}
                </LegendContainer>
            );
            if (isDisabled) {
                const disabledTooltipContent = (
                    <>
                        <div>
                            {this.translate(
                                "segments.group.analysis.legend.vertical.disabled.part1",
                                { segmentType: segmentTypeName?.toLowerCase() },
                            )}
                            ,
                        </div>
                        <div>
                            {this.translate(
                                "segments.group.analysis.legend.vertical.disabled.part2",
                                { verticalName: this.translate(selectedTab.title)?.toLowerCase() },
                            )}
                            .
                        </div>
                    </>
                );
                return (
                    <PlainTooltip placement="top" tooltipContent={disabledTooltipContent}>
                        {legendItem}
                    </PlainTooltip>
                );
            }
            return legendItem;
        });

        return <StyledLegendContainer>{legendItems}</StyledLegendContainer>;
    }

    private _renderLegendItemSegment(segmentDomain, segmentName) {
        return (
            <PlainTooltip placement={"bottom"} tooltipContent={`${segmentDomain} - ${segmentName}`}>
                <SegmentNameLabel>{segmentName}</SegmentNameLabel>
            </PlainTooltip>
        );
    }

    private _renderLegendItemWebsite(websiteDomain, websiteTypeDescription) {
        return (
            <PlainTooltip
                placement={"bottom"}
                tooltipContent={`${websiteDomain} - ${websiteTypeDescription}`}
            >
                <SegmentNameLabel>
                    <SegmentTypeBadge>WEBSITE</SegmentTypeBadge>
                </SegmentNameLabel>
            </PlainTooltip>
        );
    }

    public render() {
        const {
            title,
            titleTooltip,
            filters,
            data,
            selectedRows,
            isLoading,
            rowSelectionProp,
            SwitcherComponent,
        } = this.props;
        const { selectedTabIndex } = this.state;
        const subtitleFilters = [
            {
                filter: "date",
                value: {
                    from: filters.from,
                    to: filters.to,
                },
            },
            {
                filter: "webSource",
                value: "Desktop", // values: available: 'Total' / 'Desktop'
            },
        ];
        const selectedTab = Object.values(benchmarkVerticals)[selectedTabIndex];
        const selectedChartData = data && data.Data ? data.Data[selectedTab.dataKey] : undefined;

        const filteredChartData =
            selectedChartData && selectedRows
                ? Object.keys(selectedChartData)
                      .filter((chartDomain) =>
                          _.find(selectedRows, (row) => row[rowSelectionProp] === chartDomain),
                      )
                      .reduce((obj, key) => {
                          obj[key] = selectedChartData[key];
                          return obj;
                      }, {})
                : selectedChartData;

        return (
            <BoxContainer data-automation-sites-vs-category={true}>
                <TitleContainer>
                    <FlexColumn>
                        <StyledHeaderTitle>
                            <BoxTitle tooltip={this.translate(titleTooltip)}>
                                {this.translate(title)}
                            </BoxTitle>
                        </StyledHeaderTitle>
                        <StyledBoxSubtitle>
                            <BoxSubtitle filters={subtitleFilters} />
                        </StyledBoxSubtitle>
                    </FlexColumn>
                    <FlexRow alignItems="center">
                        <SwitcherComponent />
                        {this.props.tableExcelLink ? (
                            <PlainTooltip
                                tooltipContent={this.translate(
                                    "workspace.investors.download.excel",
                                )}
                            >
                                <ExcelButtonContainer>
                                    <ExcelButton
                                        url={this.props.tableExcelLink}
                                        trackName="segment group"
                                    />
                                </ExcelButtonContainer>
                            </PlainTooltip>
                        ) : null}
                    </FlexRow>
                </TitleContainer>
                <ContentContainer>
                    <TabsContainer>
                        <Switcher
                            selectedIndex={selectedTabIndex}
                            className={"SegmentsVsGroup"}
                            onItemClick={this.onTabClick}
                        >
                            {Object.values(benchmarkVerticals).map(
                                (vertical: IBenchmarkVertical) => {
                                    return (
                                        <TabSwitchItem key={vertical.dataKey}>
                                            <PlainTooltip
                                                placement={"top"}
                                                tooltipContent={this.translate(
                                                    vertical.tooltipInfo,
                                                )}
                                            >
                                                <span>{this.translate(vertical.title)}</span>
                                            </PlainTooltip>
                                        </TabSwitchItem>
                                    );
                                },
                            )}
                        </Switcher>
                    </TabsContainer>
                    {isLoading ? (
                        <SitesChartLoaderContainer>
                            <GraphLoader width={"100%"} />
                        </SitesChartLoaderContainer>
                    ) : (
                        <GraphContainer className={"sharedTooltip"}>
                            {selectedChartData ? (
                                <>
                                    <UtilitiesContainer>
                                        {this.renderLegend(selectedChartData, selectedTab)}
                                    </UtilitiesContainer>
                                    {this.renderChart(selectedTab, filteredChartData, selectedRows)}
                                </>
                            ) : (
                                <NoDataContainer>
                                    {" "}
                                    <NoData />{" "}
                                </NoDataContainer>
                            )}
                        </GraphContainer>
                    )}
                </ContentContainer>
            </BoxContainer>
        );
    }
}
