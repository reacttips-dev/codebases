import React from 'react';
import { InteractiveTranscript } from 'bundles/interactive-transcript';

import { generateHighlightFromTranscriptSelection } from 'bundles/video-highlighting/utils/highlightUtils';

import type { Highlight, TranscriptSelection } from 'bundles/video-highlighting';
import type Track from 'bundles/interactive-transcript/models/Track';
import type { VideoPlayer } from 'bundles/item-lecture/types';

type Props = {
  player: VideoPlayer;
  selectedTrack: Track;

  highlights?: Array<Highlight>;

  onRemoveHighlight?: (x: string) => void;
  onSaveHighlight?: (highlight: Highlight) => void;
  courseId?: string;
};

type State = {
  // double, in seconds
  time: number;
};

class VideoJsTranscriptContainer extends React.Component<Props, State> {
  static defaultProps = {
    onSaveHighlight: () => {},
    onRemoveHighlight: () => {},
  };

  state = {
    time: 0,
  };

  componentDidMount() {
    const { player } = this.props;
    player.on('timeupdate', this.handleTimeUpdate);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { player } = this.props;

    // if we are no longer passing a player in, the player is being destroyed. Remove handler.
    if (player && !nextProps.player) {
      player.off('timeupdate', this.handleTimeUpdate);
    }
  }

  componentWillUnmount() {
    const { player } = this.props;
    player.off('timeupdate', this.handleTimeUpdate);
  }

  handleTimeUpdate = () => {
    const { player } = this.props;

    this.setState({
      time: player.currentTime(),
    });
  };

  handleTimeChange = (time: number) => {
    const { player } = this.props;
    player.currentTime(time);

    if (player.paused()) {
      player.play();
    }

    this.setState({ time });
  };

  handleSaveHighlight = (transcriptSelection: TranscriptSelection) => {
    const { selectedTrack, onSaveHighlight } = this.props;
    const highlight = generateHighlightFromTranscriptSelection(transcriptSelection, selectedTrack);

    if (onSaveHighlight) {
      onSaveHighlight(highlight);
    }
  };

  handlePausePlayer = () => {
    const { player } = this.props;

    player.pause();
  };

  render() {
    const { time } = this.state;
    const { selectedTrack, highlights, onRemoveHighlight, courseId } = this.props;

    return (
      <InteractiveTranscript
        time={time}
        timeDiff={undefined}
        track={selectedTrack}
        highlights={highlights || []}
        onTimeChange={this.handleTimeChange}
        onRemoveHighlight={onRemoveHighlight}
        onSaveHighlight={this.handleSaveHighlight}
        courseId={courseId}
        handlePausePlayer={this.handlePausePlayer}
      />
    );
  }
}

export default VideoJsTranscriptContainer;
