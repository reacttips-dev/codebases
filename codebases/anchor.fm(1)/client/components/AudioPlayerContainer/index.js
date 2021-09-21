// thin wrapper just for playback position connection
import React from 'react';
import { connect } from 'react-redux';
import {
  playedForOneSecond,
  setDoSeek,
  updatePlaybackPosition,
} from '../../playbackPosition';
import AudioPlayer from '../AudioPlayer';

const mapDispatchToProps = (dispatch, { recordSeconds = false }) => ({
  actions: {
    playedForOneSecond: recordSeconds
      ? () => dispatch(playedForOneSecond())
      : undefined,
    setDoSeek: doSeek => dispatch(setDoSeek(doSeek)),
    updatePlaybackPosition: position =>
      dispatch(updatePlaybackPosition(position)),
  },
});

const mapStateToProps = ({
  playbackPosition,
  localStorage: { playbackSpeed },
}) => ({
  doSeek: playbackPosition.doSeek,
  playbackPosition: playbackPosition.playbackPosition,
  playbackSpeed,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayer);
