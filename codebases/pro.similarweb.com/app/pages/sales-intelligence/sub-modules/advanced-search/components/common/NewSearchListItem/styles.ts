import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledInnerText = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 16 })};
    line-height: normal;
    margin: 0;
`;

export const StyledPlusIcon = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 100%;
    box-shadow: 0 0 6px 2px ${rgba(colorsPalettes.blue["500"], 0.11)};
    box-sizing: border-box;
    display: flex;
    height: 32px;
    justify-content: center;
    margin: 0 12px;
    padding: 7px;
    width: 32px;
`;

export const StyledItemContainer = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    border: 1px solid ${colorsPalettes.carbon["50"]};
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    height: 65px;
    transform: translate3d(0, 0, 0);
    transition: box-shadow 100ms ease-in-out, transform 100ms ease-in-out;
    width: 100%;

    &:hover {
        border: 1px solid ${colorsPalettes.carbon["50"]};
        box-shadow: 0 12px 24px 0 ${rgba(colorsPalettes.black["0"], 0.2)};
        transform: translate3d(0, -4px, 0);
    }
`;
