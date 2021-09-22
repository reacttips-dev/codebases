import React from 'react';
// TODO: Get rid of dependency on teach-course.
import ToggleSwitch from 'bundles/teach-course/components/ToggleSwitch';

import _t from 'i18n!nls/video-player';

import 'css!./__styles__/AutoplayChangeSection';

type Props = {
  autoplayEnabled: boolean;
  onEnableAutoplayClick: () => void;
  onDisableAutoplayClick: () => void;
};

const AutoplayChangeSection = ({ autoplayEnabled, onEnableAutoplayClick, onDisableAutoplayClick }: Props) => (
  <div className="rc-AutoplayChangeSection">
    <div className="autoplay-adjust-header horizontal-box align-items-absolute-center">{_t('Autoplay')}</div>
    <div className="video-setting-separator" />
    <div className="autoplay-adjust-controls horizontal-box align-items-spacearound">
      <ToggleSwitch
        ariaLabel={autoplayEnabled ? _t('disable autoplay') : _t('enable autoplay')}
        onToggle={(toggleStatus) => {
          if (toggleStatus === ToggleSwitch.getStatus().On) {
            onEnableAutoplayClick();
          } else {
            onDisableAutoplayClick();
          }
        }}
        defaultStatus={autoplayEnabled ? ToggleSwitch.getStatus().On : ToggleSwitch.getStatus().Off}
      />
    </div>
  </div>
);

export default AutoplayChangeSection;
