import React from 'react';
import classNames from 'classnames';

import VideoMiniControls from 'bundles/item-lecture/components/v1/VideoMiniControls';

import { VideoRegion, VideoPlayer } from 'bundles/item-lecture/types';

import 'css!./__styles__/VideoMiniPlayer';

type Props = {
  children: JSX.Element;
  videoRegion?: VideoRegion;
  videoPlayer?: VideoPlayer;
};

type State = {
  videoEnded: boolean;
  isIVQVisible: boolean;
  isMainPlayerHidden: boolean;
};

class VideoMiniPlayer extends React.Component<Props, State> {
  timeoutId: number | null;

  videoPlaceholder!: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);

    this.timeoutId = null;

    this.state = {
      videoEnded: false,
      isIVQVisible: false,
      isMainPlayerHidden: false,
    };
  }

  componentDidMount() {
    const { videoPlayer } = this.props;
    const scrollContainer = this.getScrollContainer();

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', this.handleScroll);
    }

    if (videoPlayer) {
      this.attachVideoPlayerListeners(videoPlayer);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { videoPlayer } = this.props;

    if (videoPlayer && !nextProps.videoPlayer) {
      this.detachVideoPlayerListeners(videoPlayer);
    } else if (!videoPlayer && nextProps.videoPlayer) {
      this.attachVideoPlayerListeners(nextProps.videoPlayer);
    }
  }

  componentWillUnmount() {
    const { videoPlayer } = this.props;
    const scrollContainer = this.getScrollContainer();

    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', this.handleScroll);
    }

    if (videoPlayer) {
      this.detachVideoPlayerListeners(videoPlayer);
    }
  }

  handleIVQVisible = () => {
    this.setState({ isIVQVisible: true });
  };

  handleIVQHidden = () => {
    this.setState({ isIVQVisible: false });
  };

  handleTimeUpdate = () => {
    const { videoEnded } = this.state;
    const { videoPlayer } = this.props;

    if (videoPlayer) {
      if (videoPlayer.ended()) {
        if (!videoEnded) {
          this.setState({ videoEnded: true });
        }
      } else if (videoEnded) {
        this.setState({ videoEnded: false });
      }
    }
  };

  handleScroll = () => {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      const { isMainPlayerHidden } = this.state;

      if (this.getIsMainPlayerHidden()) {
        if (!isMainPlayerHidden) {
          this.setState({ isMainPlayerHidden: true });
        }
      } else if (isMainPlayerHidden) {
        this.setState({ isMainPlayerHidden: false });
      }

      this.timeoutId = null;
    }, 5);
  };

  getScrollContainer = () => {
    return document.querySelector('[data-id="item-scroll-container"]');
  };

  getIsMainPlayerHidden = () => {
    const { videoRegion } = this.props;

    const showMiniPlayer = this.getShowMiniPlayer();
    const scrollContainer = this.getScrollContainer();
    const scrollOffset = scrollContainer ? scrollContainer.scrollTop : 0;

    let scrollThreshold;

    if (showMiniPlayer) {
      scrollThreshold = this.videoPlaceholder ? this.videoPlaceholder.getBoundingClientRect().height : 500;
    } else {
      scrollThreshold = videoRegion ? videoRegion.getBoundingClientRect().height : 500;
    }

    return scrollOffset >= scrollThreshold;
  };

  getShowMiniPlayer = () => {
    const { isMainPlayerHidden, isIVQVisible, videoEnded } = this.state;
    return isMainPlayerHidden && !isIVQVisible && !videoEnded;
  };

  attachVideoPlayerListeners = (videoPlayer: VideoPlayer) => {
    if (videoPlayer) {
      videoPlayer.on('timeupdate', this.handleTimeUpdate);
      videoPlayer.emitter.on('videoQuizView.hidden', this.handleIVQHidden);
      videoPlayer.emitter.on('videoQuizView.visible', this.handleIVQVisible);
    }
  };

  detachVideoPlayerListeners = (videoPlayer: VideoPlayer) => {
    if (videoPlayer) {
      videoPlayer.off('timeupdate', this.handleTimeUpdate);
      videoPlayer.emitter.off('videoQuizView.hidden', this.handleIVQHidden);
      videoPlayer.emitter.off('videoQuizView.visible', this.handleIVQVisible);
    }
  };

  render() {
    const { children, videoRegion, videoPlayer } = this.props;
    const showMiniPlayer = this.getShowMiniPlayer();

    return (
      <div className={classNames('rc-VideoMiniPlayer', { mini: showMiniPlayer })}>
        <div className="video-main-player-container">{children}</div>

        {showMiniPlayer && videoRegion && (
          <div
            ref={(el) => {
              this.videoPlaceholder = el;
            }}
            className="video-placeholder"
            style={{
              width: videoRegion.getBoundingClientRect().width,
              height: videoRegion.getBoundingClientRect().height,
            }}
          />
        )}

        {showMiniPlayer && videoPlayer && <VideoMiniControls videoPlayer={videoPlayer} />}
      </div>
    );
  }
}

export default VideoMiniPlayer;
