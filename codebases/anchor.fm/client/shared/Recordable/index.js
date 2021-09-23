import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Promise } from 'bluebird';
import { parseUserAgent } from '../../../helpers/serverRenderingUtils';

// We record both webm and wav at the same time and then decide
// which one should be sent to the onRecordingDidFinish based on certain criteria:
//  * if the user is using safari, we send back the wav version because Safair can't play webm
//  * if the recording is longer than 60 seconds, we send back the webm version
//  * if the recording is less than 60 seconds, we send back the wav version
//  * etc

// Questions:
//   Can WEBm record less than 4 seconds?

const noop = () => null;

const handleGetUserMedia = args => {
  if (!navigator.mediaDevices) {
    return Promise.reject(new Error('MediaDevicesNotAvailable'));
  }
  return navigator.mediaDevices.getUserMedia(args);
};

const stopStream = stream => {
  stream.getAudioTracks().forEach(track => {
    track.stop();
  });
};

const WAV_MIME_TYPE = 'audio/wav';
// Firefox can't record to audio/webm, and it's just a wrapper for the same data

const WAV_LIMIT = 60000; // one minute wav limit
const WAV_ONLY_LIMIT = 300000; // five minute wav limit

class Recordable extends Component {
  constructor(props) {
    super(props);

    this.isSafariBrowser = parseUserAgent().browser === 'sa';

    this.state = {
      microphoneLabels: [],
      currentMicrophoneLabel: null,
      msElapsed: 0,
      error: null,
      webmError: null,
      isRecording: false,
      isReadyForRecording: false,
      isBrowserDetected: false, // This is because if we render server-side, our recording libraries will break our app because they expect access to browser recording tools
      isMicrophoneBlocked: false,
      isFetchingMicrophones: false,
      isRecordingSupported: true,
    };

    this.timer = null;
    this.startTime = null;
    this.nowTime = null;
  }

  componentDidMount() {
    if (window) {
      this.setState(
        () => ({
          isBrowserDetected: true,
        }),
        () => {
          // HACK: On iOS Chrome, the user is not prompted for a microphone so this promise is never resolved
          const refreshMicrophonePromise = this.refreshMicrophoneAccess()
            .then(() => {
              this.getMicrophoneLabels()
                .then(microphoneLabels => {
                  this.setState(
                    {
                      microphoneLabels,
                    },
                    () => {
                      this.selectFirstMicrophone()
                        .then(() => {
                          this.getMicrophoneWithLabel(
                            this.state.currentMicrophoneLabel
                          )
                            .then(microphone => {
                              this.setState(
                                () => ({
                                  isReadyForRecording: true,
                                }),
                                () => {
                                  this.props.onReadyForRecording(microphone);
                                }
                              );
                            })
                            .catch(err => {
                              throw err;
                            });
                        })
                        .catch(err => {
                          throw err;
                        });
                    }
                  );
                })
                .catch(err => {
                  this.onGetUserMediaError(err);
                });
            })
            .catch(err => {
              this.onGetUserMediaError(err);
            });
          setTimeout(() => {
            if (!refreshMicrophonePromise.isResolved()) {
              this.setState(() => ({ isMicrophoneBlocked: true }));
            }
          }, 3000);
        }
      );
    }
  }

  refreshMicrophoneAccess = () =>
    new Promise((resolve, reject) => {
      this.setState(
        () => ({
          isFetchingMicrophones: true,
        }),
        () => {
          this.getMicrophoneLabels()
            .then(microphoneLabels => {
              this.setState(() => ({ isMicrophoneBlocked: false }));
              this.setState(() => ({
                isFetchingMicrophones: false,
              }));
              resolve();
            })
            .catch(error => {
              this.setState(() => ({
                isFetchingMicrophones: false,
              }));
              if (
                error.toLocaleString() === 'NotAllowedError: Permission denied'
              ) {
                this.setState(() => ({ isMicrophoneBlocked: true }));
              }
              reject(error);
            });
        }
      );
    });

  componentWillUnmount() {
    const { stream } = this.state;
    this.stopRecording();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (stream) {
      stopStream(stream);
    }
  }

  componentDidUpdate(prevProps) {
    const { stream } = this.state;
    const { command } = this.props;
    if ((stream && this.webmRecorder) || this.wavRecorder) {
      if (command && command !== 'none' && prevProps.command !== command) {
        // TODO: these are no longer instance methods so they have to map to functions
        if (command === 'stop') {
          this.stopRecording();
        }
        if (command === 'start') {
          this.startRecording();
        }
      }
    }
  }

  // TODO: This isn't working. When we switch, record and then play, there isn't
  //       any audio attached to the resulting audio file.
  onGetUserMediaError = error => {
    if (error.toLocaleString() === 'NotAllowedError: Permission denied') {
      this.setState(() => ({ isMicrophoneBlocked: true, error }));
    }
    if (error.toLocaleString() === 'Error: MediaDevicesNotAvailable') {
      this.setState(() => ({ isRecordingSupported: false, error }));
    }
    const { onGetUserMediaError } = this.props;
    onGetUserMediaError(error);
    this.setState({ error });
  };

