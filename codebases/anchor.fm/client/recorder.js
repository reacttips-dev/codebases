/* eslint-disable no-param-reassign */
import { push } from 'react-router-redux';
import moment from 'moment';
import { replaceAudioInEpisode } from 'client/screens/EpisodeEditorScreen/duck';
import {
  fetchMyLibrary,
  receiveLocalRecording,
  setUploadStatuses,
  deleteUploadStatus,
} from './sourceAudio';
import { uploadAudioFile, pollAudioProcessingStatus } from './modules/Upload';

const PREFIX = '@@recorder/';

export const RECORDER_START = `${PREFIX}START`;
export const RECORDER_STOP = `${PREFIX}STOP`;
export const RECORDER_PAUSE = `${PREFIX}PAUSE`;
export const RECORDER_RESUME = `${PREFIX}RESUME`;
export const RECORDER_ON_STOP = `${PREFIX}ON_STOP`;
export const RECORDER_GOT_SOUND = `${PREFIX}GOT_SOUND`;
export const RECORDER_GOT_STREAM = `${PREFIX}GOT_STREAM`;
export const RECORDER_UNMOUNT = `${PREFIX}UNMOUNT`;

const defaultState = {
  active: false, // is recorder currently recording a segment
  audioDetected: false, // have we detected a voice from the stream
  command: 'none', // last command
  stream: null, // the active stream being recorded
  files: [], // files from blobs of recordings after recording stop
  microphone: null, // microphone (from )
};

// reducer
// eslint-disable-next-line import/no-default-export
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case RECORDER_START:
      return { ...state, active: true, command: 'start' };
    case RECORDER_STOP:
      return { ...state, active: false, command: 'stop' };
    case RECORDER_PAUSE:
      return { ...state, active: true, command: 'pause' };
    case RECORDER_RESUME:
      return { ...state, active: true, command: 'resume' };
    case RECORDER_ON_STOP:
      return { ...state, files: state.files.concat(action.file) };
    case RECORDER_GOT_SOUND:
      return { ...state, audioDetected: true };
    case RECORDER_GOT_STREAM: {
      const microphone = action.microphone || state.microphone;
      return { ...state, stream: action.stream, microphone };
    }
    case RECORDER_UNMOUNT:
      return { ...state, active: false, command: 'none', stream: null };
    default:
      return state;
  }
}

export function blobToFile(blob, duration) {
  // Standardize the blob file to redux reducers here
  // TODO: figure out a better unique filename
  const date = new Date();
  const name = moment(date).format('MMM DD, YYYY hh:mm A');
  blob.caption = name;
  blob.name = name;
  blob.lastModifiedDate = date;
  blob.created = date.toString();
  blob.lastModified = date.getTime();
  const url = window.URL.createObjectURL(blob);
  blob.preview = url;
  blob.url = url;
  blob.audioId = url;
  blob.duration = duration;
  return blob;
}

export const recorderStart = () => ({ type: RECORDER_START });

export const recorderStop = () => ({ type: RECORDER_STOP });

export const recorderPause = () => ({ type: RECORDER_PAUSE });

export const recorderResume = () => ({ type: RECORDER_RESUME });

export const recorderOnStop = file => ({
  type: RECORDER_ON_STOP,
  file,
});

export const recorderGotSound = () => ({ type: RECORDER_GOT_SOUND });

export const recorderGotStream = (stream, microphone) => ({
  type: RECORDER_GOT_STREAM,
  stream,
  microphone,
});

export const recorderUnmount = stream => ({
  type: RECORDER_UNMOUNT,
  stream,
});

export function receiveAndUploadRecording(blob, duration, baseUrl, onSuccess) {
  return dispatch => {
    const file = blobToFile(blob, duration);
    const tmpAudioId = file.audioId;
    dispatch(
      receiveLocalRecording({
        ...file,
        key: `${tmpAudioId}-0`,
        tmpAudioId,
      })
    );
    dispatch(recorderOnStop(file));
    dispatch(push(`${baseUrl}library`));
    return dispatch(uploadRecording({ dispatch, file, tmpAudioId, onSuccess }));
  };
}

export function uploadRecording({ file, tmpAudioId, onSuccess }) {
  return async dispatch => {
    try {
      handleSetUploadStatuses('uploading');
      const { requestUuid } = await uploadAudioFile({
        file,
        fileCaption: new Date().toLocaleDateString(),
        origin: 'forweb:podcasthosting',
        onSuccess: () => dispatch(deleteUploadStatus(tmpAudioId)),
        onError: () => handleSetUploadStatuses('error'),
      });
      pollAudioProcessingStatus({
        requestUuid,
        onSuccess: ({ data }) => {
          // If the audio has been added to an episode, update it
          dispatch(
            replaceAudioInEpisode({
              tmpAudioIdToReplace: tmpAudioId,
              audio: { ...data, uploadState: 'processing' },
            })
          );
          if (onSuccess) onSuccess();
          dispatch(fetchMyLibrary());
        },
        onError: () => handleSetUploadStatuses('error'),
      });
    } catch (err) {
      handleSetUploadStatuses('error');
    }

    function handleSetUploadStatuses(status) {
      dispatch(
        setUploadStatuses({
          audioId: tmpAudioId,
          tmpAudioId,
          status,
          file,
          isExtractedFromVideo: false,
        })
      );
    }
  };
}
