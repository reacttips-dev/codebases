import { colorsSets } from "@similarweb/styles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Switcher, TabSwitchItem } from "@similarweb/ui-components/dist/switcher";
import { ExcelButton } from "components/React/ExcelButton/ExcelButton";
import * as _ from "lodash";
import * as React from "react";
import { ReactElement } from "react";
import BoxSubtitle from "../../../components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "../../../components/BoxTitle/src/BoxTitle";
import Chart from "../../../components/Chart/src/Chart";
import "../../../components/Chart/styles/sharedTooltip.scss";
import { GraphLoader } from "../../../components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { NoData } from "../../../components/NoData/src/NoData";
import StyledBoxSubtitle from "../../../styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { FlexColumn } from "../../../styled components/StyledFlex/src/StyledFlex";
import {
    ADDITIONAL_METRICS,
    INDUSTRY_AVERAGE_KEY,
} from "../../conversion/components/benchmarkOvertime/benchmarkOvertime";
import { getChartConfig } from "../../conversion/components/benchmarkOvertime/SitesVsCategorylineChart";
import { dateToUTC } from "../../conversion/components/benchmarkOvertime/chartDataProcessor";

import {
    BoxContainer,
    Bullet,
    ChartContainer,
    ContentContainer,
    GraphContainer,
    LegendsContainer,
    LegendTitle,
    NoDataContainer,
    SitesChartLoaderContainer,
    StyledHeaderTitle,
    TitleContainer,
} from "../../conversion/components/benchmarkOvertime/StyledComponents";
import WithAllContexts from "../../conversion/components/WithAllContexts";
import { TabsContainer } from "./StyledComponents";

export interface IGraphWithTabsProps {
    title: string;
    titleTooltip: string;
    filters: any;
    data: any;
    selectedRows?: any[];
    isLoading?: boolean;
    renderChart?: (selectedTab, filteredChartData, selectedRows) => ReactElement<any>;
    renderLegend?: (selectedChartData) => ReactElement<any>;
    tableExcelLink?: string;
    tabs: ITabs;
    rowSelectionProp?: string;
}

export interface IGraphWithTabsState {
    selectedTabIndex: number;
}

export interface ITab {
    title: string;
    dataKey: string;
    filter: any;
    name: string;
}

export interface ITabs {
    [key: string]: ITab;
}

const transformData = (data, selectedRows, rowSelectionProp) => {
    return _.map(Object.keys(data), (chartKey: string, index) => {
        const isIndustryAverage = chartKey === INDUSTRY_AVERAGE_KEY;
        const color = selectedRows
            ? _.result(
                  _.find(selectedRows, (row: any) => row[rowSelectionProp] === chartKey),
                  "selectionColor",
              )
            : colorsSets.c.toArray()[index];
        return {
            name: chartKey,
            color: isIndustryAverage ? ADDITIONAL_METRICS[INDUSTRY_AVERAGE_KEY].color : color,
            dashStyle: isIndustryAverage ? "longdash" : undefined,
            marker: { symbol: "circle" },
            data: _.map(Object.keys(data[chartKey]), (datekey: string) => {
                if (!datekey) {
                    return;
                }
                let val = data[chartKey][datekey];
                if (isNaN(parseFloat(val))) {
                    val = null;
                }

                return { x: dateToUTC(datekey), y: data[chartKey][datekey] };
            }),
        };
    });
};

export class GraphWithTabs extends React.PureComponent<IGraphWithTabsProps, IGraphWithTabsState> {
    protected track;
    private translate;

    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 0,
        };
        this.renderLegend = this.renderLegend.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
    }

    public onTabClick = (value) => {
        this.track(
            "Metric Button",
            "click",
            `Over Time Graph/${this.translate(this.props.title)}/${
                Object.keys(this.props.tabs)[value]
            }`,
        );
        this.setState({
            selectedTabIndex: value,
        });
    };

    public renderChart(selectedTab, filteredChartData, selectedRows) {
        const { rowSelectionProp } = this.props;
        const chart = this.props.renderChart ? (
            this.props.renderChart(selectedTab, filteredChartData, selectedRows)
        ) : (
            <ChartContainer>
                <Chart
                    type={"line"}
                    config={getChartConfig({
                        type: "line",
                        filter: selectedTab.filter,
                        data: undefined,
                        yAxisFilter: undefined,
                    })}
                    data={transformData(filteredChartData, selectedRows, rowSelectionProp)}
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
        const { selectedRows, rowSelectionProp } = this.props;
        return (
            <LegendsContainer>
                {selectedRows
                    ? _.map(selectedRows, (row) => {
                          return (
                              <LegendTitle key={row[rowSelectionProp]}>
                                  <Bullet color={row.selectionColor} />
                                  {row[rowSelectionProp]}
                              </LegendTitle>
                          );
                      })
                    : _.map(Object.keys(selectedChartData), (chartKey: string, index) => {
                          return (
                              <LegendTitle key={"t" + index}>
                                  <Bullet color={colorsSets.c.toArray()[index]} />
                                  {chartKey}
                              </LegendTitle>
                          );
                      })}
            </LegendsContainer>
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
            tabs,
            rowSelectionProp,
        } = this.props;
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
        const selectedTab: ITab = Object.values(tabs)[this.state.selectedTabIndex];
        const selectedChartData = data && data ? data[selectedTab.dataKey] : undefined;

        const filteredChartData =
            selectedChartData && selectedRows && rowSelectionProp
                ? Object.keys(selectedChartData)
                      .filter((chartKey) =>
                          _.find(selectedRows, (row) => {
                              return String(row[rowSelectionProp]) === String(chartKey);
                          }),
                      )
                      .reduce((obj, key) => {
                          obj[key] = selectedChartData[key];
                          return obj;
                      }, {})
                : selectedChartData;

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
                                        <PlainTooltip
                                            tooltipContent={translate(
                                                "workspace.investors.download.excel",
                                            )}
                                        >
                                            <ExcelButton
                                                url={this.props.tableExcelLink}
                                                trackName="graph with tabs"
                                            />
                                        </PlainTooltip>
                                    </PlainTooltip>
                                ) : null}
                            </TitleContainer>
                            <ContentContainer>
                                <TabsContainer>
                                    <Switcher
                                        selectedIndex={this.state.selectedTabIndex}
                                        className={"tabsInner"}
                                        onItemClick={this.onTabClick}
                                    >
                                        {Object.values(tabs).map((geoVertical: ITab) => {
                                            return (
                                                <TabSwitchItem key={geoVertical.dataKey}>
                                                    {translate(geoVertical.title)}
                                                </TabSwitchItem>
                                            );
                                        })}
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
                                                {this.renderLegend(selectedChartData)}
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
}
