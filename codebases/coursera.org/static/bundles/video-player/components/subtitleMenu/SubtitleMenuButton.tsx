import React from 'react';
import classNames from 'classnames';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';
import { isRightToLeft } from 'js/lib/language';

import _t from 'i18n!nls/videojs';

type Props = {
  menuPopupVisible: boolean;
  onClick: () => void;
};

const SubtitleMenuButton = ({ menuPopupVisible, onClick }: Props) => {
  const label = _t('Subtitles');
  const tooltip = !menuPopupVisible && <Tooltip> {label} </Tooltip>;
  let ariaLabel = _t('Subtitles: closed');
  if (menuPopupVisible) ariaLabel = _t('Subtitles: open');

  const isRtl = isRightToLeft(_t.getLocale());
  const button = (
    <button
      type="button"
      id="subtitle-menu-button"
      className={classNames(
        'vjs-subtitles-button',
        'vjs-menu-button',
        'vjs-menu-button-popup',
        'vjs-button',
        'vjs-control',
        'c-vjs-button'
      )}
      aria-disabled="false"
      aria-haspopup="true"
      aria-controls="subtitle-menu"
      aria-label={ariaLabel}
      aria-expanded={menuPopupVisible}
      onClick={onClick}
    >
      <span
        className={classNames('cif-2x', 'cif-fw', 'cif-captions', {
          'cif-rtl': isRtl,
        })}
      />
      <span className="vjs-control-text"> {label} </span>
    </button>
  );

  const buttonWithTooltipAsNecessary = tooltip ? (
    <OverlayTrigger placement="top" overlay={tooltip}>
      {button}
    </OverlayTrigger>
  ) : (
    button
  );

  return buttonWithTooltipAsNecessary;
};

export default SubtitleMenuButton;
