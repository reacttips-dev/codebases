import React from "react";
import { CompetitiveTrackingChart } from "./CompetitiveTrackingChart";
import { ChartAndLegendsContainer, ChartContainer } from "./CompetitiveTrackingChart.styles";
import { FiltersAndActionItems } from "./FiltersAndActionItems/FiltersAndActionItems";
import { Legends } from "./FiltersAndActionItems/Legends";

export const CompetitiveTrackingChartWrapper = () => {
    return (
        <>
            <FiltersAndActionItems />
            <ChartAndLegendsContainer>
                <ChartContainer>
                    <CompetitiveTrackingChart />
                </ChartContainer>
                <Legends />
            </ChartAndLegendsContainer>
        </>
    );
};
