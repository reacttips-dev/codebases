import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { StyledHeadTitle } from "../FiltersPanelHead/styles";

export const TRANSITION_CLASSNAMES_PREFIX = "filters-panel-collapsed";

export const StyledTitle = styled(StyledHeadTitle)`
    opacity: 0;
    transform: rotate(-90deg) translateY(-100%) translateX(calc(-50% + 12px));
    transform-origin: right;
    text-align: right;
    transition: opacity 100ms ease;
    white-space: nowrap;
`;

export const StyledTitleWrap = styled.div`
    flex-grow: 1;
    padding-top: 12px;

    & > .SWReactIcons {
        margin-bottom: 12px;
        margin-left: 11px;

        & svg path {
            fill: ${colorsPalettes.carbon["500"]};
        }
    }
`;

export const StyledButtonContainer = styled.div`
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    flex-shrink: 0;
    padding-bottom: 4px;
`;

export const StyledCollapsedBlock = styled.div<{ classNamesPrefix: string }>`
    background-color: ${colorsPalettes.carbon["25"]};
    box-sizing: border-box;
    display: flex;
    height: 100%;
    flex-direction: column;
    left: 0;
    opacity: 0;
    padding: 4px;
    position: absolute;
    top: 0;
    visibility: hidden;
    width: 46px;

    ${({ classNamesPrefix }) => css`
        &.${classNamesPrefix}-enter, &.${classNamesPrefix}-exit-done {
            opacity: 0;
            visibility: hidden;

            ${StyledTitle} {
                opacity: 1;
            }
        }

        &.${classNamesPrefix}-enter-active {
            transition: opacity 200ms ease-in 200ms, visibility 0ms linear 200ms;
            opacity: 1;
            visibility: visible;
        }

        &.${classNamesPrefix}-exit, &.${classNamesPrefix}-enter-done {
            opacity: 1;
            visibility: visible;

            ${StyledTitle} {
                opacity: 1;
            }
        }

        &.${classNamesPrefix}-exit-active {
            transition: opacity 200ms ease-in;
            opacity: 0;
            visibility: hidden;
        }
    `};
`;
