import styled, { css } from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

const WEBSITE_SIZE = 18;
const MAIN_WEBSITE_SIZE = 32;
const StyledTick = styled.div`
    background-color: ${colorsPalettes.carbon["100"]};
    height: 10px;
    position: absolute;
    top: 4px;
    width: 1px;
`;
const StyledTickValue = styled.div`
    line-height: 20px;
    position: absolute;
    top: 18px;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["200"], $size: 12 })};
    }
`;

export const StyledLeftTickValue = styled(StyledTickValue)`
    left: 0;
`;

export const StyledRightTickValue = styled(StyledTickValue)`
    right: 0;
`;

export const StyledLeftTick = styled(StyledTick)`
    left: 4px;
`;

export const StyledRightTick = styled(StyledTick)`
    right: 4px;
`;

export const StyledAxisWebsiteIcon = styled.img`
    height: auto;
    max-width: 100%;
    opacity: 0;
    transition: opacity 100ms ease-in-out;
`;

export const StyledAxisWebsite = styled.div<{
    left: number;
    isActive: boolean;
}>`
    align-items: center;
    background-color: ${({ isActive }) =>
        isActive ? colorsPalettes.carbon["0"] : colorsPalettes.bluegrey["100"]};
    border: 1px solid ${colorsPalettes.midnight["50"]};
    border-radius: 6px;
    box-shadow: 0 2px 4px ${rgba(colorsPalettes.carbon["100"], 0.2)};
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    height: ${WEBSITE_SIZE}px;
    justify-content: center;
    left: ${({ left }) => `calc(${left}% - ${WEBSITE_SIZE / 2}px)`};
    padding: 2px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 100ms ease-in-out;
    width: ${WEBSITE_SIZE}px;
    z-index: 1;

    &:hover {
        box-shadow: 0 0 8px ${rgba(colorsPalettes.black["0"], 0.12)},
            0 8px 8px ${rgba(colorsPalettes.black["0"], 0.24)};
        z-index: 3;
    }

    ${({ isActive }) =>
        isActive &&
        css`
            ${StyledAxisWebsiteIcon} {
                opacity: 1;
            }
        `};
`;

export const StyledAxisMainWebsite = styled(StyledAxisWebsite)<{
    isLast: boolean;
    isFirst: boolean;
}>`
    background-color: ${colorsPalettes.carbon["0"]};
    height: ${MAIN_WEBSITE_SIZE}px;
    left: ${({ left, isFirst, isLast }) =>
        `calc(${left}% - ${isFirst ? 8 : isLast ? 24 : MAIN_WEBSITE_SIZE / 2}px)`};
    width: ${MAIN_WEBSITE_SIZE}px;
    z-index: 2;

    ${StyledAxisWebsiteIcon} {
        opacity: 1;
        width: 19px;
    }
`;

export const StyledWebsitesContainer = styled.div<{ isActive: boolean }>`
    height: 100%;
    margin: 0 auto;
    position: relative;

    ${({ isActive }) =>
        isActive &&
        css`
            ${StyledAxisWebsite} {
                transform: translateY(-50%) scale(1.3331);
            }

            ${StyledAxisMainWebsite} {
                transform: translateY(-50%) scale(1);
            }
        `};
`;

export const StyledAxis = styled.div`
    background-color: ${colorsPalettes.carbon["50"]};
    border-radius: 17px;
    height: 4px;
    position: relative;
`;

export const StyledRankingAxisContainer = styled.div`
    padding: 14px 0 30px;
`;
