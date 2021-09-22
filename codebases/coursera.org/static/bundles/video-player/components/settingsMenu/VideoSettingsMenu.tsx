import React from 'react';
import userPreferences from 'bundles/video-player/utils/userPreferences';
import constants from 'bundles/video-player/constants';

import { VideoPlayer } from 'bundles/item-lecture/types';

import SettingsMenuButton from 'bundles/video-player/components/settingsMenu/SettingsMenuButton';
import SettingsMenuPopup from 'bundles/video-player/components/settingsMenu/SettingsMenuPopup';

import 'css!./__styles__/VideoSettingsMenu';

type Props = {
  onSettingsMenuClick: () => void;
  assignRef: (node: HTMLElement | null) => void;
  menuPopupVisible: boolean;
  player: VideoPlayer;
};

type State = {
  currentPlaybackRate: 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2 | null;
  currentResolution: '360p' | '540p' | '720p' | null;
  autoplayEnabled: boolean | null;
};

class VideoSettingsMenu extends React.Component<Props, State> {
  videoSettingsRef: HTMLElement | null | undefined;

  state: State = {
    currentPlaybackRate: null,
    currentResolution: null,
    autoplayEnabled: null,
  };

  componentDidMount() {
    const { player } = this.props;

    this.setState({
      currentPlaybackRate: player.playbackRate(),
      currentResolution: player.resolution(),
      autoplayEnabled: userPreferences.get('autoplay'),
    });

    player.on('resolutionchange', this.onResolutionChange);
    player.on('ratechange', this.onPlaybackRateChange);
    player.on('autoplaychange', this.onAutoplayChange);
  }

  componentWillUnmount() {
    const { player } = this.props;

    player.off('resolutionchange', this.onResolutionChange);
    player.off('ratechange', this.onPlaybackRateChange);
    player.off('autoplaychange', this.onAutoplayChange);
  }

  onPlaybackRateChange = () => {
    const { player } = this.props;
    const currentPlaybackRate = player.playbackRate();

    this.setState({ currentPlaybackRate });
    userPreferences.set('playbackRate', currentPlaybackRate);
  };

  onResolutionChange = () => {
    const { player } = this.props;
    const currentResolution = player.resolution();

    this.setState({ currentResolution });
    userPreferences.set('resolution', currentResolution);
  };

  onAutoplayChange = () => {
    const autoplayEnabled = userPreferences.get('autoplay');

    this.setState({ autoplayEnabled });
  };

  onIncreaseResolutionClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const { player } = this.props;
    player.increaseResolution();
  };

  onDecreaseResolutionClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const { player } = this.props;
    player.decreaseResolution();
  };

  onIncreasePlaybackRateClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const { player } = this.props;
    const { currentPlaybackRate } = this.state;
    const { playbackRates } = constants;

    const currentPlaybackRateIndex = playbackRates.findIndex((rate) => rate === currentPlaybackRate);
    const newPlaybackRateIndex = Math.min(playbackRates.length - 1, currentPlaybackRateIndex + 1);
    const newPlaybackRate = playbackRates[newPlaybackRateIndex];

    player.playbackRate(newPlaybackRate);
  };

  onDecreasePlaybackRateClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const { player } = this.props;
    const { currentPlaybackRate } = this.state;
    const { playbackRates } = constants;

    const currentPlaybackRateIndex = playbackRates.findIndex((rate) => rate === currentPlaybackRate);
    const newPlaybackRateIndex = Math.max(0, currentPlaybackRateIndex - 1);
    const newPlaybackRate = playbackRates[newPlaybackRateIndex];

    player.playbackRate(newPlaybackRate);
  };

  onEnableAutoplayClick = () => {
    const { player } = this.props;
    userPreferences.set('autoplay', true);
    player.trigger('autoplaychange');
  };

  onDisableAutoplayClick = () => {
    const { player } = this.props;
    userPreferences.set('autoplay', false);
    player.trigger('autoplaychange');
  };

  render() {
    const { onSettingsMenuClick, assignRef, player, menuPopupVisible } = this.props;
    const { currentPlaybackRate, currentResolution, autoplayEnabled } = this.state;

    // don't render if state hasn't been initialized from player
    if (currentPlaybackRate === null || currentResolution === null || autoplayEnabled === null) {
      return null;
    }

    return (
      <div ref={assignRef} className="rc-VideoSettingsMenu">
        <SettingsMenuButton player={player} menuPopupVisible={menuPopupVisible} onClick={onSettingsMenuClick} />

        <SettingsMenuPopup
          visible={menuPopupVisible}
          onIncreasePlaybackRateClick={this.onIncreasePlaybackRateClick}
          onDecreasePlaybackRateClick={this.onDecreasePlaybackRateClick}
          playbackRate={currentPlaybackRate}
          onIncreaseResolutionClick={this.onIncreaseResolutionClick}
          onDecreaseResolutionClick={this.onDecreaseResolutionClick}
          currentResolution={currentResolution}
          onEnableAutoplayClick={this.onEnableAutoplayClick}
          onDisableAutoplayClick={this.onDisableAutoplayClick}
          autoplayEnabled={autoplayEnabled}
        />
      </div>
    );
  }
}

export default VideoSettingsMenu;