  onStartRecordingClick = e => {
    this.startTimer();
    this.startRecording();
  };

  onPauseRecordingClick = e => {
    const { onPause } = this.props;
    clearInterval(this.timer);
    onPause();
  };

  onStopRecordingClick = e => {
    // WEBm can't record less than 4 seconds
    // if (this.state.msElapsed && this.state.msElapsed > 4000) {
    this.stopRecording();
    // }
  };

  onWebmError = webmError => {
    // limit to 5 minutes
    this.setState({ webmError });
  };

  errorHandler = event => {
    const error = event.error;
    throw error;
  };

  getMicrophonesAndStream = () => {
    const constraints = { audio: true, video: false };
    return handleGetUserMedia(constraints)
      .then(stream =>
        navigator.mediaDevices.enumerateDevices().then(devices => {
          const microphones = devices.filter(
            device => device.kind === 'audioinput'
          );
          return { microphones, stream };
        })
      )
      .catch(err => {
        this.onGetUserMediaError(err);
        throw err;
      });
  };

  getMicrophoneWithLabel = label =>
    this.getMicrophonesAndStream().then(({ microphones }) => {
      const selectedMicrophone = microphones.find(
        microphone => microphone.label === label
      );
      return Promise.resolve(selectedMicrophone);
    });

  getMicrophoneLabels = () => {
    const constraints = { audio: true, video: false };
    return handleGetUserMedia(constraints)
      .then(stream =>
        navigator.mediaDevices.enumerateDevices().then(devices => {
          const microphoneLabels = devices
            .filter(device => device.kind === 'audioinput')
            .map(microphone => microphone.label);
          if (stream) {
            stopStream(stream);
          }
          return microphoneLabels;
        })
      )
      .catch(err => {
        this.onGetUserMediaError(err);
        throw err;
      });
  };

  selectFirstMicrophone = () =>
    new Promise((resolve, reject) => {
      const { microphoneLabels } = this.state;
      // const { microphone } = this.props;
      const firstMicrophoneLabel = microphoneLabels[0];
      this.selectMicrophoneWithLabel(firstMicrophoneLabel)
        .then(() => {
          resolve(firstMicrophoneLabel);
        })
        .catch(err => {
          reject(err);
        });
    });

  initializeMediaRecorder = () => {
    // This is here and not at the top of the file, as our other imports are, because when we try to server render this file that has a top-level import of msr, the app with crap out :-(
    // To fix this issue, we ONLY import it in browser code, determined by if the window object is present. See the constructor for this component.
    const MediaStreamRecorder = require('msr');
    const {
      onRecordingDidFinish,
      onMissingAPIsError,
      onRecordingSupportError,
    } = this.props;
    const { stream } = this.state;

    if (!stream) {
      return null;
    }
    if (stream && !MediaStreamRecorder) {
      console.warn('Audio recording APIs not supported by this browser');
      if (onMissingAPIsError) {
        onMissingAPIsError(handleGetUserMedia, window.MediaStreamRecorder);
        return null;
      }
      onRecordingSupportError();
      window.alert(
        "Your browser doesn't support native microphone recording. For best results, we recommend using Google Chrome or Mozilla Firefox to use this site."
      );
    }

    // WAV recorder for < 30secs, WEBm > 30secs
    this.wavRecorder = new MediaStreamRecorder(stream);
    this.wavRecorder.mimeType = WAV_MIME_TYPE;

    this.webmRecorder = new MediaStreamRecorder(stream);
    this.webmRecorder.mimeType = 'video/webm';

    this.wavRecorder.ondataavailable = blob => {
      if (this.canOnlyRecordWav && this.wavRecorder.isActive) {
        this.stopRecording();
      }
      // If STOP is called, duration will be available
      // otherwise, recording is still going on
      if (
        this.canOnlyRecordWav ||
        (this.duration && this.duration < WAV_LIMIT)
      ) {
        onRecordingDidFinish(blob, this.duration);
        this.duration = null;
      }
      this.wavRecorder.isActive = false;
      this.wavRecorder.stop();
    };

    this.webmRecorder.ondataavailable = blob => {
      // webm recorder finishing implies full stop of recording
      if (this.webmRecorder.isActive) {
        // If recorder is still active, stop was fired from a timeout (WEBM_LIMIT)
        // Thus need to clear duration and manually stop recorders
        this.stopRecording();
      }
      if (this.duration >= WAV_LIMIT) {
        onRecordingDidFinish(blob, this.duration);
        this.duration = null;
      }
    };

    this.webmRecorder.onerror = this.errorHandler;
    this.wavRecorder.onerror = this.errorHandler;
  };

