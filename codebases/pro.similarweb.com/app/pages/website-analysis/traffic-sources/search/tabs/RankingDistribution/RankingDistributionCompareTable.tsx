import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { ProModal } from "components/Modals/src/ProModal";
import queryString from "query-string";
import dayjs from "dayjs";
import { useTrack } from "components/WithTrack/src/useTrack";
import { RankingDistributionCompareGraph } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionCompareGraph";
import { DefaultFetchService } from "services/fetchService";
import { singleTiers } from "pages/website-analysis/traffic-sources/search/components/filters/RankingTierFilter";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { MiniTableWithExpand } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/MiniTableWithExpand";

const RowLoadingContainer = styled.div`
    display: flex;
    justify-content: space-around;
    padding-bottom: 15px;
`;
const Loader = (items) =>
    Array.from(Array(6)).map((item, index) => (
        <RowLoadingContainer key={`RowLoadingContainer-${index}`}>
            {Array.from(Array(items)).map((item, index) => (
                <PixelPlaceholderLoader key={index} width={175} height={17} />
            ))}
        </RowLoadingContainer>
    ));

const getTierText = (tier) => {
    return singleTiers.find(({ value }) => value === tier).text;
};
const getTierTooltip = (tier) => {
    return singleTiers.find(({ value }) => value === tier).compareTableTooltipText;
};
export const RankingDistributionCompareTable: FC<any> = ({
    chosenItems,
    tableFilters,
    dataParamsAdapter,
}) => {
    const translate = useTranslation();
    const [trackLegacy, trackWithGuid] = useTrack();
    const [loading, setLoading] = useState(true);
    const [showGraph, setShowGraph] = useState(false);
    const [graphMetricId, setGraphMetricId] = useState(null);
    const [expandedRowIndex, setExpandedRowIndex] = useState(null);
    const [data, setData] = useState([]);

    const onExpandRowClick = (row) => () => {
        const index = data.findIndex(({ metricId }) => metricId === row.metricId);
        if (index === expandedRowIndex) {
            setExpandedRowIndex(null);
            setGraphMetricId(null);
            trackWithGuid("ranking.distribution.compare.table", "collapse", {
                position: data[index].metric,
            });
        } else {
            setExpandedRowIndex(index);
            setGraphMetricId(row.metricId);
            trackWithGuid("ranking.distribution.compare.table", "expand", { position: row.metric });
        }
    };
    const dataTransformer = (rawData) => {
        const result = Object.entries(rawData).map(([tier, tierData]) => {
            let maxValue = 0;
            let leader;
            const row = {
                leader: null,
                metricId: tier,
                metric: getTierText(tier),
                tooltip: getTierTooltip(tier),
                ...Object.entries(tierData).reduce((result, [site, data]) => {
                    const value = data[data.length - 1][1];
                    if (value > maxValue) {
                        maxValue = value;
                        leader = site;
                    }
                    result[site] = {
                        Value: value,
                        byDate: data.map(([date, value]) => [dayjs.utc(date).valueOf(), value]),
                    };
                    return result;
                }, {}),
            };
            row.leader = leader;
            return row;
        });

        return result;
    };
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const queryStringParams = queryString.stringify(
                    dataParamsAdapter({ ...tableFilters }),
                );
                const rawData = await DefaultFetchService.getInstance().get(
                    `/api/RankDistribution/Graph?${queryStringParams}`,
                );
                const transformed = dataTransformer(rawData);
                setData(transformed);
            } catch (e) {
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [tableFilters]);

    if (loading) {
        return <div>{Loader(chosenItems.length + 1)}</div>;
    }
    if (showGraph) {
        return (
            <ProModal
                isOpen={showGraph}
                onCloseClick={() => {
                    setShowGraph(false);
                    trackWithGuid("", "");
                }}
                shouldCloseOnOverlayClick={true}
                customStyles={{ content: { width: 894, padding: 0 } }}
            >
                <RankingDistributionCompareGraph
                    data={data.find(({ metricId }) => metricId === graphMetricId)}
                    chosenItems={chosenItems}
                    title={translate("ranking.distribution.compare.chart.title", {
                        tier: getTierText(graphMetricId),
                    })}
                    tier={getTierText(graphMetricId)}
                />
            </ProModal>
        );
    }

    // NEW TABLE

    return data ? (
        <MiniTableWithExpand
            data={data}
            onExpandRowClick={onExpandRowClick}
            expandedRowIndex={expandedRowIndex}
            domains={chosenItems.map(({ name }) => name)}
            expandedRowComponent={
                expandedRowIndex !== null && (
                    <RankingDistributionCompareGraph
                        data={data.find(({ metricId }) => metricId === graphMetricId)}
                        chosenItems={chosenItems}
                        title={translate("ranking.distribution.compare.chart.title", {
                            tier: getTierText(graphMetricId),
                        })}
                        tier={getTierText(graphMetricId)}
                        onCloseClick={onExpandRowClick}
                    />
                )
            }
        />
    ) : null;
};
