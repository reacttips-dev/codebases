import React from 'react';

import styles from './styles.sass';
import { EpisodeFeedItem } from '../EpisodeFeedItem';

export function EpisodesListDesktop({
  episodes = [],
  activeEpisodeId,
  isPlaying,
  handleClickEpisode,
  playIconSize,
  maxEpisodeDescriptionLines,
  maxEpisodeNameLines,
  podcastMetadata,
}) {
  return episodes.length ? (
    <div className={styles.episodeFeed} data-cy="episodeFeed">
      {episodes.map((episode, index) => (
        <EpisodeFeedItem
          key={episode.episodeId}
          activeEpisodeId={activeEpisodeId}
          episode={episode}
          episodeNumber={episodes.length - index}
          isPlaying={isPlaying && activeEpisodeId === episode.episodeId}
          onClick={handleClickEpisode(episode)}
          playIconSize={playIconSize}
          maxEpisodeDescriptionLines={maxEpisodeDescriptionLines}
          maxEpisodeNameLines={maxEpisodeNameLines}
          podcastMetadata={podcastMetadata}
        />
      ))}
    </div>
  ) : null;
}
