import * as React from "react";
import styled from "styled-components";
import transition from "styled-transition-group";
import { IProModalCustomStyles } from "../ProModal";

export const proModalStyles: IProModalCustomStyles = {
    overlay: {
        zIndex: 2079,
    },
    content: {
        width: "550px",
        padding: 0,
        border: 0,
    },
};

export const UnlockModalWrap = styled.div`
    padding: 30px;
    div:last-of-type {
        justify-content: center;
    }
`;
UnlockModalWrap.displayName = "UnlockModalWrap";

export const UnlockModalImage = styled.div`
    position: relative;
    height: 300px;
    margin: -30px -30px 0;
    background-color: #3f70c7;
    border-radius: 6px 6px 0 0;
    img {
        max-width: 100%;
        border-radius: 6px 6px 0 0;
    }
    &:after {
        display: block;
        position: relative;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, #2a3e52 90%);
        height: 120px;
        top: 180px;
        content: "";
    }
`;
UnlockModalImage.displayName = "UnlockModalImage";

// noinspection CssInvalidPseudoSelector
export const Fade = transition.div.attrs(() => ({
    timeout: 500,
    unmountOnExit: true,
}))`
  transition: opacity 300ms ease-in;
  &:enter {
    opacity: 0.01;
  }
  &:enter-active {
    opacity: 1;
  }
  &:exit {
    opacity: 1;
  }
  &:exit-active {
    opacity: 0.01;
  }
`;
Fade.displayName = "Fade";

export const FadeItemWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    visibility: ${({ hidden }) => (hidden ? "hidden" : "visible")} ${UnlockModalImage} & {
        overflow: hidden;
        display: flex;
        align-items: flex-end;
        width: 100%;
        height: 100%;
    }
`;
FadeItemWrapper.displayName = "FadeItemWrapper";

export const UnlockModalHeader = styled.div`
    position: absolute;
    display: flex;
    align-items: stretch;
    right: 30px;
    bottom: 30px;
    ${UnlockModalImage} + & {
        width: calc(100% - ${30 * 2}px);
        top: 250px;
        right: auto;
        bottom: auto;
    }
    .Button {
        z-index: 1;
        flex-shrink: 0;
    }
`;
UnlockModalHeader.displayName = "UnlockModalHeader";

export const UnlockModalTitle = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    min-height: 100%;
    max-width: 100%;
    left: 0;
    bottom: 0;
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    visibility: ${({ hidden }) => (hidden ? "hidden" : "visible")} .SWReactIcons {
        flex-shrink: 0;
        margin-left: 8px;
        path {
            fill: #b4b8c6;
            fill-opacity: 1;
        }
    }
`;
UnlockModalTitle.displayName = "UnlockModalTitle";

export const UnlockModalTitleWrap = styled.div`
    position: relative;
    flex-grow: 1;
    margin-right: 8px;
`;
UnlockModalTitleWrap.displayName = "UnlockModalTitleWrap";

export const UnlockModalContent = styled.div`
  margin: 0 0 80px;
  height: 80px;
  position: relative;
  ${UnlockModalImage} + ${UnlockModalHeader} + & {
    margin: 24px 0;
  }
`;
UnlockModalContent.displayName = "UnlockModalContent";

export const UnlockModalContentTitle = styled.div`
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
`;
UnlockModalContentTitle.displayName = "UnlockModalContentTitle";

export const UnlockModalContentSubtitle = styled.div`
    font-size: 14px;
    color: rgba(42, 62, 82, 0.8);
`;
UnlockModalContentSubtitle.displayName = "UnlockModalContentSubtitle";
