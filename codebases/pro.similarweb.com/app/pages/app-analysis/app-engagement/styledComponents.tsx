import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";

export const PageContentsContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: center;
`;

export const BoxContainer = styled(Box)`
    width: 100%;
    max-width: 1368px;
    height: auto;
    margin: 0 0 20px 0;
`;

export const BannersBarContainer = styled.div`
    padding: 14px 0;
    justify-content: center;
    width: 100%;
    background-color: ${colorsPalettes.yellow[200]};
    & + & {
        margin-top: 10px;
    }
`;

export const BannerBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: left;
`;

export const ChartContainer = styled.div`
    width: 100%;
    min-height: 260px;
    padding: 10px 0;
`;

export const ButtonsContainer = styled(FlexRow)`
    margin-right: 15px;
`;

export const StyledLegendWrapper = styled.span`
    width: 100%;
    margin-bottom: 8px;

    .winnerIcon {
        padding-top: 0;
        margin-left: auto;
    }

    > div {
        > div {
            width: 100%;
        }
        > label {
            padding-left: 5px;
            overflow: visible;
        }
    }
`;

export const TableWrapper: any = styled(Box)`
    pointer-events: ${({ loading }: any) => (loading ? "none" : "all")};
    width: 100%;
    max-width: 1368px;
    height: auto;
    border-radius: 6px 6px 6px 6px;
    display: block;
    padding: 25px 25px 32px 25px;
    box-sizing: border-box;

    .swReactTable-column:not(:first-child) {
        .swTable-headerCell,
        .leader-cell {
            justify-content: flex-end;
        }
    }
`;
TableWrapper.displayName = "TableWrapper";

export const AppEngagementOverviewTableWrapper = styled.div`
    margin-bottom: 24px;
    width: 100%;
`;

export const StyledTableHeader = styled.div`
    height: 88px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
`;

export const StyledGraphHeader = styled.div`
    height: 88px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 25px 25px 32px 25px;
`;

export const StyledAddToDashboardButton = styled(AddToDashboardButton)`
    padding-right: 25px;
`;

export const CustomStyledPrimaryTitle = styled(StyledPrimaryTitle)`
    margin-bottom: 5px;
`;

export const CircleElement = styled.span`
    border-radius: 50%;
    width: 24px;
    height: 24px;
    overflow: hidden;
`;

interface ILabel {
    color?: string;
}

export const Label = styled.div<ILabel>`
    display: flex;
    align-items: center;
    font-size: 9px;
    text-transform: uppercase;
    border-radius: 8px;
    padding: 0 6px;
    height: 16px;
    color: ${colorsPalettes.carbon["0"]};
    background-color: ${(props) => props.color || colorsPalettes.mint["400"]};
    align-self: flex-end;
    margin: auto 10px auto 10px;
`;

export const Devider = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon["50"]};
    width: 100%;
`;
