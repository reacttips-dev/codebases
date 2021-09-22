import { SWReactIcons } from "@similarweb/icons";
import { Button } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { AssetsService } from "services/AssetsService";
import styled, { createGlobalStyle } from "styled-components";

export const Global = createGlobalStyle`
  .ReactModalPortal--trial {
    .ReactModal__Overlay {
      height: calc(100% - 64px) !important;
      top: 64px !important;
      @media (max-width: 1366px) {
        height: calc(100% - 56px) !important;
        top: 56px !important;
      }
    }
  }
`;

export const TrialWidgetModalHeader = styled.div`
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: flex-end;
    padding: 16px 25px 0;
    height: 160px;
    margin-top: -16px;
    background: url(${AssetsService.assetUrl("/images/trial-modal/header-bg.svg")}) top no-repeat;
    &::after {
        opacity: 0.43;
        position: absolute;
        width: 100%;
        height: 25px;
        bottom: 0;
        left: 0;
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.74));
        content: "";
    }
`;

export const TrialWidgetModalTitle = styled.div`
    margin-bottom: 25px;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    line-height: 1.33;
`;

export const TrialWidgetModalSubtitle = styled.div`
    display: block;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 2.4;
    letter-spacing: 1.3px;
    text-transform: uppercase;
`;

export const TrialWidgetModalImage = styled.img`
    flex-shrink: 0;
    max-width: 112px;
    height: auto;
`;

export const TrialWidgetModalContent = styled.div`
    padding: 20px 25px 32px;
    font-size: 14px;
    color: #2a3e52;
    line-height: 1.57;
`;

export const TrialWidgetModalList = styled.ul`
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
`;

export const TrialWidgetModalListItem = styled.li`
    margin-top: 2px;
    line-height: 1.72;
    &:first-of-type {
        margin-top: 0;
    }
    path {
        fill: #4fbf40;
    }
`;

export const TrialWidgetModalListIcon = styled(SWReactIcons)`
    display: inline-block;
    width: 12px;
    height: auto;
    margin-right: 14px;
`;

export const TrialWidgetModalButton = styled(Button)`
    display: block;
    min-width: 150px;
    margin: 32px auto 0;
`;
