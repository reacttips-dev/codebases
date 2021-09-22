import Chart from "components/Chart/src/Chart";
import { FC, useEffect, useState } from "react";
import _ from "lodash";
import { stringify } from "querystring";
import dayjs from "dayjs";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { CHART_COLORS } from "constants/ChartColors";
import { Legends } from "components/React/Legends/Legends";
import { getChartConfig } from "pages/sneakpeek/config/chartCongif";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders/src/PlaceholderLoaders";
import { GraphHeaderContainer, GraphTitle, RowGap } from "pages/sneakpeek/StyledComponents";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { NoData } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { SwNavigator } from "common/services/swNavigator";
import { SneakpeekApiService } from "pages/sneakpeek/SneakpeekApiService";

const chartType = "line";

export interface ISneakpeekGraphProps {
    type: string;
    metaData: any;
    queryDataRaw: any;
    dynamicParams: any;
    chartRef: any;
    queryId: string;
    navigator: SwNavigator;
    params: any;
}

export const SneakpeekGraph: FC<ISneakpeekGraphProps> = ({
    type,
    metaData,
    chartRef,
    queryDataRaw,
    dynamicParams,
    navigator,
    queryId,
    params,
}) => {
    const [legends, setLegends] = useState<{ name: string; color: string; visible: boolean }[]>(
        undefined,
    );
    const [series, setSeries] = useState<
        { name: string; color: string; data: any; visible: boolean }[]
    >([]);
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    //const chartRef = useRef<HTMLElement>();

    const transformData = (rawData) => {
        const innerData = rawData.Data.Data;
        const isSingleSeries = Object.keys(innerData).length === 1;
        let isPercent = true;
        if (!isSingleSeries) {
            setLegends(
                Object.keys(innerData).map((key, idx) => ({
                    name: key,
                    color: CHART_COLORS.chartMainColors[idx],
                    visible: true,
                })),
            );
        }
        const seriesData = Object.entries(innerData).reduce((acc, v, idx) => {
            const data = Object.values(v[1])[0][0].map((val) => {
                if (val.Value && val.Value > 1) isPercent = false;
                return [dayjs.utc(val.Key).valueOf(), val.Value];
            });
            return acc.concat({
                name: v[0],
                color: CHART_COLORS.chartMainColors[idx],
                data,
                visible: true,
            });
        }, []);
        return {
            isSingleSeries,
            isPercent,
            seriesData,
            rawData,
        };
    };

    // in the event that there are dynamic params, we need the graph itself to do
    // the data fetching instead of the Query component that renders it.
    useEffect(() => {
        if (_.isEmpty(dynamicParams)) return;
        async function getData() {
            !isLoading && setIsLoading(true);
            const apiParams = navigator.getApiParams();
            const allParams = {
                ...apiParams,
                ...params,
                queryId,
                includeSubDomains: this.props.params.isWWW === "*",
                timeGranularity: _.capitalize(metaData.granularity),
            };
            let data;
            try {
                data = await SneakpeekApiService.ExecuteQuery(stringify(allParams), {
                    dynamicParams,
                });
            } catch (e) {
                setIsLoading(false);
            }
            const transformedData = transformData(data);
            setData(transformedData);
            setSeries(transformedData.seriesData);
            setIsLoading(false);
        }
        getData();
    }, [dynamicParams]);

    useEffect(() => {
        if (queryDataRaw) {
            const transformedData = transformData(queryDataRaw);
            setData(transformedData);
            setSeries(transformedData.seriesData);
        }
    }, [queryDataRaw]);

    useEffect(() => {
        if (series.length > 0) {
            const newSeries = [...series];
            newSeries.forEach((s) => {
                const legend = legends.find((l) => l.name === s.name);
                s.visible = legend.visible;
            });
            setSeries(newSeries);
        }
    }, [legends]);

    const toggleSeries = (serie, state, event) => {
        event.stopPropagation();
        const newLegends = [...legends];
        const index = newLegends.findIndex(({ name }) => name === serie.name);
        newLegends[index] = {
            ...newLegends[index],
            visible: !newLegends[index].visible,
        };
        setLegends(newLegends);
    };

    if (isLoading) {
        return (
            <FlexColumn>
                <PixelPlaceholderLoader width={140} height={26} />
                <RowGap />
                <GraphLoader width={"95%"} height={250} />
            </FlexColumn>
        );
    }

    return (
        <FlexColumn ref={chartRef}>
            {series.length > 0 ? (
                <>
                    <GraphHeaderContainer justifyContent={"space-between"}>
                        {legends ? (
                            <Legends legendItems={legends} toggleSeries={toggleSeries} />
                        ) : (
                            <GraphTitle hasChildren={!!metaData.yaxis}>{metaData.yaxis}</GraphTitle>
                        )}
                    </GraphHeaderContainer>
                    <Chart
                        type={chartType}
                        data={series}
                        config={getChartConfig(type)(
                            _.capitalize(metaData.granularity),
                            metaData.yaxis,
                            data["isPercent"],
                        )}
                    />
                </>
            ) : (
                <NoData
                    paddingTop="80px"
                    noDataTitleKey="global.nodata.notavilable"
                    noDataSubTitleKey="workspaces.marketing.nodata.subtitle"
                />
            )}
        </FlexColumn>
    );
};
