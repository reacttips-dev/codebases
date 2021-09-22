import { colorsPalettes, colorsSets } from "@similarweb/styles";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Switcher, TabSwitchItem } from "@similarweb/ui-components/dist/switcher";
import { ExcelButton } from "components/React/ExcelButton/ExcelButton";
import * as _ from "lodash";
import * as React from "react";
import { ReactElement } from "react";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import {
    abbrNumberVisitsFilter,
    abbrNumberWithNASupportVisitsFilter,
    decimalNumberFilter,
    i18nFilter,
    percentageSignFilter,
} from "../../../../../app/filters/ngFilters";
import { ConversionSegmentsUtils } from "../../../../../app/pages/conversion/ConversionSegmentsUtils";
import BoxSubtitle from "../../../../components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "../../../../components/BoxTitle/src/BoxTitle";
import Chart from "../../../../components/Chart/src/Chart";
import "../../../../components/Chart/styles/sharedTooltip.scss";
import { GraphLoader } from "../../../../components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { NoData } from "../../../../components/NoData/src/NoData";
import StyledBoxSubtitle from "../../../../styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { FlexColumn } from "../../../../styled components/StyledFlex/src/StyledFlex";
import { IScatterItem } from "../ConversionScatterChart/ConversionCategoryScatter";
import WithAllContexts from "../WithAllContexts";
import { getChartConfig, transformData } from "./SitesVsCategorylineChart";
import {
    BoxContainer,
    Bullet,
    ChartContainer,
    ContentContainer,
    DropdownContainer,
    GraphContainer,
    IndustryAverageCheckboxContainer,
    LabelOverflowHidden,
    LegendContainer,
    LegendTitle,
    NoDataContainer,
    RightUtilsContainer,
    SegmentNameLabel,
    SitesChartLoaderContainer,
    StyledHeaderTitle,
    StyledLegendContainer,
    TabsContainer,
    TitleContainer,
    UtilitiesContainer,
} from "./StyledComponents";
import { trafficSources } from "./trafficSources";

export interface IBenchmarkOvertimeProps {
    title: string;
    titleTooltip: string;
    filters: any;
    data: any;
    selectedRows?: any[];
    isLoading?: boolean;
    renderChart?: (selectedTab, filteredChartData, selectedRows) => ReactElement<any>;
    renderLegend?: (selectedChartData) => ReactElement<any>;
    onGraphDDClick: (props) => void;
    onScatterDDClick: (props) => void;
    tableExcelLink?: string;
    industryAverageAvailable?: boolean;
    rowSelectionProp?: string;
    segmentsData: ISegmentsData;
}

export interface IBenchmarkOvertimeState {
    selectedTabIndex: number;
    selectedChannel: string;
    showIndustryAverage: boolean;
}

export interface IConversionVertical {
    title: string;
    tooltipInfo: string;
    dataKey: string;
    filter: any;
    yAxisFilter?: any;
    name: string;
    metricLabel: string;
    midValueCalculator?: (data: IScatterItem[]) => number;
}

export interface IConversionVerticals {
    Visits: IConversionVertical;
    ConvertedVisits: IConversionVertical;
    ConvertionRate: IConversionVertical;
    Stickiness: IConversionVertical;
}

export function stickinessFormatter() {
    return (num) => {
        return num !== 0 ? decimalNumberFilter()(num, true) || "N/A" : "N/A";
    };
}

