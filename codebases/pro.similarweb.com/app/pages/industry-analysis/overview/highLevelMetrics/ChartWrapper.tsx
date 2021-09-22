import { PngHeader } from "pages/industry-analysis/overview/highLevelMetrics/PngHeader";
import { Chart } from "pages/industry-analysis/overview/highLevelMetrics/Chart";
import { FiltersAndActionItems } from "pages/industry-analysis/overview/highLevelMetrics/chartFiltersAndLegends/FiltersAndActionItems";
import React from "react";
import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import styled from "styled-components";

const ChartWrapperContainer = styled.div`
    padding: 20px;
`;

export const ChartWrapper: React.FunctionComponent = () => {
    const { setChartRef } = useIndustryAnalysisOverviewHighLevelMetricsContext();
    const chartRef = React.useRef<HTMLDivElement>(undefined);
    React.useEffect(() => {
        setChartRef(chartRef);
    }, []);
    return (
        <ChartWrapperContainer ref={chartRef}>
            <PngHeader />
            <FiltersAndActionItems />
            <Chart />
        </ChartWrapperContainer>
    );
};
