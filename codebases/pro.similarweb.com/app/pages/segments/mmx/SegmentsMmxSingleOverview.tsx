import React from "react";
import { colorsSets } from "@similarweb/styles";
import { devicesTypes } from "../../../UtilitiesAndConstants/Constants/DevicesTypes";
import CountryService from "services/CountryService";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import {
    BarChartOverviewContainer,
    BoxContainer,
    MainValueContainer,
    NoDataGraphContainer,
    SectionContainer,
    SectionLine,
    SegmentsBarChartStyles,
    StyledHeaderTitle,
    SwitcherContainer,
    TitleContainer,
} from "./styledComponents";
import { FlexColumn, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import DurationService from "services/DurationService";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import Chart from "components/Chart/src/Chart";
import {
    barChartGraphDashed,
    segmentsMarketingChannelsBarChartConfig,
} from "./SegmentsSingleMarketingChannelsBarChartConfig";
import { SegmentsMmxChannelsMapping } from "./SegmentsMarketingChannelsConfig";
import { isLowConfidence } from "components/Chart/src/data/confidenceProcessor";
import { PdfExportService } from "services/PdfExportService";
import { EngagementVerticals } from "pages/segments/mmx/SegmentsSingleMarketingGraphChart";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";

const MIN_VALUE_TO_SHOW_DATA = 5000;

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

export const SegmentsMmxSingleOverview = (props) => {
    const { i18n } = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const { params, data, isLoading } = props;
    const { id, duration, comparedDuration, country, webSource } = params;

    const durationObject = React.useMemo(
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
                value: devicesTypes.DESKTOP,
            },
        ],
        [durationObject, country, webSource, duration],
    );

    const [selectedDisplayTypeIndex, setSelectedDisplayTypeIndex] = React.useState(0);
    const selectedDisplayTypeItem = React.useMemo(
        () => displayTypeItems[selectedDisplayTypeIndex],
        [selectedDisplayTypeIndex],
    );

    const barChartConfig = React.useMemo(
        () =>
            segmentsMarketingChannelsBarChartConfig({
                valueType: selectedDisplayTypeItem.name,
                categories: SegmentsMmxChannelsMapping,
            }),
        [selectedDisplayTypeItem],
    );

    const siteData = data?.Data?.[id]?.[EngagementVerticals.Visits.dataKey];
    const { totalTrafficValue, barChartData } = React.useMemo(() => {
        const totalTrafficValue: any = siteData
            ? Object.values(siteData)?.reduce((acc, { Value }) => acc + Value, 0)
            : null;
        const colorsSet = colorsSets.c.toArray();
        const barChartData = barChartGraphDashed(
            [
                {
                    data: SegmentsMmxChannelsMapping.map(({ dataKey }, i) => {
                        const point = siteData?.[dataKey];
                        const val = point
                            ? selectedDisplayTypeItem.name === "numeric"
                                ? point.Value
                                : (totalTrafficValue && point.Value / totalTrafficValue) ?? null
                            : null;
                        const isLowConfidenceValue = isLowConfidence(point?.Confidence);
                        return {
                            y: val,
                            isLowConfidence: isLowConfidenceValue,
                            color: colorsSet[i % colorsSet.length],
                        };
                    }),
                },
            ],
            (point) => point.isLowConfidence,
        );
        return { totalTrafficValue, barChartData };
    }, [siteData, selectedDisplayTypeItem]);

    const barChartRef = React.useRef<HTMLElement>();
    const downloadPNG = React.useCallback(() => {
        // const pngHeaderStyle = (barChartRef.current.children[0] as HTMLElement).style;
        // pngHeaderStyle.display = "block";
        TrackWithGuidService.trackWithGuid(
            "segments.mmx.single.bar.graph.download.png",
            "submit-ok",
            {
                type: "PNG",
            },
        );
        const offSetX = 0;
        const offSetY = 50;
        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        PdfExportService.downloadHtmlPngFedService(
            styleHTML + barChartRef.current.outerHTML,
            "SegmentsMmxChartOverview",
            barChartRef.current.offsetWidth + offSetX,
            barChartRef.current.offsetHeight + offSetY,
        ).then();
        // pngHeaderStyle.display = "none";
    }, []);

    return (
        <BoxContainer ref={barChartRef}>
            <TitleContainer>
                <FlexColumn>
                    <StyledHeaderTitle>
                        <BoxTitle
                            tooltip={i18n("segments.analysis.mmx.single.overview.title.tooltip")}
                        >
                            {i18n("segments.analysis.mmx.single.overview.title")}
                        </BoxTitle>
                    </StyledHeaderTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </FlexColumn>
                <RightFlexRow>
                    <DownloadButtonMenu PNG={true} exportFunction={downloadPNG} />
                </RightFlexRow>
            </TitleContainer>
            <SectionContainer>
                <SectionLine>
                    <MainValueContainer>
                        <div className="mainValue">
                            {isLoading ? (
                                <PixelPlaceholderLoader width="60px" height="20px" />
                            ) : !data || totalTrafficValue === 0 ? (
                                "N/A"
                            ) : (
                                abbrNumberFilter()(totalTrafficValue)
                            )}
                        </div>
                        <div className="mainValueDesc">
                            {i18n("segments.analysis.mmx.single.overview.total.traffic")}
                        </div>
                    </MainValueContainer>
                    <SwitcherContainer>
                        <Switcher
                            customClass="CircleSwitcher"
                            className="chartSwitcher"
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
            </SectionContainer>
            <SectionContainer>
                <SegmentsBarChartStyles />
                <BarChartOverviewContainer>
                    {isLoading ? (
                        <PixelPlaceholderLoader width="100%" height="260px" />
                    ) : !data || totalTrafficValue < MIN_VALUE_TO_SHOW_DATA ? (
                        <NoDataGraphContainer>
                            <TableNoData
                                icon="no-data"
                                messageTitle={i18nFilter()("global.nodata.notavilable")}
                            />
                        </NoDataGraphContainer>
                    ) : (
                        <Chart type="bar" data={barChartData} config={barChartConfig} />
                    )}
                </BarChartOverviewContainer>
            </SectionContainer>
        </BoxContainer>
    );
};
