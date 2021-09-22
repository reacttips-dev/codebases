import styled, { css, Keyframes, keyframes } from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { IRightBarProps } from "pages/workspace/common components/RightBar/src/RightBar";
import { TRIAL_BANNER_HEIGHT } from "components/React/TrialBanner/TrialBanner";
import { BoxContainer } from "pages/app performance/src/page/single/usage section/styledComponents";
import { SidebarGraphWrapper } from "pages/workspace/common components/SidebarGraph/StyledComponents";
import { TopGeoContainer } from "pages/workspace/common/WebsiteExpandData/Tabs/COPY_AnalysisTab";
import {
    AnalysisTileWrapper,
    TabWrapper,
} from "pages/workspace/common/WebsiteExpandData/Tabs/StyledComponents";
import { StyledTabContainer as StyledTabContainerFeed } from "pages/workspace/sales/sub-modules/feed/components/styles";
import { StyledFeedsGroup } from "pages/workspace/sales/sub-modules/feed/components/FeedsGroup/styles";

// Taken from node_modules/@similarweb/styles/src/z-index.scss:26
const CURRENT_MAX_Z_INDEX = 1010;

export const slideEnteringRight = keyframes`
    from {
        transform:translateX(100%);
    }
    to {
        transform:translateX(0);
    }
`;

export const slideEnteringLeft = keyframes`
    from {
        transform:translateX(-100%);
    }
    to {
        transform:translateX(0);
    }
`;

export const slideLeavingRight = keyframes`
    0% {
        transform: translateX(0);
    }
    99% {
        max-height: initial;
    }
    100% {
        transform: translateX(100%);
        max-height: 0;
        overflow: hidden;
    }
`;

export const slideLeavingLeft = keyframes`
    0% {
        transform: translateX(0);
    }
    99% {
        max-height: initial;
    } 
    100% {
        transform: translateX(-100%);
        max-height: 0;
        overflow: hidden;
    }
`;

interface ST {
    curr: boolean;
    prev: boolean;
    animation: Keyframes | string;
}

export const StyledTabContainer = styled.div<ST>`
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    left: 0;
    z-index: 4;
    ${({ curr, prev }) =>
        !curr &&
        !prev &&
        css`
            transform: translateX(100%);
            max-height: 0;
        `};
    ${({ animation }) =>
        !!animation &&
        css`
            animation: ${animation} 0.9s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        `};
`;

export const StyledTitle = styled.div`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    font-size: 24px;
    color: ${colorsPalettes.carbon["0"]};
    padding: 22px 12px 22px 24px;
    font-weight: 500;
    line-height: 0.8;
    letter-spacing: normal;
`;

export const StyledContent = styled.div`
    display: block;
    flex-grow: 1;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    ${SidebarGraphWrapper} {
        display: flex;
        width: 96%;
        justify-content: center;
        &.topCountries {
            width: 100%;
        }
    }
    ${TopGeoContainer} {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    ${BoxContainer} {
        justify-content: space-between;
        &.topCountries {
            border: none;
        }
    }
    ${AnalysisTileWrapper} {
        width: 96%;
        margin: 0;
    }
    ${TabWrapper} {
        margin-bottom: 10px;
        padding-top: 20px;
    }
    ${StyledTabContainerFeed} {
        padding-bottom: 10px;
    }
    ${StyledFeedsGroup} {
        padding-top: 20px;
    }
`;

export const StyledHeader = styled.div`
    background-color: ${colorsPalettes.carbon["400"]};
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;

export const StyledRightBar = styled.div<Partial<IRightBarProps>>`
    box-shadow: 0 4px 21px 0 ${rgba(colorsPalettes.black["0"], 0.35)};
    height: 100%;
    display: flex;
    flex-direction: column;
    transform: translateX(${(props) => (props.isOpen ? "0" : "100%")});
    transition: transform 575ms cubic-bezier(0.32, 0.61, 0.65, 0.64);
    background-color: ${colorsPalettes.bluegrey["100"]};
    &.FixedBar--trial {
        height: calc(100vh - ${TRIAL_BANNER_HEIGHT}px);
        top: ${TRIAL_BANNER_HEIGHT}px;
    }
`;

export const StyledCloseButton = styled.div`
    display: flex;
    align-items: center;
    color: ${colorsPalettes.carbon["0"]};
    && svg,
    &&:hover svg {
        path {
            fill: ${colorsPalettes.carbon["0"]};
        }
    }
`;

export const StyledScrollWrapperRightBar = styled.div`
    flex-grow: 1;
    overflow-y: auto;
`;

export const StyledContainerWrapperRightBar = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const StyledRightBarFixedContainer = styled.div<{ isRightBarOpen: boolean }>`
    height: 100vh;
    width: 600px;
    right: 0;
    top: 0;
    pointer-events: ${({ isRightBarOpen }) => (isRightBarOpen ? "all" : "none")};
    position: fixed;
    z-index: ${CURRENT_MAX_Z_INDEX + 1};
`;

export const StyledOverlay = styled.div`
    animation: overlay-appear 200ms ease-in-out forwards;
    background-color: ${rgba(colorsPalettes.midnight["300"], 0.7)};
    height: 100vh;
    left: 0;
    opacity: 0;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: ${CURRENT_MAX_Z_INDEX};

    @keyframes overlay-appear {
        to {
            opacity: 1;
        }
    }
`;

export const StyledOverlayContainer = styled.div`
    position: absolute;
`;

export const StyledButtonIcon = styled(IconButton)`
    && {
        background-color: transparent;
    }

    &:hover {
        .SWReactIcons svg path {
            fill: #fff;
        }
        background-color: rgba(170, 178, 186, 0.2);
    }

    .SWReactIcons svg {
        width: 24px;
        height: 24px;
    }
    .SWReactIcons svg path {
        fill: #fff;
    }
`;

export const StyledHeaderRight = styled.div`
    display: flex;
    flex-shrink: 0;
`;

export const StyledHeaderLeft = styled.div`
    display: flex;
`;
