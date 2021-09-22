import React from 'react';
import _t from 'i18n!nls/video-player';

import 'css!./__styles__/ResolutionChangeSection';

type Props = {
  currentResolution: '360p' | '540p' | '720p';
  onIncreaseResolutionClick: (event: React.MouseEvent<HTMLElement>) => void;
  onDecreaseResolutionClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const ResolutionChangeSection = ({
  currentResolution,
  onDecreaseResolutionClick,
  onIncreaseResolutionClick,
}: Props) => {
  const resolutionMap = {
    '360p': _t('Low'),
    '540p': _t('Medium'),
    '720p': _t('High'),
  };

  const resolutionDisplayText = `${currentResolution} (${resolutionMap[currentResolution]})`;

  const isDecreaseDisabled = currentResolution === '360p';
  const isIncreaseDisabled = currentResolution === '720p';

  return (
    <div className="rc-ResolutionChangeSection">
      <div className="resolution-change-header horizontal-box align-items-absolute-center">{_t('Video Quality')}</div>

      <div className="video-setting-separator" />

      <div className="resolution-change-controls horizontal-box align-items-absolute-center">
        <button
          type="button"
          aria-label={_t('decrease video quality')}
          onClick={onDecreaseResolutionClick}
          disabled={isDecreaseDisabled}
        >
          <span className="cif-minus" />
        </button>

        <span className="resolution-text">{resolutionDisplayText}</span>

        <button
          type="button"
          aria-label={_t('increase video quality')}
          onClick={onIncreaseResolutionClick}
          disabled={isIncreaseDisabled}
        >
          <span className="cif-plus" />
        </button>
      </div>
    </div>
  );
};

export default ResolutionChangeSection;
