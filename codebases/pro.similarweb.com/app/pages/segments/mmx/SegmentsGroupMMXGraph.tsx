import {
    Dropdown,
    DropdownButton,
    EllipsisDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import React, { useContext, useEffect, useMemo, useState } from "react";
import CountryService from "services/CountryService";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import {
    MMXCompareBoxContainer,
    MMXGroupChartContainer,
    SectionContainer,
    SectionLine,
    GroupGraphContainer,
    CompareGraphLegendContainer,
    DropdownFilterContainer,
    StyledHeaderTitle,
    StyledTab,
    StyledTitleContainer,
    SwitcherContainer,
} from "./styledComponents";
import { FlexColumn, FlexRow, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { i18nFilter } from "filters/ngFilters";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import DurationService from "services/DurationService";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { displayTypeItems } from "pages/segments/mmx/SegmentsMmxSingleOverview";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    CompareContentContainer,
    TabListStyled,
    TabsContainer,
} from "components/Rule/src/RuleModes/EditRule/EditRuleModeStyles";
import { TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import {
    ButtonsContainer,
    LegendsTitle,
    StyledTabIcon,
} from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import { SegmentDomainLegends } from "pages/segments/mmx/SegmentDomainLegends";
import Chart from "components/Chart/src/Chart";
import {
    dateToUTC,
    getChartConfig,
    SegmentSubtitle,
} from "pages/segments/components/benchmarkOvertime/SegmentsVsGroupLineChart";
import * as _ from "lodash";
import combineConfigs from "components/Chart/src/combineConfigs";
import markerWithDashedConfig from "components/Chart/src/configs/series/markerWithDashedLinePerPointChartConfig";
import {
    EngagementVerticals,
    IEngagementMetricVertical,
} from "./SegmentsSingleMarketingGraphChart";
import { getAvailableGranularities } from "./MMXCommon";
import SegmentsApiService, {
    IBaseSingleRequestParams,
    ICustomSegment,
    ICustomSegmentGroupWebsite,
    SEGMENT_TYPES,
} from "services/segments/segmentsApiService";
import { Injector } from "common/ioc/Injector";
import { PdfExportService } from "services/PdfExportService";
import { SegmentTypeBadge } from "pages/segments/StyledComponents";
import { SwNavigator } from "common/services/swNavigator";

const SEGMENT_MMX_GROUP_DEFAULT_CHANNEL = "Direct";

export const ChannelsObj = {
    Direct: "Direct",
    Mail: "Email",
    OrganicSearch: "Organic Search",
    Referrals: "Referrals",
    PaidReferrals: "Display Ads",
    PaidSearch: "Paid Search",
    Social: "Social",
    InternalReferrals: "Internal Referrals",
};

export const SegmentsGroupMMXGraph = (props) => {
    const { i18n } = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const {
        groups,
        params,
        data,
        isLoading,
        selectedRows,
        selectedDisplayTypeIndex,
        setSelectedDisplayTypeIndex,
        allSegments,
        selectedMetric,
        setSelectedTab,
        selectedTab,
        groupData,
    } = props;
    const { id, duration, comparedDuration, country, webSource } = params;

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
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const apiParams = swNavigator.getApiParams(params);
    const { segmentsApiService } = useMemo(
        () => ({
            segmentsApiService: new SegmentsApiService(),
        }),
        [],
    );
    const excelUrl = useMemo(() => {
        const excelFileName = `SegmentMarketingChannels - ${groupData.name} - (${params.country}) - (${durationObject.forAPI.from}) - (${durationObject.forAPI.to})`;
        return segmentsApiService.getCustomSegmentMarketingMixGraphExcelUrl({
            ...apiParams,
            segmentGroupId: params.id,
            timeGranularity: selectedGranularity?.value,
            keys: "null",
            webSource: "Desktop",
            includeSubDomains: true,
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
                value: "Desktop",
            },
        ],
        [durationObject, country, webSource, duration],
    );

    const [currentChannel, setCurrentChannel] = React.useState(SEGMENT_MMX_GROUP_DEFAULT_CHANNEL);

    const [hiddenLegends, setHiddenLegends] = useState([]);
    const toggleGranularity = (index) => {
        const selectedGranularity = availableGranularities[index];
        setSelectedGranularity(selectedGranularity);
        TrackWithGuidService.trackWithGuid(
            "segments.mmx.group.graph.change_granularity",
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
        setSelectedDisplayTypeIndex(0);
        TrackWithGuidService.trackWithGuid("segment.mmx.group.graph.tab", "switch", {
            tabName: Object.keys(EngagementVerticals)[index],
        });
    };

    const chartRef = React.useRef<HTMLElement>();
    const getPNG = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid("segments.mmx.group.graph.download.png", "submit-ok", {
            metric: selectedMetric,
            type: "PNG",
        });
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
            "segments.mmx.compare.graph.download.excel",
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
    const isPercentage =
        selectedMetric === EngagementVerticals.Visits.name && selectedDisplayTypeIndex === 1;

    const transformedData = useMemo(() => {
        if (isLoading || selectedRows.length < 1) {
            return null;
        }
        const filteredChartData = Object.entries(data).reduce((acc, [segId, segment], idx) => {
            if (
                SegmentsUtils.getSegmentIdTypeByKey(segId)[1] === SEGMENT_TYPES.WEBSITE &&
                currentChannel === ChannelsObj.InternalReferrals
            ) {
                acc: {
                }
            } else {
                segment[selectedGranularity.value][selectedMetric][currentChannel]["Breakdown"].map(
                    (datePoint) => {
                        const currentRow = selectedRows?.find((row) => row.id === segId);
                        if (currentRow && !hiddenLegends.includes(segId)) {
                            const [memberObj, memberType] = SegmentsUtils.getSegmentObjectByKey(
                                segId,
                                {
                                    segments: allSegments,
                                    websites: groups.find((group) => group.id === params.id)
                                        ?.websites,
                                },
                            );
                            switch (memberType) {
                                case SEGMENT_TYPES.SEGMENT:
                                    const segmentObj = memberObj as ICustomSegment;
                                    acc[segId] = {
                                        ...(acc[segId] ?? {}),
                                        [datePoint["Key"]]: {
                                            color: currentRow.selectionColor,
                                            rowIndex: currentRow.index,
                                            name: segmentObj.segmentName,
                                            domain: segmentObj.domain,
                                            Value: { ...datePoint.Value },
                                            seriesSubtitle: (
                                                <SegmentSubtitle>
                                                    {segmentObj.segmentName}
                                                </SegmentSubtitle>
                                            ),
                                        },
                                    };
                                    break;
                                case SEGMENT_TYPES.WEBSITE:
                                    const websiteObj = memberObj as ICustomSegmentGroupWebsite;
                                    acc[segId] = {
                                        ...(acc[segId] ?? {}),
                                        [datePoint["Key"]]: {
                                            color: currentRow.selectionColor,
                                            rowIndex: currentRow.index,
                                            name: websiteObj.domain,
                                            domain: websiteObj.domain,
                                            Value: { ...datePoint.Value },
                                            seriesSubtitle: (
                                                <SegmentTypeBadge>WEBSITE</SegmentTypeBadge>
                                            ),
                                        },
                                    };
                                    break;
                            }
                        }
                    },
                );
            }
            return acc;
        }, {});

        return TransformData(filteredChartData, isPercentage).sort(
            (a, b) => a.rowIndex - b.rowIndex,
        );
    }, [
        selectedGranularity,
        selectedDisplayTypeIndex,
        selectedMetric,
        isLoading,
        hiddenLegends,
        currentChannel,
        selectedRows,
    ]);

    const getDropdown = useMemo(() => {
        const onDropdownChanged = (value) => {
            setCurrentChannel(value.id);
            TrackWithGuidService.trackWithGuid(
                "segments_analysis.marketing_channels.group.channel_dropdown",
                "click",
                { channel: value.id },
            );
        };
        const onToggle = (isOpen) => {
            if (isOpen) {
                TrackWithGuidService.trackWithGuid(
                    "segments_analysis.marketing_channels.group.channel_dropdown",
                    "open",
                );
            }
        };
        return (
            <Dropdown
                onOpen={onToggle}
                dropdownPopupPlacement={"ontop-left"}
                onToggle={onToggle}
                selectedIds={currentChannel}
                onClick={onDropdownChanged}
                width={"245px"}
                dropdownPopupHeight={400}
            >
                {[
                    <DropdownButton key={"button"} width={245}>
                        {currentChannel}{" "}
                    </DropdownButton>,
                    ...Object.entries(ChannelsObj).map(([channel, channelName]) => (
                        <EllipsisDropdownItem width={245} key={channel} id={channelName}>
                            {channelName}
                        </EllipsisDropdownItem>
                    )),
                ]}
            </Dropdown>
        );
    }, [currentChannel]);

    return (
        <MMXCompareBoxContainer ref={chartRef}>
            <StyledTitleContainer>
                <FlexColumn>
                    <StyledHeaderTitle>
                        <BoxTitle tooltip={i18n("segments.analysis.mmx.group.graph.title.tooltip")}>
                            {i18n("segments.analysis.mmx.group.graph.title")}
                        </BoxTitle>
                    </StyledHeaderTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </FlexColumn>
                <RightFlexRow>
                    <SectionLine>
                        {selectedMetric === EngagementVerticals.Visits.name && (
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
                        const tabObj: IEngagementMetricVertical = EngagementVerticals[`${tabKey}`];
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
            <CompareContentContainer>
                <Tabs onSelect={onTabSelect} selectedIndex={selectedTab} forceRenderTabPanel={true}>
                    {Object.keys(EngagementVerticals).map((tab, idx) => (
                        <TabPanel key={`tab-panel-${idx}`}>
                            {idx === selectedTab && (
                                <SectionContainer>
                                    <MMXGroupChartContainer>
                                        {isLoading ? (
                                            <PixelPlaceholderLoader width="100%" height="100%" />
                                        ) : (
                                            <FlexRow>
                                                <GroupGraphContainer className={"sharedTooltip"}>
                                                    <Chart
                                                        type={"line"}
                                                        config={getChartConfig({
                                                            type: "line",
                                                            metric:
                                                                EngagementVerticals[selectedMetric],
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
                                                            durationObject,
                                                            showChangeColumn: !(
                                                                selectedMetric ===
                                                                    EngagementVerticals.Visits
                                                                        .name && isPercentage
                                                            ),
                                                        })}
                                                        data={transformedData}
                                                    />
                                                </GroupGraphContainer>
                                                <CompareGraphLegendContainer>
                                                    <DropdownFilterContainer>
                                                        {getDropdown}
                                                    </DropdownFilterContainer>
                                                    <LegendsTitle>
                                                        {i18nFilter()(
                                                            "segments.mmx.group.graph.legends.channels.title",
                                                        )}
                                                    </LegendsTitle>
                                                    <SegmentDomainLegends
                                                        {...{
                                                            groups,
                                                            selectedDisplayTypeIndex,
                                                            data,
                                                            selectedMetric,
                                                            selectedRows,
                                                            allSegments,
                                                            currentChannel,
                                                            hiddenLegends,
                                                            setHiddenLegends,
                                                            params,
                                                        }}
                                                    />
                                                </CompareGraphLegendContainer>
                                            </FlexRow>
                                        )}
                                    </MMXGroupChartContainer>
                                </SectionContainer>
                            )}
                        </TabPanel>
                    ))}
                </Tabs>
            </CompareContentContainer>
        </MMXCompareBoxContainer>
    );
};

export const TransformData = (data, isPercentage?) => {
    return _.map(Object.keys(data), (chartKey: string, index) => {
        const chartData = data[chartKey];
        const { domain, color, rowIndex, seriesSubtitle }: any = Object.values(chartData)[0];
        const baseSeriesConfig: any = {
            name: domain,
            seriesSubtitle: seriesSubtitle,
            color,
            tooltipIndex: index,
            rowIndex,
        };
        return combineConfigs(
            {
                ...baseSeriesConfig,
                isDataSingleSeries: true,
                data: Object.entries(chartData).map((dataPoint: any) => {
                    const key = dataPoint?.[0];
                    dataPoint = dataPoint?.[1];
                    if (!dataPoint) {
                        return;
                    }
                    const confidenceLevel = dataPoint?.Value?.Confidence;
                    let value = isPercentage ? dataPoint.Value?.Percentage : dataPoint.Value?.Value;
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
