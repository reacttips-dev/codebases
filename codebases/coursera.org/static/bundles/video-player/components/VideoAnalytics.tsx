/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import type { VideoProgress } from 'bundles/video-player/types/VideoProgress';

import {
  createVideoEventTracker,
  getTrackingDataForVideoEvent,
} from 'bundles/video-player/utils/AnalyticsMetadataFetcher';

import type { VideoPlayer } from 'bundles/item-lecture/types';
import type { VideoMetaData } from 'bundles/video-player/types/VideoAnalytics';

type Props = {
  player: VideoPlayer;
  children?: JSX.Element;
  videoProgress: VideoProgress | null;
};

export default class VideoAnalytics extends React.Component<Props> {
  static contextTypes = {
    _eventData: PropTypes.object,
  };

  /**
   * Sets up all player analytics listeners on component mount
   */
  componentDidMount() {
    const { player } = this.props;

    Object.keys(this.basicEvents).forEach((key) => {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      player.on(key, this.trackHandler(this.basicEvents[key]));
    });

    player.one('play', this.trackHandler('start'));
    player.ready(this.trackHandler('playback_tech'));

    player.on('waitmetrics', (event: $TSFixMe) =>
      this.track('wait_metrics', {
        play_duration: event.playDuration,
        wait_duration: event.waitDuration,
        wait_count: event.waitCount,
      })
    );

    player.on('fullscreenchange', () => this.track(player.isFullscreen() ? 'fullscreen.open' : 'fullscreen.close'));

    player.emitter.on('heartbeat:30000', this.handleVideoProgressEvent);
    player.emitter.on('heartbeat:5000', this.trackHandler('heartbeat'));

    // @ts-ignore ts-migrate(7031) FIXME: Binding element 'join_duration' implicitly has an ... Remove this comment to see the full error message
    // eslint-disable-next-line camelcase
    player.emitter.once('joined', ({ joinDuration: join_duration }) =>
      this.track('joined', {
        join_duration,
      })
    );
  }

  /**
   * Removes all player listeners on unmount
   */
  componentWillUnmount() {
    const { player } = this.props;

    Object.keys(this.basicEvents).forEach((key) => player.off(key));

    player.off('play');
    player.off('waitmetrics');
    player.emitter.off('heartbeat:30000');
    player.emitter.off('heartbeat:5000');
  }

  /**
   * Sends a "not found" for video progress if it cannot be found during a heartbeat
   */
  handleVideoProgressEvent = () => {
    const { videoProgress } = this.props;

    if (!videoProgress) {
      this.track('video_progress.not_found');
    }
  };

  // A map of player events to the analytic events they should trigger
  basicEvents = {
    autoplaychange: 'autoplay.change',
    joining: 'joining',
    mute: 'mute',
    pause: 'pause',
    play: 'play',
    ratechange: 'playback_rate.change',
    seeked: 'seek',
    subtitleschange: 'change.subtitles',
    unmute: 'unmute',
    waiting: 'waiting',
  };

  /**
   * Wrapper for the Retracked tracker
   *
   * @param {string} event
   * @param {string[]} data
   */
  track = (event: string, additionalData: VideoMetaData = {}) => {
    const { player } = this.props;

    const {
      _eventData: {
        namespace: { app: namespace },
      },
    } = this.context;

    // TODO: combine createVideoEventTracker & getTrackingDataForVideoEvent into one call
    // also need to move all other usages to this component
    const tracker = createVideoEventTracker(namespace, player);

    tracker(event, {
      ...getTrackingDataForVideoEvent(player, event),
      ...additionalData,
    });
  };

  /**
   * Returns a callback method that tracks the given event name with accompanying data
   *
   * @param eventName Name of the event to track
   * @param data Map of data to track (in addition to the fields including in the default data map in analytics.js)
   * @returns A callback function
   */
  trackHandler =
    (eventName: string, data: {} = {}) =>
    () => {
      this.track(eventName, data);
    };

  render() {
    const { children } = this.props;

    if (!children) {
      return null;
    }

    return children;
  }
}
