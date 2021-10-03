import { ButtonGroup } from "react-bootstrap";
import styled from "styled-components";
import {
  sideBarWidth,
  greyDark,
  grey,
  secondaryColor,
  bottomPanelHeight,
  primary,
  blackAlpha12,
  studioFooterColor,
  lightInactive,
  lightGrey,
  md,
  greyBlack,
  bottomBarAndTitlebarHeight,
  bottomBarAndTitlebarHeightMobile,
} from "../variable";

export const StyledArtBoardFooterWithBottomPanel = styled.div`
  width: calc(100vw - ${sideBarWidth});
  position: sticky;
  bottom: 0;
  transition: width 0.5s, margin-left 0.5s;

  @media screen and (max-width: ${md}) {
    width: calc(100vw);
  }
`;

export const StyledArtBoardFooter = styled.div`
  display: flex;
  flex-direction: row;
  background: ${greyDark};
  height: ${bottomBarAndTitlebarHeight};
  width: 100%;
  cursor: pointer;
  ${"" /* will-change: width, margin-left, margin-right; */}
  padding: 0rem 20px;
  justify-content: center;
  transition: width 0.5s, margin-left 0.5s, margin-right 0.5s;

  ${
    "" /* ${(props) =>
    props.isSliderOpen &&
    `
  width: calc(100vw - ${sideBarWidth} - ${sidebarItemDetailSliderWidth});
  margin-left: ${sidebarItemDetailSliderWidth};
  `}

  ${(props) =>
    props.isActionPanelOpen &&
    `
  width: calc(100vw - ${sideBarWidth} - ${advancedPanelSliderWidth});
  margin-right: ${advancedPanelSliderWidth};
  `}

  ${(props) =>
    props.isSliderOpen &&
    props.isActionPanelOpen &&
    `
  width: calc(100vw - ${sideBarWidth} - ${sidebarItemDetailSliderWidth} - ${advancedPanelSliderWidth});
  margin-left: ${sidebarItemDetailSliderWidth};
  margin-right: ${advancedPanelSliderWidth};
  `} */
  }

  @media (max-width: ${md}) {
    height: 60px;
    padding: 0rem 24px;
    height: ${bottomBarAndTitlebarHeightMobile};
  }
`;

export const StyledFooterButtonGroup = styled(ButtonGroup)``;

export const StyledVerticalSeparater = styled.div`
  width: 2px;
  height: 24px;
  align-self: center;
  margin: ${(props) => (props.margin ? props.margin : "0px")};
  background-color: rgba(255, 255, 255, 0.12);
`;

export const StyledEditorBottomPanel = styled.div`
  background-color: ${studioFooterColor};
  height: ${bottomPanelHeight};
  transition: 1s;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title-bar {
    padding: 0 20px;
    width: 100%;
    height: ${bottomBarAndTitlebarHeight};
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${secondaryColor};
    cursor: pointer;

    @media (max-width: ${md}) {
      height: ${bottomBarAndTitlebarHeightMobile};
      padding: 0 24px;
    }

    .title-display {
      color: ${lightInactive};
      font-size: 16px;
      font-weight: 500;
    }

    .actions {
      display: flex;
    }
  }

  @media (max-width: ${md}) {
    height: 228px;
  }

  .swiper {
    flex-grow: 1;
  }
`;

export const StyledArtBoardPreviewContainer = styled.div`
  background-color: ${secondaryColor};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  /* width: 160px; */
  /* height: 136px; */
  border-radius: 8px;
  align-items: center;
  overflow: hidden;
`;

export const StyledArtboardPreviewDuration = styled.div`
  font-size: 14px;
  font-weight: 400;
  position: absolute;
  right: 8px;
  bottom: 8px;
  background-color: ${greyBlack};
  color: ${lightInactive};
  padding: 4px;
  border-radius: 8px;
`;

export const StyledArtBoardPreviewWrapper = styled.div`
  /* height: 100%; */
  aspect-ratio: 16 / 9;
  height: 136px;
  width: auto;
  display: flex;
  align-items: center;
`;

export const StyledArtBoardPreviewAddAction = styled.div`
  height: 35px;
  width: 35px;
  border-radius: 50%;
  background-color: ${blackAlpha12};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -50px;
`;

export const StyledArtBoardPreviewStaticCanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const StyledArtBoardPreviewTitle = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  color: ${grey};
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100%;

  p {
    margin-bottom: unset !important;
    margin-left: ${(props) =>
      props.location === "preview-container"
        ? "unset"
        : props.location === "rearrange-container"
        ? "5rem"
        : "2.3rem"};
  }

  @media (max-width: 768px) {
    justify-content: center;
    p {
      margin: 0px !important;
    }
  }
