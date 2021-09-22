import { FC, useEffect, useRef, useState } from "react";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import {
    MetricTitle,
    NoData,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import Chart from "components/Chart/src/Chart";
import React from "react";
import { Legend } from "@similarweb/ui-components/dist/legend/src/Legend";
import {
    Container,
    ChartSection,
    LegendContainer,
    TopSection,
    ChartContainer,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/StyledComponents";
import {
    ETiers,
    tiersMeta,
    timeRangeOptions,
    TOTAL_NUMBER_OF_TIERS,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";
import {
    getBaseSeries,
    getRankingsDistributionChartConfigSingle,
    initialDisplayedTiers,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Configs";
import {
    getCategories,
    buildSeriesForChart,
    getDurationValueForDataFetching,
    transformData,
} from "./Utilities";
import { FlexRow, FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import _ from "lodash";
import { DefaultFetchService } from "services/fetchService";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders/src/PlaceholderLoaders";
import dayjs from "dayjs";
import { customRangeFormat } from "services/DurationService";
import { useRankingDistributionTableTopContext } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionContext";
import {
    aggregatedTiers,
    singleTiers,
} from "pages/website-analysis/traffic-sources/search/components/filters/RankingTierFilter";
import { useTrack } from "components/WithTrack/src/useTrack";
import { useTranslation } from "components/WithTranslation/src/I18n";
import swLog from "@similarweb/sw-log";
import { i18nFilter } from "filters/ngFilters";
import { fullMonthAndYear } from "constants/dateFormats";
import { RankingDistributionTableSummary } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionTableSummary";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

const fetchService = DefaultFetchService.getInstance();
const titleKey = "rankings_distribution.chart.title";
const endPoint = "api/RankDistribution/Graph";

const RankingsDistributionDateIndicator = styled.div`
    height: 64px;
    display: flex;
    align-items: center;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    padding-left: 24px;
    ${setFont({ $size: 20, $color: colorsPalettes.carbon[500], $weight: 500 })}
`;

const getLegends = (onClick, filter = initialDisplayedTiers, legendsData): JSX.Element[] => {
    return Object.keys(tiersMeta)
        .filter((tierKey) => filter.includes(Number(tierKey)))
        .map((tierKey) => {
            const legendObj = legendsData.find((legend) => `${legend.id}` === tierKey);
            return (
                <Legend
                    key={tierKey}
                    labelColor={legendObj?.color}
                    text={legendObj?.name}
                    onClick={onClick(legendObj?.id)}
                    isChecked={legendObj?.visible}
                />
            );
        });
};

interface RankingDistributionSingleGraphInnerProps {
    onChangeRange: (duration) => void;
    data: Record<string, any[]>;
    filters: Record<string, any>;
    isLoading: boolean;
    displayedTiers?: ETiers[];
}

const RankingDistributionSingleGraphInner: FC<RankingDistributionSingleGraphInnerProps> = (
    props,
) => {
    const { data, displayedTiers, isLoading, onChangeRange: onChangeRangeProp, filters } = props;
    const { duration, ranking } = filters;
    const [trackLegacy, trackWithGuid] = useTrack();
    const translate = useTranslation();

    const [selectedRange, setSelectedRange] = useState(timeRangeOptions[2]);
    // meta data of the graph
    const [config, setConfig] = useState({});
    // data of the graph
    const [series, setSeries] = useState([]);

    useEffect(() => {
        if (!data) return;
        const isFiltered = displayedTiers.length < TOTAL_NUMBER_OF_TIERS;
        setConfig(
            getRankingsDistributionChartConfigSingle(isFiltered, getCategories(data), duration),
        );
        setSeries(buildSeriesForChart(data, getBaseSeries(displayedTiers), isFiltered));
    }, [displayedTiers, data]);

    // reset the legends on position filter change
    useEffect(() => {
        if (!series.length) return;
        const seriesClone = [...series];
        series.forEach((item) => {
            item.visible = true;
        });
        setSeries(seriesClone);
    }, [ranking]);

    const onLegendClick = (tier: ETiers) => () => {
        const seriesClone = [...series];
        const indexOfClickedLegend = seriesClone.findIndex((item) => item.id === tier);
        trackWithGuid("ranking.distribution.single.graph.legends", "click", {
            position: seriesClone[indexOfClickedLegend].key,
        });
        seriesClone[indexOfClickedLegend].visible = !seriesClone[indexOfClickedLegend].visible;
        setSeries(seriesClone);
    };

    const getTimeRangeOptions = React.useCallback(() => timeRangeOptions, []);

    const onChangeRange = (index) => {
        const rangeObject = getTimeRangeOptions()[index];
        trackWithGuid("ranking.distribution.single.graph.granularity_switcher", "switch", {
            range: rangeObject.name,
        });
        setSelectedRange(rangeObject);
        onChangeRangeProp(rangeObject.value);
    };

    return (
        <Container>
            <TopSection>
                <MetricTitle headline={translate(titleKey)} />
                {/* commented out the UI of the granularity switcher but left all the logic
                  and functionality as is ie. uncommented */}
                {/*<TimeGranularitySwitcher*/}
                {/*    timeGranularity={selectedRange}*/}
                {/*    getGranularity={getTimeRangeOptions}*/}
                {/*    granularityUpdate={onChangeRange}*/}
                {/*/>*/}
            </TopSection>
            <ChartSection>
                <>
                    {isLoading ? (
                        <FlexRow justifyContent={"space-between"}>
                            <GraphLoader width={"100%"} height={"170px"} />
                            <FlexColumn justifyContent={"space-evenly"} alignItems={"center"}>
                                {displayedTiers.map((t, i) => (
                                    <PixelPlaceholderLoader
                                        key={displayedTiers[i]}
                                        width={"80%"}
                                        height={24}
                                    />
                                ))}
                            </FlexColumn>
                        </FlexRow>
                    ) : !series || !props.data ? (
                        <NoData
                            paddingTop="0px"
                            noDataTitleKey="global.nodata.notavilable"
                            noDataSubTitleKey="workspaces.marketing.nodata.subtitle"
                            className={"rankings-distribution-chart--no-data"}
                        />
                    ) : (
                        <FlexRow>
                            <ChartContainer>
                                <Chart
                                    type={"column"}
                                    data={series}
                                    config={config}
                                    domProps={{ style: { height: "170px" } }}
                                />
                            </ChartContainer>
                            <LegendContainer>
                                {getLegends(onLegendClick, displayedTiers, series)}
                            </LegendContainer>
                        </FlexRow>
                    )}
                </>
            </ChartSection>
        </Container>
    );
};

const RankingDistributionSingleGraphContainer = ({ dataParamsAdapter }) => {
    const { tableFilters } = useRankingDistributionTableTopContext();
    const { duration, ranking } = tableFilters;
    const [isLoading, setIsLoading] = useState(true);
    // this state is for filtering the legends based on the table filter for position.
    const [displayedTiers, setDisplayedTiers] = useState(initialDisplayedTiers);
    const [visibleGraphRange, setVisibleGraphRange] = useState(24);
    const [data, setData] = useState(undefined);
    const initialDataRef = useRef(undefined);

    useEffect(() => {
        async function getData() {
            !isLoading && setIsLoading(true);
            const params = dataParamsAdapter({ ...tableFilters });
            const { from, to } = getDurationValueForDataFetching(duration);
            params.from = from;
            params.to = to;
            try {
                const data = await fetchService.get(endPoint, params);
                transformData(data, visibleGraphRange);
                setData(data);
                initialDataRef.current = data;
            } catch (e) {
                swLog.error(e);
                setData(undefined);
            } finally {
                setIsLoading(false);
            }
        }
        getData();
    }, [tableFilters]);

    const getTiersFromRankingProp = (ranking): ETiers[] => {
        const allTiers = [...singleTiers, ...aggregatedTiers];
        return allTiers.filter((tier) => tier.value === ranking)[0].tiers;
    };

    useEffect(() => {
        if (!ranking) {
            setDisplayedTiers(initialDisplayedTiers);
            return;
        }
        // use ranking prop to calculate displayed tiers value
        const tiersToDisplay = getTiersFromRankingProp(ranking);
        setDisplayedTiers(tiersToDisplay);
    }, [ranking]);

    // useEffect(() => {
    //     if (!initialDataRef.current) return;
    //     const initialDataClone = _.cloneDeep(initialDataRef.current);
    //     const keys = Object.keys(initialDataClone);
    //     if (selectedRangeDataExists(duration, visibleGraphRange)) {
    //         const indexOfDuration = initialDataClone[keys[0]].findIndex((p) =>
    //             moment
    //                 .utc(p[0], FORMAT_DATA)
    //                 .isSame(moment.utc(duration, customRangeFormat), "month"),
    //         );
    //         keys.forEach((key) => {
    //             initialDataClone[key] = initialDataClone[key].slice(
    //                 indexOfDuration - visibleGraphRange + 1,
    //                 indexOfDuration + 1,
    //             );
    //         });
    //     } else {
    //         keys.forEach((key) => {
    //             initialDataClone[key] = initialDataClone[key].slice(0, visibleGraphRange);
    //         });
    //     }
    //     setData(initialDataClone);
    // }, [visibleGraphRange]);

    return (
        <>
            <RankingDistributionSingleGraphInner
                displayedTiers={displayedTiers}
                data={data}
                onChangeRange={setVisibleGraphRange}
                filters={{ duration, ranking }}
                isLoading={isLoading}
            />
            <RankingsDistributionDateIndicator>
                {i18nFilter()("rankings_distribution.tabletop.date", {
                    date: dayjs
                        .utc(tableFilters.duration, customRangeFormat)
                        .format(fullMonthAndYear),
                })}
            </RankingsDistributionDateIndicator>
            <RankingDistributionTableSummary
                data={data}
                duration={tableFilters.duration}
                isLoading={isLoading}
            />
        </>
    );
};

export const RankingDistributionSingleGraph = RankingDistributionSingleGraphContainer;
