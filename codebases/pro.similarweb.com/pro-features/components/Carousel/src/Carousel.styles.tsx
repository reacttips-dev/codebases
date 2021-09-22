import { rgba, colorsPalettes } from "@similarweb/styles";
import styled, { css } from "styled-components";

interface ICarouselContainerWrapper {
    rightVisible: boolean;
    leftVisible: boolean;
    forceHover?: boolean;
}

interface ICarouselButton {
    isTable?: boolean;
}

const carouselButtonEdge = 48;

export const CarouselButton = styled.button<ICarouselButton>`
    width: ${carouselButtonEdge}px;
    height: ${carouselButtonEdge}px;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.carbon[200], 0.5)};
    border-radius: 50%;
    outline: 0px;
    border: none;
    ${({ isTable }) => {
        return isTable
            ? css`
                  position: fixed;
                  top: auto;
                  transform: translateY(-140%);
              `
            : css`
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
              `;
    }};
    transition: opacity ease 500ms, box-shadow ease 300ms;
    &:hover {
        box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.carbon[400], 0.5)};
    }
    &:active {
        box-shadow: 0 1px 2px 0 ${rgba(colorsPalettes.carbon[400], 0.5)};
    }
    opacity: 0;
    cursor: default;
`;

export const CarouselButtonLeft = styled(CarouselButton)`
    left: -${carouselButtonEdge / 2}px;
`;

export const CarouselButtonRight = styled(CarouselButton)`
    right: -${carouselButtonEdge / 2}px;
`;

export const CarouselButtonIconContainer = styled.div`
    width: 24px;
    height: 24px;
    margin: auto;
`;

export const CarouselContainerWrapper = styled.div<ICarouselContainerWrapper>`
    position: relative;
    width: auto;
    height: auto;
    &:hover {
        ${CarouselButtonRight} {
            opacity: ${(props) => (props.rightVisible ? 1 : 0)};
            cursor: ${(props) => (props.rightVisible ? "pointer" : "default")};
        }
        ${CarouselButtonLeft} {
            opacity: ${(props) => (props.leftVisible ? 1 : 0)};
            cursor: ${(props) => (props.leftVisible ? "pointer" : "default")};
        }
    }
    ${CarouselButtonRight} {
        opacity: ${(props) => (props.forceHover && props.rightVisible ? 1 : 0)};
    }
    ${CarouselButtonLeft} {
        opacity: ${(props) => (props.forceHover && props.leftVisible ? 1 : 0)};
    }
`;
