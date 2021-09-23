/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CoverArtPlaceholder } from '../../../../components/CoverArtPlaceholder';
import { Button } from '../../../../shared/Button/NewButton';
import { Icon } from '../../../../shared/Icon';
import { CoverArtModalScreenContainer } from '../../../CoverArtModalScreen';
import actions from '../../../CoverArtModalScreen/duck/actions';
import { trackUpdateCoverArtClick } from '../../events';
import { LabelHeading } from '../../styles';
import {
  ButtonWrapper,
  DownloadArtButtonCss,
  DownloadIconWrapper,
  ImageUploadButtonContainer,
  ImageUploadContainer,
  ImageUploadParagraph,
  ImageWrapper,
  UpdateCoverArtButtonCss,
} from './styles';

function PodcastCoverArtPresentation({
  podcastImage,
  podcastImageFull,
  toggleCoverArtModal,
}: {
  podcastImage?: string;
  podcastImageFull?: string;
  toggleCoverArtModal: (isShowing: boolean) => void;
}) {
  const [coverArt, setCoverArt] = useState<
    [string | undefined, string | undefined]
  >([undefined, undefined]);

  // this might be a dumb thing to worry about, but using `||` in the case where
  // we only have one of the image sizes. if we have both, prioritize the full
  // version for download and the smaller one for display
  useEffect(() => {
    setCoverArt([
      podcastImage || podcastImageFull,
      podcastImageFull || podcastImage,
    ]);
  }, [podcastImage, podcastImageFull]);

  const [displayImage, downloadImage] = coverArt;

  return (
    <div>
      <LabelHeading>Podcast cover art</LabelHeading>
      <ImageUploadContainer>
        <ImageWrapper>
          {displayImage ? (
            <img
              src={displayImage}
              alt="Podcast cover art"
              css={css`
                width: 100%;
              `}
            />
          ) : (
            <CoverArtPlaceholder />
          )}
        </ImageWrapper>
        <ImageUploadButtonContainer>
          <ImageUploadParagraph>
            Upload or search through a catalog of cover art options that best
            represents your podcast.
          </ImageUploadParagraph>
          <ButtonWrapper>
            <Button
              css={UpdateCoverArtButtonCss}
              height={40}
              color="purple"
              onClick={() => {
                trackUpdateCoverArtClick();
                toggleCoverArtModal(true);
              }}
            >
              Update cover art
            </Button>
            {downloadImage && (
              <Button
                css={DownloadArtButtonCss}
                height={40}
                href={downloadImage}
                kind="link"
                target="_blank"
                rel="noopener noreferrer"
                download=""
              >
                <DownloadIconWrapper>
                  <Icon type="download" fillColor="#5000b9" />
                </DownloadIconWrapper>
                Download art
              </Button>
            )}
          </ButtonWrapper>
        </ImageUploadButtonContainer>
      </ImageUploadContainer>
      <CoverArtModalScreenContainer
        onWillClose={() => toggleCoverArtModal(false)}
        onFinishSubmitCoverArt={({
          image400,
          image,
        }: {
          image: string;
          image400: string;
        }) => {
          setCoverArt([image400, image]);
          toggleCoverArtModal(false);
        }}
      />
    </div>
  );
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  toggleCoverArtModal: (isShowing: boolean) => {
    dispatch(actions.setIsShowing(isShowing));
  },
});

export const PodcastCoverArt = connect(
  () => ({}),
  mapDispatchToProps
)(PodcastCoverArtPresentation);
