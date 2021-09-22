import React, { Component } from 'react';
import classNames from 'classnames';

import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

import _t from 'i18n!nls/videojs';

import VideoTrackedButton from '../VideoTrackedButton';

type Props = {
  menuPopupVisible: boolean;
  onClick: () => void;
  player: any;
};

class SettingsMenuButton extends Component<Props> {
  render() {
    const { menuPopupVisible, player, onClick } = this.props;

    const label = _t('Settings');
    const tooltip = !menuPopupVisible && <Tooltip> {label} </Tooltip>;

    const button = (
      <VideoTrackedButton
        type="button"
        player={player}
        trackingName={`settings_menu.${menuPopupVisible ? 'close' : 'open'}`}
        onClick={onClick}
        className={classNames('vjs-menu-button', 'vjs-menu-button-popup', 'vjs-button', 'vjs-control', 'c-vjs-button')}
        aria-disabled="false"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label={label}
      >
        <span className={classNames('cif-2x', 'cif-fw', 'cif-cog')} />
        <span className="vjs-control-text"> {label} </span>
      </VideoTrackedButton>
    );

    const buttonWithTooltipAsNecessary = tooltip ? (
      <OverlayTrigger placement="top" overlay={tooltip}>
        {button}
      </OverlayTrigger>
    ) : (
      button
    );

    return buttonWithTooltipAsNecessary;
  }
}

export default SettingsMenuButton;
