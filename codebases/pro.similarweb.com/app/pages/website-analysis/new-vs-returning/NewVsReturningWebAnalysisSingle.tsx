import React, { useEffect, useMemo } from "react";
import CountryService from "services/CountryService";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import {
    BoxContainer,
    ChartContainer,
    GraphLegendContainer,
    InnerGraphContainer,
    SectionContainer,
    SectionLine,
    StyledHeaderTitle,
    StyledTitleContainer,
    SwitcherContainer,
} from "./StyledComponents";
import { FlexColumn, FlexRow, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { i18nFilter, minVisitsAbbrFilter, percentageSignFilter } from "filters/ngFilters";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import DurationService from "services/DurationService";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import {
    ButtonsContainer,
    LegendsTitle,
    StyledLegendWrapper,
} from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import Chart from "components/Chart/src/Chart";
import { dateToUTC } from "pages/segments/components/benchmarkOvertime/SegmentsVsGroupLineChart";
import * as _ from "lodash";
import combineConfigs from "components/Chart/src/combineConfigs";
import markerWithDashedConfig from "components/Chart/src/configs/series/markerWithDashedLinePerPointChartConfig";
import { CHART_COLORS } from "constants/ChartColors";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { LegendWithOneLineCheckboxFlex } from "@similarweb/ui-components/dist/legend";
import { Legends } from "components/React/Legends/Legends";
import { getChartConfig } from "pages/website-analysis/new-vs-returning/ChartConfig";
import { NoDataGraphContainer } from "pages/segments/mmx/styledComponents";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { PdfExportService } from "services/PdfExportService";

export const displayTypeItems = [
    {
        name: "numeric",
        display: "#",
    },
    {
        name: "percentage",
        display: "%",
    },
];

export const NewVsReturningVertical = {
    NewUsers: {
        dataKey: "NewUsers",
        displayText: "New Users",
    },
    ReturningUsers: {
        dataKey: "ReturningUsers",
        displayText: "Returning Users",
    },
};

export const NewVsReturningWebAnalysisSingle = (props: any) => {
    const { params, data, isLoading, excelUrl } = props;
    const { key, duration, comparedDuration, country, webSource } = params;
    const { i18n } = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );
    const durationObject = useMemo(
        () => DurationService.getDurationData(duration, comparedDuration),
        [duration, comparedDuration],
    );
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
                value: webSource,
            },
        ],
        [durationObject, country, webSource, duration],
    );
    const [selectedDisplayTypeIndex, setSelectedDisplayTypeIndex] = React.useState(0);
    const [legendItems, setLegendItems] = React.useState(null);
    const chartRef = React.useRef<HTMLElement>();
    const getPNG = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "new.vs.returning.single.graph.download.png",
            "submit-ok",
            {
                type: "PNG",
            },
        );
        // const pngHeaderStyle = (chartRef.current.children[0] as HTMLElement).style;
        // pngHeaderStyle.display = "block";
        const offSetX = 0;
        const offSetY = 50;
        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        PdfExportService.downloadHtmlPngFedService(
            styleHTML + chartRef.current.outerHTML,
            "NewVsReturningSingle",
            chartRef.current.offsetWidth + offSetX,
            chartRef.current.offsetHeight + offSetY,
        ).then();
        // pngHeaderStyle.display = "none";
    }, []);

    const onExcelClick = () => {
        TrackWithGuidService.trackWithGuid(
            "website.analysis.new.vs.returning.single.excel.download",
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

    const isPercentage = selectedDisplayTypeIndex === 1;
    const transformedData = useMemo(() => {
        if (isLoading) {
            return null;
        }
        return transformData(data, key, isPercentage, legendItems || []);
    }, [selectedDisplayTypeIndex, isLoading, legendItems]);

    useEffect(() => {
        if (isLoading) {
            return;
        }
        const items = Object.keys(NewVsReturningVertical).map((userKey, index) => {
            const value = isPercentage
                ? data?.[key]?.Total?.[userKey] /
                  (data?.[key]?.Total?.[NewVsReturningVertical.NewUsers.dataKey] +
                      data?.[key]?.Total?.[NewVsReturningVertical.ReturningUsers.dataKey])
                : data?.[key]?.Total?.[userKey];
            const color = CHART_COLORS.newReturningUsersColors[userKey];
            return {
                id: userKey,
                data: value
                    ? isPercentage
                        ? percentageSignFilter()(value, 2)
                        : minVisitsAbbrFilter()(value)
                    : "N/A",
                name: i18n(`web.analysis.new.vs.returning.single.${userKey}.legend`),
                hidden: legendItems?.find((i) => i?.id === userKey)?.hidden || false,
                color,
                isWinner: false,
            };
        });
        setLegendItems(items);
    }, [data, isPercentage]);

    const onLegendClick = (filter) => {
        const action = filter.hidden ? "add" : "remove";
        let isAllLegendsChecked = true;
        const filteredChannels = [];
        const filterChannels = legendItems?.map((f) => {
            if (f.name === filter.name) {
                f.hidden = !f.hidden;
            }
            if (f.hidden) {
                isAllLegendsChecked = false;
                filteredChannels.push(f.name);
            }
            return f;
        });
        setLegendItems(filterChannels);
        TrackWithGuidService.trackWithGuid(
            "website_analysis.new_vs_returning.single.graph.checkbox_filters",
            "click",
            { name: filter.name, action },
        );
    };

    const renderLegends = () => {
        return legendItems ? (
            <Legends
                legendComponent={LegendWithOneLineCheckboxFlex}
                legendComponentWrapper={StyledLegendWrapper}
                legendItems={legendItems}
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
        ) : undefined;
    };

    const chartConfig = useMemo(() => {
        if (!data) {
            return undefined;
        }
        return getChartConfig({
            type: "area",
            filter: isPercentage ? [percentageSignFilter, 1] : [minVisitsAbbrFilter, 1],
            data: transformedData,
            timeGranularity: "Monthly",
            isPercentage,
        });
    }, [isPercentage, data]);

    const isEmptyData = useMemo(() => {
        if (isLoading) {
            return false;
        }
        if (!data) {
            return true;
        } else {
            const newAndReturningDataTotal =
                (data[params.key]?.Total?.[NewVsReturningVertical.NewUsers.dataKey] || 0) +
                (data[params.key]?.Total?.[NewVsReturningVertical.ReturningUsers.dataKey] || 0);
            return newAndReturningDataTotal === 0;
        }
    }, [isLoading]);

    return (
        <BoxContainer ref={chartRef}>
            <StyledTitleContainer>
                <FlexColumn>
                    <StyledHeaderTitle>
                        <BoxTitle
                            tooltip={i18n(
                                "web.analysis.new.vs.returning.single.graph.title.tooltip",
                            )}
                        >
                            {i18n("web.analysis.new.vs.returning.single.graph.title")}
                        </BoxTitle>
                    </StyledHeaderTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </FlexColumn>
                <RightFlexRow>
                    <SectionLine>
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
                    </SectionLine>
                    {getUtilityButtons()}
                </RightFlexRow>
            </StyledTitleContainer>
            <SectionContainer>
                <ChartContainer>
                    {isLoading ? (
                        <PixelPlaceholderLoader width="100%" height="300" />
                    ) : !data || isEmptyData ? (
                        <NoDataGraphContainer>
                            <TableNoData
                                icon="no-data"
                                messageTitle={i18n("global.nodata.notavilable")}
                            />
                        </NoDataGraphContainer>
                    ) : (
                        <FlexRow>
                            <InnerGraphContainer className={"sharedTooltip"}>
                                <Chart type={"area"} config={chartConfig} data={transformedData} />
                            </InnerGraphContainer>
                            <GraphLegendContainer>
                                <LegendsTitle>
                                    {i18n(
                                        "web.analysis.new.vs.returning.single.graph.legends.title",
                                    )}
                                </LegendsTitle>
                                {renderLegends()}
                            </GraphLegendContainer>
                        </FlexRow>
                    )}
                </ChartContainer>
            </SectionContainer>
        </BoxContainer>
    );
};

export const transformData = (data, key, isPercentage?, legendItems?) => {
    return _.map(Object.keys(NewVsReturningVertical), (chartKey: string, index) => {
        const chartData =
            legendItems.filter((item: any) => {
                return item.id === chartKey && item.hidden;
            }).length > 0
                ? []
                : data?.[key]?.Graph;
        const color = CHART_COLORS.newReturningUsersColors[chartKey];
        const baseSeriesConfig: any = {
            name: NewVsReturningVertical[chartKey].displayText,
            color,
            tooltipIndex: index,
        };
        return combineConfigs(
            {
                ...baseSeriesConfig,
                isDataSingleSeries: true,
                data: Object.entries(chartData).map(([date, dataPoint]) => {
                    if (!dataPoint) {
                        return;
                    }
                    const confidenceLevel = 0.1; //dataPoint?.["Confidence"];
                    let value = isPercentage
                        ? dataPoint?.[chartKey] /
                          (dataPoint?.[NewVsReturningVertical.ReturningUsers.dataKey] +
                              dataPoint?.[NewVsReturningVertical.NewUsers.dataKey])
                        : dataPoint?.[chartKey];
                    if (isNaN(parseFloat(value))) {
                        value = null;
                    }
                    return [
                        dateToUTC(date),
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
