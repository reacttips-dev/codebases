// thin wrapper just for playback position connection
import React from 'react';
import { connect } from 'react-redux';
import StationProgressBar from '../StationProgressBar';
import { updateEpisodePlaybackPosition } from '../../station';

const mapDispatchToProps = dispatch => ({
  onSeekPlaybackPosition: positionInMs =>
    dispatch(updateEpisodePlaybackPosition(positionInMs, true)),
});

const mapStateToProps = ({ playbackPosition }) => ({
  playingPosition: playbackPosition.playbackPositionInMs,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StationProgressBar);
