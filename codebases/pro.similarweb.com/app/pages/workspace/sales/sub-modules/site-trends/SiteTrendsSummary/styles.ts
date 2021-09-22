import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledSiteTrendsSummary = styled.div`
    display: flex;
    padding: 15px 20px 13px 20px;
    border-radius: 4px;
    border: solid 1px #ecedf0;
    margin: 24px;
`;

export const StyledSiteTrendsSummaryItem = styled.div<{ flexBasis: string }>`
    flex-basis: ${({ flexBasis }) => flexBasis};
`;

export const StaledValue = styled.span<{ colorValue: string }>`
    color: ${({ colorValue }) => colorValue || colorsPalettes.carbon["0"]};
    font-size: 20px;
`;

export const StyledSiteTrendsIconWinner = styled.div`
    margin-left: 5px;
`;

export const StyledSiteTrendsSummaryValueText = styled.div`
    display: flex;
    align-items: center;

    .ChangeValue-text {
        font-size: 20px;
        line-height: 1.2;
    }
    .ChangeValue-arrow--symbol {
        vertical-align: -3px;
        height: 15px;
    }
`;

export const StyledSiteTrendsSummaryLabel = styled.div`
    font-size: 12px;
    line-height: 20px;
    color: rgba(42, 62, 82, 0.6);
    margin-bottom: 5px;
`;
