import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import CommonRadioSelect from "./common/CommonRadioSelect/CommonRadioSelect";

export const FILTERS_PANEL_TRANSITION_TIMEOUT = 1000;
export const FILTERS_PANEL_INNER_ELS_TRANSITION_DURATION = 200;
export const FILTERS_PANEL_WIDTH = 400;
export const FILTERS_PANEL_COLLAPSED_WIDTH = 48;
export const FILTERS_PANEL_LEFT_DISTANCE = 24;
export const RESULTS_LEFT_DISTANCE = 16;

export const StyledHorizontalRadioSelect = styled(CommonRadioSelect)`
    align-items: center;
    display: flex;
`;

export const StyledDropdownContainer = styled.div`
    position: relative;
`;

export const StyledBaseFilterContainer = styled.div`
    padding-left: 16px;
    padding-right: 16px;
`;

export const StyledBaseDropdownButtonWrap = styled.div`
    width: 100%;

    & .DropdownButton {
        background-color: ${colorsPalettes.carbon["0"]};
        border-color: ${colorsPalettes.midnight["50"]};
        box-sizing: border-box;
        color: ${colorsPalettes.carbon["200"]};
        height: 40px;
    }

    & .DropdownButton:active {
        background-color: ${colorsPalettes.carbon["0"]};
        color: ${colorsPalettes.carbon["200"]};

        .DropdownButton--triangle {
            color: ${colorsPalettes.carbon["400"]};
        }
    }
`;

export const StyledCommonTransitionedElement = styled.div<{ classNamesPrefix: string }>`
    ${({ classNamesPrefix }) => css`
        &.${classNamesPrefix}-enter, &.${classNamesPrefix}-exit-done {
            opacity: 1;
            visibility: visible;
        }

        &.${classNamesPrefix}-enter-active {
            opacity: 0;
            transition: opacity ${FILTERS_PANEL_INNER_ELS_TRANSITION_DURATION}ms ease-in,
                visibility 0s linear ${FILTERS_PANEL_INNER_ELS_TRANSITION_DURATION}ms;
            visibility: hidden;
        }

        &.${classNamesPrefix}-exit, &.${classNamesPrefix}-enter-done {
            opacity: 0;
            visibility: hidden;
        }

        &.${classNamesPrefix}-exit-active {
            opacity: 1;
            transition: opacity ${FILTERS_PANEL_INNER_ELS_TRANSITION_DURATION}ms ease-in
                    ${FILTERS_PANEL_INNER_ELS_TRANSITION_DURATION}ms,
                visibility 0s linear ${FILTERS_PANEL_INNER_ELS_TRANSITION_DURATION}ms;
            visibility: visible;
        }
    `};
`;
