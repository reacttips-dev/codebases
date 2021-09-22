import { colorsPalettes, colorsSets } from "@similarweb/styles";
import { SFC } from "react";
import * as React from "react";
import Chart from "../../../../.pro-features/components/Chart/src/Chart";
import "../../../../.pro-features/components/Chart/styles/sharedTooltip.scss";
import { GraphLoader } from "../../../../.pro-features/components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { NoData } from "../../../../.pro-features/components/NoData/src/NoData";
import {
    GraphContainer,
    NoDataContainer,
} from "../../../../.pro-features/pages/conversion/components/benchmarkOvertime/StyledComponents";
import { getChartConfig, transformData } from "./ChartConfig";
import { ChartContainer, SitesChartLoaderContainer } from "./StyledComponents";

export interface IArenaVisitsContainerProps {
    graphData: any;
    selectedVisualizationIndex: number;
    isLoading?: boolean;
    filter?: any;
    selectedGranularity: string;
}

export const ArenaLineChart: SFC<IArenaVisitsContainerProps> = ({
    graphData,
    isLoading,
    filter,
    selectedVisualizationIndex,
    selectedGranularity,
}) => {
    const isPercentage = selectedVisualizationIndex === 0;
    const transformedData = transformData(graphData, isPercentage);
    const chartType = isPercentage ? "area" : "line";

    return (
        <>
            {isLoading ? (
                <SitesChartLoaderContainer>
                    <GraphLoader width={"100%"} />
                </SitesChartLoaderContainer>
            ) : (
                <GraphContainer className={"sharedTooltip"}>
                    {graphData ? (
                        <ChartContainer>
                            <Chart
                                type={chartType}
                                config={getChartConfig({
                                    type: chartType,
                                    filter,
                                    selectedVisualizationIndex,
                                    selectedGranularity,
                                    isPercentage,
                                    chartData: transformedData,
                                })}
                                data={transformedData}
                            />
                        </ChartContainer>
                    ) : (
                        <NoDataContainer>
                            {" "}
                            <NoData />{" "}
                        </NoDataContainer>
                    )}
                </GraphContainer>
            )}
        </>
    );
};
