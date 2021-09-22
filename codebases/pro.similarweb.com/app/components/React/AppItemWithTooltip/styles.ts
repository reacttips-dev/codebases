import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";

export const CarouselContainer = styled.div`
    overflow: hidden;
    display: flex;
    flex-direction: row;
`;

export const AppIconImage = styled.img`
    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 8px;
`;

export const AppIconLink = styled.a`
    width: 36px;
    height: 36px;
    min-width: 36px;
    display: flex;
    box-sizing: border-box;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border: 1px solid ${colorsPalettes.carbon[100]};
    border-radius: 8px;
`;

export const CarouselContainerInner = styled.div`
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    & > * {
        scroll-snap-align: center;
        margin-right: 4px;
    }

    & > ${AppIconLink}:last-of-type {
        margin-right: 0;
    }
`;

export const ArrowButtons = styled(IconButton)`
    display: inline-block;
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
`;

export const LeftButton = styled(ArrowButtons)`
    margin-right: 16px;
`;

export const RightButton = styled(ArrowButtons)`
    margin-left: 16px;
`;
