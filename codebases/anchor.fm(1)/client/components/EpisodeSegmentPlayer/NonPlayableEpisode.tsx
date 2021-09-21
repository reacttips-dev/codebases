import { css } from 'emotion';
import React from 'react';
// Module has no exported member 'getEpisodeImage'.
// @ts-ignore
import { getEpisodeImage } from '../../../helpers/serverRenderingUtils';
import { formatDateSinceCreated } from '../../utils';
import EpisodeWaveAnimationContainer from '../EpisodeWaveAnimationContainer';
import { SpotifySquareLogoIcon } from '../Profile/SpotifySquareLogoIcon';
import { AnchorLogo } from './index';
import { LinkText, ListenOnSpotifyLink } from './ListenOnSpotifyLink';
import styles from './styles.sass';
import { getContainerClassName } from './utils';
import { TruncatedEpisodeTitle, TruncatedPodcastName } from './styles';

export function NonPlayableEpisode({
  episode,
  isEmbedded,
  podcastMetadata,
  stationName,
  episodeTitle,
  volumeData,
  spotifyShowUrl,
  vanitySlug,
  isShowSpotifyButton = true,
}: {
  episode: { episodeImage: string; publishOn: string; spotifyUrl: string };
  isEmbedded: boolean;
  podcastMetadata: { podcastImage: string };
  stationName: string;
  startShare: () => void;
  episodeTitle: string;
  volumeData: number[];
  spotifyShowUrl: string;
  vanitySlug: string;
  isShowSpotifyButton?: boolean;
}) {
  return (
    <div className={getContainerClassName({ isEmbedded })}>
      <div className={styles.episodeImage}>
        <img
          alt={`Artwork for episode "${episodeTitle}"`}
          src={getEpisodeImage({ episode, podcastMetadata })}
        />
      </div>
      <div className={styles.episodeContainerInner}>
        <EpisodeWaveAnimationContainer
          isEmbedded={isEmbedded}
          fgColor="rgba(125,125,125,0.1)"
          className={`${styles.waveform} ${css`
            bottom: 0;
          `}`}
          volumeData={volumeData}
          isPlaying={false}
        />
        <div className={styles.segmentInfo}>
          <TruncatedEpisodeTitle>
            {episodeTitle || 'Untitled'}
          </TruncatedEpisodeTitle>
          <TruncatedPodcastName>
            {stationName}
            <span className={styles.byLinePublishOn}>
              <span> &bull; </span>
              {formatDateSinceCreated(episode.publishOn, true)}
            </span>
          </TruncatedPodcastName>
        </div>
        {isShowSpotifyButton && (
          <ListenOnSpotifyLink
            className={css`
              position: absolute;
              left: 20px;
              bottom: 24px;

              // A workaround for the button overlapping with the episode info
              // when the container is less tall on mobile web
              @media (max-width: 768px) {
                left: auto;
                right: 10px;
                bottom: 10px;
              }
            `}
            href={episode.spotifyUrl || spotifyShowUrl}
            target="_blank"
            rel="noopener noreferer"
            aria-label="Listen on Spotify"
          >
            <LinkText aria-hidden="true">
              Listen on <SpotifySquareLogoIcon />
            </LinkText>
          </ListenOnSpotifyLink>
        )}
        {isEmbedded && <AnchorLogo vanitySlug={vanitySlug} />}
      </div>
    </div>
  );
}
