import React, { useMemo } from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import {
    BoxContainer,
    ChartContainer,
    ContentContainer,
    Disclaimer,
    LegendContainer,
    LegendDivider,
    LegendsLineLoaders,
    LegendsTitle,
    OverlapLegendWrapper,
    StyledHeaderTitle,
    SumOfLegendsContainer,
    TextWrapper,
    TitleContainer,
} from "./StyledComponents";
import { OverlapLoaders } from "components/Loaders/src/OverlapVennLoader";
import { FlexColumn, FlexRow, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BoxTitle, { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import { i18nFilter, minVisitsAbbrFilter } from "filters/ngFilters";
import Chart from "components/Chart/src/Chart";
import { getChartConfig } from "./chartConfig";
import { getSetsColor } from "../traffic-sources/search/components/keywordsGapVennFilter/utilityFunctions";
import { Legends } from "components/React/Legends/Legends";
import { LegendWithOneLineBulletFlex } from "@similarweb/ui-components/dist/legend";
import { CHART_COLORS } from "constants/ChartColors";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import I18n from "components/WithTranslation/src/I18n";
import { SWReactIcons } from "@similarweb/icons";
import * as _ from "lodash";
import { selectSelectedCountry } from "pages/workspace/sales/sub-modules/benchmarks/store/selectors";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IconButton } from "@similarweb/ui-components/dist/button";

const CIRCLE_LOADER_DIAMETER = 175;
const BIG_CIRCLE_LOADER_DIAMETER = 200;
const LEGENDS_LOADER_WIDTH = 248;
const LEGENDS_LOADER_HEIGHT = 16;
const MINIMUM_OVERLAP_SHARE_THRESHOLD = 0.03;
const MINIMUM_OVERLAP_SHARE_FROW_LARGEST_THRESHOLD = 0.002;
const VENN_NORMALIZE_FACTOR = 4; // Decrease for blow up intersection visibility

export interface IVennDiagramComponentProps {
    subtitleFilters: any[];
    chosenSitesLegends?: any;
    isSingleMode?: boolean;
    websitesArrayWithColor?: any[];
    VennDiagramData?: any;
    isVennDiagramLoading?: boolean;
    selectedCountryCode?: string;
    excelDownloadUrl?: string;
}

const colors = CHART_COLORS.compareMainColors;
export const VennDiagramComponent: React.FC<IVennDiagramComponentProps> = (props) => {
    const {
        subtitleFilters,
        VennDiagramData,
        isVennDiagramLoading,
        chosenSitesLegends,
        isSingleMode,
        websitesArrayWithColor,
        selectedCountryCode,
        excelDownloadUrl,
    } = props;
    const { i18n } = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const sitesOrder = useMemo(() => {
        return isSingleMode
            ? websitesArrayWithColor?.map((site) => site.name)
            : chosenSitesLegends?.map((site) => site.name);
    }, [isSingleMode, websitesArrayWithColor, chosenSitesLegends]);

    // sum all higher Order combinations into base combination
    // example: ab:1, abc: 2 => ab: 3, abc: 2
    const transformData = (multipleSitesEntries: [string, any][]) => {
        let res = [];
        for (let i = 0; i < multipleSitesEntries.length; i++) {
            let current: any = multipleSitesEntries[i] as any;
            let currentSites = current[0];
            let currentSitesArray = current[0].split(",");
            let currentValue = current[1];
            for (let j = 0; j < multipleSitesEntries.length; j++) {
                let sumCandidateCurrent: any = multipleSitesEntries[j] as any;
                let sumCandidateCurrentSites = sumCandidateCurrent[0];
                let sumCandidateCurrentValue = sumCandidateCurrent[1];
                let sumCandidateCurrentSitesArray = sumCandidateCurrentSites.split(",");
                if (
                    currentSites !== sumCandidateCurrentSites &&
                    currentSitesArray.length < sumCandidateCurrentSitesArray.length &&
                    _.intersection(currentSitesArray, sumCandidateCurrentSitesArray).length ===
                        currentSitesArray.length
                ) {
                    currentValue += sumCandidateCurrentValue;
                }
            }
            res.push([currentSites, currentValue]);
        }
        return res;
    };

    const chartData: any = React.useMemo(() => {
        if (!isVennDiagramLoading) {
            const singlesSitesEntries = Object.entries(
                VennDiagramData.data.OverlapData.Data,
            ).filter(([set, value]) => !set.includes(","));
            const singlesSitesValues = singlesSitesEntries.map(([set, value]) => value);
            const multipleSitesEntries = Object.entries(
                VennDiagramData.data.OverlapData.Data,
            ).filter(([set, value]) => set.includes(","));
            const transformedMultipleSitesEntries = transformData(multipleSitesEntries);
            const unifiedEntries = [...singlesSitesEntries, ...transformedMultipleSitesEntries];
            const sortedSitesVal: any = singlesSitesValues.sort((a: any, b: any) => b - a);
            const smallestSiteVal = sortedSitesVal[singlesSitesValues.length - 1];
            const biggestSiteVal = sortedSitesVal[0];

            return unifiedEntries.map(([set, value]: any, idx) => {
                const setArray = set.split(",");
                return {
                    sets: setArray,
                    //We normalize the graph by increasing the value relatively (by degree of intersections in sets)
                    value:
                        sitesOrder.length < 4 ||
                        value / smallestSiteVal < MINIMUM_OVERLAP_SHARE_THRESHOLD ||
                        value / biggestSiteVal < MINIMUM_OVERLAP_SHARE_FROW_LARGEST_THRESHOLD
                            ? value
                            : value + biggestSiteVal / VENN_NORMALIZE_FACTOR,
                    realValue: value,
                    color: isSingleMode
                        ? getSetsColor(websitesArrayWithColor)(setArray)
                        : getSetsColor(chosenSitesLegends)(setArray),
                    dataLabels: {
                        enabled: false,
                    },
                };
            });
        }
    }, [isVennDiagramLoading, VennDiagramData.data, chosenSitesLegends, sitesOrder]);

    const websitesDataArray = React.useMemo(() => {
        return chartData?.filter((el) => el.sets.length === 1);
    }, [chartData]);

    const legendsItems = React.useMemo(() => {
        if (props.isSingleMode) {
            return websitesArrayWithColor?.map((website) => {
                return {
                    name: website.Domain,
                    color: website.color,
                    setOpacity: website.isSuggested,
                    isDisabled: true,
                    gridRowGap: "14px",
                    data: minVisitsAbbrFilter()(
                        chartData?.filter(
                            (permutation) =>
                                permutation.sets.length === 1 &&
                                permutation.sets[0] === website.Domain,
                        )[0]?.realValue,
                    ),
                };
            });
        }
        return chosenSitesLegends?.map((website) => {
            return {
                name: website.name,
                color: website.color,
                setOpacity: false,
                isDisabled: true,
                gridRowGap: "14px",
                data: minVisitsAbbrFilter()(
                    chartData?.filter(
                        (permutation) =>
                            permutation.sets.length === 1 && permutation.sets[0] === website.name,
                    )[0]?.realValue,
                ),
            };
        });
    }, [chartData, websitesArrayWithColor, chosenSitesLegends, props.isSingleMode]);

    const renderNoData = (selectedCountryCode: string) => {
        const noDataText =
            selectedCountryCode === "999"
                ? "global.nodata.notavilable.worldwide"
                : "global.nodata.notavilable";
        return <TableNoData icon="no-data" messageTitle={i18nFilter()(noDataText)} />;
    };

    const onDownloadClick = () => {
        TrackWithGuidService.trackWithGuid(
            "website.analysis.audience.overlap.download.excel",
            "click",
        );
    };

    const renderLoaders = () => {
        return (
            <ContentContainer>
                <OverlapLoaders />
                <LegendContainer>
                    <PixelPlaceholderLoader width={99} height={LEGENDS_LOADER_HEIGHT} />
                    <LegendsLineLoaders>
                        <PixelPlaceholderLoader
                            width={LEGENDS_LOADER_WIDTH}
                            height={LEGENDS_LOADER_HEIGHT}
                        />
                        <PixelPlaceholderLoader
                            width={LEGENDS_LOADER_WIDTH}
                            height={LEGENDS_LOADER_HEIGHT}
                        />
                        <PixelPlaceholderLoader
                            width={LEGENDS_LOADER_WIDTH}
                            height={LEGENDS_LOADER_HEIGHT}
                        />
                    </LegendsLineLoaders>
                    <LegendDivider />
                    <LegendsLineLoaders>
                        <PixelPlaceholderLoader
                            width={LEGENDS_LOADER_WIDTH}
                            height={LEGENDS_LOADER_HEIGHT}
                        />
                    </LegendsLineLoaders>
                </LegendContainer>
            </ContentContainer>
        );
    };

    return (
        <BoxContainer>
            <TitleContainer>
                <FlexColumn>
                    <StyledHeaderTitle>
                        <BoxTitle
                            tooltip={i18n("analysis.audience.overlap.competitive.title.tooltip")}
                        >
                            {i18n("analysis.audience.overlap.competitive.title")}
                        </BoxTitle>
                    </StyledHeaderTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </FlexColumn>
                <DownloadExcelContainer
                    target="_self"
                    key="AudienceOverlapDownloadExcel"
                    href={excelDownloadUrl}
                    onClick={onDownloadClick}
                >
                    <IconButton iconName="excel" type="flat" />
                </DownloadExcelContainer>
            </TitleContainer>
            {!VennDiagramData.data && !isVennDiagramLoading && renderNoData(selectedCountryCode)}
            {isVennDiagramLoading && renderLoaders()}
            {!isVennDiagramLoading && (
                <div>
                    {sitesOrder && sitesOrder.length > 2 && (
                        <Disclaimer>
                            <SWReactIcons iconName="info" size="xs" />
                            <TextWrapper>
                                <I18n>
                                    {
                                        "analysis.audience.overlap.more.than.three.comparisons.discalimer"
                                    }
                                </I18n>
                            </TextWrapper>
                        </Disclaimer>
                    )}
                    <ContentContainer>
                        <ChartContainer>
                            <Chart
                                type={"venn"}
                                data={chartData}
                                config={getChartConfig(chartData, sitesOrder)}
                            />
                        </ChartContainer>
                        <LegendContainer>
                            <LegendsTitle>
                                {i18nFilter()("analysis.audience.overlap.legend.title")}
                            </LegendsTitle>
                            <Legends
                                toggleSeries={() => {}}
                                legendComponentWrapper={OverlapLegendWrapper}
                                legendComponent={LegendWithOneLineBulletFlex}
                                legendItems={legendsItems}
                                gridDirection="column"
                            />
                            <LegendDivider />
                            <SumOfLegendsContainer>
                                <FlexRow>
                                    {i18nFilter()("analysis.audience.overlap.legend.deduplicated")}
                                    <PlainTooltip
                                        placement="top"
                                        tooltipContent={i18nFilter()(
                                            "analysis.audience.overlap.legend.deduplicated.tooltip",
                                        )}
                                    >
                                        <span>
                                            <InfoIcon iconName="info" />
                                        </span>
                                    </PlainTooltip>
                                </FlexRow>
                                <div>
                                    {minVisitsAbbrFilter()(VennDiagramData.data?.OverlapData.Total)}
                                </div>
                            </SumOfLegendsContainer>
                        </LegendContainer>
                    </ContentContainer>
                </div>
            )}
        </BoxContainer>
    );
};
