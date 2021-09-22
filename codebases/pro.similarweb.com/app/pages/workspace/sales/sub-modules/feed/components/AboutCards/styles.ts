import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { BoxContainer } from "pages/app performance/src/page/single/usage section/styledComponents";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { colorsPalettes } from "@similarweb/styles";

export const StyledAdNetworkDetails = styled.div``;

export const TitleWrapper = styled.div`
    padding-left: 24px;
`;

export const CardContainer = styled.div`
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 6px;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    box-sizing: border-box;

    &.technologies {
        padding: 0 24px;
        height: 480px;
        &.noPagination {
            height: 455px;
        }
        & .swReactTable-container.swReactTable-header {
            border-top: none;
        }

        & .swReactTableHeaderCell.swTable-headerCell {
            border-right: none;
            background-color: ${colorsPalettes.carbon["0"]};
            & > div {
                border: none;
                background-color: ${colorsPalettes.carbon["0"]};
            }
        }
        & .swReactTableCell.swTable-cell {
            height: 50px;
            align-items: center;
            display: flex;
            justify-content: flex-start;
        }
        & .swTable-cell:last-child,
        .swReactTableCell:last-child {
            border-bottom: 1px #e6e9ec solid;
        }

        & .automation-tooltip {
            &.automation-popup {
                &.DropdownContent-container.Popup-content--pro.ontop-left {
                    position: absolute;
                }
            }
        }
    }

    &.siteInfo {
        padding: 0 20px;
        font-size: 14px;
    }

    &.topCountries {
        padding-bottom: 10px;
        font-size: 14px;
        height: 480px;

        & .MiniFlexTable-headerCell {
            border-top: none;
            font-size: 12px;
        }
        & .MiniFlexTable-column {
            flex: auto !important;
        }
    }

    .emptyTopcountries {
        margin: 40px 0;
    }

    ${BoxContainer} {
        height: auto;
    }

    .MiniFlexTable {
        padding: 0;

        &-headerCell {
            padding-bottom: 15px;
            padding-top: 25px;
            font-weight: 700;
            color: #7f8b97;
        }
    }
    .MiniFlexTable-container {
        padding-left: 24px;
        padding-right: 24px;
        display: flex;
        width: auto;
        height: 297px;
    }

    .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-cell {
        padding: 0;
        height: 50px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        &:nth-last-child(n + 2) {
            border-bottom: 1px solid #edf2f7;
        }
    }

    .MiniFlexTable-container .MiniFlexTable-column:first-child {
        .MiniFlexTable-cell {
            padding-left: 23px;
        }
        .MiniFlexTable-headerCell {
            padding-left: 20px;
        }
    }

    .MiniFlexTable-container .MiniFlexTable-column:last-child {
        .MiniFlexTable-cell {
            justify-content: flex-end;
            padding-right: 32px;
        }
        .MiniFlexTable-headerCell {
            justify-content: flex-end;
            padding-right: 18px;
        }
    }

    .MiniFlexTable-headerCell {
        border-top: 1px solid #edf2f7;
        border-bottom: 1px solid #edf2f7;
        height: 32px;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        color: #a1aab3;
    }

    .MiniFlexTable-cell {
        .countryCellNew {
            .country-text {
                display: flex;
            }
        }
    }
`;

export const TopGeoSubtitle = styled.div`
    display: flex;
    align-items: center;
    color: rgba(42, 62, 82, 0.6);
    font-size: 12px;
    margin: 4px 0 16px 0;
`;
export const Icon = styled(SWReactIcons)`
    display: flex;
    margin-right: 4px;
`;
export const WebSource = styled(FlexRow)`
    align-items: center;
    margin-left: 8px;
`;
export const StyledAboutTabContainer = styled.div`
    padding-bottom: 24px;
    &:nth-child(-1) {
        padding-bottom: 10px;
    }
`;
export const InnerTabTittle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
`;

export const StyledGeneralInfoContainer = styled.div`
    ${StyledAboutTabContainer} {
        &:nth-last-child(2) {
            padding-bottom: 10px;
        }
    }
`;

export const StyledGeneralInfoTitle = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    color: #2a3e52;
    font-size: 16px;
    font-weight: 500;
    font-family: Roboto;
    padding: 24px 0 24px 0;
`;

export const StyledPaginationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    border-top: 1px solid ${colorsPalettes.carbon[50]};
    height: 48px;
    align-items: center;
    justify-content: center;

    & > div:first-of-type {
        align-self: flex-end;
    }
`;

export const GreyCheckMark = styled.i`
    color: ${colorsPalettes.carbon[200]};
`;

export const StyledSubTitle = styled.div`
    padding-top: 8px;
    display: flex;
    color: ${colorsPalettes.carbon[400]};
    font-family: Roboto;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0px;
`;

export const StyledTechnologiesWrapper = styled.div`
    &.swReactTable-container.swReactTable-header {
        background-color: #fff;
        border-top: none;
    }
    & .flex-table {
        height: 280px;
    }
`;

export const LoaderWrapper = styled.div`
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const StyledBoldTextWrapper = styled.div`
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 13px;
    line-height: 20px;
`;
