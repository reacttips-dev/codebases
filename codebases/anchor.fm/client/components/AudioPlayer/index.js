import React, { Component } from 'react';
import {
  clearInterval,
  nextFrame,
  setInterval,
} from '../../../helpers/serverRenderingUtils';

const SIXTY_FPS = Math.round(1000 / 60);

let audioPlayerDOMElementPlayPromise = null;

/**
 * Pass `onPlaybackStarted` handler as a prop if you want to bootstrap everything (and record)
 * everything necessary for autoplay
 */

class AudioPlayer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { isPlaying: false, playbackInterval: null };
  }

  componentDidMount() {
    const { playbackSpeed } = this.props;
    this.handlePlaybackViaProps(this.props);
    if (this.audio && playbackSpeed) {
      this.audio.playbackRate = playbackSpeed;
    }
  }

  componentWillReceiveProps(newProps) {
    const { playbackSpeed, episodeEnclosureUrl } = this.props;
    this.handlePlaybackViaProps(newProps);
    if (newProps.playbackSpeed !== playbackSpeed) {
      if (this.audio && playbackSpeed) {
        this.audio.playbackRate = playbackSpeed;
      }
    }
    if (
      (this.audio.src === episodeEnclosureUrl &&
        episodeEnclosureUrl !== newProps.episodeEnclosureUrl) ||
      // MT -> RSS episode transition (MT episodes lack episode enclosures)
      (!episodeEnclosureUrl && newProps.episodeEnclosureUrl)
    ) {
      this.audio.src = newProps.episodeEnclosureUrl;
    }
  }

  componentWillUnmount() {
    this.endPlaybackInterval();
  }

  playDomElement = () => {
    const { onError } = this.props;
    audioPlayerDOMElementPlayPromise = this.audio.play();
    if (
      audioPlayerDOMElementPlayPromise &&
      audioPlayerDOMElementPlayPromise.then &&
      audioPlayerDOMElementPlayPromise.catch
    ) {
      audioPlayerDOMElementPlayPromise
        .then(() => {
          this.setState({ isPlaying: true });
          audioPlayerDOMElementPlayPromise = null;
        })
        // suppress pause/play race errors
        .catch(err => {
          // TODO: User-facing warning
          if (err.name === 'NotAllowedError' && onError) {
            onError(); // Safari iOS / any browser not allowing autoplay
          }
          audioPlayerDOMElementPlayPromise = null; // reset for another play
        });
    } else {
      // promise not supported
      this.setState({ isPlaying: true });
    }
  };

  /**
   * Not very React-y but (1) the autoplay attribute cannot be dynamically set and
   * expected to work reliably, so we check for active props presence when a audio can play
   * and then play it programmatically
   * (2) we need to turn redux state (station.isPlaying) into playing the HTML5 tag, so we
   * use componentWillReceiveProps (and componentDidMount for first pass of props (need ref present)).
   */
  jumpToBeginning = () => {
    this.audio.currentTime = 0;
  };

  handlePlaybackViaProps({ doSeek, isActive, isPlaying, playbackPosition }) {
    const {
      episodeEnclosureUrl,
      url,
      actions: { setDoSeek },
    } = this.props;
    const { isPlaying: stateIsPlaying } = this.state;

    // if the audio has not be preloaded, load valid episodeEnclosure (if present) or url here
    if (!this.audio.src && (episodeEnclosureUrl || url))
      this.audio.src = episodeEnclosureUrl || url;

    // seek
    if (isActive && this.audio && doSeek) {
      this.audio.currentTime = playbackPosition;
      setDoSeek(false);
      return;
    }
    // skip
    if (
      !isActive &&
      this.audio &&
      stateIsPlaying &&
      !audioPlayerDOMElementPlayPromise
    ) {
      this.audio.pause();
      this.audio.currentTime = 0; // "stop"
      this.setState({ isPlaying: false });
      return;
    }
    if (isActive && this.audio) {
      // play
      if (isPlaying && !stateIsPlaying) {
        this.handlePlaybackStart();
        // race condition with props for a newly playing track;
        // try to play the actual DOM element once DOM has updated
        if (!this.audio.src) {
          nextFrame(this.playDomElement.bind(this));
          return;
        }
        this.playDomElement.bind(this)();
        return;
      }
      // pause
      if (!isPlaying && stateIsPlaying && !audioPlayerDOMElementPlayPromise) {
        this.audio.pause();
        this.setState({ isPlaying: false });
        return;
      }
    }
    if (!isActive) {
      this.endPlaybackInterval();
    }
  }

  endPlaybackInterval() {
    const { playbackInterval } = this.state;
    if (playbackInterval) {
      clearInterval(playbackInterval);
    }
    this.setState({ playbackInterval: null });
  }

  startPlaybackInterval() {
    const fadeDuration = 3;
    const { actions, audioType } = this.props;
    const { intervalLastSecond } = this.state;
    const playbackInterval = setInterval(() => {
      if (!this.audio) {
        return;
      }
      const fadePoint = this.audio.duration - fadeDuration;
      if (this.audio.paused) {
        return;
      }

      // track playing
      if (actions.playedForOneSecond) {
        const currentTime = Date.now();
        if (currentTime - intervalLastSecond > 1000) {
          actions.playedForOneSecond();
          this.setState({ intervalLastSecond: currentTime });
        }
      }

      actions.updatePlaybackPosition(this.audio.currentTime);

      // beyond is fade logic just for spotify tracks
      if (audioType !== 'spotify') {
        return;
      }

      // Only fade if past the fade out point or not at zero already
      if (this.audio.currentTime <= fadeDuration) {
        this.audio.volume = Math.min(1, this.audio.currentTime / fadeDuration);
        this.audio.muted = false;
        return;
      }

      // Only fade if past the fade out point or not at zero already
      if (this.audio.currentTime >= fadePoint && this.audio.volume > 0.0) {
        this.audio.volume = Math.max(
          0,
          (this.audio.duration - this.audio.currentTime) /
            (this.audio.duration - fadePoint)
        );
        this.audio.muted = false;
      }
    }, SIXTY_FPS);

    this.setState({ playbackInterval, intervalLastSecond: Date.now() });
  }

  // this handler ensures actual DOM play and pause come from state alone
  // if 'play' and 'isPlaying' let event through since it is from redux state
  // if eventand state don't align, prevent the default and change state
  handlePlayOrPause = e => {
    const { onPause } = this.props;
    if (e.type === 'pause') {
      if (onPause) onPause({ jumpToBeginning: this.jumpToBeginning });
    }
    const isPlayEvent = e.type === 'play';
    const { isActive, isPlaying, onPlayOrPause } = this.props;
    this.setState({ isPlaying: isPlayEvent });
    if (isActive && isPlayEvent !== isPlaying && onPlayOrPause) {
      onPlayOrPause();
    }
    if (isPlayEvent) {
      this.handlePlaybackStart();
    }
  };

  handleEnded = e => {
    const { isActive, onEnded } = this.props;
    if (isActive && this.audio) {
      onEnded(e);
    }
  };

  handlePlaybackStart = () => {
    const { isActive, isPlaying, audioType, onPlaybackStarted } = this.props;
    const { playbackInterval } = this.state;
    if (!isActive || !isPlaying) {
      return;
    }
    if (!playbackInterval) {
      // spotify reset on play
      if (audioType === 'spotify') {
        this.audio.muted = true; // to fade in on replay
      }
      this.startPlaybackInterval();
      // ensures we record autoplays as plays
      if (onPlaybackStarted) onPlaybackStarted();
    }
  };

  render() {
    const {
      url,
      doPreload,
      audioType,
      onPlaybackStarted,
      onLoadedData,
    } = this.props;
    const audioProps = {
      onEnded: this.handleEnded,
      onPlay: this.handlePlayOrPause,
      onPause: this.handlePlayOrPause,
      onCanPlay: onPlaybackStarted && this.handlePlaybackStart,
      muted: audioType === 'spotify' /* for fade in */,
      ref: node => {
        this.audio = node;
      },
      'data-testid': 'audio-element',
    };
    if (doPreload) {
      audioProps.src = url;
    } else {
      // Because we set the src in other places in the audio player logic. This
      // prevents preloading from happening despite having src being set.
      // TODO https://anchorfm.atlassian.net/browse/WHEEL-433: Fully implement the "no src" solution for preventing audio preloading
      audioProps.preload = 'none';
    }

    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <audio {...audioProps} onLoadedData={onLoadedData} />;
  }
}

export default AudioPlayer;
