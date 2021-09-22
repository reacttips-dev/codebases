import React from 'react';
import classNames from 'classnames';

import ResolutionChangeSection from 'bundles/video-player/components/settingsMenu/ResolutionChangeSection';
import PlaybackRateChangeSection from 'bundles/video-player/components/settingsMenu/PlaybackRateChangeSection';
import AutoplayChangeSection from 'bundles/video-player/components/settingsMenu/AutoplayChangeSection';

import 'css!./__styles__/SettingsMenuPopup';

type Props = {
  // control visibility via prop to allow fade transitions
  visible: boolean;
  // resolution adjustment state
  currentResolution: '360p' | '540p' | '720p';
  onIncreaseResolutionClick: (event: React.MouseEvent<HTMLElement>) => void;
  onDecreaseResolutionClick: (event: React.MouseEvent<HTMLElement>) => void;
  // playback rate state
  playbackRate: 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
  onIncreasePlaybackRateClick: (event: React.MouseEvent<HTMLElement>) => void;
  onDecreasePlaybackRateClick: (event: React.MouseEvent<HTMLElement>) => void;
  // autoplay state
  autoplayEnabled: boolean;
  onEnableAutoplayClick: () => void;
  onDisableAutoplayClick: () => void;
};

const SettingsMenuPopup = ({
  visible,
  currentResolution,
  onIncreaseResolutionClick,
  onDecreaseResolutionClick,
  playbackRate,
  onIncreasePlaybackRateClick,
  onDecreasePlaybackRateClick,
  autoplayEnabled,
  onEnableAutoplayClick,
  onDisableAutoplayClick,
}: Props) => (
  <div className={classNames('rc-SettingsMenuPopup', { visible })}>
    <ResolutionChangeSection
      currentResolution={currentResolution}
      onIncreaseResolutionClick={onIncreaseResolutionClick}
      onDecreaseResolutionClick={onDecreaseResolutionClick}
    />
    <PlaybackRateChangeSection
      playbackRate={playbackRate}
      onIncreasePlaybackRateClick={onIncreasePlaybackRateClick}
      onDecreasePlaybackRateClick={onDecreasePlaybackRateClick}
    />
    <AutoplayChangeSection
      autoplayEnabled={autoplayEnabled}
      onEnableAutoplayClick={onEnableAutoplayClick}
      onDisableAutoplayClick={onDisableAutoplayClick}
    />
  </div>
);

export default SettingsMenuPopup;
