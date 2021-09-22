import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import {
    FILTERS_PANEL_COLLAPSED_WIDTH,
    FILTERS_PANEL_LEFT_DISTANCE,
    FILTERS_PANEL_WIDTH,
} from "../../styles";

export const TRANSITION_CLASSNAME_PREFIX = "filter-panel";

export const StyledFiltersPanel = styled.div<{ classNamesPrefix: string }>`
    background-color: ${colorsPalettes.carbon["0"]};
    height: 100%;
    margin-left: ${FILTERS_PANEL_LEFT_DISTANCE}px;
    width: ${FILTERS_PANEL_WIDTH}px;
    will-change: width;

    ${({ classNamesPrefix }) => css`
        &.${classNamesPrefix}-enter, &.${classNamesPrefix}-exit-done {
            background-color: ${colorsPalettes.carbon["0"]};
            width: ${FILTERS_PANEL_WIDTH}px;
        }

        &.${classNamesPrefix}-enter-active {
            background-color: ${colorsPalettes.carbon["25"]};
            transition: width 300ms ease 200ms, background-color 300ms ease 200ms;
            width: ${FILTERS_PANEL_COLLAPSED_WIDTH}px;
        }

        &.${classNamesPrefix}-exit, &.${classNamesPrefix}-enter-done {
            background-color: ${colorsPalettes.carbon["25"]};
            width: ${FILTERS_PANEL_COLLAPSED_WIDTH}px;
        }

        &.${classNamesPrefix}-exit-active {
            background-color: ${colorsPalettes.carbon["0"]};
            transition: width 300ms ease, background-color 300ms ease;
            width: ${FILTERS_PANEL_WIDTH}px;
        }
    `};
`;

export const StyledFiltersPanelInner = styled.div`
    border: 1px solid ${colorsPalettes.carbon["50"]};
    border-bottom-width: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
`;