export const conversionVerticals: IConversionVerticals = {
    Visits: {
        title: "conversion.category.tab.visits",
        tooltipInfo: "category.converstion.table.tooltip.visits",
        dataKey: "Visits",
        filter: [abbrNumberWithNASupportVisitsFilter, 1],
        yAxisFilter: [abbrNumberVisitsFilter, 1],
        name: "Visits",
        metricLabel: "Scale",
        midValueCalculator: (data) => {
            return (
                data.reduce((sum, item) => {
                    return sum + item.Visits;
                }, 0) / data.length
            );
        },
    },
    ConvertedVisits: {
        title: "conversion.category.tab.convertedVisits",
        tooltipInfo: "conversion.home.leaderboard.table.tooltip.converted.visits",
        dataKey: "ConvertedVisits",
        filter: [abbrNumberWithNASupportVisitsFilter, 2],
        yAxisFilter: [abbrNumberVisitsFilter, 2],
        name: "ConvertedVisits",
        metricLabel: "Scale",
        midValueCalculator: (data) => {
            return (
                data.reduce((sum, item) => {
                    return sum + item.ConvertedVisits;
                }, 0) / data.length
            );
        },
    },
    ConvertionRate: {
        title: "conversion.category.tab.conversionRate",
        tooltipInfo: "conversion.home.leaderboard.table.tooltip.conversion.rate",
        dataKey: "ConversionRate",
        filter: [percentageSignFilter, 1],
        name: "ConvertionRate",
        metricLabel: "Efficiency",
        midValueCalculator: (data) => {
            const { visits, convertedVisits } = data.reduce(
                (acc, item) => {
                    return {
                        visits: acc.visits + item.Visits,
                        convertedVisits: acc.convertedVisits + item.ConvertedVisits,
                    };
                },
                { visits: 0, convertedVisits: 0 },
            );

            return convertedVisits / visits;
        },
    },
    Stickiness: {
        title: "conversion.category.tab.purchasesPerCustomer",
        tooltipInfo: "conversion.home.leaderboard.table.tooltip.stickiness",
        dataKey: "Stickiness",
        filter: [stickinessFormatter, 1],
        yAxisFilter: [decimalNumberFilter, 1],
        name: "Stickiness",
        metricLabel: "Efficiency",
        midValueCalculator: (data) => {
            const { divident, divisor } = data.reduce(
                (acc, item) => {
                    return {
                        divident: acc.divident + item.ConvertedVisits * item.Stickiness,
                        divisor: acc.divisor + item.ConvertedVisits,
                    };
                },
                { divident: 0, divisor: 0 },
            );

            return divident / divisor;
        },
    },
};

export const INDUSTRY_AVERAGE_KEY = "Group Average";
export const ADDITIONAL_METRICS = {
    [INDUSTRY_AVERAGE_KEY]: {
        key: INDUSTRY_AVERAGE_KEY,
        color: colorsPalettes.carbon[200],
        title: "conversion.category.metrics.average",
        label: "conversion.category.metrics.average.label",
        tooltip: "conversion.category.metrics.average.tooltip",
    },
};

export class BenchmarkOvertime extends React.PureComponent<
    IBenchmarkOvertimeProps,
    IBenchmarkOvertimeState
