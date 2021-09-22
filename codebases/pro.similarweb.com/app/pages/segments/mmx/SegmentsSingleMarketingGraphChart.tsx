import React, { useEffect, useMemo, useState } from "react";
import CountryService from "services/CountryService";
import { devicesTypes } from "../../../UtilitiesAndConstants/Constants/DevicesTypes";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import {
    BoxContainer,
    ChartContainer,
    NoDataGraphContainer,
    SectionContainer,
    SectionLine,
    SingleGraphContainer,
    SingleGraphLegendContainer,
    StyledHeaderTitle,
    StyledTab,
    StyledTitleContainer,
    SwitcherContainer,
} from "./styledComponents";
import { FlexColumn, FlexRow, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import {
    abbrNumberVisitsFilter,
    numberFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
    timeFilter,
} from "filters/ngFilters";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import DurationService from "services/DurationService";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { displayTypeItems } from "pages/segments/mmx/SegmentsMmxSingleOverview";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    ContentContainer,
    TabListStyled,
    TabsContainer,
} from "components/Rule/src/RuleModes/EditRule/EditRuleModeStyles";
import { TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import {
    ButtonsContainer,
    LegendsTitle,
    StyledTabIcon,
} from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import {
    dateToUTC,
    getChartConfig,
} from "pages/segments/components/benchmarkOvertime/SegmentsVsGroupLineChart";
import * as _ from "lodash";
import combineConfigs from "components/Chart/src/combineConfigs";
import markerWithDashedConfig from "components/Chart/src/configs/series/markerWithDashedLinePerPointChartConfig";
import { CHART_COLORS } from "constants/ChartColors";
import { getAvailableGranularities } from "./MMXCommon";
import { Injector } from "common/ioc/Injector";
import { PdfExportService } from "services/PdfExportService";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import Chart from "components/Chart/src/Chart";
import { SegmentChannelsLegends } from "pages/segments/mmx/SegmentChannelsLegends";
import { SegmentsMmxChannelsMapping } from "pages/segments/mmx/SegmentsMarketingChannelsConfig";
import { ISegmentsMMXGraphData } from "pages/segments/mmx/SegmentsSingleMarketingChannelsContainer";
import { pagesPerVisitsFormatter } from "pages/segments/components/benchmarkOvertime/benchmarkOvertime";
import { BounceRate, DefaultCellRightAlign } from "components/React/Table/cells";
import SegmentsApiService, { IBaseSingleRequestParams } from "services/segments/segmentsApiService";
import { SwNavigator } from "common/services/swNavigator";

const MIN_VALUE_TO_SHOW_DATA = 5000;

export interface IEngagementMetricVertical {
    title: string;
    dataKey: string;
    name: string;
    filter: any;
    icon: string;
    yAxisFilter?: any;
    percentFilter?: any;
    format?: string;
    cellComponent?: any;
}

export interface IEngagementMetricVerticals {
    Visits: IEngagementMetricVertical;
    PageViews: IEngagementMetricVertical;
    PagesPerVisit: IEngagementMetricVertical;
    BounceRate: IEngagementMetricVertical;
    Duration: IEngagementMetricVertical;
}

export const EngagementVerticals: IEngagementMetricVerticals = {
    Visits: {
        title: "segments.mmx.graph.tab.visits",
        dataKey: "Visits",
        name: "Visits",
        filter: [minVisitsAbbrFilter],
        percentFilter: [percentageSignFilter],
        yAxisFilter: [abbrNumberVisitsFilter],
        icon: "visits",
        cellComponent: DefaultCellRightAlign,
        format: "minVisitsAbbr",
    },
    PageViews: {
        title: "segments.mmx.graph.tab.pageviews",
        dataKey: "PageViews",
        name: "PagesViews",
        filter: [minVisitsAbbrFilter],
        yAxisFilter: [abbrNumberVisitsFilter],
        icon: "impressions",
        cellComponent: DefaultCellRightAlign,
        format: "minVisitsAbbr",
    },
    PagesPerVisit: {
        title: "segments.mmx.graph.tab.pages.per.visit",
        dataKey: "PagesPerVisit",
        name: "PagesPerVisit",
        filter: [pagesPerVisitsFormatter],
        yAxisFilter: [numberFilter, 2],
        icon: "pages-per-visit",
        cellComponent: DefaultCellRightAlign,
        format: "number",
    },
    Duration: {
        title: "segments.mmx.graph.tab.visit.duration",
        dataKey: "Duration",
        name: "VisitDuration",
        filter: [timeFilter],
        icon: "avg-visit-duration",
        cellComponent: DefaultCellRightAlign,
        format: "time",
    },
    BounceRate: {
        title: "segments.mmx.graph.tab.bounce.rate",
        dataKey: "BounceRate",
        name: "BounceRate",
        filter: [percentageSignFilter],
        icon: "bounce-rate-2",
        format: "percentagesign",
        cellComponent: BounceRate,
    },
};

export interface IHiddenLegends {
    hiddenLegends: any[];
    setHiddenLegends: any;
}
export interface ISegmentsSingleMarketingChannelsGraphChartProps {
    params: any;
    data: ISegmentsMMXGraphData;
    isLoading: boolean;
    organizationSegments: any;
}

export const SegmentsSingleGraphLegendsContext = React.createContext<IHiddenLegends>({
    hiddenLegends: [],
    setHiddenLegends: () => {},
});

export const SegmentsSingleMarketingChannelsGraphChart = (
    props: ISegmentsSingleMarketingChannelsGraphChartProps,
) => {
    const { i18n } = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const { params, data, isLoading, organizationSegments } = props;
    const { id, duration, comparedDuration, country, webSource } = params;
    const segmentData = organizationSegments.find((seg) => seg.id === params.id);

    const { segmentsApiService } = React.useMemo(
        () => ({
            segmentsApiService: new SegmentsApiService(),
        }),
        [],
    );

    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const apiParams = swNavigator.getApiParams(params);
    const durationObject = useMemo(
        () => DurationService.getDurationData(duration, comparedDuration),
        [duration, comparedDuration],
    );

    const availableGranularities = useMemo(() => getAvailableGranularities(durationObject), [
        duration,
    ]);
    useEffect(() => {
        const durationRaw = durationObject?.raw;
        const monthDiff = durationRaw.to.diff(durationRaw.from, "month");
        if (monthDiff < 1 && selectedGranularity.value === "Monthly") {
            setSelectedGranularity(availableGranularities[1]);
        }
    }, [duration]);
    const [selectedGranularity, setSelectedGranularity] = useState(availableGranularities[2]);

    const excelUrl: string = useMemo(() => {
        const excelFileName = `SegmentMarketingChannels - ${segmentData.segmentName} - (${params.country}) - (${durationObject.forAPI.from}) - (${durationObject.forAPI.to})`;
        return segmentsApiService.getCustomSegmentMarketingMixGraphExcelUrl({
            ...apiParams,
            id: undefined,
            segmentsIds: params.id,
            keys: "null",
            webSource: "Desktop",
            timeGranularity: selectedGranularity?.value,
            includeSubDomains: true,
            lastUpdated: segmentData.lastUpdated,
            FileName: excelFileName,
        } as IBaseSingleRequestParams);
    }, [params, selectedGranularity]);

    const subtitleFilters = React.useMemo(
        () => [
            {
                filter: "date",
                value: {
                    from: durationObject.raw.from.valueOf(),
                    to: durationObject.raw.to.valueOf(),
                    useRangeDisplay:
                        duration !== "28d" &&
                        durationObject.raw.from.format("YYYY-MM") !==
                            durationObject.raw.to.format("YYYY-MM"),
                },
            },
            {
                filter: "country",
                countryCode: country,
                value: CountryService.getCountryById(country)?.text,
            },
            {
                filter: "webSource",
                value: devicesTypes.DESKTOP,
            },
        ],
        [durationObject, country, webSource, duration],
    );

    const [selectedDisplayTypeIndex, setSelectedDisplayTypeIndex] = React.useState(0);
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [hiddenLegends, setHiddenLegends] = useState([]);
    const toggleGranularity = (index) => {
        const selectedGranularity = availableGranularities[index];
        setSelectedGranularity(selectedGranularity);
        TrackWithGuidService.trackWithGuid(
            "segments.mmx.single.graph.change_granularity",
            "switch",
            {
                granularity: selectedGranularity.value,
            },
        );
    };
    const getTabProps = (index, isLocked?) => {
        return {
            onClick: () => onTabSelect(index),
            selected: selectedTab === index,
            key: `tab-${index}`,
        };
    };
    const onTabSelect = (index: any) => {
        setSelectedTab(index);
        TrackWithGuidService.trackWithGuid("segment.mmx.single.graph.tab", "switch", {
            tabName: Object.keys(EngagementVerticals)[index],
        });
    };

    const chartRef = React.useRef<HTMLElement>();
    const getPNG = React.useCallback(() => {
        const metric = Object.keys(EngagementVerticals)[selectedTab];
        TrackWithGuidService.trackWithGuid("segments.mmx.single.graph.download.png", "submit-ok", {
            metric,
            type: "PNG",
        });
        // const pngHeaderStyle = (chartRef.current.children[0] as HTMLElement).style;
        // pngHeaderStyle.display = "block";
        const offSetX = 0;
        const offSetY = 50;
        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        PdfExportService.downloadHtmlPngFedService(
            styleHTML + chartRef.current.outerHTML,
            "SegmentsMmxSingleGraph",
            chartRef.current.offsetWidth + offSetX,
            chartRef.current.offsetHeight + offSetY,
        ).then();
        // pngHeaderStyle.display = "none";
    }, []);

    const onExcelClick = () => {
        TrackWithGuidService.trackWithGuid(
            "segments.mmx.single.graph.download.excel",
            "submit-ok",
            { type: "Excel" },
        );
    };

    const getUtilityButtons = () => {
        return (
            <ButtonsContainer>
                {excelUrl && (
                    <a href={excelUrl}>
                        <DownloadButtonMenu
                            Excel={true}
                            downloadUrl={excelUrl}
                            exportFunction={onExcelClick}
                        />
                    </a>
                )}
                <DownloadButtonMenu PNG={true} exportFunction={getPNG} />
            </ButtonsContainer>
        );
    };
    const selectedMetric = Object.keys(EngagementVerticals)[selectedTab];
    const isPercentage =
        selectedMetric === EngagementVerticals.Visits.name && selectedDisplayTypeIndex === 1;
    const transformedData = useMemo(() => {
        if (isLoading || !data) {
            return null;
        }
        const filteredChartData = Object.entries(
            data?.[params.id]?.[selectedGranularity.value]?.[selectedMetric],
        )?.reduce((acc, channel) => {
            if (!hiddenLegends.includes(channel[0])) {
                acc[channel[0]] = channel[1];
            }
            return acc;
        }, {});
        const filteredChannelsMapping = SegmentsMmxChannelsMapping.filter(
            ({ dataKey }) => !hiddenLegends.includes(dataKey),
        );
        return transformData(filteredChartData, filteredChannelsMapping, isPercentage);
    }, [selectedGranularity, selectedDisplayTypeIndex, selectedMetric, isLoading, hiddenLegends]);

    const isEmptyData = useMemo(() => {
        if (isLoading) {
            return false;
        }
        if (!data) {
            return true;
        } else {
            const visitsData = data?.[params.id]?.Monthly?.[EngagementVerticals.Visits.dataKey];
            const totalTrafficValue: any = Object.values(visitsData)?.reduce(
                (acc, { Total }) => acc + Total?.Value,
                0,
            );
            return totalTrafficValue < MIN_VALUE_TO_SHOW_DATA;
        }
    }, [isLoading]);

    return (
        <SegmentsSingleGraphLegendsContext.Provider value={{ hiddenLegends, setHiddenLegends }}>
            <BoxContainer ref={chartRef}>
                <StyledTitleContainer>
                    <FlexColumn>
                        <StyledHeaderTitle>
                            <BoxTitle
                                tooltip={i18n("segments.analysis.mmx.single.graph.title.tooltip")}
                            >
                                {i18n("segments.analysis.mmx.single.graph.title")}
                            </BoxTitle>
                        </StyledHeaderTitle>
                        <StyledBoxSubtitle>
                            <BoxSubtitle filters={subtitleFilters} />
                        </StyledBoxSubtitle>
                    </FlexColumn>
                    <RightFlexRow>
                        <SectionLine>
                            {Object.keys(EngagementVerticals)[selectedTab] ===
                                EngagementVerticals.Visits.name && (
                                <SwitcherContainer>
                                    <Switcher
                                        customClass="CircleSwitcher"
                                        className="rightSwitcher"
                                        selectedIndex={selectedDisplayTypeIndex}
                                        onItemClick={setSelectedDisplayTypeIndex}
                                    >
                                        {displayTypeItems.map((displayTypeItem) => (
                                            <CircleSwitcherItem key={displayTypeItem.name}>
                                                {displayTypeItem.display}
                                            </CircleSwitcherItem>
                                        ))}
                                    </Switcher>
                                </SwitcherContainer>
                            )}
                            <SwitcherGranularityContainer
                                itemList={availableGranularities}
                                selectedIndex={selectedGranularity.index}
                                customClass={"CircleSwitcher"}
                                className={"gran-switch"}
                                onItemClick={toggleGranularity}
                            />
                        </SectionLine>
                    </RightFlexRow>
                </StyledTitleContainer>
                <TabsContainer>
                    <TabListStyled>
                        {Object.keys(EngagementVerticals).map((tabKey, index) => {
                            const tabProps = getTabProps(index);
                            const tabObj: IEngagementMetricVertical =
                                EngagementVerticals[`${tabKey}`];
                            return (
                                <StyledTab {...tabProps}>
                                    <StyledTabIcon size={"xs"} iconName={tabObj.icon} />
                                    <span>{i18nFilter()(tabObj.title)}</span>
                                </StyledTab>
                            );
                        })}
                    </TabListStyled>
                    {getUtilityButtons()}
                </TabsContainer>
                <ContentContainer>
                    <Tabs
                        onSelect={onTabSelect}
                        selectedIndex={selectedTab}
                        forceRenderTabPanel={true}
                    >
                        {Object.keys(EngagementVerticals).map((tab, idx) => (
                            <TabPanel key={`tab-panel-${idx}`}>
                                {idx === selectedTab && (
                                    <SectionContainer>
                                        <ChartContainer>
                                            {isLoading ? (
                                                <PixelPlaceholderLoader
                                                    width="100%"
                                                    height="260px"
                                                />
                                            ) : !data || isEmptyData ? (
                                                <NoDataGraphContainer>
                                                    <TableNoData
                                                        icon="no-data"
                                                        messageTitle={i18nFilter()(
                                                            "global.nodata.notavilable",
                                                        )}
                                                    />
                                                </NoDataGraphContainer>
                                            ) : (
                                                <FlexRow>
                                                    <SingleGraphContainer
                                                        className={"sharedTooltip"}
                                                    >
                                                        <Chart
                                                            type={"line"}
                                                            config={getChartConfig({
                                                                type: "line",
                                                                metric:
                                                                    EngagementVerticals[
                                                                        selectedMetric
                                                                    ],
                                                                filter: isPercentage
                                                                    ? EngagementVerticals[
                                                                          selectedMetric
                                                                      ].percentFilter
                                                                    : EngagementVerticals[
                                                                          selectedMetric
                                                                      ].filter,
                                                                data: transformedData,
                                                                timeGranularity:
                                                                    selectedGranularity.value,
                                                                yAxisFilter: isPercentage
                                                                    ? [percentageSignFilter]
                                                                    : EngagementVerticals[
                                                                          selectedMetric
                                                                      ].yAxisFilter,
                                                                durationObject,
                                                            })}
                                                            data={transformedData}
                                                        />
                                                    </SingleGraphContainer>
                                                    <SingleGraphLegendContainer>
                                                        <LegendsTitle>
                                                            {i18nFilter()(
                                                                "segments.mmx.single.graph.legends.channels.title",
                                                            )}
                                                        </LegendsTitle>
                                                        <SegmentChannelsLegends
                                                            {...{
                                                                selectedDisplayTypeIndex,
                                                                id: params.id,
                                                                data,
                                                                selectedMetric,
                                                                selectedGranularity,
                                                            }}
                                                        />
                                                    </SingleGraphLegendContainer>
                                                </FlexRow>
                                            )}
                                        </ChartContainer>
                                    </SectionContainer>
                                )}
                            </TabPanel>
                        ))}
                    </Tabs>
                </ContentContainer>
            </BoxContainer>
        </SegmentsSingleGraphLegendsContext.Provider>
    );
};

export const transformData = (data, filteredChannelMappings, isPercentage?) => {
    return _.map(filteredChannelMappings, ({ dataKey: chartKey }, index) => {
        const chartData = data?.[chartKey];
        const color = CHART_COLORS.trafficSourcesColorsBySourceMMX[chartKey];
        const baseSeriesConfig: any = {
            name: chartKey,
            color,
            tooltipIndex: index,
        };
        return combineConfigs(
            {
                ...baseSeriesConfig,
                isDataSingleSeries: true,
                data: chartData?.Breakdown?.map((dataPoint: any) => {
                    if (!dataPoint) {
                        return;
                    }
                    const key = dataPoint?.Key;
                    const confidenceLevel = dataPoint?.Value?.Confidence;
                    let value = isPercentage
                        ? dataPoint?.Value?.Percentage
                        : dataPoint.Value?.Value;
                    if (isNaN(parseFloat(value))) {
                        value = null;
                    }

                    return [
                        dateToUTC(key),
                        value,
                        {
                            partial: confidenceLevel >= 0.3 && confidenceLevel < 1,
                            hallowMarker: confidenceLevel >= 0.3 && confidenceLevel < 1,
                            confidenceLevel,
                        },
                    ];
                }),
            },
            [baseSeriesConfig, markerWithDashedConfig],
        );
    });
};
