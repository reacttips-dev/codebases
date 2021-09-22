var _require = require('preact'),
    h = _require.h;

var _require2 = require('./icons'),
    iconPlus = _require2.iconPlus;

var uploadStates = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete',
  STATE_PAUSED: 'paused'
};

function getUploadingState(isAllErrored, isAllComplete, isAllPaused, files) {
  if (files === void 0) {
    files = {};
  }

  if (isAllErrored) {
    return uploadStates.STATE_ERROR;
  }

  if (isAllComplete) {
    return uploadStates.STATE_COMPLETE;
  }

  if (isAllPaused) {
    return uploadStates.STATE_PAUSED;
  }

  var state = uploadStates.STATE_WAITING;
  var fileIDs = Object.keys(files);

  for (var i = 0; i < fileIDs.length; i++) {
    var progress = files[fileIDs[i]].progress; // If ANY files are being uploaded right now, show the uploading state.

    if (progress.uploadStarted && !progress.uploadComplete) {
      return uploadStates.STATE_UPLOADING;
    } // If files are being preprocessed AND postprocessed at this time, we show the
    // preprocess state. If any files are being uploaded we show uploading.


    if (progress.preprocess && state !== uploadStates.STATE_UPLOADING) {
      state = uploadStates.STATE_PREPROCESSING;
    } // If NO files are being preprocessed or uploaded right now, but some files are
    // being postprocessed, show the postprocess state.


    if (progress.postprocess && state !== uploadStates.STATE_UPLOADING && state !== uploadStates.STATE_PREPROCESSING) {
      state = uploadStates.STATE_POSTPROCESSING;
    }
  }

  return state;
}

function UploadStatus(props) {
  var uploadingState = getUploadingState(props.isAllErrored, props.isAllComplete, props.isAllPaused, props.files);

  switch (uploadingState) {
    case 'uploading':
      return props.i18n('uploadingXFiles', {
        smart_count: props.inProgressNotPausedFiles.length
      });

    case 'preprocessing':
    case 'postprocessing':
      return props.i18n('processingXFiles', {
        smart_count: props.processingFiles.length
      });

    case 'paused':
      return props.i18n('uploadPaused');

    case 'waiting':
      return props.i18n('xFilesSelected', {
        smart_count: props.newFiles.length
      });

    case 'complete':
      return props.i18n('uploadComplete');
  }
}

function PanelTopBar(props) {
  var allowNewUpload = props.allowNewUpload; // TODO maybe this should be done in ../index.js, then just pass that down as `allowNewUpload`

  if (allowNewUpload && props.maxNumberOfFiles) {
    allowNewUpload = props.totalFileCount < props.maxNumberOfFiles;
  }

  return h("div", {
    class: "uppy-DashboardContent-bar"
  }, !props.isAllComplete && !props.hideCancelButton ? h("button", {
    class: "uppy-DashboardContent-back",
    type: "button",
    onclick: props.cancelAll
  }, props.i18n('cancel')) : h("div", null), h("div", {
    class: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, h(UploadStatus, props)), allowNewUpload ? h("button", {
    class: "uppy-DashboardContent-addMore",
    type: "button",
    "aria-label": props.i18n('addMoreFiles'),
    title: props.i18n('addMoreFiles'),
    onclick: function onclick() {
      return props.toggleAddFilesPanel(true);
    }
  }, iconPlus(), h("span", {
    class: "uppy-DashboardContent-addMoreCaption"
  }, props.i18n('addMore'))) : h("div", null));
}

module.exports = PanelTopBar;