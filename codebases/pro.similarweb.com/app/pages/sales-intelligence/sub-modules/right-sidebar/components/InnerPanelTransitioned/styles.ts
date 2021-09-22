import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledInnerPanelTransitioned = styled.div<{
    classNamePrefix: string;
    transitionDurationMs: number;
}>`
    background: ${colorsPalettes.bluegrey["100"]};
    height: 100%;
    position: absolute;
    top: 0;
    transform: translateX(100%);
    transition: transform ${({ transitionDurationMs }) => transitionDurationMs}ms ease-in-out;
    width: 100%;
    z-index: 99;

    ${({ classNamePrefix, transitionDurationMs }) => css`
        &.${classNamePrefix}-enter-active, &.${classNamePrefix}-enter-done {
            transform: translateX(0);
        }

        &.${classNamePrefix}-exit-active,
            &.${classNamePrefix}-exit-done,
            &.${classNamePrefix}-exit,
            &.${classNamePrefix}-enter {
            transform: translateX(100%);
        }

        &.${classNamePrefix}-enter-active, &.${classNamePrefix}-exit-active {
            transition: transform ${transitionDurationMs}ms ease-in-out;
        }
    `};
`;
