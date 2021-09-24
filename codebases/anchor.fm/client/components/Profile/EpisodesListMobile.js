import React from 'react';
import styles from './styles.sass';
import { SpotifySquareLogoIcon } from './SpotifySquareLogoIcon';
import {
  LinkText,
  ListenOnSpotifyLink,
} from '../EpisodeSegmentPlayer/ListenOnSpotifyLink';
import { MobileNowPlayingContainer } from './styles';

const moreEpisodesText = episodeCount =>
  episodeCount === 1 ? `${episodeCount} Episode` : `${episodeCount} Episodes`;
export default function MobileEpisodesList({
  episodes,
  currentEpisode,
  renderItem,
  renderCurrentItem,
  spotifyShowUrl,
}) {
  if (episodes.length === 0) return <div style={{ marginBottom: '70px' }} />;
  return (
    <React.Fragment>
      <div className={styles.mobileEpisodeList}>
        {currentEpisode && (
          <React.Fragment>
            {currentEpisode.isMT ? (
              <MobileNowPlayingContainer>
                <h5 className={styles.mobileEpisodeListTitle}>Now Playing</h5>
                <ListenOnSpotifyLink
                  href={currentEpisode.spotifyUrl || spotifyShowUrl}
                  aria-label="Listen on Spotify"
                >
                  <LinkText aria-hidden="true">
                    Listen on <SpotifySquareLogoIcon />
                  </LinkText>
                </ListenOnSpotifyLink>
              </MobileNowPlayingContainer>
            ) : (
              <h5 className={styles.mobileEpisodeListTitle}>Now Playing</h5>
            )}
            {renderCurrentItem(currentEpisode)}
          </React.Fragment>
        )}
        <h5 className={styles.mobileEpisodeListTitle}>
          {moreEpisodesText(episodes.length)}
        </h5>
        {episodes.map(episode => renderItem(episode))}
      </div>
    </React.Fragment>
  );
}
