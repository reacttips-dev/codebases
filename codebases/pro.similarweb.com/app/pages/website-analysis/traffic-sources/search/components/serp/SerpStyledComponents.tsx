import React from "react";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, getBrightnessHEX } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { setFont } from "@similarweb/styles/src/mixins";

const SERP_ICON_SIZE = 24;
const SERP_ICON_OVERLAP = 14;

const SerpIcon = styled.div<{ background: string; onClick?: Function }>`
    width: ${SERP_ICON_SIZE}px;
    height: ${SERP_ICON_SIZE}px;
    border-radius: ${SERP_ICON_SIZE}px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: ${({ background }) => background};
    cursor: ${({ onClick }) => (typeof onClick === "function" ? "pointer" : "initial")};
    ${SWReactIcons} {
        display: flex;
        align-items: center;
        svg {
            path{ fill: ${({ background }) =>
                getBrightnessHEX(background) === "dark" ? "#ffffff" : colorsPalettes.carbon[400]}
        }
    }
`;

export const SerpIconComponent: React.FC<{
    background?: string;
    iconName: string;
    onClick?: (serp) => void;
}> = (props) => {
    return (
        <SerpIcon background={props.background} onClick={props.onClick}>
            <SWReactIcons iconName={props.iconName} size="xs" />
        </SerpIcon>
    );
};
SerpIconComponent.defaultProps = {
    background: colorsPalettes.carbon[0],
};

const createStackedSerpIconStyle = (count) => {
    let res = ``;
    for (let i = 0; i <= count; i += 1) {
        res += `
        &:nth-child(${i + 1}) {
          transform: translateX(${-1 * i * SERP_ICON_OVERLAP}px);
          z-index: ${SERP_ICON_SIZE - SERP_ICON_OVERLAP - i};
          svg {
            opacity: ${i === 0 ? 1 : 0};
          }
         }
      `;
    }
    return res;
};

const SerpIconsStackedContainer: any = styled.div<any>`
    position: relative;
    z-index: 8;
    display: flex;
    align-items: center;
    width: ${({ numOfChildes }) =>
        SERP_ICON_SIZE + (numOfChildes - 1) * (SERP_ICON_SIZE - SERP_ICON_OVERLAP)}px;
    margin-right: 4px;
    ${SerpIcon} {
        position: relative;
        flex-shrink: 0;
        ${createStackedSerpIconStyle(5)}
    }
`;

const SerpIconsGroupedContainer = styled.div`
    display: flex;
    align-items: center;
    ${SerpIcon} {
        margin-right: 4px;
    }
`;

const SerpIconsComponentWithTextContainer = styled(FlexRow)`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon["500"] })};
    ${SerpIcon} {
        margin-right: 4px;
    }
`;

export const SerpIconsStacked: React.FC<{ numOfChildes?: number }> = (props) => {
    const numOfChildes = props.numOfChildes ?? React.Children.toArray(props.children).length;
    return (
        <SerpIconsStackedContainer numOfChildes={numOfChildes}>
            {props.children}
        </SerpIconsStackedContainer>
    );
};

export const SerpIconsGrouped: React.FC = (props) => {
    return <SerpIconsGroupedContainer>{props.children}</SerpIconsGroupedContainer>;
};

export const SerpIconsComponentWithText: React.FC<{ text: string }> = (props) => {
    return (
        <SerpIconsComponentWithTextContainer alignItems="center">
            {props.children}
            {props.text}
        </SerpIconsComponentWithTextContainer>
    );
};