  startRecording = () => {
    const { onWebmError, onRecordingDidStart } = this.props;
    const { currentMicrophoneLabel } = this.state;
    this.getMicrophonesAndStream()
      .then(({ microphones, stream }) => {
        const selectedMicrophone = microphones.find(
          microphone => microphone.label === currentMicrophoneLabel
        );
        if (stream) {
          stopStream(stream);
        }
        handleGetUserMedia({
          audio: {
            deviceId: selectedMicrophone.deviceId,
          },
          video: false,
        })
          .then(stream => {
            // this._audioDetected = false;
            this.setState(
              () => ({
                stream,
                currentMicrophoneLabel: selectedMicrophone.label,
              }),
              () => {
                this.initializeMediaRecorder();
                this.startTime = new Date();
                this.canOnlyRecordWav = !!this.isSafariBrowser;
                try {
                  this.webmRecorder.start(3600000 + 60000);
                  this.webmRecorder.isActive = true;
                } catch (err) {
                  this.webmRecorder = null;
                  if (onWebmError) {
                    onWebmError(err);
                  }
                  this.canOnlyRecordWav = true;
                } finally {
                  this.wavRecorder.start(
                    (this.canOnlyRecordWav ? WAV_ONLY_LIMIT : WAV_LIMIT) + 60000
                  );
                  this.wavRecorder.isActive = true;
                  onRecordingDidStart();
                  this.startTimer();
                  this.setState(() => ({
                    isRecording: true,
                  }));
                }
              }
            );
          })
          .catch(err => {
            this.onGetUserMediaError(err);
          });
      })
      .catch(error => {
        this.onGetUserMediaError(error);
      });
  };

  stopRecording = () => {
    const { stream } = this.state;
    this.endTime = new Date();
    this.duration = this.endTime - this.startTime;

    if (this.webmRecorder && this.webmRecorder.isActive) {
      this.webmRecorder.stop();
      stopStream(stream);
    }
    if (this.wavRecorder && this.wavRecorder.isActive) {
      this.wavRecorder.stop();
      stopStream(stream);
    }
    this.stopTimer();
    this.setState(() => ({
      isRecording: false,
    }));
  };

  stopTimer = () => {
    clearInterval(this.timer);
  };

  startTimer = () => {
    const { onTick } = this.props;
    this.startTime = new Date();
    this.timer = setInterval(() => {
      this.nowTime = new Date();
      const newElapsed = this.nowTime - this.startTime;
      this.setState({
        msElapsed: newElapsed,
      });
      onTick(newElapsed, this.stopRecording);
      if (
        newElapsed > WAV_LIMIT &&
        this.wavRecorder.isActive &&
        !this.canOnlyRecordWav
      ) {
        // stop wav recorder
        this.wavRecorder.isActive = false;
        this.wavRecorder.stop();
      }
      if (newElapsed > WAV_ONLY_LIMIT && this.wavRecorder.isActive) {
        // stop wav recorder always and capture recording
        this.stopRecording();
      }
    }, 1);
  };

  selectMicrophoneWithLabel = selectedMicrophoneLabel =>
    new Promise((resolve, reject) => {
      this.setState(
        () => ({
          currentMicrophoneLabel: selectedMicrophoneLabel,
          error: null,
        }),
        () => resolve()
      );
    });

  updateMicrophoneList = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        this.setState({
          microphoneLabels: devices
            .filter(device => device.kind === 'audioinput')
            .map(microphone => microphone.label),
        });
      })
      .catch(err => {
        console.warn(`Unable to detect this browser's other devices: ${err}`);
      });
  };

  render() {
    const {
      microphoneLabels,
      msElapsed,
      isRecording,
      isReadyForRecording,
      currentMicrophoneLabel,
      isBrowserDetected,
      error,
      isMicrophoneBlocked,
      isFetchingMicrophones,
      isRecordingSupported,
    } = this.state;

    const { children } = this.props;

    return !isBrowserDetected ? (
      // TODO: What should we do if browser is not detected?
      <div>Browser is not detected</div>
    ) : (
      children({
        isReadyForRecording,
        isRecording,
        startRecording: this.startRecording,
        stopRecording: this.stopRecording,
        availableMicrophoneLabels: microphoneLabels,
        currentMicrophoneLabel,
        durationInMs: msElapsed,
        reFetchMicrophones: this.updateMicrophoneList,
        selectMicrophoneWithLabel: this.selectMicrophoneWithLabel,
        error,
        isMicrophoneBlocked,
        isFetchingMicrophones,
        isRecordingSupported,
        getMicrophoneWithLabel: this.getMicrophoneWithLabel,
      })
    );
  }
}

Recordable.defaultProps = {
  onRecordingDidFinish: noop,
  onMissingAPIsError: noop,
  onRecordingSupportError: noop,
  onWebmError: noop,
  onRecordingDidStart: noop,
  onReadyForRecording: noop,
  onGetUserMediaError: noop,
  onTick: noop,
  command: 'none',
};

Recordable.propTypes = {
  children: PropTypes.func.isRequired,
  onRecordingDidFinish: PropTypes.func,
  onMissingAPIsError: PropTypes.func,
  onRecordingSupportError: PropTypes.func,
  onReadyForRecording: PropTypes.func,
  onWebmError: PropTypes.func,
  onRecordingDidStart: PropTypes.func,
  onGetUserMediaError: PropTypes.func,
  onTick: PropTypes.func,
  command: PropTypes.string.isRequired,
};

export default Recordable;
