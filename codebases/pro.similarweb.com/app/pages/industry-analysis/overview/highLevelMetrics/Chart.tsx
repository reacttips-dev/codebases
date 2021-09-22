import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import React from "react";
import {
    getRawData,
    parseServerDataBase,
    parseServerDataPeriodOverPeriod,
} from "pages/industry-analysis/overview/highLevelMetrics/dataHandler";
import ChartView from "components/Chart/src/Chart";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import { getChartConfig } from "pages/industry-analysis/overview/highLevelMetrics/chartConfig";
import { LoadingSpinner } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import styled from "styled-components";
import { NoData } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { GRAPH_ZOOM_CURSOR } from "constants/GraphZoomPng";

const DEFAULT_GET_CHART_TYPE = () => chartTypes.LINE;

const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 200px;
`;

const ChartContainer = styled.div`
    cursor: ${GRAPH_ZOOM_CURSOR};
`;

export const Chart = () => {
    const industryAnalysisOverviewHighLevelMetricsContext = useIndustryAnalysisOverviewHighLevelMetricsContext();
    const {
        queryParams,
        selectedMetric,
        timeGranularity,
        legendItems,
        isPeriodOverPeriod,
    } = industryAnalysisOverviewHighLevelMetricsContext;
    const { getChartType = DEFAULT_GET_CHART_TYPE } = selectedMetric;
    const [rawData, setRawData] = React.useState<any>();
    const [chartData, setChartData] = React.useState<any>();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isError, setIsError] = React.useState<boolean>(false);
    const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const rawData = await getRawData(industryAnalysisOverviewHighLevelMetricsContext);
            setRawData(rawData);
        } catch (e) {
            setIsError(true);
        } finally {
            setChartData(undefined);
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [selectedMetric, timeGranularity]);

    React.useEffect(() => {
        const parseServerData = isPeriodOverPeriod
            ? parseServerDataPeriodOverPeriod
            : parseServerDataBase;
        const chartData =
            rawData?.Data &&
            Object.values(rawData.Data).length &&
            parseServerData(rawData, industryAnalysisOverviewHighLevelMetricsContext);
        setChartData(chartData);
    }, [rawData, legendItems]);

    if (isLoading) {
        return (
            <LoaderContainer>
                <LoadingSpinner />
            </LoaderContainer>
        );
    }
    const isNoData = !chartData || isError || !chartData.filter(({ data }) => data).length;
    if (isNoData) {
        return (
            <NoData
                paddingTop="80px"
                noDataTitleKey="global.nodata.notavilable"
                noDataSubTitleKey="workspaces.marketing.nodata.subtitle"
            />
        );
    }

    const chartType = getChartType({ ...queryParams, isPeriodOverPeriod });
    const chartConfig = getChartConfig(
        chartType,
        timeGranularity,
        selectedMetric,
        industryAnalysisOverviewHighLevelMetricsContext,
    );
    return (
        <ChartContainer>
            <ChartView type={chartType} data={chartData} config={chartConfig} />
        </ChartContainer>
    );
};
