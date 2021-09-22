import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";
import { ChartContainer } from "../../../../../.pro-features/components/Chart/src/components/PeriodOverPeriodChart/StyledComponents";

export const IAPerformanceGraphLegendContainer: any = styled.div`
    height: 342px;
    ${ChartContainer} {
        height: 282px;
    }
`;
IAPerformanceGraphLegendContainer.displayName = "IAPerformanceGraphLegendContainer";
