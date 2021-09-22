import React from 'react';
import classNames from 'classnames';

import ControlBar from 'bundles/video-player/components/ControlBar';
import AutoNextOverlay from 'bundles/video-player/components/autoplay/AutoNextOverlay';
import PlayButton from 'bundles/video-player/components/video/PlayButton';
import userPreferences from 'bundles/video-player/utils/userPreferences';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import type VerificationDisplay from 'bundles/verificationDisplay/models/verificationDisplay';
/* eslint-enable no-restricted-imports */

import 'css!./__styles__/VideoControlsContainer';

import type { VideoPopup } from 'bundles/video-player/types/VideoPlayer';
import type { VideoPlayer as VideoPlayerType } from 'bundles/item-lecture/types';
import type { InVideoQuestion } from 'bundles/video-quiz/types';
import type { QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';

const SPACE_BAR_KEY = 32;
const ENTER_KEY = 13;

type Props = {
  defaultSubtitleLanguage: string;
  nextItem: ItemMetadata;
  verificationDisplay: typeof VerificationDisplay;
  itemMetadata: ItemMetadata;
  courseId: string;
  player: VideoPlayerType;
  videoQuizQuestions: InVideoQuestion<QuizQuestionPrompt>[] | null;
};

type State = {
  hideContextMenu: boolean;
  isChromeVisible: boolean;
  showAutoNextOverlay: boolean;
  showPlayButton: boolean;
  visiblePopup: VideoPopup;
};

class VideoControlsContainer extends React.Component<Props, State> {
  node: HTMLElement | null | undefined;

  timeoutID: number | null | undefined;

  state = {
    isChromeVisible: false,
    showAutoNextOverlay: false,
    showPlayButton: true,
    visiblePopup: null,
    // disables the context menu on the container-level so
    // users can use the <video> element's context menu
    hideContextMenu: false,
  };

  componentDidMount() {
    const { player } = this.props;

    player.one('play', () => {
      this.setState({ showPlayButton: false });
    });

    player.on('play', () => {
      this.setState({ showAutoNextOverlay: false });

      this.timeoutID = window.setTimeout(() => {
        this.setChromeVisibility(false);
      }, 5000);
    });

    player.on('ended', () => {
      // player.autoplay() refers to autoplaying the video when the page is loaded.
      // This assumes the "autoplay experience" includes the above, as well as displaying
      // the auto next overlay when a video ends
      // see: https://blog.videojs.com/autoplay-best-practices-with-video-js/
      // TODO: move this and other settings to backend API.
      this.setState({ showAutoNextOverlay: true });
    });

    this.setState({ showPlayButton: !player.autoplay() });

    document.addEventListener('mousedown', this.handleDocumentMouseDown);
    document.addEventListener('mousemove', this.handleDocumentMouseMove);
  }

  componentWillUnmount() {
    const { player } = this.props;

    player.off('ended');

    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }

    document.removeEventListener('mousedown', this.handleDocumentMouseDown);
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
  }

  handleDocumentMouseMove = () => {
    const { hideContextMenu } = this.state;

    if (hideContextMenu) {
      this.setState({
        hideContextMenu: false,
      });
    }
  };

  handleVideoRegionMouseMove = () => {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }

    this.setChromeVisibility(true);
    this.timeoutID = window.setTimeout(() => {
      this.setChromeVisibility(false);
    }, 5000);
  };

  handleDocumentMouseDown = (event: MouseEvent) => {
    const { player } = this.props;
    const isFullscreen = player.isFullscreen();

    if (this.node && !this.node.contains(event.target as HTMLElement) && !isFullscreen) {
      if (!player.paused()) {
        this.setChromeVisibility(false);
      }
    }
  };

  applySubtitlePosition = ({ textTracks, line = 100, position = 50, align = 'bottom' }: $TSFixMe) => {
    textTracks.forEach(
      (track: $TSFixMe) =>
        track.cues &&
        Object.keys(track.cues).forEach((i) => {
          if (track.cues) {
            track.cues[i].position = position;
            track.cues[i].line = line;
            track.cues[i].align = align;
          }
        })
    );
  };

  onPlayButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { player } = this.props;

    player.play();

    player.on('play', () => {
      const textTracks = Array.from(player.textTracks());
      this.applySubtitlePosition({ textTracks });
    });

    this.setState({ showPlayButton: false });
  };

  onPlayButtonKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.keyCode === SPACE_BAR_KEY || event.keyCode === ENTER_KEY) {
      const { player } = this.props;

      player.play();

      player.on('play', () => {
        const textTracks = Array.from(player.textTracks());
        this.applySubtitlePosition({ textTracks });
      });
      this.setState({ showPlayButton: false });
    }
  };

  onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { player } = this.props;

    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    }
    player.on('play', () => {
      const textTracks = Array.from(player.textTracks());
      this.applySubtitlePosition({ textTracks });
    });
  };

  onShareClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    const { player } = this.props;

    if (!player.paused()) {
      player.pause();
    }
  };

  onContextMenu = () => {
    this.setState({
      hideContextMenu: true,
    });
  };

  hideChrome = (event: React.FocusEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    const { visiblePopup } = this.state;
    const { player } = this.props;
    const isFullscreen = player.isFullscreen();

    if (!player.paused() && !isFullscreen && visiblePopup === null) {
      this.setChromeVisibility(false);
    }
  };

  showChrome = (event: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
    event.stopPropagation();

    this.setChromeVisibility(true);
  };

  setChromeVisibility = (visible: boolean) => {
    const { visiblePopup } = this.state;

    this.setState({
      isChromeVisible: visible,
      visiblePopup: visible ? visiblePopup : null,
    });
  };

  setVisiblePopup = (popupName: VideoPopup) => {
    this.setState({
      visiblePopup: popupName,
    });
  };

  assignRef = (node: HTMLElement | null) => {
    this.node = node;
  };

  render() {
    const { defaultSubtitleLanguage, nextItem, player, videoQuizQuestions } = this.props;

    const { isChromeVisible, visiblePopup, showAutoNextOverlay, showPlayButton, hideContextMenu } = this.state;

    const isAutoNextEnabled = userPreferences && userPreferences.get('autoplay');

    return (
      <div
        ref={this.assignRef}
        role="presentation"
        className={classNames('rc-VideoControlsContainer', { hideContextMenu })}
        onClick={this.onClick}
        onFocus={this.showChrome}
        onContextMenu={this.onContextMenu}
        onBlur={this.hideChrome}
        onMouseEnter={!showPlayButton ? this.showChrome : undefined}
        onMouseLeave={this.hideChrome}
        onMouseMove={this.handleVideoRegionMouseMove}
      >
        {showPlayButton && (
          <PlayButton onClick={this.onPlayButtonClick} onKeyPress={this.onPlayButtonKeyPress} haspopup={false} />
        )}

        {showAutoNextOverlay && nextItem && player.ended() && (
          <AutoNextOverlay
            onCancel={() => this.setState({ showAutoNextOverlay: false })}
            player={player}
            nextItem={nextItem}
            isAutoNextEnabled={isAutoNextEnabled}
          />
        )}

        <ControlBar
          visiblePopup={visiblePopup}
          videoQuizQuestions={videoQuizQuestions}
          setVisiblePopup={this.setVisiblePopup}
          visible={isChromeVisible}
          player={player}
          defaultSubtitleLanguage={defaultSubtitleLanguage}
          setChromeVisibility={this.setChromeVisibility}
        />
      </div>
    );
  }
}

export default VideoControlsContainer;
