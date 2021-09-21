import React from 'react';
import styles from '../../../EpisodeSegmentPlayer/styles.sass';
import EpisodeWaveAnimationContainer from '../../../EpisodeWaveAnimationContainer';
import { getRandomizedVolumeData } from '../../../../utils';
import { AnchorLogo } from '../../../EpisodeSegmentPlayer';

const EmbedNotFound = ({ vanitySlug }) => (
  <div className={styles.embedNotFoundContainer}>
    <EpisodeWaveAnimationContainer
      isEmbedded
      fgColor="rgba(125,125,125,0.1)"
      className={styles.waveform}
      volumeData={getRandomizedVolumeData()}
      isPlaying={false}
    />
    <h4 className={styles.header}>Sorry, this episode can{"'"}t be found.</h4>
    <AnchorLogo vanitySlug={vanitySlug} />
  </div>
);

export { EmbedNotFound };
