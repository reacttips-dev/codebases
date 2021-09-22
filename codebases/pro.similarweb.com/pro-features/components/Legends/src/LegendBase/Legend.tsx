import * as React from "react";

import styled, { css } from "styled-components";
import { mixins, colorsPalettes, rgba } from "@similarweb/styles";
import { StatelessComponent } from "react";

export interface ILegend {
    color: string;
    name: string;
    isMain?: boolean;
    size?: "s" | "m";
}

export interface ILegendStyled {
    isMain: boolean;
    size: any;
}

export const DefaultLegendContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const LegendStyled = styled.div<ILegendStyled>`
    display: flex;
    align-items: center;
    ${({ isMain, size }) =>
        !isMain &&
        css`
            ${mixins.setFont({
                $color: rgba(colorsPalettes.carbon[500], 0.8),
                $weight: 400,
                $size: size === "m" ? "14px" : "12px",
            })}
        `};
    ${({ isMain, size }) =>
        isMain &&
        css`
            ${mixins.setFont({
                $color: rgba(colorsPalettes.carbon[500], 0.8),
                $weight: 600,
                $size: size === "m" ? "14px" : "12px",
            })}
        `};
    margin-right: 8px;
`;

export const Marker = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
    margin-right: 8px;
`;

export const LegendText = styled.span``;

export const Legend: StatelessComponent<ILegend> = ({ color, name, isMain, size }) => {
    return (
        <LegendStyled isMain={isMain} size={size}>
            <Marker color={color} />
            <LegendText>{name}</LegendText>
        </LegendStyled>
    );
};

Legend.defaultProps = {
    isMain: false,
    size: "m",
};
