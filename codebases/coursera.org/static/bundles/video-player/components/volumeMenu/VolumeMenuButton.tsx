import React from 'react';
import classNames from 'classnames';

import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

import _t from 'i18n!nls/videojs';
import { isRightToLeft } from 'js/lib/language';

type Props = {
  onVolumeButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  volume: number;
  muted: boolean;
};

const VolumeMenuButton = ({ onVolumeButtonClick, volume, muted }: Props) => {
  const label = _t('Volume');
  const tooltipText = muted ? _t('Unmute') : _t('Mute');

  const tooltip = <Tooltip> {tooltipText} </Tooltip>;
  const isRtl = isRightToLeft(_t.getLocale());
  return (
    <OverlayTrigger placement="top" overlay={tooltip}>
      <button
        type="button"
        className={classNames('vjs-button', 'vjs-control', 'c-vjs-button')}
        aria-disabled="false"
        aria-label={tooltipText}
        onClick={onVolumeButtonClick}
      >
        <span
          className={classNames('cif-2x', 'cif-fw', {
            'cif-volume-up': !muted && volume > 0.3,
            'cif-volume-down': !muted && volume > 0 && volume <= 0.3,
            'cif-volume-off': muted || volume === 0,
            'cif-rtl': isRtl,
          })}
        />
        <span className="vjs-control-text"> {label} </span>
      </button>
    </OverlayTrigger>
  );
};

export default VolumeMenuButton;
