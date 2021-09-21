import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { SM_SCREEN_MAX } from 'modules/Styleguide';

const CloseButton = styled.button`
  height: 100%;
  width: 100%;
  padding: 0;
  &:hover g {
    fill: #7f8287;
    stroke: #7f8287;
  }
`;

const CloseButtonWrapper = styled.div`
  margin: 16px;
  width: 18px;
  height: 18px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
`;

const fadeIn = keyframes`
  0%   { opacity: 0;}
  100% { opacity: 1 }
`;

const OverlayContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.96);
  z-index: 21;
  animation: ${fadeIn} 0.5s;
  border-radius: 6px;
`;

const ContentContainerCss = css`
  padding: 25px 18px;
  @media screen and (min-width: ${SM_SCREEN_MAX}px) {
    padding: 32px 40px;
  }
`;

const DialogCss = css`
  .modal-content {
    border-radius: 10px;
    margin: 0;
    border-width: 0;
  }
`;

const FullScreenModalDialog = css`
  @media (max-width: 600px) {
    height: 100vh;
    height: -webkit-fill-available;
    max-width: 100%;
    width: 100%;
    background-color: #fff;
    .modal-content {
      height: 100vh;
      height: -webkit-fill-available;
      box-shadow: none;
      margin: 0;
      border: 0;
      border-radius: 0;
    }
    .closeButtonWrapper {
      margin: 0;
      padding: 0 24px;
      width: 100%;
      height: 64px;
      box-shadow: 0 0.5px 0 rgba(0, 0, 0, 0.25);
      position: relative;
    }
    .closeButton {
      width: 18px;
      g {
        fill: #5f6368;
        stroke: #5f6368;
      }
    }
    .renderContent {
      padding: 24px;
    }
  }
`;

export {
  ContentContainerCss,
  CloseButton,
  CloseButtonWrapper,
  OverlayContainer,
  DialogCss,
  FullScreenModalDialog,
};
