import React from 'react';

import TextTruncate from 'react-text-truncate';
import StationProgressBarContainer from '../StationProgressBarContainer';
import PlayButton from '../PlayButton';
import { formatDate, PODCAST_COLORS } from '../../utils';
import styles from './styles.sass';
import estyles from '../EpisodeSegmentPlayer/styles.sass';
import { hexToRgba } from '../../modules/ColorUtils';
import { ProfilePaywallsModalTrigger } from '../ProfilePaywalls/components/ProfilePaywallsModalTrigger';
import CircleButton from '../CircleButton';
import { PaywallsLockIcon } from '../svgs/PaywallsLockIcon';
import { getFormattedTimestamp } from '../../modules/Time';
import { OpenModalLocation } from '../ProfilePaywalls/events';
import { SUBSCRIBE_BUTTON_ARIA_LABEL } from '../ProfilePaywalls/constants';

const CurrentEpisodeFeedItemMobile = ({
  episode,
  onClickPlayButton,
  isPlaying,
  stationDuration,
  playedPosition,
  remainingPosition,
  profileColor,
}) => (
  <div className={styles.mobileEpisodeListItem}>
    <div className={styles.mobileEpisodeListCurrentItemPlayButton}>
      {!episode.isMT && !episode.isPW && (
        <PlayButton
          iconColors={PODCAST_COLORS.WHITE}
          colors={PODCAST_COLORS.BLACK}
          isPlaying={isPlaying}
          onClick={onClickPlayButton}
          shadow
          size={35}
          iconSize={15}
        />
      )}
      {episode.isPW && (
        <ProfilePaywallsModalTrigger
          locationForAnalytics={OpenModalLocation.COVER_ART_LOCK_ICON}
        >
          <CircleButton
            baseColor={PODCAST_COLORS.BLACK.colorClass}
            size={35}
            className={styles.overlayButton}
            ariaLabel={SUBSCRIBE_BUTTON_ARIA_LABEL}
          >
            <PaywallsLockIcon
              onClick={() => {}}
              width="35%"
              fillColor={PODCAST_COLORS.WHITE.color}
            />
          </CircleButton>
        </ProfilePaywallsModalTrigger>
      )}
    </div>
    <div className={styles.mobileEpisodeListItemContent}>
      <TextTruncate
        className={styles.mobileEpisodeListItemTitle}
        line={2}
        truncateText="…"
        text={episode.title}
      />
      <div className={styles.mobileEpisodeListItemDetails}>
        <span>
          {formatDate(new Date(episode.publishOnUnixTimestamp * 1000))}
        </span>
        <span>
          {getFormattedTimestamp(episode.duration, {
            omitZeroHours: true,
            roundMilliseconds: true,
          })}
        </span>
      </div>
    </div>
    {/*
      TODO: Don't use a container here. Instead, pass the elapsed time into the
      component. The problem is that everytime the elapsed time is updated
      (every ms?) the profile component and all sub-components are rerenderd,
      which leads to a choppy UX. A possible solution would be to check elapsed
      time is the only updated prop, if so, skip the rendering off all components
      except the one that needs the elapsed tiem (e.g. StationProgressBar).
    */}
    <StationProgressBarContainer
      className={estyles.progressBar}
      min={0}
      max={stationDuration}
      playedPosition={playedPosition}
      remainingPosition={remainingPosition}
      remainingColor={hexToRgba(profileColor, 0.2)}
      bgColor={hexToRgba(profileColor, 0.2)}
      playingColor={profileColor}
      playedColor={profileColor}
      size={1.75}
    />
  </div>
);

export default CurrentEpisodeFeedItemMobile;
