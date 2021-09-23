import React from 'react';
import moment from 'moment';
import { css } from 'emotion';
import Link from 'react-router-dom/Link';
import TextTruncate from 'react-text-truncate';
import PlayButton from '../PlayButton';
import TextExpander from '../TextExpander';
import { getEpisodeImage } from '../../../helpers/serverRenderingUtils';
import { PODCAST_COLORS } from '../../utils';
import makeCaptionWithLinks from '../../makeCaptionWithLinks';
import styles from './styles.sass';
import { OutlinedMusicNote } from '../svgs/OutlinedMusicNote';
import { SquareMusicNote } from '../../shared/SquareMusicNote';
import { PaywallsLockIcon } from '../svgs/PaywallsLockIcon';
import { getFormattedTimestamp } from '../../modules/Time';
import { ProfilePaywallsModalTrigger } from '../ProfilePaywalls/components/ProfilePaywallsModalTrigger';
import CircleButton from '../CircleButton';
import { OpenModalLocation } from '../ProfilePaywalls/events';
import { SUBSCRIBE_BUTTON_ARIA_LABEL } from '../ProfilePaywalls/constants';

export function EpisodeFeedItem(props) {
  const {
    activeEpisodeId,
    onClick = () => {},
    episode,
    maxEpisodeDescriptionLines = 1,
    maxEpisodeNameLines = 2,
    isPlaying,
    playIconSize,
    podcastMetadata,
  } = props;
  const iconInnerSize = parseInt(playIconSize * 0.45, 10);

  const { podcastName } = podcastMetadata;
  const {
    isPW,
    isMT,
    episodeId,
    shareLinkPath,
    title,
    description,
    descriptionPreview,
    duration,
  } = episode;
  const isShowLockIcon = isPW;
  const isShowPlayIcon = !isShowLockIcon && !isMT;

  const coverImage = (
    <Link className={styles.episodeImage} onClick={onClick} to={shareLinkPath}>
      <img src={getEpisodeImage({ episode, podcastMetadata })} alt="" />
      {isShowPlayIcon && (
        <PlayButton
          size={playIconSize}
          iconSize={iconInnerSize}
          colors={PODCAST_COLORS.WHITE}
          iconColors={PODCAST_COLORS.BLACK}
          isPlaying={isPlaying}
          className={styles.overlayButton}
          ariaLabel={`Play episode: ${title}`}
        />
      )}
      {isShowLockIcon && (
        <CircleButton
          baseColor={PODCAST_COLORS.WHITE.colorClass}
          size={playIconSize}
          className={styles.overlayButton}
          ariaLabel={SUBSCRIBE_BUTTON_ARIA_LABEL}
        >
          <PaywallsLockIcon
            onClick={() => {}}
            width="35%"
            fillColor={PODCAST_COLORS.BLACK.color}
          />
        </CircleButton>
      )}
    </Link>
  );

  return (
    <div className={styles.episodeFeedItem}>
      {activeEpisodeId === episodeId && (
        <span className={styles.isActiveEpisode} />
      )}
      {isPW ? (
        <ProfilePaywallsModalTrigger
          locationForAnalytics={OpenModalLocation.COVER_ART_LOCK_ICON}
        >
          {coverImage}
        </ProfilePaywallsModalTrigger>
      ) : (
        coverImage
      )}
      <Link
        to={shareLinkPath}
        className={css`
          display: flex;
          align-items: center;
        `}
      >
        <TextTruncate
          line={maxEpisodeNameLines}
          containerClassName={styles.episodeHeading}
          truncateText="…"
          text={title}
        />
      </Link>
      {isMT && (
        <div
          className={css`
            display: flex;
          `}
        >
          <SquareMusicNote aria-hidden="true">
            <OutlinedMusicNote fillColor="#7F8287" />
          </SquareMusicNote>
          <span
            className={css`
              margin-left: 6px;
              font-size: 1.3rem;
              color: #7f8287;
            `}
          >
            Episodes with music are only available on Spotify.
          </span>
        </div>
      )}

      {/* line is 1 mobile, 2 tablet */}
      <TextExpander
        className={styles.episodeDescription}
        expandedText={makeCaptionWithLinks(description)}
        line={maxEpisodeDescriptionLines}
        text={descriptionPreview}
        expanderIconStyle="dark"
      />
      <div className={styles.episodeDuration}>
        {getFormattedTimestamp(duration || 0, {
          omitZeroHours: true,
          roundMilliseconds: true,
        })}
      </div>
      <div className={styles.episodeCreated}>{displayDate(episode)}</div>
    </div>
  );
}

function displayDate(episode = {}) {
  const DATETIME_FORMAT = 'MMMM D, YYYY';
  return moment(episode.publishOn).format(DATETIME_FORMAT);
}
