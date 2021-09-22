import { colorsPalettes, mixins } from "@similarweb/styles";
import * as React from "react";
import { StatelessComponent } from "react";
import styled, { css } from "styled-components";

export interface IPillProps {
    text: string;
    backgroundColor?: string;
    className?: string;
}

const bgColor = ({ backgroundColor = colorsPalettes.mint[400] }) =>
    css`
        background-color: ${backgroundColor};
    `;

export const PillStyled = styled.span<{ backgroundColor?: string }>`
    display: inline-block;
    padding: 0px 5px;
    height: 16px;
    line-height: 16px;
    ${bgColor};
    display: inline-block;
    ${mixins.setFont({ $size: 10, $color: colorsPalettes.carbon[0] })};
    border-radius: 10px;
`;

export const Pill: StatelessComponent<IPillProps> = ({ text, backgroundColor, className }) => (
    <PillStyled backgroundColor={backgroundColor} className={className}>
        {text}
    </PillStyled>
);
