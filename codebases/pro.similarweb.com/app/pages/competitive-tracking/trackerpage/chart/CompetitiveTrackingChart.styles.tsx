import styled from "styled-components";
import { clientWidthThreshold as defaultClientWidthThreshold } from "../context/context";

export const ChartContainer = styled.div`
    overflow: hidden;
    padding-right: 24px;
    width: 100%;
`;

export const ChartAndLegendsContainer = styled.div<{ clientWidthThreshold?: number }>`
    display: flex;
    padding: 16px;
    height: 400px;
    ${({ clientWidthThreshold = defaultClientWidthThreshold }) =>
        `@media (max-width: ${clientWidthThreshold}px) {
            height: 350px;
        }`}
`;
