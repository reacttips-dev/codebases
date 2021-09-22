import React from "react";
import styled from "styled-components";
import { Spinner } from "components/Loaders/src/Spinner";
import SWReactRootComponent from "decorators/SWReactRootComponent";

export const SpinnerLoading = styled(Spinner)<{
    top?: string;
    width?: string;
    height?: string;
    borderWidth?: string;
}>`
    margin: 0 auto;
    position: relative;
    top: ${({ top }) => (top ? top : "40px")};
    width: ${({ width }) => (width ? width : "55px")};
    height: ${({ height }) => (height ? height : "55px")};
    border-width: ${({ borderWidth }) => (borderWidth ? borderWidth : "2px")};
`;

SWReactRootComponent(SpinnerLoading, "SpinnerLoading");