> {
    public defaultChannel = "Total Traffic";
    protected track;
    private translate;

    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 0,
            selectedChannel: undefined,
            showIndustryAverage: false,
        };
        this.getChannelItems = this.getChannelItems.bind(this);
        this.renderLegend = this.renderLegend.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
        this.onIndustryAverageCheckboxClick = this.onIndustryAverageCheckboxClick.bind(this);
    }

    public componentWillUpdate(nextProps) {
        const { data } = nextProps;
        if (!this.state.selectedChannel && data && data.Data) {
            const availableChannels = this.getAvailableChannels(data) || [];
            if (
                !this.state.selectedChannel ||
                !_.includes(availableChannels, this.state.selectedChannel)
            ) {
                this.setState({
                    selectedChannel: this.defaultChannel,
                });
            }
        }
    }

    public onTabClick = (value) => {
        const { data } = this.props;
        const availableChannels = this.getAvailableChannels(data, value);
        this.track(
            "Metric Button",
            "click",
            `${this.translate(this.props.title)}/Change Tab/${
                Object.keys(conversionVerticals)[value]
            }`,
        );
        if (!_.includes(availableChannels, this.state.selectedChannel)) {
            this.setState({
                selectedChannel: this.defaultChannel,
                selectedTabIndex: value,
            });
        } else {
            this.setState({
                selectedTabIndex: value,
            });
        }
    };

    public onSelectedChannelClick = (value) => {
        this.track("Drop Down", "click", `${this.translate(this.props.title)}/Channel/${value.id}`);
        this.setState({
            selectedChannel: value.id,
        });
    };

    public onToggle = (isOpen) => {
        const event = isOpen ? "open" : "close";
        this.track("Drop Down", event, `${this.translate(this.props.title)}/Channel`);
    };

    public getChannelItems = () => {
        const { data } = this.props;
        const availableChannels = this.getAvailableChannels(data);
        return [
            <DropdownButton key={"channel-button"} width={180}>
                {this.state.selectedChannel}
            </DropdownButton>,
            ..._.map(availableChannels, (channel: string) => {
                return (
                    <SimpleDropdownItem key={channel} id={channel}>
                        {channel}
                    </SimpleDropdownItem>
                );
            }),
        ];
    };

    public renderChart(selectedTab, filteredChartData, selectedRows) {
        const { rowSelectionProp, segmentsData } = this.props;
        const transformedData = transformData(
            filteredChartData,
            selectedRows,
            rowSelectionProp,
            segmentsData,
        );
        const chart = this.props.renderChart ? (
            this.props.renderChart(selectedTab, filteredChartData, selectedRows)
        ) : (
            <ChartContainer>
                <Chart
                    type={"line"}
                    config={getChartConfig({
                        type: "line",
                        filter: selectedTab.filter,
                        data: transformedData,
                        shouldConnectNulls: false,
                        yAxisFilter: selectedTab.yAxisFilter,
                    })}
                    data={transformedData}
                />
            </ChartContainer>
        );
        return chart;
    }

    public renderLegend(selectedChartData) {
        const chartLegend = this.props.renderLegend
            ? this.props.renderLegend(selectedChartData)
            : this._renderLegend(selectedChartData);
        return chartLegend;
    }

    public _renderLegend(selectedChartData) {
        const { selectedRows, rowSelectionProp, segmentsData } = this.props;
        const getLegendItem = (domain, key, color, segmentData?) => {
            return (
                <LegendContainer key={key}>
                    <LegendTitle>
                        <Bullet color={color} />
                        <LabelOverflowHidden>{domain}</LabelOverflowHidden>
                    </LegendTitle>
                    {segmentData && segmentData.segmentName && (
                        <PlainTooltip
                            placement={"bottom"}
                            tooltipContent={`${domain} - ${segmentData.segmentName}`}
                        >
                            <SegmentNameLabel> {segmentData.segmentName} </SegmentNameLabel>
                        </PlainTooltip>
                    )}
                </LegendContainer>
            );
        };
        const legendItems = selectedRows
            ? _.map(selectedRows, (row: any) => {
                  return getLegendItem(
                      row.Domain,
                      row[rowSelectionProp],
                      row.selectionColor,
                      ConversionSegmentsUtils.getSegmentById(segmentsData, row.SegmentId),
                  );
              })
            : _.map(Object.keys(selectedChartData), (chartDomain: string, index) => {
                  return getLegendItem(chartDomain, `t${index}`, colorsSets.c.toArray()[index]);
              });

        if (this.state.showIndustryAverage) {
            const metric = ADDITIONAL_METRICS[INDUSTRY_AVERAGE_KEY];

            legendItems.push(getLegendItem(this.translate(metric.title), metric.key, metric.color));
        }
        return <StyledLegendContainer>{legendItems}</StyledLegendContainer>;
    }

    private getConfidenceData(data: any, selectedTabName: string, selectedChannelName: string) {
        const isSupportedTab =
            selectedTabName === "ConvertedVisits" || selectedTabName === "ConversionRate";
        if (!isSupportedTab) return null;

        const confidenceData = data?.Data["ConversionRateConfidenceLevel"];

        return confidenceData ? confidenceData[selectedChannelName] : null;
    }

    /**
     * Process group data for the chart, and augments it with confidence data, if such exists
     * NOTE: data types are "any" since the data returned from the API makes it impossible
     * for adding a static typing :(
     */
    private processGroupGraphData = (selectedChartData: any, confidenceData: any) => {
        const { selectedRows, rowSelectionProp } = this.props;
        const { showIndustryAverage } = this.state;

        const groupData = Object.keys(selectedChartData)
            .filter((chartDomain) =>
                _.find(selectedRows, (row) => {
                    const includeIndustryAverage =
                        showIndustryAverage && chartDomain === INDUSTRY_AVERAGE_KEY;
                    return row[rowSelectionProp] === chartDomain || includeIndustryAverage;
                }),
            )
            .reduce((acc, groupingName) => {
                acc[groupingName] = {
                    data: selectedChartData[groupingName],
                    confidence: confidenceData[groupingName],
                };
                return acc;
            }, {});

        return groupData;
    };

    /**
     * Augments a single website data for the chart with confidence data.
     * NOTE: data types are "any" since the data returned from the API makes it impossible
     * for adding a static typing :(
     */
    private processWebsiteGraphData = (selectedChartData: any[], confidenceData: any) => {
        selectedChartData?.forEach((recordPair) => {
            recordPair["Values"]?.forEach((record) => {
                const recordDate = record["Key"];
                const confidenceAtDate = confidenceData[recordDate];
                record["Confidence"] = confidenceAtDate;
            });
        });

        return selectedChartData;
    };

    public render() {
        const {
            title,
            titleTooltip,
            filters,
            data,
            selectedRows,
            isLoading,
            rowSelectionProp,
            industryAverageAvailable,
        } = this.props;
        const { selectedTabIndex, showIndustryAverage, selectedChannel } = this.state;
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
        const selectedTab = Object.values(conversionVerticals)[selectedTabIndex];

        const selectedChartData =
            data && data.Data ? data.Data[selectedTab.dataKey][selectedChannel] : undefined;

        const confidenceData =
            this.getConfidenceData(data, selectedTab.dataKey, selectedChannel) ?? {};

        const filteredChartData =
            selectedChartData && selectedRows
                ? this.processGroupGraphData(selectedChartData, confidenceData)
                : this.processWebsiteGraphData(selectedChartData, confidenceData);

        return (
            <WithAllContexts>
                {({ track, translate }) => {
                    this.track = track;
                    this.translate = translate;
                    return (
                        <BoxContainer data-automation-sites-vs-category={true}>
                            <TitleContainer>
                                <FlexColumn>
                                    <StyledHeaderTitle>
                                        <BoxTitle tooltip={translate(titleTooltip)}>
                                            {translate(title)}
                                        </BoxTitle>
                                    </StyledHeaderTitle>
                                    <StyledBoxSubtitle>
                                        <BoxSubtitle filters={subtitleFilters} />
                                    </StyledBoxSubtitle>
                                </FlexColumn>
                                {this.props.tableExcelLink ? (
                                    <PlainTooltip
                                        tooltipContent={translate(
                                            "workspace.investors.download.excel",
                                        )}
                                    >
                                        <ExcelButton
                                            url={this.props.tableExcelLink}
                                            trackName="category sites leaders"
                                        />
                                    </PlainTooltip>
                                ) : null}
                            </TitleContainer>
                            <ContentContainer>
                                <TabsContainer>
                                    <Switcher
                                        selectedIndex={selectedTabIndex}
                                        className={"sitesVsCategory"}
                                        onItemClick={this.onTabClick}
                                    >
                                        {Object.values(conversionVerticals).map(
                                            (conversionVertical: IConversionVertical) => {
                                                return (
                                                    <TabSwitchItem key={conversionVertical.dataKey}>
                                                        <PlainTooltip
                                                            placement={"top"}
                                                            tooltipContent={i18nFilter()(
                                                                conversionVertical.tooltipInfo,
                                                            )}
                                                        >
                                                            <span>
                                                                {translate(
                                                                    conversionVertical.title,
                                                                )}
                                                            </span>
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
                                                    {this.renderLegend(selectedChartData)}
                                                    <RightUtilsContainer>
                                                        {industryAverageAvailable && (
                                                            <PlainTooltip
                                                                tooltipContent={translate(
                                                                    ADDITIONAL_METRICS[
                                                                        INDUSTRY_AVERAGE_KEY
                                                                    ].tooltip,
                                                                )}
                                                            >
                                                                <IndustryAverageCheckboxContainer>
                                                                    <Checkbox
                                                                        label={translate(
                                                                            ADDITIONAL_METRICS[
                                                                                INDUSTRY_AVERAGE_KEY
                                                                            ].label,
                                                                        )}
                                                                        onClick={
                                                                            this
                                                                                .onIndustryAverageCheckboxClick
                                                                        }
                                                                        selected={
                                                                            showIndustryAverage
                                                                        }
                                                                        className={[
                                                                            "industry-benchmark",
                                                                        ]}
                                                                    />
                                                                </IndustryAverageCheckboxContainer>
                                                            </PlainTooltip>
                                                        )}
                                                        <DropdownContainer
                                                            style={{ width: "180px" }}
                                                        >
                                                            <Dropdown
                                                                dropdownPopupPlacement={
                                                                    "bottom-left"
                                                                }
                                                                selectedIds={{
                                                                    [selectedChannel]: true,
                                                                }}
                                                                shouldScrollToSelected={true}
                                                                onToggle={this.onToggle}
                                                                onClick={
                                                                    this.onSelectedChannelClick
                                                                }
                                                            >
                                                                {this.getChannelItems()}
                                                            </Dropdown>
                                                        </DropdownContainer>
                                                    </RightUtilsContainer>
                                                </UtilitiesContainer>
                                                {this.renderChart(
                                                    selectedTab,
                                                    filteredChartData,
                                                    selectedRows,
                                                )}
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
                }}
            </WithAllContexts>
        );
    }

    private onIndustryAverageCheckboxClick() {
        this.track(
            "Industry Average Checkbox",
            "click",
            `Performance trends/Benchmark Group/${
                this.state.showIndustryAverage ? "Hide" : "Check"
            }`,
        );
        this.setState({ showIndustryAverage: !this.state.showIndustryAverage });
    }

    private getAvailableChannels(data: any, selectedTab?: number) {
        return (
            data &&
            Object.keys(
                data.Data[
                    Object.values(conversionVerticals)[selectedTab || this.state.selectedTabIndex]
                        .dataKey
                ],
            ).sort((a, b) => (trafficSources[a].priority > trafficSources[b].priority ? 1 : -1))
        );
    }
}
