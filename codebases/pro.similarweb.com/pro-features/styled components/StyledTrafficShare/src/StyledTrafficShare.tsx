import * as React from "react";
import styled, { css } from "styled-components";

export interface ITrafficShareBarProps {
    // TODO: remove optional x 3
    color?: string;
    backgroundColor?: string;
    width?: string | number;
    marginRight?: string | number;
    text?: string;
    tooltipText?: string;
    name?: string;
    borderRadius?: number;
    valuesAlignment?: string;
}

const HEIGHT = 16;

export const TrafficShareContainer = styled.div<{ height?: number }>`
    width: 100%;
    height: ${({ height }) => (height ? height : HEIGHT)}PX;
    display: inline-flex;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
`;

const defaultBorderRadius = 3;

const color: any = ({ color }) =>
    css`
        color: ${color};
    `;
const textAlign: any = ({ valuesAlignment }) =>
    css`
        text-align: ${valuesAlignment};
    `;
const backgroundColor: any = ({ backgroundColor }) =>
    css`
        background-color: ${backgroundColor};
    `;
const width: any = ({ width }) =>
    css`
        width: ${width * 100}%;
    `;
const marginRight: any = ({ marginRight }) =>
    marginRight &&
    css`
        margin-right: ${marginRight}px;
    `;
const borderRadius: any = ({ borderRadius = defaultBorderRadius, marginRight }) =>
    marginRight
        ? css`
              border-radius: ${borderRadius}px;
          `
        : css`
              &:first-of-type {
                  border-top-left-radius: ${borderRadius}px;
                  border-bottom-left-radius: ${borderRadius}px;
              }
              &:last-of-type {
                  border-top-right-radius: ${borderRadius}px;
                  border-bottom-right-radius: ${borderRadius}px;
              }
          `;

export const TrafficShareBar = styled.div<ITrafficShareBarProps>`
    display: inline-flex;
    align-items: center;
    text-indent: 3px;
    font-size: 11px;
    font-weight: 500;
    height: 100%;
    line-height: ${HEIGHT}px;
    overflow: hidden;
    ${color};
    ${width};
    ${backgroundColor};
    ${marginRight};
`;

export const TrafficShareBarThin = styled.div<ITrafficShareBarProps>`
    display: inline-flex;
    align-items: center;
    text-indent: 3px;
    font-size: 12px;
    font-weight: 500;
    height: 100%;
    line-height: ${HEIGHT}px;
    overflow: hidden;
`;

export const TrafficShareValue = styled.span<ITrafficShareBarProps>`
    ${color};
    ${textAlign};
    font-size: 14px;
    min-width: 29px;
`;
