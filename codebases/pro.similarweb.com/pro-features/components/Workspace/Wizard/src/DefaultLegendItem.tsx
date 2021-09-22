import { colorsPalettes } from "@similarweb/styles";
import React from "react";
import styled, { css } from "styled-components";

import { SWReactIcons } from "@similarweb/icons";
import { WithContext } from "./WithContext";

interface IItemState {
    isActive: boolean;
    isVisited: boolean;
}

const Circle = styled.div<IItemState>`
    width: 24px;
    height: 24px;
    font-size: 14px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: ${(props) =>
        props.isVisited || props.isActive
            ? colorsPalettes.blue["400"]
            : colorsPalettes.carbon["200"]};

    svg path {
        fill: white;
    }
`;

const Container = styled.div<IItemState>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 52px;
    transition: all 0.2s ease-in-out;
    opacity: ${(props) => (props.isActive ? 1 : 0.6)};
`;

const Text = styled.span<{ alignText?: string }>`
    position: relative;
    top: 4px;
    font-size: 12px;
    color: ${colorsPalettes.carbon["500"]};
    white-space: nowrap;
    display: inline-block;
    max-width: 228px;
    text-overflow: ellipsis;
    overflow: hidden;
    ${({ alignText }) =>
        alignText === "left" &&
        css`
            transform: translateX(calc(50% - 12px));
        `}
`;

export const DefaultLegendItem = ({
    currentStep,
    isActive,
    isVisited,
    step,
    label,
    alignText = "center",
}) => {
    return (
        <Container isActive={isActive} isVisited={isVisited}>
            <Circle isActive={isActive} isVisited={isVisited}>
                {isVisited ? <SWReactIcons iconName="checked" size="xs" /> : step + 1}
            </Circle>
            <Text alignText={alignText}>
                <WithContext>{({ translate }) => translate(label)}</WithContext>
            </Text>
        </Container>
    );
};
