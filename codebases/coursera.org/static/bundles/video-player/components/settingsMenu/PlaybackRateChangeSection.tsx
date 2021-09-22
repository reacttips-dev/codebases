import React from 'react';
import _t from 'i18n!nls/video-player';

import 'css!./__styles__/PlaybackRateChangeSection';

type Props = {
  playbackRate: 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
  onIncreasePlaybackRateClick: (event: React.MouseEvent<HTMLElement>) => void;
  onDecreasePlaybackRateClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const formatPlaybackRate = (playbackRate: $TSFixMe) => playbackRate && `${playbackRate.toFixed(2)}x`;

const PlaybackRateChangeSection = ({
  playbackRate,
  onIncreasePlaybackRateClick,
  onDecreasePlaybackRateClick,
}: Props) => {
  const minPlaybackRate = 0.75;
  const maxPlaybackRate = 2;
  const isDecreaseDisabled = playbackRate === minPlaybackRate;
  const isIncreaseDisabled = playbackRate === maxPlaybackRate;

  return (
    <div className="rc-PlaybackRateChangeSection">
      <div className="playback-rate-change-header horizontal-box align-items-absolute-center">
        {_t('Playback Rate')}
      </div>

      <div className="video-setting-separator" />

      <div className="playback-rate-change-controls horizontal-box align-items-absolute-center">
        <button
          type="button"
          aria-label={_t('decrease playback rate')}
          onClick={onDecreasePlaybackRateClick}
          disabled={isDecreaseDisabled}
        >
          <span className="cif-minus" />
        </button>

        <span className="playback-rate-text">{formatPlaybackRate(playbackRate)}</span>

        <button
          type="button"
          aria-label={_t('increase playback rate')}
          onClick={onIncreasePlaybackRateClick}
          disabled={isIncreaseDisabled}
        >
          <span className="cif-plus" />
        </button>
      </div>
    </div>
  );
};

export default PlaybackRateChangeSection;
