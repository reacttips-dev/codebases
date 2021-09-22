import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const StyledBenchmarkSummaryInfo = styled.div`
    cursor: pointer;
    margin-left: 4px;
`;

export const StyledBenchmarkSummaryValueText = styled(FlexRow)<{ color?: string }>`
    animation: value-appear 200ms ease-in-out forwards;
    color: ${({ color }) => (color ? color : colorsPalettes.carbon["500"])};
    font-size: 21px;
    opacity: 0;

    @keyframes value-appear {
        to {
            opacity: 1;
        }
    }
`;

export const StyledBenchmarkSummaryValue = styled.div``;

export const StyledBenchmarkWinnerIcon = styled.div`
    margin-left: 4px;
    margin-top: 1px;

    & .SWReactIcons svg path {
        /* Can't use colorsPalettes here. It has to be this color */
        fill: #ffd13e;
    }
`;

export const StyledBenchmarkSummaryLabel = styled.div<{ labelColor: string }>`
    background-color: ${({ labelColor }) => labelColor};
    border-radius: 50%;
    flex-shrink: 0;
    height: 10px;
    margin-right: 6px;
    width: 10px;
`;

export const StyledBenchmarkSummaryItemHead = styled(FlexRow)`
    align-items: center;
    margin-bottom: 5px;

    & > span {
        color: ${rgba(colorsPalettes.carbon["500"], 0.6)};
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

export const StyledBenchmarkSummaryItemInner = styled.div`
    max-width: 100%;
`;

export const StyledBenchmarkSummaryItem = styled(FlexRow)`
    flex-shrink: 0;
`;

export const StyledBenchmarkSummaryTextIcon = styled.div`
    cursor: pointer;
    display: inline-block;
    margin-left: 4px;
    vertical-align: middle;
`;

export const StyledBenchmarkSummaryText = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const StyledBenchmarkSummaryTextContainer = styled(FlexRow)`
    align-items: center;
    background-color: ${rgba(colorsPalettes.carbon["25"], 0.6)};
    border-radius: 6px;
    padding: 8px 16px;

    ${StyledBenchmarkSummaryText} {
        color: ${colorsPalettes.carbon["500"]};
        font-size: 14px;
        line-height: 20px;
        margin: 0;
    }
`;

export const StyledBenchmarkSummary = styled(FlexRow)`
    align-items: center;
    justify-content: space-between;
`;

export const StyledBenchmarkSummaryContainer = styled.div`
    cursor: default;
    background-color: ${colorsPalettes.carbon["0"]};
    border-top: 1px solid ${colorsPalettes.carbon["50"]};
    padding: 16px 20px;
    margin-top: 20px;
`;
