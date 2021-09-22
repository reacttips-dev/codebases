import styled, { css } from "styled-components";

export const TRANSITION_TIMEOUT = 1000;
export const TRANSITION_CLASSNAME_PREFIX = "summary";

export const StyledFiltersSummaryContainer = styled.div``;

export const StyledSummaryTransitionedContainer = styled.div<{
    classNamesPrefix: string;
}>`
    overflow-y: hidden;

    ${({ classNamesPrefix }) => css`
        &.${classNamesPrefix}-enter {
            max-height: 0;
        }

        &.${classNamesPrefix}-enter-active {
            max-height: 1000px;
            transition: max-height 500ms;
        }

        &.${classNamesPrefix}-exit {
            max-height: 1000px;
        }

        &.${classNamesPrefix}-exit-active {
            max-height: 0;
            transition: max-height 500ms;
        }
    `};
`;
