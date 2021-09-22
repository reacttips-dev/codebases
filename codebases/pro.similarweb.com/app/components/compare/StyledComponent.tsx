import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import styled from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { Close } from "@similarweb/ui-components/dist/simple-legend";

export const ClosableItemContainer = styled.li`
    min-width: 112px;
    position: relative;
    display: flex;
    align-items: center;
    text-align: center;
    cursor: default;
    opacity: ${({ itemDisabled }: any) => (itemDisabled ? 0.5 : null)};
    margin-right: 16px;
    &:hover {
        ${Close} {
            visibility: visible;
        }
    }
`;
ClosableItemContainer.displayName = "ClosableItemContainer";

export const ClosableItemText = styled.a`
    cursor: pointer;
    ${setFont({ $size: 18, $family: "Roboto", $color: "#0e1e3e", $weight: 400 })};
    letter-spacing: 0.8px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &:hover {
        color: #4e8cf9;
    }
    &:nth-child(n + 2) {
        margin-left: 11px;
    }
`;
ClosableItemText.displayName = "ClosableItemText";

export const ClosableItemIconContainer = styled.div`
    flex-shrink: 0;
    justify-content: center;
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
    box-shadow: 0 2px 4px 0 rgba(202, 202, 202, 0.2);
    border: solid 1px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    text-align: center;
    cursor: default;
`;
ClosableItemIconContainer.displayName = "ClosableItemIconContainer";

export const ClosableItemColorMarker = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: solid 2px ${colorsPalettes.carbon["0"]};
    position: absolute;
    bottom: -3px;
    right: -4px;
    display: inline-block;
`;
ClosableItemColorMarker.displayName = "ClosableItemColorMarker";

export const AppClosableImageItem = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 6px;
`;
AppClosableImageItem.displayName = "AppClosableImageItem";

export const AppClosableCloseIcon = styled(Close)`
    left: 18px !important;
`;
AppClosableCloseIcon.displayName = "AppClosableCloseIcon";

const BaseOverlay = styled.div`
    background: rgba(42, 62, 82, 0.8);
    position: fixed;
    z-index: 1020;
`;

BaseOverlay.displayName = "BaseOverlay";

export const OverlayMain = styled(BaseOverlay)`
    width: calc(100% - 300px);
    height: calc(100vh);
    top: 60px;
    right: 0;
    bottom: 0;
    left: 300px;
    background: linear-gradient(rgba(42, 62, 82, 0.96), rgba(42, 62, 82, 0.8) 4%);
`;

OverlayMain.displayName = "OverlayMain";

export const OverlaySidenav = styled(BaseOverlay)`
    width: 300px;
    height: 100%;
    top: 0;
    left: 0;
`;

OverlaySidenav.displayName = "OverlaySidenav";

export const FaviconButtonStyle = styled.div`
    margin: 0 8px 0 4px;
`;

// Loading component styles:
export const TopSection = styled.div`
    height: 48px;
    padding: 7px 16px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    .SWReactIcons {
        width: 18px;
        height: 18px;
    }
`;

export const TopSectionText = styled.div`
    padding: 0 15px;
    height: 40px;
    box-sizing: border-box;
    position: relative;
    margin-left: 4px;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 2.8;
    max-width: 84%;
    color: ${colorsPalettes.carbon[200]};
`;

export const Separator = styled.div`
    height: 1px;
    width: calc(100% - 14px);
    border-bottom: 1px solid ${colorsPalettes.blue[400]};
    display: inline-block;
    margin-left: 7px;
    transform: translateY(-6px);
`;

export const TabSection = styled.div`
    display: flex;
    padding: 0 16px 8px 0;
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
`;

export const TabHeader = styled.div`
    color: ${colorsPalettes.carbon[200]};
    font-size: 14px;
    margin-right: 40px;
    font-weight: 500;
    display: flex;
    align-items: center;
    .SWReactIcons {
        padding-left: 15px;
        margin-right: 14px;
        svg {
            width: 16px;
            height: 16px;
        }
    }
`;

export const LoaderSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
