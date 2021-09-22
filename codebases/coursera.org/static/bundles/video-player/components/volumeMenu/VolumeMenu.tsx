import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import userPreferences from 'bundles/video-player/utils/userPreferences';

import VolumeMenuButton from 'bundles/video-player/components/volumeMenu/VolumeMenuButton';
import VolumeMenuPopup from 'bundles/video-player/components/volumeMenu/VolumeMenuPopup';

import 'css!./__styles__/VolumeMenu';

import { createVideoEventTracker } from 'bundles/video-player/utils/AnalyticsMetadataFetcher';
import { VideoPlayer } from 'bundles/item-lecture/types';
import { VideoMetaData } from 'bundles/video-player/types/VideoAnalytics';

type Props = {
  player: VideoPlayer;
  setVolumeMenuPopup: () => void;
  assignRef: (node: HTMLElement | null) => void;
};

type State = {
  menuPopupVisible: boolean;
  muted: boolean | null;
  volume: number | null;
  isSliderChanging: boolean;
};

class VolumeMenu extends React.Component<Props, State> {
  static contextTypes = {
    _eventData: PropTypes.object,
  };

  state: State = {
    menuPopupVisible: false,
    muted: null,
    volume: null,
    isSliderChanging: false,
  };

  componentDidMount() {
    const { player } = this.props;

    this.setState({
      volume: player.volume(),
      muted: player.muted(),
    });

    player.on('volumechange', this.onVolumeChange);
  }

  componentWillUnmount() {
    const { player } = this.props;
    player.off('volumechange', this.onVolumeChange);
  }

  onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  onMenuEnter = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    const { setVolumeMenuPopup } = this.props;

    setVolumeMenuPopup();

    this.setState({ menuPopupVisible: true });
  };

  onMenuLeave = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const { isSliderChanging } = this.state;
    if (!isSliderChanging) {
      this.setState({ menuPopupVisible: false });
    }
  };

  onVolumeChange = () => {
    const { player } = this.props;
    const { volume: currentVolume } = this.state;

    if (currentVolume !== null && typeof currentVolume !== 'undefined') {
      this.trackVolumeEvent('volume.change', {
        /* eslint-disable-next-line camelcase */
        volume_delta: player.volume() - currentVolume,
      });
    }

    this.setState({
      volume: player.volume(),
      muted: player.muted(),
    });
  };

  onVolumeButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const { player } = this.props;
    const isMuted = player.muted();
    const toggledIsMuted = !isMuted;

    player.muted(toggledIsMuted);

    userPreferences.set('volume', toggledIsMuted ? 0 : player.volume());

    if (toggledIsMuted) {
      this.trackVolumeEvent('mute');
    } else {
      this.trackVolumeEvent('unmute');
      // if the volume is 0 - set the volume to "unmute" the player
      if (player.volume() === 0) {
        const defaultVolume = 0.3;
        player.volume(defaultVolume);
        this.setState({ volume: defaultVolume });
        userPreferences.set('volume', defaultVolume);
      }
    }

    this.setState({
      muted: player.muted(),
    });
  };

  onVolumeSliderChange = (value: number) => {
    const { player } = this.props;

    if (value === 0) {
      player.volume(0);
      player.muted(true);
    } else {
      player.volume(value / 100);
      player.muted(false);
    }

    userPreferences.set('volume', player.muted() ? 0 : player.volume());
  };

  onBeforeChange = () => {
    this.setState({
      isSliderChanging: true,
    });
  };

  onAfterChange = () => {
    this.setState({
      isSliderChanging: false,
    });
  };

  trackVolumeEvent = (event: string, data?: VideoMetaData) => {
    const { player } = this.props;
    const {
      _eventData: {
        namespace: { app },
      },
    } = this.context;
    const track = createVideoEventTracker(app, player);

    track(event, { ...data });
  };

  render() {
    const { assignRef } = this.props;
    const { menuPopupVisible, muted, volume } = this.state;

    // make sure the state has been initialized to some sane values
    if (muted === null || muted === undefined || volume === null || volume === undefined) {
      return null;
    }

    return (
      <div
        className={classNames('rc-VolumeMenu', 'horizontal-box', 'align-items-absolute-center')}
        role="presentation"
        onMouseEnter={this.onMenuEnter}
        onMouseLeave={this.onMenuLeave}
        onClick={this.onClick}
        ref={assignRef}
      >
        <VolumeMenuButton onVolumeButtonClick={this.onVolumeButtonClick} volume={volume} muted={muted} />
        <VolumeMenuPopup
          visible={menuPopupVisible}
          volume={volume}
          muted={muted}
          onVolumeSliderChange={this.onVolumeSliderChange}
          onBeforeChange={this.onBeforeChange}
          onAfterChange={this.onAfterChange}
        />
      </div>
    );
  }
}

export default VolumeMenu;