`;

export const StyledArtBoardStaticCanvasWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  height: 100%;
  /* opacity: 0.35;

  ${(props) =>
    props.active &&
    `
    opacity: 1;
  `} */
`;

export const StyledArtBoardRearrangeGridContainer = styled.div`
  height: calc(100vh - 61px);
  display: flex;
  flex-direction: column;
  background-color: ${studioFooterColor};

  .title-bar {
    padding: 16px 20px;
    width: 100%;
    height: ${bottomBarAndTitlebarHeight};
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${secondaryColor};
    cursor: pointer;

    @media (max-width: ${md}) {
      padding: 16px 24px !important;
      height: ${bottomBarAndTitlebarHeightMobile};
    }

    .title-display {
      color: ${lightInactive};
      font-size: 16px;
      font-weight: 500;
    }

    .actions {
    }

    .actions-container {
      display: flex;
      flexdirection: row;
      justifycontent: space-between;
    }
  }

  .re-arrange-grid {
    transition: 1s;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(253px, 250px));
    grid-template-rows: repeat(auto-fill, minmax(min-content, 180px));
    grid-gap: 40px 40px;
    padding: 1rem;
    overflow-y: auto;
    justify-content: center;

    @media (max-width: 768px) {
      height: 100%;
      grid-template-columns: repeat(auto-fill, minmax(170px, 170px));
      grid-template-rows: repeat(auto-fill, minmax(170px, 170px));
      grid-gap: 40px 25px;

      .title-bar {
        padding: 20px 24px !important;
      }
    }
  }
`;

export const StyledArtBoardRearrangeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  align-items: center;
  border: 3px solid transparent;

  :hover {
    cursor: move;
    border: 3px solid ${primary};
    box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
  }

  &.active {
    border: 3px solid ${primary};
  }
`;

export const StyledTooltipWithKBDShortcut = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .hotkeys {
    margin-bottom: 4px;
    font-size: 18px;
  }
`;

export const StyledArtBoardEmptyContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.24);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 26px;

    path {
      fill: ${lightInactive};
    }
  }

  :hover {
    cursor: pointer;
  }
`;

export const StyledFullArtboardPreviewWrapper = styled.div`
  ${(props) => `
    width: ${props.width}px;
    height: ${props.height}px;
  `}
`;

export const StyledMusicToolWrapper = styled.div`
  z-index: 60;
  position: absolute;
  width: calc(100vw - ${sideBarWidth});
  background: ${greyDark};
  transition: width 0.5s, margin-left 0.5s;
  background-color: red;
  width: 240px;
`;

export const StyledMinimalMusicToolWrapper = styled.div`
  z-index: 60;
  position: absolute;
  width: calc(100vw - ${sideBarWidth});
  background: ${secondaryColor};
  transition: width 0.5s, margin-left 0.5s;
  width: 240px;
  height: 75px;
  left: ${(props) => (props.isSliderOpen ? "384px" : "24px")};
  /* right: 24px; */
  top: -120px;
  border-radius: 8px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;

  .thumb {
    position: relative;
    margin: 8px;
    width: 60px;
    height: 60px;
    background-color: #161616;
    border-radius: 8px;
    flex-shrink: 0;

    .progress-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 28px;
      height: 28px;
    }

    .play-button {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      padding: 0;
      border: 0;
      background: inherit;
      cursor: pointer;
      outline: none;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background-color: ${(props) =>
        props.playState === "play" ? primary : "#848484"};

      svg {
        width: 12px;
        height: 12px;
        color: #4b4b4b;
      }
    }
  }

  .details {
    margin: 8px 8px 8px 4px;
    flex-grow: 1;
    overflow: hidden;
    cursor: pointer;

    .title {
      color: ${lightGrey};
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;

      &:not(:hover) {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      /* animate on either hover or focus */
      &:hover,
      &:focus {
        animation-name: scroll-text;
        animation-duration: 7s;
        animation-timing-function: linear;
        animation-delay: 0s;
        animation-iteration-count: infinite;
        animation-direction: normal;
      }

      /* define the animation */
      @keyframes scroll-text {
        0% {
          transform: translateX(0%);
        }
        90% {
          transform: translateX(-100%);
        }
        95% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(0%);
        }
      }
    }
  }

  .duration {
    color: ${grey};
    font-size: 12px;
    font-weight: 500;
  }
`;
