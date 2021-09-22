import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import styled from "styled-components";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";

export const StyledTable: any = styled(MiniFlexTable)<{ colsCount: number }>`
    line-height: 24px;
    padding-bottom: 4px;
    .MiniFlexTable-column {
        &:not(:first-of-type) {
            min-width: 0;
            flex-basis: ${({ colsCount }) => `calc(${100 / colsCount}%)`};
        }
        overflow: initial !important;
        &:first-of-type {
            font-size: 14px;
            color: ${colorsPalettes.carbon["500"]};
            .MiniFlexTable-cell {
                padding-right: 25px;
                padding-left: 25px;
            }
            .MiniFlexTable-headerCell {
                padding-left: 25px;
            }
        }
        &:last-of-type {
            flex-shrink: unset !important;
        }
        .MiniFlexTable-cell {
            overflow: initial !important;
            border-bottom: solid 1px ${colorsPalettes.carbon["50"]};
            padding: 0;
            height: 48px;
            display: flex !important;
            align-items: center;
            box-sizing: border-box;
            &:last-of-type {
                border-bottom: none;
            }
            .leader-cell {
                align-items: center;
                @media (max-width: 1380px) {
                    font-size: ${({ colsCount }) => (colsCount === 6 ? "14px" : "18px")};
                }
                @media (min-width: 1381px) {
                    font-size: 18px;
                }
                color: ${colorsPalettes.carbon["500"]};
                .u-flex-row {
                    align-items: center;
                    flex-direction: row-reverse;
                    .SWReactIcons {
                        line-height: initial;
                        margin-left: 7px;
                        margin-right: 0px;
                    }
                }
                .no-leader-icon-offset {
                    margin-left: 0;
                }
            }
        }
        .MiniFlexTable-headerCell {
            border-bottom: solid 1px ${colorsPalettes.carbon["50"]};
            height: 40px;
            display: flex;
            align-items: center;
            &:first-of-type {
                border-top: solid 1px ${colorsPalettes.carbon["50"]};
            }
            font-size: 14px;
            color: ${colorsPalettes.carbon["300"]};
        }
        .u-flex-row {
            align-items: center;
        }
    }
`;

export const StyledBox = styled(Box)`
    width: 100%;
    margin-bottom: 1.4rem;
    height: 100%;
`;

export const StyledHeader = styled.div`
    height: 88px;
    box-sizing: border-box;
    padding: 24px;
    display: flex;
    justify-content: space-between;
`;

export const StyledAddToDashboardButton = styled(AddToDashboardButton)`
    padding-right: 25px;
`;
