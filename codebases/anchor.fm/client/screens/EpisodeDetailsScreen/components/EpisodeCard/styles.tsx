import styled from '@emotion/styled';
import InfoButtonIcon from '../../../../components/InfoButtonIcon';

export const EpisodeCardCopy = styled.p`
  color: #7f8287;
  display: inline;
  font-size: 1.4rem;
`;

export const IconContainer = styled.div`
  display: inline-block;
  margin-right: 6px;
`;

export const StyledInfoButtonIcon = styled(InfoButtonIcon)`
  margin-left: 6px;
  height: 12px;
  width: 12px;
  font-size: 11px;
`;

export const PodcastEpisodeCoverArt = styled.img`
  height: 160px;
  width: 160px;
  display: block;
  margin: 0 auto 44px auto;
  border-radius: 6px;
`;

export const ShareButtonsContainer = styled.div<{
  containsMusicSegments: boolean;
}>`
  display: flex;
  justify-content: space-between;
  width: ${({ containsMusicSegments }) =>
    containsMusicSegments ? `46px` : `240px`};
  margin: 0;
  @media (max-width: 675px) {
    margin-top: 22px;
  }
  @media (max-width: 599px) {
    margin: auto;
  }
`;

export const ShareIconContainer = styled.div`
  position: relative;
  height: 46px;
  width: 46px;
`;

export const CopyLinkContainer = styled(ShareIconContainer)`
  span {
    display: none;
    text-align: center;
    margin-top: 4px;
    font-size: 1rem;
    color: rgb(95, 99, 105);
  }
  &:hover {
    display: flex;
    flex-wrap: wrap;
    span {
      display: inline-block;
    }
  }
`;

export const ShareTextContainer = styled.div<{ isFlexed: boolean }>`
  white-space: nowrap;
  display: ${({ isFlexed }) => (isFlexed ? 'flex' : 'none')};
  justify-content: center;
  margin-top: 4px;
  width: 46px;
`;

export const Container = styled.div`
  background-color: #ffffff;
  max-width: 940px;
  width: 100%;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  @media (min-width: 600px) {
    border-radius: 6px;
    padding: 42px;
  }
`;

export const CoverArtContainer = styled.div`
  width: 100%;
  max-width: 274px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto 24px;
  @media (min-width: 600px) {
    max-width: 200px;
    max-height: 200px;
    height: 100%;
    margin-bottom: 0;
  }
`;

export const CoverArtImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`;

export const PlayCountContainer = styled.div`
  width: 200px;
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  border-radius: 6px;
  border: solid 2px #dfe0e1;
`;

export const EpisodeTitle = styled.h1<{
  titleLength: number;
}>`
  font-weight: bold;
  letter-spacing: normal;
  word-break: break-word;
  margin-bottom: 10px;
  @media (min-width: 1024px) {
    font-weight: ${({ titleLength }) => getFontWeight(titleLength)};
    font-size: ${({ titleLength }) => getFontSizes(titleLength).desktop};
  }
  @media (max-width: 1023px) {
    font-size: ${({ titleLength }) => getFontSizes(titleLength).tablet};
  }
  @media (max-width: 768px) {
    font-size: ${({ titleLength }) => getFontSizes(titleLength).mobile};
  }
  @media (max-width: 599px) {
    font-size: 18px;
  }
`;

function getFontWeight(length: number) {
  return length <= 50 ? 800 : 'bold';
}

function getFontSizes(length: number) {
  return {
    mobile: length <= 50 ? '18px' : length <= 100 ? '14px' : '14px',
    tablet: length <= 50 ? '24px' : length <= 100 ? '18px' : '14px',
    desktop: length <= 50 ? '32px' : length <= 100 ? '22px' : '18px',
  };
}

export const DescriptionContainer = styled.div`
  margin: 10px 5px 10px 0;
  p {
    line-height: normal;
    margin-bottom: 12px;
  }
`;

export const SponsorshipStatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  flex-direction: column;
  margin-top: 22px;
  @media (min-width: 676px) {
    flex-direction: row;
  }
`;

export const DesktopCoverArtColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 200px;
`;

export const DesktopMetadataContainer = styled.div`
  margin-left: 42px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export const MobilePlayCountContainer = styled.div`
  display: flex;
  margin: 24px auto;
`;

export const MobileDetailsEditButtonContainer = styled.div`
  display: flex;
  margin: 24px auto;
  max-width: 260px;
`;
