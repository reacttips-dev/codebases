import React from "react";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const ChartLoaderContainer = styled.div`
    display: flex;
    background-color: ${colorsPalettes.carbon["25"]};
    width: 100%;
    height: 326px;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
`;

export const CircleLoaderContainer = styled.div<{
    width?: number;
    height?: number;
    marginRight?: number;
    marginTop?: number;
}>`
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    border-radius: 50%;
    width: ${({ width }) => (width ? `${width}px` : "175px")};
    height: ${({ height }) => (height ? `${height}px` : "175px")};
    margin-right: ${({ marginRight }) => (marginRight ? `${marginRight}px` : "0px")};
    margin-top: ${({ marginTop }) => (marginTop ? `${marginTop}px` : "0px")};
    border: solid 1px #ffffff;
`;
const CIRCLE_LOADER_DIAMETER = 175;
const BIG_CIRCLE_LOADER_DIAMETER = 200;

export const OverlapLoaders: React.FunctionComponent = () => {
    return (
        <ChartLoaderContainer>
            <CircleLoaderContainer
                marginRight={-80}
                marginTop={-75}
                width={CIRCLE_LOADER_DIAMETER}
                height={CIRCLE_LOADER_DIAMETER}
            >
                <PixelPlaceholderLoader
                    width={CIRCLE_LOADER_DIAMETER}
                    height={CIRCLE_LOADER_DIAMETER}
                />
            </CircleLoaderContainer>
            <CircleLoaderContainer
                marginRight={-210}
                marginTop={-85}
                width={CIRCLE_LOADER_DIAMETER}
                height={CIRCLE_LOADER_DIAMETER}
            >
                <PixelPlaceholderLoader
                    width={CIRCLE_LOADER_DIAMETER}
                    height={CIRCLE_LOADER_DIAMETER}
                />
            </CircleLoaderContainer>
            <CircleLoaderContainer
                marginRight={80}
                marginTop={90}
                width={BIG_CIRCLE_LOADER_DIAMETER}
                height={BIG_CIRCLE_LOADER_DIAMETER}
            >
                <PixelPlaceholderLoader
                    width={BIG_CIRCLE_LOADER_DIAMETER}
                    height={BIG_CIRCLE_LOADER_DIAMETER}
                />
            </CircleLoaderContainer>
        </ChartLoaderContainer>
    );
};
