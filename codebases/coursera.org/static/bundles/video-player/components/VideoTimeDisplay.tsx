import React from 'react';
import classNames from 'classnames';
import _t from 'i18n!nls/video-player';
import { isRightToLeft } from 'js/lib/language';

import 'css!./__styles__/VideoTimeDisplay';

type Props = {
  player: any;
};

type State = {
  currentTime: number | null;
  duration: number | null;
};

class VideoTimeDisplay extends React.Component<Props, State> {
  state = {
    currentTime: null,
    duration: null,
  };

  componentDidMount() {
    const { player } = this.props;
    this.setState({
      currentTime: player.currentTime(),
      duration: player.duration(),
    });
    player.on('timeupdate', this.onTimeChange);
    player.on('durationchange', this.onDurationChange);
  }

  componentWillUnmount() {
    const { player } = this.props;
    player.off('timeupdate', this.onTimeChange);
    player.off('durationchange', this.onDurationChange);
  }

  onTimeChange = () => {
    const { player } = this.props;
    this.setState({
      currentTime: player.currentTime(),
    });
  };

  onDurationChange = () => {
    const { player } = this.props;
    this.setState({
      duration: player.duration(),
    });
  };

  convertSecondsToDisplay = (timeInSeconds: number | null): string => {
    if (!timeInSeconds) {
      return `0:00`;
    }

    const minuteDisplay = `${Math.floor(timeInSeconds / 60)}`;
    const secondsDisplay = `${Math.floor(timeInSeconds % 60)}`.padStart(2, '0');
    return `${minuteDisplay}:${secondsDisplay}`;
  };

  render() {
    const { currentTime, duration } = this.state;

    // don't render in case state hasn't initialized correctly
    if (currentTime === null || currentTime === undefined || duration === null || duration === undefined) {
      return null;
    }
    const isRtl = isRightToLeft(_t.getLocale());

    return (
      <div
        className={classNames('rc-VideoTimeDisplay', 'horizontal-box', 'align-items-absolute-center')}
        style={{ flexDirection: isRtl ? 'row-reverse' : 'row' /* Timestamps should render LTR. */ }}
      >
        <span className="current-time-display">{this.convertSecondsToDisplay(currentTime)}</span>
        <span className="time-separator">/</span>
        <span className="duration-display">{this.convertSecondsToDisplay(duration)}</span>
      </div>
    );
  }
}

export default VideoTimeDisplay;
