import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled, { css } from "styled-components";

import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";

export const IndustryDemographicsContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ContentBox = styled(Box)`
    width: 100%;
    height: auto;
`;

export const ContentRow = styled(FlexRow)`
    justify-content: center;
    width: 100%;
    height: auto;
`;

export const LoaderContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
`;

const ChartContainer = styled.div`
    border: solid 1px ${colorsPalettes.carbon[50]};
    border-radius: 3px;
    height: 284px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin: 16px;
    padding: 12px 12px 0 24px;
`;

export const LeftChartContainer = styled(ChartContainer)`
    margin-right: 0px;
    @media (min-width: 1441px) {
        width: 35%;
    }
    @media (max-width: 1440px) {
        width: 45%;
    }
`;

export const RightChartContainer = styled(ChartContainer)`
    @media (min-width: 1441px) {
        width: 65%;
    }
    @media (max-width: 1440px) {
        width: 55%;
    }
`;
