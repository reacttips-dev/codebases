import React from 'react';

import classNames from 'classnames';

import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

import _t from 'i18n!nls/videojs';
import 'css!./__styles__/PlayToggle';

type Props = {
  player: any;
};

type State = {
  isPlaying: boolean;
};

class PlayToggle extends React.Component<Props, State> {
  state = {
    isPlaying: false,
  };

  componentDidMount() {
    const { player } = this.props;
    this.setState({
      isPlaying: !player.paused(),
    });
    player.on('play', this.onPlay);
    player.on('pause', this.onPause);
  }

  componentWillUnmount() {
    const { player } = this.props;
    player.off('play', this.onPlay);
    player.off('pause', this.onPause);
  }

  onPlay = () => {
    this.setState({ isPlaying: true });
  };

  onPause = () => {
    this.setState({ isPlaying: false });
  };

  togglePlaying = () => {
    const { isPlaying } = this.state;
    const { player } = this.props;

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  render() {
    const { isPlaying } = this.state;
    const label = isPlaying ? _t('Pause') : _t('Play');
    const tooltip = <Tooltip> {label} </Tooltip>;

    // NOTE: continuing to use the VJS skin styles for now
    // once we get stuff into React we can migrate the skin
    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <button
          type="button"
          onClick={this.togglePlaying}
          className={classNames('rc-PlayToggle')}
          aria-label={label}
          aria-disabled={false}
        >
          <span
            className={classNames('cif-2x', 'cif-fw', {
              'cif-play': !isPlaying,
              'cif-pause': isPlaying,
            })}
          />
          <span className="vjs-control-text"> {label} </span>
        </button>
      </OverlayTrigger>
    );
  }
}

export default PlayToggle;
