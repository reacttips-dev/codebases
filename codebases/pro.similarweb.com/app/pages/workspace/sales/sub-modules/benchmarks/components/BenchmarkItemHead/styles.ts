import styled, { css } from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const StyledBenchmarkInfo = styled.div`
    flex-grow: 1;
    margin-right: 8px;

    span {
        color: ${rgba(colorsPalettes.carbon["500"], 0.6)};
        font-size: 12px;
    }
`;

export const StyledBenchmarkDate = styled(FlexRow)`
    cursor: default;
    align-items: center;
    margin-right: 16px;

    & svg path {
        fill: ${rgba(colorsPalettes.carbon["500"], 0.6)};
    }

    & > span {
        margin-left: 4px;
    }
`;

export const StyledBenchmarkCountry = styled(FlexRow)`
    cursor: default;
    align-items: center;

    & *:first-child {
        height: 16px;
        margin-right: 4px;
        width: 16px;
    }
`;

export const StyledBenchmarkNameTooltip = styled.div`
    cursor: pointer;
    margin-left: 5px;
`;

export const StyledBenchmarkName = styled(FlexRow)`
    align-items: center;
    cursor: default;
    flex-grow: 1;
    margin-bottom: 8px;
    overflow: hidden;
    padding-right: 0;
    text-overflow: ellipsis;
    white-space: nowrap;

    span {
        color: ${rgba(colorsPalettes.carbon["500"], 0.8)};
        font-size: 16px;
        font-weight: 500;
    }
`;

export const StyledBenchmarkHead = styled(FlexRow)`
    justify-content: space-between;
    padding: 24px 24px 0 24px;
`;
