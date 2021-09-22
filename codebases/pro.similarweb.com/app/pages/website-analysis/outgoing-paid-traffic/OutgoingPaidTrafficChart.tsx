import Chart from "components/Chart/src/Chart";
import { getChartConfig } from "pages/website-analysis/outgoing-paid-traffic/chartConfig";
import { buildChartData } from "pages/website-analysis/outgoing-paid-traffic/chartData";
import React from "react";
import styled from "styled-components";
import { IOutgoingPaidTrafficChartProps } from "./OutgoingPaidTrafficTypes";

/**
 * The chart's height should be different in case it's in comparison mode or single mode.
 * on single mode we want to limit the chart to a (relativley) small height, since it can
 * show its data in a compact manner.
 * In compare mode - we want the chart to take its entire parent height
 * to have an optimal viewing experience (compare mode contains much more info)
 */
const StyledChartContainer = styled.div<{ isCompareMode: boolean }>`
    height: ${({ isCompareMode }) => `${isCompareMode ? "100%" : "225px"}`};
    padding: 25px 15px 0 15px;
`;

const OutgoingPaidTrafficChart: React.FunctionComponent<IOutgoingPaidTrafficChartProps> = (
    props,
) => {
    const { afterRender, data, isCompareMode } = props;

    const chartConfig = getChartConfig(isCompareMode);
    const chartData = buildChartData(data);

    // When in comparing multiple websites - we want to use
    // the line chart.
    const chartType = isCompareMode ? "line" : "area";

    return (
        <StyledChartContainer isCompareMode={isCompareMode}>
            <Chart
                type={chartType}
                data={chartData}
                config={chartConfig}
                afterRender={afterRender}
            />
        </StyledChartContainer>
    );
};

export default OutgoingPaidTrafficChart;
