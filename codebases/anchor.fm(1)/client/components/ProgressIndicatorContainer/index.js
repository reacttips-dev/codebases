// thin wrapper just for playback position connection
import React from 'react';
import { connect } from 'react-redux';
import ProgressIndicator from '../ProgressIndicator';

const mapStateToProps = ({ playbackPosition }) => ({
  playingPosition: playbackPosition.playbackPositionInMs,
});

export default connect(mapStateToProps)(ProgressIndicator);
