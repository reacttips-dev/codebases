import Chart from "components/Chart/src/Chart";
import combineConfigs from "components/Chart/src/combineConfigs";
import { PeriodOverPeriodChart } from "components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChart";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { Legends } from "components/React/Legends/Legends";
import { CHART_COLORS } from "constants/ChartColors";
import {
    numberFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
    timeFilter,
} from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import {
    filtersList,
    getChartConfig,
    getYaxisFormat,
} from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/ChannelAnalysisChartConfig";
import {
    ButtonsContainer,
    ChannelsButtonsTitle,
    ChannelsButtonsWrapper,
    ChartContainer,
    ChartHeaderContainer,
    ChartLegendsContainer,
    ChartWrapper,
    CheckBoxContainer,
    ContentWrapper,
    LegendsTitle,
    NoDataWrapper,
    StyledLegendWrapper,
    StyledSwitcher,
    StyledTab,
    StyledTabIcon,
    StyledTabList,
    VisioWrapper,
    Wrapper,
} from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import * as React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    adaptCompareData,
    ChannelAnalysisPoPCompare,
} from "../ChannelAnalysisPoPCompare/ChannelAnalysisPoPCompare";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { adaptCompareSingleData } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisPoPSingle";
import InsightsContainer, {
    IInsight,
} from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/InsightsContainer";
import { LegendWithOneLineCheckboxFlex } from "@similarweb/ui-components/dist/legend";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { MMXAlertWithPlainTooltip } from "components/MMXAlertWithPlainTooltip";
import { swSettings } from "common/services/swSettings";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { FlexColumn, FlexRowReverse } from "styled components/StyledFlex/src/StyledFlex";
import { PdfExportService } from "services/PdfExportService";
import { CircleSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { ChartIds } from "components/Chart/src/components/annotations/Helpers/ChartIdsHelper";

const gran = {
    Monthly: "MonthlyData",
    Weekly: "WeeklyData",
    Daily: "DailyData",
};

export class ChannelAnalysisChart extends React.Component<any, any> {
    private chart;
    private pdfExportService;
    private legendItems;
    private newMMXAlgoStartData = swSettings.current.resources.NewAlgoMMX;

    constructor(props) {
        super(props);
        this.state = {
            isCompare: this.props.keys.length > 1,
            checkboxFilters: this.getCheckboxFilters(),
            selectedVisualizationIndex: 1,
            insights: this.getEnrichedInsights(),
            insightCardClicked: false,
            isAllLegendsChecked: true,
            isError: false,
            selectedChannel: this.props.selectedChannelFilter
                ? filtersList[this.props.webSource].findIndex(
                      (c) => c === this.props.selectedChannelFilter,
                  )
                : 0,
        };
        this.pdfExportService = PdfExportService;
    }

    public render() {
        return (
            <Wrapper>
                {this.getChartHeader()}
                {this.props.showInsights &&
                    this.props.selectedMetric === "TrafficShare" &&
                    this.getInsights()}
                <FlexColumn ref={(el) => (this.chart = el)}>
                    <FlexRowReverse alignItems={"center"} justifyContent={"space-between"}>
                        <VisioWrapper>
                            {this.props.webSource === devicesTypes.MOBILE &&
                                this.getUtilityButtons()}
                        </VisioWrapper>
                        {this.getChannelsButtons()}
                    </FlexRowReverse>
                    <ContentWrapper>
                        {this.getChartContainer()}
                        {this.getLegendsContainer()}
                    </ContentWrapper>
                </FlexColumn>
            </Wrapper>
        );
    }

    private getChartHeader = () => {
        return (
            <>
                <ChartHeaderContainer>
                    {this.props.webSource === devicesTypes.DESKTOP ? this.getTabsContainer() : null}
                </ChartHeaderContainer>
            </>
        );
    };
    private getUtilityButtons = () => {
        return (
            <ButtonsContainer>
                <a href={this.props.getExcelUrl()}>
                    <DownloadButtonMenu
                        Excel={true}
                        downloadUrl={this.props.getExcelUrl()}
                        exportFunction={this.onExcelClick}
                    />
                </a>
                <DownloadButtonMenu PNG={true} exportFunction={this.getPNG} />
                {!this.props.isPoP && this.props.webSource !== devicesTypes.MOBILE && (
                    <AddToDashboardButton onClick={this.onAddToDashboardClick} />
                )}
            </ButtonsContainer>
        );
    };
    private getTabsContainer = () => {
        return (
            <>
                <StyledTabList>
                    <StyledTab {...this.getTabProps("TrafficShare")}>
                        <StyledTabIcon size={"xs"} iconName={"chart-pie"} />
                        {i18nFilter()("mmx.channelanalysis.traffic-share.title")}
                    </StyledTab>
                    <StyledTab {...this.getTabProps("AverageDuration")}>
                        <StyledTabIcon size={"xs"} iconName={"avg-visit-duration"} />
                        {i18nFilter()("mmx.channelanalysis.duration.title")}
                    </StyledTab>
                    <StyledTab {...this.getTabProps("PagesPerVisit")}>
                        <StyledTabIcon size={"xs"} iconName={"pages-per-visit"} />
                        {i18nFilter()("mmx.channelanalysis.page-visits.title")}
                    </StyledTab>
                    <StyledTab {...this.getTabProps("BounceRate")}>
                        <StyledTabIcon size={"xs"} iconName={"bounce-rate-2"} />
                        {i18nFilter()("mmx.channelanalysis.bounce-rate.title")}
                    </StyledTab>
                </StyledTabList>
                {this.getUtilityButtons()}
            </>
        );
    };
    private getTabProps = (index) => {
        return {
            onClick: () => {
                this.props.handleMetricChange(index);
                TrackWithGuidService.trackWithGuid(
                    "website_analysis.marketing_channels.channel_analysis.metric_tab",
                    "click",
                    { metric: index },
                );
            },
            selected: this.props.selectedMetric === index,
            key: `tab-${index}`,
        };
    };

    private isPercentage() {
        const { selectedVisualizationIndex, selectedMetric } = this.props;
        return selectedMetric === "TrafficShare" && selectedVisualizationIndex === 0;
    }

    private basePostProcessChartData = (data) => {
        if (this.state.isCompare) {
            return data.map((item) => {
                if (item.data) {
                    const legendItem = this.state.checkboxFilters.filter(
                        (i) => i.name === item.name,
                    )[0];
                    return {
                        ...item,
                        visible: !legendItem.hidden,
                        color: legendItem.color,
                    };
                }
            });
        } else {
            return data.reverse().map((item, index) => {
                const legendItem = this.state.checkboxFilters[index];
                return {
                    ...item,
                    visible: !legendItem.hidden,
                    color: legendItem.color,
                };
            });
        }
    };

    private getChartContainer = () => {
        const { mtdEndDate, isMTDOn, selectedGranularity, isPoP, durationObject } = this.props;
        const { isCompare } = this.state;
        const { selectedMetric } = this.props;
        const data = isPoP ? this.transformDataPoP() : this.getGraphData();

        if (this.state.isError !== !data) {
            this.setState({ isError: !data });
        }

        return this.state.isError
            ? ChannelAnalysisChart.getNoData()
            : data && (
                  <ChartContainer>
                      {isPoP ? (
                          isCompare ? (
                              this.renderPopCompareChart(data)
                          ) : (
                              this.renderPopChart(data)
                          )
                      ) : (
                          <ChartWrapper>
                              <Chart
                                  type="line"
                                  data={data}
                                  config={getChartConfig(
                                      this.isPercentage(),
                                      selectedMetric,
                                      selectedGranularity,
                                      isMTDOn,
                                      mtdEndDate,
                                      durationObject,
                                      isPoP,
                                      data,
                                      this.props.webSource === devicesTypes.DESKTOP,
                                      this.newMMXAlgoStartData,
                                  )}
                                  chartIdForAnnotations={`${ChartIds["ChannelTrafficAndEngagement"]}_${selectedMetric}`}
                              />
                          </ChartWrapper>
                      )}
                  </ChartContainer>
              );
    };

    private getLegendsContainer = () => {
        const { isPoP } = this.props;
        const { isCompare } = this.state;
        const titleTooltip = this.getLegendTooltip();

        return (
            <ChartLegendsContainer
                justifyContent={!isCompare && !isPoP ? "center" : null}
                paddingTop={isCompare || isPoP ? 7 : null}
            >
                <CheckBoxContainer>{this.getLegends(titleTooltip)}</CheckBoxContainer>
            </ChartLegendsContainer>
        );
    };

    private getInsights = () => {
        const { selectedGranularity, domain, isLoading, durationObject } = this.props;

        const onInsightClick = (chosenChannel, type, index, domain?) => {
            let checkboxFilters;
            if (domain) {
                this.setState({
                    selectedChannel: filtersList[this.props.webSource].findIndex(
                        (c) => c === chosenChannel,
                    ),
                });
                this.props.handleChannelFilterChange(chosenChannel);
                checkboxFilters = this.legendItems.map((f) => {
                    f.hidden = f.name !== domain.name;
                    return f;
                });
            } else {
                checkboxFilters = this.legendItems.map((f) => {
                    f.hidden = f.name !== chosenChannel;
                    return f;
                });
            }
            const insights = this.state.insights.map((card) => {
                card.isClicked = card.index === index;
                card.isVisited = card.isVisited ? true : card.index === index;
                return card;
            });

            this.setState({
                checkboxFilters: checkboxFilters,
                selectedVisualizationIndex: 1,
                insights: insights,
                insightCardClicked: true,
                isAllLegendsChecked: false,
            });

            TrackWithGuidService.trackWithGuid(
                "website_analysis.marketing_channels.channel_analysis.insights.card",
                "click",
                {
                    type: type,
                },
            );
        };

        const resetInsightsAndLegends = () => {
            const insights = this.state.insights.map((card) => {
                card.isClicked = false;
                return card;
            });

            const filterSites = this.legendItems.map((f) => {
                f.hidden = false;
                return f;
            });

            this.setState({
                insights: insights,
                checkboxFilters: filterSites,
                isAllLegendsChecked: true,
            });

            TrackWithGuidService.trackWithGuid(
                "website_analysis.marketing_channels.channel_analysis.insights.reset.clicked",
                "click",
            );
        };

        return (
            <InsightsContainer
                domain={domain}
                granularity={selectedGranularity}
                insights={this.state.insights}
                onInsightClick={onInsightClick}
                isFetching={isLoading}
                channelsData={this.state.checkboxFilters}
                resetClickedCard={resetInsightsAndLegends}
                insightCardClicked={this.state.insightCardClicked}
                isAllLegendsChecked={this.state.isAllLegendsChecked}
                durationObject={durationObject}
                isCompare={this.state.isCompare}
            />
        );
    };

    private static getNoData() {
        return (
            <NoDataWrapper>
                <NoDataLandscape
                    title={"global.nodata.notavilable"}
                    subtitle={"global.nodata.notavilable.subtitle"}
                />
            </NoDataWrapper>
        );
    }

    private renderPopChart(chartData) {
        const postProcessChartData = this.basePostProcessChartData;
        const postProcessChartConfig = (config) => {
            const { selectedMetric } = this.props;
            return combineConfigs({ yAxisFormatter }, [
                config,
                yAxisLabelsConfig,
                {
                    tooltip: {
                        formatter() {
                            const reversePointsForTooltip = this.points.slice().reverse();
                            return config.tooltip.formatter.call({
                                points: reversePointsForTooltip,
                            });
                        },
                    },
                },
                selectedMetric === "TrafficShare"
                    ? {
                          yAxis: {
                              min: 0,
                          },
                      }
                    : {},
            ]);
        };
        const yAxisFormatter = ({ value }) =>
            getYaxisFormat(this.props.selectedMetric, value, this.isPercentage());
        const durationObject = this.props.durationObject;
        const durations = [durationObject.forWidget[1], durationObject.forWidget[0]];

        if (chartData) {
            return (
                <ChartWrapper>
                    <PeriodOverPeriodChart
                        showLegend={false}
                        type="line"
                        data={chartData}
                        legendDurations={durations}
                        yAxisFormatter={yAxisFormatter}
                        postProcessChartData={postProcessChartData}
                        postProcessChartConfig={postProcessChartConfig}
                        metric={this.state.selectedTab}
                    />
                </ChartWrapper>
            );
        }
        return null;
    }

    private renderPopCompareChart(chartData) {
        const postProcessChartData = this.basePostProcessChartData;

        return (
            <ChannelAnalysisPoPCompare
                type="column"
                data={chartData}
                postProcessChartData={postProcessChartData}
                webSource={this.props.webSource}
                dropdownFilter={this.props.selectedChannelFilter}
                metric={this.props.selectedMetric}
                isPercentage={this.isPercentage()}
            />
        );
    }

    private getCheckboxFilters = () => {
        if (this.props.isPoP && this.props.keys.length === 1) {
            const durations = this.props.durationObject.forWidget;
            return durations.map((f, i) => {
                return {
                    name: f,
                    hidden: false,
                    color: CHART_COLORS.periodOverPeriod.Total[i],
                };
            });
        } else {
            if (this.props.keys.length > 1) {
                return this.props.keys.map((f, i) => {
                    return {
                        name: f.name,
                        hidden: false,
                        color: f.color,
                    };
                });
            } else {
                return filtersList[this.props.webSource].map((f, i) => {
                    return {
                        name: f,
                        hidden: false,
                        color: CHART_COLORS.trafficSourcesColorsBySourceMMX[f],
                    };
                });
            }
        }
    };

    private getFormattedNumbers = (metric, value) => {
        switch (metric) {
            case "TrafficShare":
                return minVisitsAbbrFilter()(value);
            case "AverageDuration":
                return timeFilter()(value, null);
            case "PagesPerVisit":
                return numberFilter()(value, 2);
            case "BounceRate":
                return percentageSignFilter()(value, 2);
        }
    };

    private transformData = () => {
        const { isCompare } = this.state;
        const {
            webSource,
            selectedGranularity,
            data,
            selectedChannelFilter,
            selectedMetric,
        } = this.props;

        const Path =
            webSource === devicesTypes.DESKTOP
                ? data[gran[selectedGranularity]][selectedMetric]
                : data["Data"][selectedMetric];
        const finaleData =
            Path &&
            (webSource === devicesTypes.DESKTOP
                ? isCompare
                    ? Path[selectedChannelFilter]
                    : Path["Data"]
                : isCompare
                ? Path[selectedChannelFilter]
                : Path["Data"]);
        return finaleData;
    };

    private constructPopDataObject() {
        const data = this.props.data;
        const metric = this.props.selectedMetric;

        return this.state.isCompare
            ? {
                  comparedData: data.ComparedData?.Data[metric][this.props.selectedChannelFilter],
                  Total: data.Data[metric][this.props.selectedChannelFilter]?.Total,
                  BreakDown: data.Data[metric][this.props.selectedChannelFilter]?.BreakDown,
              }
            : {
                  comparedData: data.ComparedData?.Data[metric],
                  Total: data.Data[metric]?.Data?.Total,
                  BreakDown: data.Data[metric]?.Data?.BreakDown,
              };
    }

    private transformDataPoP() {
        const data = this.constructPopDataObject();
        return this.state.isCompare
            ? adaptCompareData(data, this.props.webSource)
            : adaptCompareSingleData(data)[this.props.selectedChannelFilter];
    }

    private getPopLegendDataObject() {
        const [{ name: thisPeriod }, { name: previousPeriod }] = this.getCheckboxFilters();
        const { Total, comparedData } = this.constructPopDataObject();
        const channel = this.props.selectedChannelFilter;
        return {
            [thisPeriod]: Total[channel] ?? 0,
            [previousPeriod]: comparedData?.Data?.Total[channel] ?? 0,
        };
    }

    private getLegendTooltip = () => {
        const {
            startDate,
            endDate,
            mtdStartDate,
            mtdEndDate,
            isMTDOn,
            selectedMetric,
        } = this.props;

        if (isMTDOn) {
            const format = "YYYY-MM-DD";
            const getDateString = (start, end) =>
                dayjs(start, format).format("MM YYYY") === dayjs(end, format).format("MM YYYY")
                    ? `${dayjs(start, format).format("MMM")}`
                    : `${dayjs(start, format).format("MMM")} - ${dayjs(end, format).format("MMM")}`;
            const dates = getDateString(startDate, endDate);
            const mtdDates = getDateString(mtdStartDate, mtdEndDate);
            return selectedMetric === "TrafficShare"
                ? i18nFilter()("mmx.channelanalysis.legends.tooltip.mtd.sum", {
                      dates,
                      mtdDates,
                  })
                : i18nFilter()("mmx.channelanalysis.legends.tooltip.mtd.avg", {
                      dates,
                      mtdDates,
                  });
        } else {
            return false;
        }
    };

    private getLegendItems = () => {
        const { checkboxFilters } = this.state;
        const { selectedMetric, selectedVisualizationIndex } = this.props;
        const data = this.props.isPoP ? this.getPopLegendDataObject() : this.transformData()?.Total;
        if (data) {
            const getWinner = () => {
                if (!data) {
                    return null;
                }
                if (selectedMetric === "BounceRate") {
                    return _.minBy(Object.keys(data), (o) => {
                        return data[o];
                    });
                } else {
                    return _.maxBy(Object.keys(data), (o) => {
                        return data[o];
                    });
                }
            };
            const winner = getWinner();
            const isPercentage =
                selectedMetric === "TrafficShare" && selectedVisualizationIndex === 0;
            const total: any = Object.values(data).reduce(
                (acc: number, val: number) => acc + val,
                0,
            );

            return total
                ? checkboxFilters.map((item) => {
                      const value =
                          data[item.name] && isPercentage
                              ? percentageSignFilter()(data[item.name] / total, 2)
                              : data[item.name]
                              ? this.getFormattedNumbers(selectedMetric, data[item.name])
                              : "N/A";
                      return {
                          data: value,
                          name: item.name,
                          hidden: item.hidden,
                          color: item.color,
                          isWinner: item.name === winner,
                      };
                  })
                : [];
        } else {
            return [];
        }
    };

    private getLegendItemsPoP = () => {
        const { checkboxFilters } = this.state;
        return checkboxFilters.map((item) => {
            return {
                name: item.name,
                hidden: item.hidden,
                color: item.color,
            };
        });
    };

    private getLegends = (titleTooltip) => {
        const { selectedMetric } = this.props;
        this.legendItems =
            this.props.isPoP && this.state.isCompare
                ? this.getLegendItemsPoP()
                : this.getLegendItems();

        if (this.props.isPoP && !this.state.isCompare && this.legendItems.length > 0) {
            this.legendItems = [this.legendItems[1], this.legendItems[0]];
        }

        const onLegendClick = (filter) => {
            const action = filter.hidden ? "add" : "remove";
            let isAllLegendsChecked = true;
            let filterSites = this.legendItems.map((f) => {
                if (f.name === filter.name) {
                    f.hidden = !f.hidden;
                }
                if (f.hidden) {
                    isAllLegendsChecked = false;
                }
                return f;
            });

            const insights = this.state.insights.map((card) => {
                card.isClicked = false;
                return card;
            });

            if (this.props.isPoP && !this.state.isCompare) {
                filterSites = [filterSites[1], filterSites[0]];
            }

            this.setState({
                checkboxFilters: filterSites,
                insights: insights,
                isAllLegendsChecked: isAllLegendsChecked,
            });

            TrackWithGuidService.trackWithGuid(
                "website_analysis.marketing_channels.channel_analysis.checkbox_filters",
                "click",
                { metric: selectedMetric, name: filter.name, action },
            );
        };
        return (
            this.legendItems &&
            this.legendItems.length > 0 && (
                <>
                    <LegendsTitle>
                        {i18nFilter()(
                            this.state.isCompare
                                ? "website_analysis.marketing_channels.channel_analysis.legends.websites.title"
                                : "website_analysis.marketing_channels.channel_analysis.legends.channels.title",
                        )}
                        {titleTooltip !== false && (
                            <PlainTooltip placement="top" text={titleTooltip}>
                                <span>
                                    <InfoIcon iconName="info" />
                                </span>
                            </PlainTooltip>
                        )}
                        {this.props.isShowMMXAlertBell && <MMXAlertWithPlainTooltip />}
                    </LegendsTitle>
                    <Legends
                        legendComponent={LegendWithOneLineCheckboxFlex}
                        legendComponentWrapper={StyledLegendWrapper}
                        legendItems={this.legendItems}
                        toggleSeries={onLegendClick}
                        gridDirection="column"
                        textMaxWidth={
                            window.innerWidth < 1680
                                ? window.innerWidth > 1366
                                    ? "125px"
                                    : "100px"
                                : "150px"
                        }
                    />
                </>
            )
        );
    };

    private getChannelsButtons() {
        const isAllowed = this.state.isCompare || this.props.isPoP;

        const onChannelChange = (value) => {
            this.setState({
                selectedChannel: value,
            });

            this.props.handleChannelFilterChange(filtersList[this.props.webSource][value]);
            TrackWithGuidService.trackWithGuid(
                "website_analysis.marketing_channels.channel_analysis.channel_dropdown",
                "click",
                { channel: value.id },
            );
        };

        return isAllowed ? (
            <ChannelsButtonsWrapper>
                <ChannelsButtonsTitle>
                    {i18nFilter()(
                        "website_analysis.marketing_channels.channel_analysis.channels.title",
                    )}
                </ChannelsButtonsTitle>
                <StyledSwitcher
                    selectedIndex={this.state.selectedChannel}
                    customClass="CircleSwitcher"
                    onItemClick={onChannelChange}
                >
                    {filtersList[this.props.webSource].map((channel, index) => {
                        return <CircleSwitcherItem key={index}>{channel}</CircleSwitcherItem>;
                    })}
                </StyledSwitcher>
            </ChannelsButtonsWrapper>
        ) : null;
    }

    private getGraphData = () => {
        const { selectedVisualizationIndex, selectedMetric } = this.props;
        const isPercentage = selectedMetric === "TrafficShare" && selectedVisualizationIndex === 0;
        const filters = [];
        this.state.checkboxFilters.forEach((f) => {
            if (!f.hidden) {
                filters.push(f);
            }
        });
        const data = this.transformData()?.BreakDown;
        let newData;
        let isAllValuesNull = true;

        if (data) {
            newData = filters.map((f) => {
                return {
                    name: f.name,
                    color: f.color,
                    data: Object.keys(data).map((d) => {
                        const value = data[d][f.name];
                        const total: any = Object.values(data[d]).reduce(
                            (acc: number, val: number) => acc + val,
                            0,
                        );

                        if (value) {
                            isAllValuesNull = false;
                        }

                        return [dayjs.utc(d).valueOf(), isPercentage ? value / total : value];
                    }),
                };
            });
        }

        return isAllValuesNull ? null : newData;
    };

    private onExcelClick = () => {
        const metric = this.props.selectedMetric;
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.channel_analysis.download",
            "submit-ok",
            { metric, type: "Excel" },
        );
    };

    private onAddToDashboardClick = () => {
        const metric = this.props.selectedMetric;
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.channel_analysis.add_to_dashboard",
            "click",
            { metric },
        );
        this.props.addToDashboard({
            metric,
            selectedChannel:
                (this.state.isCompare || this.props.isPoP) && this.props.selectedChannelFilter,
        });
    };

    private getPNG = () => {
        const metric = this.props.selectedMetric;
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.channel_analysis.download",
            "submit-ok",
            { metric, type: "PNG" },
        );
        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        const pngExportElement = document.querySelector(".ChannelAnalysisChartContainer")
            .firstChild as HTMLElement;
        this.pdfExportService.downloadHtmlPngFedService(
            styleHTML + (pngExportElement?.outerHTML ?? ""),
            "Marketing Channels Analysis",
            pngExportElement?.clientWidth ?? 1366,
            pngExportElement?.clientHeight ?? 400,
        );
    };

    private getEnrichedInsights = () => {
        if (!this.props.insights) {
            return [];
        }
        return this.props.insights.map((card: IInsight, index: number) => ({
            ...card,
            isClicked: false,
            index,
        }));
    };
}
