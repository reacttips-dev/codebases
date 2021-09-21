import React, { Component } from 'react';

class EpisodeSegmentPlayer extends Component {
  handlePlayOrPauseButtonClick = e => {
    e.preventDefault();
    const { isPlaying, onPlayOrPause } = this.props;
    onPlayOrPause(isPlaying ? 'Pause Button' : 'Play Button');
  };

  render() {
    return this.props.playerRender(this.handlePlayOrPauseButtonClick);
  }
}

export default EpisodeSegmentPlayer;
