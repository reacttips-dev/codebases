'use es6';

export var asyncTrackSaveCall = function asyncTrackSaveCall(_ref) {
  var engagement = _ref.engagement,
      callDisposition = _ref.callDisposition,
      isRecording = _ref.isRecording,
      appIdentifier = _ref.appIdentifier;
  return new Promise(function (resolve, reject) {
    import(
    /* webpackChunkName: "call-done" */
    './trackSaveCall').then(function (trackSaveCallModule) {
      trackSaveCallModule.trackSaveCall({
        engagement: engagement,
        callDisposition: callDisposition,
        isRecording: isRecording,
        appIdentifier: appIdentifier
      });
      resolve();
    }).catch(reject);
  });
};