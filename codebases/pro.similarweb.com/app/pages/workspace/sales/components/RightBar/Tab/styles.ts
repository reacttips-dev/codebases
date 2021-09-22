import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const StyledTabs = styled.div<{ totalTabs: number }>`
    display: flex;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: 0.5px;
    text-align: center;
    color: ${rgba(colorsPalettes.carbon["500"], 0.6)};
    background-color: ${colorsPalettes.carbon["0"]};
    & > div {
        flex-basis: ${({ totalTabs }) => (totalTabs % 4 === 0 ? "25%" : "33%")};
        cursor: pointer;
    }

    & > div:last-child {
        flex-basis: ${({ totalTabs }) => (totalTabs % 4 === 0 ? "25%" : "34%")};
    }

    .Tab {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 30%;
        padding: 15px 0px;
        box-sizing: border-box;
        border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
        &:hover {
            cursor: pointer;
        }
        &.active {
            padding-bottom: 14px;
            border-bottom: 2px solid ${colorsPalettes.blue["400"]};
            color: ${colorsPalettes.blue["400"]};
        }
    }

    .Tab:last-child {
        flex-basis: 40%;
    }
`;

export const StyledAmountSignals = styled.div`
    background: ${colorsPalettes.blue["400"]};
    border-radius: 50%;
    height: 20px;
    width: 20px;
    margin-left: 10px;
    font-size: 10px;
`;

export const StyledBeta = styled.span`
    font-size: 10px;
    background: ${colorsPalettes.mint["400"]};
    border-radius: 8px;
    color: ${colorsPalettes.carbon["0"]};
    padding: 0 6px;
    margin-left: 6px;
    display: inline-block;
    text-transform: uppercase;
`;
