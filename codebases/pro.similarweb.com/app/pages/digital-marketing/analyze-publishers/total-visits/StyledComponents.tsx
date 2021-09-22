import { colorsPalettes, rgba } from "@similarweb/styles";
import styled, { css } from "styled-components";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { Box } from "@similarweb/ui-components/dist/box";

export const ContentWrapper = styled.div`
    margin: 0 12px 5px 7px;
    height: 100%;
`;

export const TopPart = styled(FlexColumn)`
    align-items: center;
    height: 60%;
    justify-content: center;
`;

export const TotalVisitsWrapper = styled.div`
    color: ${colorsPalettes.carbon[500]};
    font-size: 44px;
    font-weight: 400;
    margin-bottom: 3px;
    line-height: 56px;
`;

export const TotalVisitsBottonWrapper = styled.div`
    display: flex;
    font-size: 16px;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    font-weight: 400;
    margin-bottom: 24px;
    text-transform: capitalize;
`;

export const ShareNumber = styled.div`
    font-weight: 700;
    margin-right: 5px;
`;
