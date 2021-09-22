import React from 'react';
import { SvgPlayFilled, SvgPauseFilled } from '@coursera/coursera-ui/svg';

import TrackedDiv from 'bundles/page/components/TrackedDiv';

import { VideoPlayer } from 'bundles/item-lecture/types';

import _t from 'i18n!nls/item-lecture';

import 'css!./__styles__/VideoMiniControls';

type Props = {
  videoPlayer: VideoPlayer;
};

type State = {
  playing: boolean;
};

class VideoMiniControls extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      playing: !props.videoPlayer.paused(),
    };
  }

  componentDidMount() {
    const { videoPlayer } = this.props;

    videoPlayer.on('play', this.handlePlay);
    videoPlayer.on('pause', this.handlePause);
  }

  componentWillUnmount() {
    const { videoPlayer } = this.props;

    videoPlayer.off('play', this.handlePlay);
    videoPlayer.off('pause', this.handlePause);
  }

  handlePlay = () => {
    this.setState({ playing: true });
  };

  handlePause = () => {
    this.setState({ playing: false });
  };

  handleToggle = () => {
    const { videoPlayer } = this.props;

    if (videoPlayer.paused()) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  };

  render() {
    const { playing } = this.state;
    const trackingName = playing ? 'pause_mini_video' : 'play_mini_video';

    return (
      <TrackedDiv trackingName={trackingName} className="rc-VideoMiniControls" onClick={this.handleToggle}>
        <div className="video-mini-actions">
          {!playing && <SvgPlayFilled title={_t('Play')} size={30} color="#fff" />}
          {playing && <SvgPauseFilled title={_t('Pause')} size={30} color="#fff" />}
        </div>
      </TrackedDiv>
    );
  }
}

export default VideoMiniControls;
