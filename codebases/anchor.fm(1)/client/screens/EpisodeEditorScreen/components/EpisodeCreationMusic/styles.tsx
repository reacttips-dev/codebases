import { css } from '@emotion/core';
import styled from '@emotion/styled';

export const EmptyContentContainer = styled.div`
  display: flex;
  height: 100%;
  background-color: #ebeced;
  border-radius: 6px;
  flex: 1;
  margin: 24px;
`;

export const MusicToolContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.25);
  overflow: scroll;
`;

export const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SearchBar = styled.div`
  position: relative;
  margin-top: 30px;
  padding: 0 24px;
`;

export const Header = styled.div`
  padding-top: 24px;
  text-align: center;
  max-width: 330px;
  margin: 0 auto;
`;

export const SearchTitle = styled.h3`
  margin-top: 8px;
  margin-bottom: 8px;
  padding-bottom: 0;
  font-size: 1.8rem;
`;

export const SearchBarIconContainer = styled.div`
  height: 14px;
  width: 14px;
  display: inline-flex;
  margin-top: 14px;
  margin-left: 16px;
  position: absolute;
`;

export const SearchInput = styled.input`
  background: #ffffff;
  resize: none;
  height: 40px;
  width: 100%;
  padding: 0 0 0 37px;
  border: 0.75px solid #c9cbcd;
  border-radius: 20px;
  outline: none;
  line-height: 40px;
  color: #7f8287;
`;

export const SpinnerContainer = styled.div`
  margin: 0 auto;
  display: grid;
  place-content: center;
`;

export const musicSegmentBackground = (coverArt: string) => css`
  // applies album art as PlayButton background
  // this !important rule turns the CircleButton into a square
  border-radius: 0 !important;
  margin: 0 auto;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.75)
    ),
    url(${coverArt});
  background-size: cover;
  &:hover {
    background-size: cover;
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.25)
      ),
      url(${coverArt});
  }
`;

export const SearchResultPreviewUnavailable = styled.div`
  &:hover > div {
    display: flex !important;
  }
`;

export const StagingAudioPreviewUnavailable = styled.div`
  margin-left: 16px;
  &:hover > div {
    display: flex !important;
  }
`;

export const ButtonWrapper = styled.button<{ backgroundColor: string }>`
  height: 50px;
  width: 50px;
  display: grid;
  place-content: center;
  border-radius: 100%;
  flex: 0 0 50px;
  padding: 14px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const DollarIconWrapper = styled.div`
  height: 18px;
  width: 18px;
  background-color: #c9cbcd;
  border-radius: 50%;
  svg {
    width: 42%;
    padding-top: 4px;
    padding-left: 1px;
  }
`;
