import React, { useCallback, useEffect, useMemo } from "react";
import { i18nFilter, minVisitsAbbrFilter, percentageSignFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import CountryService from "services/CountryService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Injector } from "common/ioc/Injector";
import {
    ButtonsContainer,
    LegendsTitle,
    StyledLegendWrapper,
} from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { CHART_COLORS } from "constants/ChartColors";
import { Legends } from "components/React/Legends/Legends";
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
} from "pages/website-analysis/new-vs-returning/StyledComponents";
import { FlexColumn, FlexRow, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import Chart from "components/Chart/src/Chart";
import { getChartConfig } from "pages/website-analysis/new-vs-returning/ChartConfig";
import {
    displayTypeItems,
    NewVsReturningVertical,
} from "pages/website-analysis/new-vs-returning/NewVsReturningWebAnalysisSingle";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { LegendWithOneLineCheckboxFlex } from "@similarweb/ui-components/dist/legend";
import { PdfExportService } from "services/PdfExportService";
import { DropdownFilterContainer, NoDataGraphContainer } from "pages/segments/mmx/styledComponents";
import {
    Dropdown,
    DropdownButton,
    EllipsisDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import * as _ from "lodash";
import combineConfigs from "components/Chart/src/combineConfigs";
import { dateToUTC } from "pages/segments/components/benchmarkOvertime/SegmentsVsGroupLineChart";
import markerWithDashedConfig from "components/Chart/src/configs/series/markerWithDashedLinePerPointChartConfig";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";

export const NewVsReturningWebAnalysisCompare = (props: any) => {
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
    const [currentMetric, setCurrentMetric] = React.useState(NewVsReturningVertical.NewUsers);
    const [legendItems, setLegendItems] = React.useState(null);
    const chartRef = React.useRef<HTMLElement>();
    const getPNG = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "new.vs.returning.compare.graph.download.png",
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
            "NewVsReturningCompare",
            chartRef.current.offsetWidth + offSetX,
            chartRef.current.offsetHeight + offSetY,
        ).then();
        // pngHeaderStyle.display = "none";
    }, []);

    const onExcelClick = () => {
        TrackWithGuidService.trackWithGuid(
            "website.analysis.new.vs.returning.compare.excel.download",
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

    const getDropdown = useMemo(() => {
        const onDropdownChanged = (value) => {
            setCurrentMetric(NewVsReturningVertical[value.id]);
            TrackWithGuidService.trackWithGuid("new.vs.returning.group.metric_dropdown", "click", {
                channel: value.id,
            });
        };
        const onToggle = (isOpen) => {
            if (isOpen) {
                TrackWithGuidService.trackWithGuid(
                    "new.vs.returning.group.metric_dropdown",
                    "open",
                );
            }
        };
        return (
            <Dropdown
                onOpen={onToggle}
                onToggle={onToggle}
                selectedIds={currentMetric.dataKey}
                onClick={onDropdownChanged}
                width={"248px"}
                dropdownPopupPlacement={"ontop-left"}
            >
                {[
                    <DropdownButton key={"button"} width={248}>
                        {currentMetric.displayText}{" "}
                    </DropdownButton>,
                    ...Object.values(NewVsReturningVertical).map(({ displayText, dataKey }) => (
                        <EllipsisDropdownItem key={displayText} id={dataKey}>
                            {displayText}
                        </EllipsisDropdownItem>
                    )),
                ]}
            </Dropdown>
        );
    }, [currentMetric]);
    const isPercentage = selectedDisplayTypeIndex === 1;
    const transformedData = useMemo(() => {
        if (isLoading) {
            return null;
        }
        const competitors = params.key.split(",");
        return transformData(data, competitors, currentMetric, isPercentage, legendItems || []);
    }, [selectedDisplayTypeIndex, data, legendItems, currentMetric]);

    useEffect(() => {
        if (isLoading) {
            return;
        }
        const competitors = params.key.split(",");
        const items = competitors.map((key, index) => {
            const value = isPercentage
                ? data?.[key]?.Total?.[currentMetric.dataKey] /
                  (data?.[key]?.Total?.[NewVsReturningVertical.NewUsers.dataKey] +
                      data?.[key]?.Total?.[NewVsReturningVertical.ReturningUsers.dataKey])
                : data?.[key]?.Total?.[currentMetric.dataKey]; // userKey === "NewUsers" ? data?.[key]?.Total?.NewUsers : data?.[key]?.Total?.ReturningUsers;
            const color = CHART_COLORS.main[index];
            return {
                id: key,
                data: value
                    ? isPercentage
                        ? percentageSignFilter()(value, 2)
                        : minVisitsAbbrFilter()(value)
                    : "N/A",
                name: key,
                hidden: legendItems?.find((i) => i?.id === key)?.hidden || false,
                color,
                isWinner: false,
            };
        });
        setLegendItems(items);
    }, [data, currentMetric, isPercentage]);

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
            "website_analysis.new_vs_returning.compare.graph.checkbox_filters",
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
            type: "line",
            filter: isPercentage ? [percentageSignFilter, 1] : [minVisitsAbbrFilter, 1],
            data: transformedData,
            timeGranularity: "Monthly",
            isPercentage,
        });
    }, [isPercentage, data, legendItems]);

    const isEmptyData = useMemo(() => {
        if (isLoading) {
            return false;
        }
        if (!data) {
            return true;
        } else {
            const competitors = params.key.split(",");
            let newAndReturningDataTotal = 0;
            competitors.map((competitor) => {
                newAndReturningDataTotal +=
                    (data[competitor]?.Total?.[NewVsReturningVertical.NewUsers.dataKey] || 0) +
                    (data[competitor]?.Total?.[NewVsReturningVertical.ReturningUsers.dataKey] || 0);
            });
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
                                "web.analysis.new.vs.returning.compare.graph.title.tooltip",
                            )}
                        >
                            {i18n("web.analysis.new.vs.returning.compare.graph.title")}
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
                        <PixelPlaceholderLoader width="100%" height="260px" />
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
                                <Chart type={"line"} config={chartConfig} data={transformedData} />
                            </InnerGraphContainer>
                            <GraphLegendContainer>
                                <DropdownFilterContainer>{getDropdown}</DropdownFilterContainer>
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
const transformData = (data, competitors, currentMetric, isPercentage?, legendItems?) => {
    const visibleItems = legendItems.filter((i) => !i.hidden);
    return _.map(visibleItems, ({ id }, index) => {
        const chartData =
            legendItems.filter((item: any) => {
                return item.id === id && item.hidden;
            }).length > 0
                ? []
                : data?.[id]?.Graph;
        const color = legendItems.find((legendItem) => legendItem.id === id)?.color;
        const baseSeriesConfig: any = {
            name: id,
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
                    const confidenceLevel = 0.1; // dataPoint?["Confidence"];
                    let value = isPercentage
                        ? dataPoint?.[currentMetric.dataKey] /
                          (dataPoint?.[NewVsReturningVertical.ReturningUsers.dataKey] +
                              dataPoint?.[NewVsReturningVertical.NewUsers.dataKey])
                        : dataPoint?.[currentMetric.dataKey];
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
