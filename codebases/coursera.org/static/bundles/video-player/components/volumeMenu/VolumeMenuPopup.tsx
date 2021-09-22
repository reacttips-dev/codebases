import React from 'react';
import classNames from 'classnames';

import Slider from 'rc-slider';

import { color } from '@coursera/coursera-ui';

import _t from 'i18n!nls/videojs';
import { isRightToLeft } from 'js/lib/language';

import 'css!./__styles__/VolumeMenuPopup';
import 'css!rc-slider/assets/index';

type Props = {
  visible: boolean;
  volume: number;
  muted: boolean;
  onVolumeSliderChange: (value: number) => void;
  onBeforeChange: () => void;
  onAfterChange: () => void;
};

const VolumeMenuPopup = ({ visible, volume, muted, onVolumeSliderChange, onBeforeChange, onAfterChange }: Props) => (
  <div className={classNames('rc-VolumeMenuPopup', 'horizontal-box', 'align-items-absolute-center', { visible })}>
    <Slider
      className="rc-VolumeSlider"
      value={muted ? 0 : volume * 100}
      onChange={onVolumeSliderChange}
      onBeforeChange={onBeforeChange}
      onAfterChange={onAfterChange}
      trackStyle={{
        backgroundColor: color.white,
        cursor: 'pointer',
      }}
      handleStyle={{
        borderColor: color.white,
        height: '10px',
        width: '10px',
        marginLeft: '-5px',
        marginTop: '-3px',
        cursor: 'pointer',
      }}
      railStyle={{
        backgroundColor: '#aaa',
      }}
      reverse={isRightToLeft(_t.getLocale())}
    />
  </div>
);

export default VolumeMenuPopup;
