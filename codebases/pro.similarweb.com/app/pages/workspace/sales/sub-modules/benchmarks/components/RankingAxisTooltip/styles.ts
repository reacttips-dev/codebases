import styled, { createGlobalStyle } from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledRankingAxisTooltipContent = styled.div`
    display: flex;
    justify-content: space-between;

    & span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};

        &:last-child {
            margin-left: 20px;
        }
    }
`;

export const RankingAxisTooltipGlobalStyles = createGlobalStyle`
    .benchmarks-ranking-axis-tooltip-container {
        border: none;
    }

    .benchmarks-ranking-axis-tooltip-content {
        padding: 8px 16px;
    }
`;
