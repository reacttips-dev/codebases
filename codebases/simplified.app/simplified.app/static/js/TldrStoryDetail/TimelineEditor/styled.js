/**
 * Styled components specific to TimelineEditor
 */

import { Rnd } from "react-rnd";
import styled from "styled-components";
import {
  bottomBarAndTitlebarHeight,
  bottomBarAndTitlebarHeightMobile,
  DURATION_GUTTER_WIDTH,
  grey,
  lightInactive,
  md,
  primary,
  primaryHover,
  secondaryColor,
  studioFooterColor,
} from "../../_components/styled/variable";

export const StyledTimelinePanelWrapper = styled.div`
  .title-bar {
    padding: 0 32px;
    width: 100%;
    height: ${bottomBarAndTitlebarHeight};
    display: flex;
    align-items: center;
    background-color: ${secondaryColor};
    cursor: pointer;

    .left-actions {
      flex: 1 1 0%;
    }

    .right-actions {
      flex: 1 1 0%;
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: ${md}) {
      padding: 0 24px;
      height: ${bottomBarAndTitlebarHeightMobile};
    }
  }
`;

export const StyledTimelineContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: ${studioFooterColor};
  display: flex;
  min-height: 100%;
  flex-direction: column;
  overflow-x: auto;

  & > div {
    width: fit-content;
    min-width: 100%;
  }
`;

export const StyledRuler = styled.div`
  min-width: 100%;
  color: ${grey};
  display: flex;
  height: 20px;
  margin-bottom: 4px;

  .big-mark {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 12px;
    transform: translate(50%, 30%);
  }

  .small-mark {
    flex: 1 1 0%;
    align-self: flex-end;
    border-right: 1px solid ${grey};
    height: 3px;
  }
  .small-mark:last-child {
    opacity: 0;
  }
`;

export const StyledSeeker = styled(Rnd)`
  height: 100%;
  padding-top: 10px;
  cursor: e-resize !important;
  z-index: 55;
  transition: transform 0.1s;

  .seeker {
    background-color: white;
    color: white;
    height: 100%;
    width: 2px;
    svg {
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(calc(-50% + 1px));
    }
  }
`;

export const StyledArtboardBlock = styled.div`
  height: 100px;
  padding: 0 ${DURATION_GUTTER_WIDTH}px;
  flex-shrink: 0;

  & > div {
    cursor: pointer;
    height: 100%;
    width: 100%;
    background-color: ${secondaryColor};
    border-radius: 8px;
    border: 2px solid ${(props) => (props.isActive ? primary : "transparent")};
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const StyledAddBlock = styled.div`
  border: 1px dashed ${lightInactive};
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  color: ${lightInactive};
  align-self: stretch;
  padding: 16px;
`;

export const StyledSoundAddBlock = styled(StyledAddBlock)`
  justify-content: flex-start;
`;

export const StyledAudioVerticalResizeHandler = styled.div`
  color: ${grey};
  height: 100%;
  align-items: center;
  display: flex;
`;

export const StyledSoundBlock = styled(Rnd)`
  height: 48px !important;
  padding: 0 ${DURATION_GUTTER_WIDTH}px;

  .block {
    position: relative;
    background-color: ${secondaryColor};
    padding: 6px 25px;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    color: ${lightInactive};
    display: flex;
    align-items: center;

    .music-icon {
      margin-right: 16px;
    }

    .title {
      flex-grow: 1;
      overflow: hidden;
      white-space: nowrap;

      div {
        &:not(:hover) {
          text-overflow: ellipsis;
          overflow: hidden;
        }

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

    .action {
    }
  }
`;

// Playback related styles
export const StyledPlaybackActionButton = styled.button`
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: 0;
  height: 16px;
  width: 16px;
  cursor: pointer;
  outline: none;
  display: flex;
  flex-direction: column;
  transition: color 0.3s;
  color: ${grey};
  background: none;

  svg {
    width: 100% !important;
    height: 100% !important;
  }

  :focus,
  :hover {
    outline: none;
    color: ${primaryHover};
  }
`;

export const StyledPlayButton = styled(StyledPlaybackActionButton)`
  height: 30px;
  width: 30px;
  color: ${primary};

  :focus,
  :hover {
    color: ${primaryHover};
  }
`;

export const StyledPlaybackWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
