import React from 'react';
import classNames from 'classnames';

import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

import _t from 'i18n!nls/videojs';

import 'css!./__styles__/FullscreenToggle';

type Props = {
  player: any;
  setChromeVisibility: (x: boolean) => void;
};

type State = {
  isFullscreen: boolean;
};

class FullscreenToggle extends React.Component<Props, State> {
  timeoutID: number | null | undefined;

  state = {
    isFullscreen: false,
  };

  componentDidMount() {
    // you may wonder why we don't directly adjust the button state...
    // this is because the fullscreen property is really player-level state
    // results of 'exitFullscreen' or 'requestFullscreen' need to be delegated
    // through player events
    const { player } = this.props;
    player.on('fullscreenchange', this.onFullscreenChange);
  }

  componentWillUnmount() {
    const { player } = this.props;
    player.off('fullscreenchange', this.onFullscreenChange);

    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
  }

  onFullscreenChange = () => {
    const { player } = this.props;
    const isFullscreen = player.isFullscreen();
    this.setState({ isFullscreen });
  };

  toggleFullscreen = () => {
    const { player, setChromeVisibility } = this.props;
    const isFullscreen = player.isFullscreen();

    if (isFullscreen) {
      player.exitFullscreen();
    } else {
      player.requestFullscreen();
      this.timeoutID = window.setTimeout(() => {
        setChromeVisibility(false);
      }, 5000);
    }
  };

  render() {
    const { isFullscreen } = this.state;
    const label = _t('Full Screen');
    const tooltip = <Tooltip> {label} </Tooltip>;

    // NOTE: continuing to use the VJS skin styles for now
    // once we get stuff into React we can migrate the skin
    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <button
          type="button"
          onClick={this.toggleFullscreen}
          className={classNames(
            'rc-FullscreenToggle',
            'vjs-button',
            'c-vjs-button',
            'vjs-control',
            'c-video-control',
            'c-fullscreen-control',
            'horizontal-box',
            'align-items-absolute-center'
          )}
          aria-label={label}
        >
          <span
            className={classNames('cif-2x', 'cif-fw', {
              'cif-expand': !isFullscreen,
              'cif-compress': isFullscreen,
            })}
          />
          <span className="vjs-control-text"> {label} </span>
        </button>
      </OverlayTrigger>
    );
  }
}

export default FullscreenToggle;
