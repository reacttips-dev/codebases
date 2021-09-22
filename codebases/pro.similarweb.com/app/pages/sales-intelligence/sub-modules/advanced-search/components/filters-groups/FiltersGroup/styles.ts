import styled, { css } from "styled-components";
import { colorsPalettes, fonts, mixins, rgba } from "@similarweb/styles";
import { Collapsible } from "@similarweb/ui-components/dist/collapsible";
import { StyledFadeIn } from "pages/sales-intelligence/common-components/styles";

export const StyledValueIndication = styled.div`
    background-color: ${colorsPalettes.blue["300"]};
    border-radius: 6px;
    height: 6px;
    margin-left: 11px;
    width: 6px;
`;

export const StyledContentWrap = styled.div`
    padding-bottom: 20px;
    padding-top: 16px;
`;

export const StyledDisabledOverlay = styled.div`
    background-color: ${rgba(colorsPalettes.carbon["25"], 0.8)};
    cursor: not-allowed;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
`;

export const StyledInfoContainer = styled(StyledFadeIn)`
    cursor: pointer;
    display: none;
    margin-left: 8px;

    &.visible {
        display: block;
    }

    .SWReactIcons svg path:last-child {
        fill: ${colorsPalettes.carbon["200"]};
    }
`;

export const StyledIconContainer = styled.div`
    margin-right: 12px;
`;

export const StyledGroupName = styled.h4`
    ${mixins.setFont({
        $color: colorsPalettes.carbon["400"],
        $family: fonts.$dmSansFontFamily,
        $size: 12,
        $weight: 500,
    })};
    margin: 0;
`;

export const StyledGroupNameWrap = styled.div`
    align-items: center;
    display: flex;
`;

export const StyledGroupHeadInner = styled.div<{ canBeHovered: boolean }>`
    align-items: center;
    background-color: transparent;
    box-sizing: border-box;
    display: flex;
    height: 100%;
    padding: 0 16px 0 12px;
    transition: background-color 200ms ease-in-out;
    user-select: none;
    width: 100%;

    ${({ canBeHovered }) =>
        canBeHovered &&
        css`
            cursor: pointer;

            ${StyledIconContainer} {
                .SWReactIcons svg path,
                .SWReactIcons svg use {
                    transition: fill 200ms ease-in-out;
                }
            }

            &:hover {
                background-color: ${colorsPalettes.bluegrey["200"]};

                ${StyledIconContainer} {
                    .SWReactIcons svg path,
                    .SWReactIcons svg use {
                        fill: ${colorsPalettes.carbon["400"]};
                    }
                }
            }
        `};
`;

export const StyledGroupHead = styled.div<{ expanded: boolean; isCollapsible: boolean }>`
    background-color: ${({ expanded, isCollapsible }) =>
        expanded || !isCollapsible
            ? colorsPalettes.carbon["0"]
            : rgba(colorsPalettes.carbon["25"], 0.8)};
    box-sizing: border-box;
    cursor: default;
    height: 48px;
    padding: 4px 0 5px;
    position: relative;
    transition: background-color 500ms ease-in-out;

    &::after {
        background-color: ${colorsPalettes.carbon["50"]};
        bottom: 0;
        content: "";
        display: block;
        height: 1px;
        left: 16px;
        position: absolute;
        width: calc(100% - 32px);
    }

    ${({ isCollapsible }) =>
        !isCollapsible &&
        css`
            ${StyledGroupHeadInner} {
                padding-left: 16px;
            }
        `};
`;

export const StyledCollapsible = styled(Collapsible)`
    overflow: ${({ isActive }) => (isActive ? "visible" : "hidden")};
`;

export const StyledFiltersGroupContainer = styled.div<{ expanded: boolean }>`
    position: relative;

    &::before {
        background-color: ${colorsPalettes.blue["300"]};
        content: "";
        display: ${({ expanded }) => (expanded ? "block" : "none")};
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 2px;
        z-index: 1;
    }

    ${({ expanded }) =>
        !expanded &&
        css`
            &:last-child {
                ${StyledGroupHead} {
                    padding-bottom: 4px;
                    &::after {
                        display: none;
                    }
                }
            }
        `};
`;
