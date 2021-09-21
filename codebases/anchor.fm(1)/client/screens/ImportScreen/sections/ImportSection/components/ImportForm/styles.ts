import styled from '@emotion/styled';
import { css } from 'emotion';
import {
  BREAKPOINT_SMALL,
  COLOR_DARK_PURPLE,
} from '../../../../../../components/MarketingPagesShared/styles';

export const mutedTextColor = 'rgba(255, 255, 255, 0.6)';
const solidGrayBackground = 'rgb(196, 198, 200)';
const mutedGrayBackground = 'rgba(196, 198, 200, 0.2)';

export const typeaheadClassName = css`
  flex: 1;

  .rbt-input-wrapper {
    margin-right: 35px;
  }

  .rbt-input {
    height: auto;
    border: 0;
    padding: 15px 35px;
    margin: 0;
    background: transparent;
    font-size: 2.4rem;
    border: 2px solid #9f6fff;
    border-radius: 80px;
  }

  .rbt-input-hint {
    // This color is hardcoded into the library code and added in the style
    // props, and there's no hook for adding a custom style :/
    color: ${mutedTextColor} !important;
  }

  .dropdown-menu {
    background: ${COLOR_DARK_PURPLE};
    box-shadow: none;
    border: 0;
    padding: 0;
    margin: 15px 20px;
    max-height: 600px !important;
    right: 0;
    font-size: 1.6rem;

    ::-webkit-scrollbar {
      width: 5px;
    }
    ::-webkit-scrollbar-track {
      background: ${mutedGrayBackground};
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: ${solidGrayBackground};
    }

    .dropdown-item {
      font-size: 2.4rem;
      padding: 15px;
      margin-right: 5px;
      border-radius: 4px;
      color: ${mutedTextColor};

      &.active {
        background: ${mutedGrayBackground};
      }

      &:hover:not(.disabled) {
        background: #9f6fff;
      }

      &.disabled {
        &,
        &:hover {
          cursor: default;
          color: ${mutedTextColor};
        }
      }
    }
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    .rbt-input {
      padding: 12px 25px;
      font-size: 1.6rem;
    }
    .rbt-input-wrapper {
      margin-right: 25px;
    }

    .dropdown-menu {
      max-height: 300px !important;
      margin: 10px 0 0;

      .dropdown-item {
        font-size: 1.6rem;
        padding: 15px;
      }
    }
  }
`;

export const infoButtonClassName = css`
  box-shadow: none;
  display: block;
  font-size: 1.4rem;
  line-height: 1.3;
  &:before {
    box-shadow: none;
  }
`;

export const caretIconClassName = css`
  margin-left: 5px;
`;

export const inputFieldClassName = css`
  position: relative;
  z-index: 1;
  width: 100%;
  color: white;
  &::placeholder {
    color: ${mutedTextColor};
  }
`;

export const PopupAnchor = styled.a`
  line-height: 1;
  &,
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

export const SpinnerContainer = styled.div`
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  position: relative;
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  right: 30px;
  font-size: 0;
  pointer-events: none;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    right: 18px;
  }
`;

export const EpisodeCount = styled.h5`
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0;
`;

export const EpisodeCountText = styled.span`
  display: inline-block;
  margin-right: 5px;
`;

export const DesktopEpisodeCount = styled.div`
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    display: none;
  }
`;

export const MobileEpisodeCount = styled.div`
  @media (min-width: ${BREAKPOINT_SMALL}px) {
    display: none;
  }
`;

export const SelectedPodcast = styled.div`
  display: flex;
  border-radius: 6px;
  font-size: 1.4rem;
  text-align: left;
  padding: 30px;
  justify-content: center;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 30px 0;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const SelectedPodcastName = styled.h3`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 2.4rem;
  margin: 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    display: block;
    margin: 24px 0 0;
  }
`;

export const SelectedPodcastAuthor = styled.h4`
  margin: 10px 0;
  font-size: 1.4rem;
`;

export const SelectedPodcastInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
`;

export const SelectedPodcastImage = styled.img`
  flex: 0 0 168px;
  width: 168px;
  height: 168px;
  border-radius: 6px;

  @media (min-width: ${BREAKPOINT_SMALL}px) {
    margin-right: 24px;
  }
`;

export const Message = styled.p`
  color: white;
  font-size: 1.6rem;
  margin-top: 32px;
`;

export const SelectedPodcastDescription = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: inherit;
  line-height: 1.4;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 16px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    align-items: center;
    margin: 24px 0;
  }
`;
