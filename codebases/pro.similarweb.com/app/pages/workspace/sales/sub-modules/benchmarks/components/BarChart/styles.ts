import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const StyledChartWrapper = styled.div`
    display: inherit;
    flex-grow: inherit;
    max-width: inherit;
    position: inherit;
`;

export const StyledChartLoadingContainer = styled.div`
    & .bar-chart-loader-size-3 {
        margin-top: 45px;
    }

    & .bar-chart-loader-size-2 {
        margin-top: 5px;
    }
`;

export const StyledChartShadow = styled.div<{ height: string }>`
    box-shadow: 4px 0 4px -3px ${rgba(colorsPalettes.black["0"], 0.2)};
    height: ${({ height }) => height};
    left: -9px;
    position: absolute;
    top: 0;
    z-index: 1;
    width: 9px;
`;

export const StyledChartContainer = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-grow: 1;
    max-width: 325px;
    position: relative;
`;

export const StyledWatermark = styled.div`
    position: absolute;
    bottom: -20px;
    z-index: 9;
    right: 0px;
`;
