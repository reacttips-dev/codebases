import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { FluidContainer } from "components/Chart/src/ResponsiveChart";

export const StyledGraphWrapper = styled.div`
    ${FluidContainer} {
        height: 170px;
    }
    padding: 24px;
`;

export const StyledSiteTrendsGraphHeader = styled.div`
    margin-bottom: 40px;
`;

export const StyledTrendsGraphTitleValue = styled.div`
    font-weight: 500;
`;

export const StyledTrendsGraphTitle = styled.div`
    display: flex;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 5px;

    .ChangeValue {
        font-size: 20px;
        line-height: 24px;
        margin-left: 10px;
        &-text,
        &-arrow {
            vertical-align: baseline;
            height: 14px;
        }
    }
`;

export const StyledTrendsGraphSubTitle = styled.div`
    font-size: 12px;
    line-height: 16px;
`;
