import React from 'react';
import classNames from 'classnames';

import _t from 'i18n!nls/videojs';

import 'css!./__styles__/PlayButton';

type Props = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyPress: (event: React.KeyboardEvent<HTMLElement>) => void;
  haspopup?: boolean;
};

const PlayButton = ({ onClick, onKeyPress, haspopup }: Props) => {
  const label = _t('Play Video');

  return (
    <div
      role="presentation"
      onClick={onClick}
      onKeyPress={onKeyPress}
      className="rc-PlayButton horizontal-box align-items-absolute-center"
    >
      <button
        type="button"
        className="vjs-button"
        aria-disabled="false"
        aria-haspopup={haspopup ? true : undefined}
        aria-label={label}
        onClick={onClick}
        onKeyDown={onKeyPress}
      >
        <span className={classNames('cif-stack', 'cif-2x')}>
          <em className={classNames('cif-circle', 'cif-stack-2x', 'cif-inverse')} />
          <em className={classNames('cif-play-circle', 'cif-stack-2x')} />
        </span>
        <span className="vjs-control-text">{label}</span>
      </button>
    </div>
  );
};

PlayButton.defaultProps = {
  haspopup: true,
};

export default PlayButton;
