import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledSummaryName = styled.div`
    flex-shrink: 0;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
        line-height: 20px;
    }
`;

export const StyledSummaryValue = styled(StyledSummaryName)<{ maxWidth?: string }>`
    max-width: ${({ maxWidth }) => maxWidth};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    span {
        font-weight: 700;
    }
`;

export const StyledFilterSummaryItem = styled.div`
    align-items: center;
    display: flex;
    overflow: hidden;

    &:first-child {
        margin-top: 12px;
    }
`;
