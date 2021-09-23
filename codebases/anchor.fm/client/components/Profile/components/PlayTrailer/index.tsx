import classNames from 'classnames';
import React from 'react';
import Icon from '../../../../shared/Icon';
import AudioPlayer from '../../../AudioPlayer';

import styles from './styles.sass';

type Props = {
  isMobile: boolean;
  trailerUrl: string;
  onLoadedData: (audioElement: HTMLAudioElement) => void;
  onPlayback: (currentTime: number | null) => void;
  profileColor: string;
};

export const PlayTrailer = ({
  isMobile,
  trailerUrl,
  onLoadedData,
  onPlayback,
  profileColor,
}: Props) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const buttonType = isPlaying ? 'Stop' : 'Play';
  const playIconPadding = isPlaying ? '' : '7px 7px 7px 9px';

  function handleOnLoadedData(e: React.SyntheticEvent) {
    onLoadedData(e.currentTarget as HTMLAudioElement);
  }

  function resetPlaybackPosition() {
    onPlayback(null);
  }

  if (!trailerUrl) return <div className={styles.placeholder} />;
  return (
    <div className={styles.container}>
      <AudioPlayer
        actions={{
          updatePlaybackPosition: onPlayback,
        }}
        doSeek={false}
        doPreload={true}
        isActive={true}
        isPlaying={isPlaying}
        onEnded={() => setIsPlaying(false)}
        onPause={({ jumpToBeginning }: { jumpToBeginning: () => void }) => {
          resetPlaybackPosition();
          jumpToBeginning();
        }}
        url={trailerUrl}
        onLoadedData={handleOnLoadedData}
      />
      <button
        className={styles.button}
        onClick={() => setIsPlaying(!isPlaying)}
        role="button"
        aria-label={`${buttonType} trailer`}
      >
        <div
          className={classNames(styles.iconWrapper, {
            [styles.mobileIconWrapper]: isMobile,
          })}
          style={{ padding: playIconPadding }}
        >
          {isPlaying ? (
            <div
              className={styles.stopIcon}
              style={isMobile ? { backgroundColor: profileColor } : {}}
            />
          ) : (
            <Icon type="play" fillColor={isMobile ? profileColor : '#EBEBEC'} />
          )}
        </div>
        <span
          className={classNames(styles.buttonLabel, {
            [styles.mobileButtonLabel]: isMobile,
          })}
        >
          {buttonType} trailer
        </span>
      </button>
    </div>
  );
};
