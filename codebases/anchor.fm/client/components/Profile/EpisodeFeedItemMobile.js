import React from 'react';
import { css } from 'emotion';
import TextTruncate from 'react-text-truncate';

import Link from 'react-router-dom/Link';
import { formatDate } from '../../utils';
import styles from './styles.sass';
import { OutlinedMusicNote } from '../svgs/OutlinedMusicNote';
import { SquareMusicNote } from '../../shared/SquareMusicNote';
import {
  MobileEpisodeListItemDetails,
  MobileOnlyOnSpotifyCopy,
} from './styles';
import { getFormattedTimestamp } from '../../modules/Time';

class EpisodeFeedItemMobile extends React.Component {
  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    const shouldRemoveClickState =
      nextProps.isActiveEpisode !== this.props.isActiveEpisode &&
      nextProps.isActiveEpisode === false;
    if (shouldRemoveClickState) {
      this.setState(prevState => ({
        clicked: false,
      }));
    }
  }

  handleClick = () => {
    this.setState(prevState => ({
      clicked: true,
    }));
    this.props.onClick();
  };

  render() {
    const { episode, onClick, isActiveEpisode } = this.props;

    return (
      <Link
        className={styles.mobileEpisodeListItemLink}
        onClick={this.handleClick}
        to={episode.shareLinkPath}
      >
        <div
          key={`episode-${episode.episodeId}`}
          className={styles.mobileEpisodeListItem}
          onClick={onClick}
        >
          {isActiveEpisode && (
            <div
              className={styles.mobileEpisodeListItemPlayingIndicatorContainer}
            >
              <div className={styles.mobileEpisodeListItemPlayingIndicator} />
            </div>
          )}
          <div className={styles.mobileEpisodeListItemContent}>
            <TextTruncate
              className={styles.mobileEpisodeListItemTitle}
              line={2}
              truncateText="…"
              text={episode.title}
            />
            <MobileEpisodeListItemDetails>
              <span>
                {formatDate(new Date(episode.publishOnUnixTimestamp * 1000))}
              </span>
              <span>
                {getFormattedTimestamp(episode.duration, {
                  omitZeroHours: true,
                  roundMilliseconds: true,
                })}
              </span>
            </MobileEpisodeListItemDetails>
            <span>
              {episode.isMT && (
                <div>
                  <SquareMusicNote aria-hidden="true">
                    <OutlinedMusicNote fillColor="#7F8287" />
                    <MobileOnlyOnSpotifyCopy>
                      Episodes with music are only available on Spotify.
                    </MobileOnlyOnSpotifyCopy>
                  </SquareMusicNote>
                </div>
              )}
            </span>
          </div>
        </div>
      </Link>
    );
  }
}

export default EpisodeFeedItemMobile;
