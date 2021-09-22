import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Tab, TabList } from "@similarweb/ui-components/dist/tabs";
import React from "react";
import styled, { css } from "styled-components";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Switcher } from "@similarweb/ui-components/dist/switcher";

export const StyledTab = styled(Tab)`
    ${setFont({ $size: 13 })};
    height: 48px;
     &.selected {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.blue[400]};
        }
         &:hover {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.blue[400]};
        }
    }
    }
    &:hover {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[500]};
        }
    }
 }
`;

export const ChartHeaderContainer = styled(FlexRow)`
    justify-content: space-between;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;

export const StyledTabList = styled(TabList)`
    border-bottom: none;
`;

export const StyledTabIcon = styled(SWReactIcons)`
    margin-right: 10px;
`;

export const ChartLegendsContainer = styled(FlexColumn)<{
    justifyContent: string;
    paddingTop: number;
}>`
    width: 25%;
    @media (min-width: 1500px) {
        width: 20%;
    }
    @media print {
        width: 20%;
    }
    margin: 10px 0 12px 0;
    align-items: center;
    ${({ justifyContent }) =>
        justifyContent &&
        css`
            justify-content: ${justifyContent};
        `};
    ${({ paddingTop }) =>
        paddingTop &&
        css`
            padding-top: ${paddingTop}px;
        `};
`;

export const CheckBoxContainer = styled(FlexColumn)`
    width: 100%;
    justify-content: center;
`;

export const ButtonsContainer = styled(FlexRow)`
    margin-right: 15px;
`;

export const ChartContainer = styled.div`
    margin-left: 17px;
    margin-right: 32px;
    @media (min-width: 1500px) {
        width: 80%;
    }
    @media print {
        width: 80%;
    }
    width: 75%;
`;

export const Wrapper = styled.div`
    width: 100%;
`;

export const Name = styled.div`
    font-size: 14px;
    font-weight: 400;
`;

export const Value = styled.div`
    font-size: 14px;
    font-weight: 400;
`;

export const VisioWrapper = styled(FlexRow)`
    margin-top: 5px;
    justify-content: flex-end;
`;

export const PartialText = styled.div`
    height: 24px;
    font-size: 12px;
    background: ${colorsPalettes.carbon["50"]};
    font-weight: 400;
    border-radius: 4px;
    padding-left: 8px;
    padding-bottom: 6px;
    box-sizing: border-box;
    margin: -12px 8px 12px;
`;

export const ChartWrapper = styled.div`
    margin-top: 16px;
    width: 100%;
`;

export const PoPChartWrapper = styled(ChartWrapper)`
    min-height: 240px;
`;

export const StyledLegendWrapper = styled.span`
    width: 100%;
    margin-bottom: 8px;

    .winnerIcon {
        padding-top: 0;
    }
`;

export const LegendsTitle = styled.span`
    font-weight: 500;
    font-size: 14px;
    color: ${colorsPalettes.carbon["500"]};
    margin-bottom: 12px;
    display: flex;
    align-items: center;
`;

export const ContentWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    height: 100%;
    margin: 0 24px 24px 0;
`;

export const NoDataWrapper = styled(ChartContainer)`
    height: 312px;
    width: 100%;
    > div {
        padding-left: 15%;
        @media (min-width: 1500px) {
            padding-left: 10%;
        }
    }
`;

export const StyledSwitcher = styled(Switcher)`
    height: 40px;
`;

export const ChannelsButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 24px 12px 16px 25px;
`;

export const ChannelsButtonsTitle = styled.div`
    margin-right: 12px;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[400] })};
`;
