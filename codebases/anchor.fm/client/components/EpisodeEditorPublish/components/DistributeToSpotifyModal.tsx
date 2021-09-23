import React from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';
import { PodcastEpisodeCoverArt } from 'screens/EpisodeDetailsScreen/components/EpisodeCard/styles';
import { Button } from 'shared/Button/NewButton';
import { ConfirmationModal } from 'shared/ConfirmationModal';
import { LearnMoreLink } from 'screens/EpisodeEditorScreen/styles';
import { CoverArtPlaceholder } from '../../CoverArtPlaceholder';

const LEARN_MORE_URL = 'https://anch.co/3iOP2uG';

const PlaceholderContainer = styled.div`
  width: 160px;
  height: 160px;
  margin: 0 auto 44px auto;
`;

export function DistributeToSpotifyModal({
  onClickClose,
  podcastImage,
  onSubmit,
}: {
  onClickClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  podcastImage?: string;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <ConfirmationModal
      title="Distribute to Spotify"
      onClickClose={onClickClose}
    >
      <p>
        To submit an episode that includes Spotify songs, you&apos;ll need to
        distribute your show to Spotify.
      </p>
      {podcastImage ? (
        <PodcastEpisodeCoverArt src={podcastImage} alt="Episode cover art" />
      ) : (
        <PlaceholderContainer>
          <CoverArtPlaceholder />
        </PlaceholderContainer>
      )}
      <Button
        color="purple"
        onClick={onSubmit}
        kind="button"
        className={css`
          width: 270px;
          margin-bottom: 14px;
        `}
      >
        Distribute to Spotify
      </Button>
      <LearnMoreLink href={LEARN_MORE_URL}>Learn more</LearnMoreLink>
    </ConfirmationModal>
  );
}
