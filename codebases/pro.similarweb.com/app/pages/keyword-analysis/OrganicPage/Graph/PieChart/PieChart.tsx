import Chart from "components/Chart/src/Chart";
import { NoData } from "pages/keyword-analysis/OrganicPage/Graph/NoData";
import {
    getEnrichedLegendItems,
    parsePieData,
    visibleFilter,
} from "pages/keyword-analysis/OrganicPage/Graph/PieChart/functions";
import { getChartConfig } from "pages/keyword-analysis/OrganicPage/Graph/PieChart/pieChartConfig";
import {
    LoaderContainer,
    PieChartContainer,
} from "pages/keyword-analysis/OrganicPage/Graph/PieChart/styled";
import React from "react";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import { Loader } from "../Loader";
import { PieLegends } from "./Legends";

export const PieChart = ({
    graphData,
    legends,
    toggleSeries,
    isLoading,
    lastSupportedDate,
    timeGranularity,
}) => {
    if (isLoading)
        return (
            <LoaderContainer>
                <Loader />
            </LoaderContainer>
        );
    if (graphData.length === 0) return <NoData />;
    const chartData = parsePieData(graphData);
    const enrichedLegendItems = getEnrichedLegendItems(chartData, legends);
    const filteredChartData = chartData.filter(visibleFilter);
    return (
        <div style={{ margin: "30px", height: "100%" }}>
            <PieChartContainer>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "315px", height: "315px" }}>
                        <Chart
                            data={filteredChartData}
                            type={chartTypes.PIE}
                            config={getChartConfig(
                                filteredChartData,
                                lastSupportedDate,
                                timeGranularity,
                                false,
                            )}
                        />
                    </div>
                </div>
                <PieLegends legendItems={enrichedLegendItems} toggleSeries={toggleSeries} />
            </PieChartContainer>
        </div>
    );
};
